import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { searchNanoSchool } from "@/lib/wordpress";
import { getMentors } from "@/lib/mentors";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;
    const logId = Math.random().toString(36).substring(7);
    const fs = await import('fs');
    const log = (msg: string) => fs.appendFileSync('DEBUG_CHAT.log', `[${new Date().toISOString()}] [${logId}] ${msg}\n`);
    
    log(`Starting request: ${lastMessage}`);

    // Use gemini-3-flash for improved performance and features
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: `You are a Senior Educational Counselor and Mentor at NanoSchool, India's leading platform for AI, Biotech, and Nanotechnology. Your goal is to guide students and professionals toward their best learning path with a human, encouraging, and expert touch.

CORE BEHAVIOR:
1. ACT LIKE A HUMAN MENTOR: Use a warm, professional, and helpful tone. Avoid being a generic bot.
2. PROACTIVE SYNERGY: When you suggest a Course or Workshop, you MUST also search for a relevant Mentor in that same domain (using searchMentors). Connect them in your response: "To get the most out of this Artificial Intelligence course, I recommend connecting with Mentor X, who has extensive experience in Y."
3. CHOOSE THE "BEST": Based on the user's domain (e.g., AI, Biotech, Nano-tech), identify the top 1-2 most relevant programs and justify why they are the absolute best starting point for them.
4. BASES SOLELY ON DATA: Your responses must be based ONLY on search results or conversation context. No assumptions.

FORMATTING:
- Recommendations & Justification come FIRST.
- Use DIRECT MARKDOWN LINKS for courses (e.g. [Course Name](/course/slug)).
- Use the special MENTOR BLOCK for mentors:
\`\`\`mentor
{
  "id": "mentor_id",
  "name": "Mentor Name",
  "image": "image_url",
  "bio": "Bio snippet"
}
\`\`\`
- Keep your total response concise but high-impact. Suggest no more than 2 courses and 1-2 mentors.`,
      tools: [{
        functionDeclarations: [
          {
            name: "searchNanoSchool",
            description: "Search for courses, workshops, and programs at NanoSchool based on a query term like 'farming', 'ai', or 'biotech'.",
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                query: {
                  type: SchemaType.STRING,
                  description: "The search query term."
                }
              },
              required: ["query"]
            }
          },
          {
            name: "searchMentors",
            description: "Search for expert mentors at NanoSchool based on a domain or skill query like 'artificial intelligence' or 'molecular biology'.",
            parameters: {
              type: SchemaType.OBJECT,
              properties: {
                query: {
                  type: SchemaType.STRING,
                  description: "The domain or skill to search for."
                }
              },
              required: ["query"]
            }
          }
        ]
      }]
    });

    try {
      // Try using the chat session first
      const fullHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      // Find the first 'user' message to satisfy Gemini's requirement that history starts with 'user'
      const firstUserIndex = fullHistory.findIndex((m: { role: string }) => m.role === 'user');
      const history = firstUserIndex === -1 ? [] : fullHistory.slice(firstUserIndex);

      const chat = model.startChat({ history });
      let result = await chat.sendMessage(lastMessage);
      let response = await result.response;
      
      // Handle potential function calls in a loop (Gemini may call tools multiple times)
      let toolCallCount = 0;
      const MAX_TOOL_CALLS = 5;
      const processedToolCalls = new Set<string>();

      while (response.functionCalls()?.length && toolCallCount < MAX_TOOL_CALLS) {
        toolCallCount++;
        log(`Tool loop iteration ${toolCallCount}`);
        const calls = response.functionCalls();
        if (!calls) break;

        const functionResponses = [];

        for (const call of calls) {
          log(`Calling tool: ${call.name} with args: ${JSON.stringify(call.args)}`);
          // Prevent infinite loops if model keeps requesting exactly the same thing
          const callKey = `${call.name}:${JSON.stringify(call.args)}`;
          if (processedToolCalls.has(callKey)) {
            log(`Skipping duplicate tool call: ${callKey}`);
            continue;
          }
          processedToolCalls.add(callKey);

          let toolResults = null;
          
          try {
            if (call.name === "searchNanoSchool") {
              const { query } = call.args as { query: string };
              toolResults = await searchNanoSchool(query);
              log(`searchNanoSchool returned ${toolResults?.length || 0} results`);
            } else if (call.name === "searchMentors") {
              const { query } = call.args as { query: string };
              log(`Fetching mentors for query: ${query}`);
              const mentorData = await getMentors(1, 3, { search: query }, 150);
              toolResults = mentorData.mentors.map(m => ({
                id: m.id,
                name: m.name,
                image: m.image,
                bio: m.bio.slice(0, 150) + '...'
              }));
              log(`searchMentors found ${toolResults.length} mentors`);
            }
          } catch (toolError: any) {
            log(`Tool call ${call.name} ERROR: ${toolError.message}`);
            console.error(`Tool call ${call.name} failed:`, toolError);
          }

          functionResponses.push({
            functionResponse: {
              name: call.name,
              response: { results: toolResults || [] }
            }
          });
        }

        if (functionResponses.length === 0) break;

        // Send all tool results back to the model in one go
        log(`Sending tool results back to Gemini...`);
        result = await chat.sendMessage(functionResponses);
        response = await result.response;
        log(`Received response from Gemini after tools.`);
      }

      let text = response.text() || "";
      log(`Final response text length: ${text.length}`);
      
      // Safety fallback if the model returns empty content after tools
      if (!text.trim() && toolCallCount > 0) {
        text = "I've searched our database but couldn't find a perfect match. Please try a different query or explore our courses and mentors pages directly!";
      }

      return NextResponse.json({ role: 'assistant', content: text });
    } catch (chatError: any) {
      console.warn("Chat session failed, falling back to direct generation:", chatError.message);
      
      // Fallback: If chat history fails (e.g. role order), just send the last message directly
      const result = await model.generateContent(lastMessage);
      const response = await result.response;
      const text = response.text();
      return NextResponse.json({ role: 'assistant', content: text });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ 
      error: error.message || "Failed to connect to AI",
      details: error.stack?.split('\n').slice(0, 2).join(' ')
    }, { status: 500 });
  }
}
