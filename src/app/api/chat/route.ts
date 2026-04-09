import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { searchNanoSchool } from "@/lib/wordpress";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Use gemini-3-flash for improved performance and features
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: "You are a helpful AI assistant for NanoSchool, India's leading platform for AI, Biotech, and Nanotechnology. You have access to a search tool to find live courses, workshops, and programs. When searching, ALWAYS BE CONCISE. Recommend the SINGLE BEST MATCH if a strong one exists, or at most 2 relevant options. Provide the DIRECT CLICKABLE LINKS from the search results in markdown format (e.g. [Course Name](/course/slug)). Avoid long lists. If no perfect match exists, suggest the closest relevant alternative briefly.",
      tools: [{
        functionDeclarations: [{
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
        }]
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
      
      // Handle potential function calls
      const calls = response.functionCalls();
      if (calls && calls.length > 0) {
        const call = calls[0];
        if (call.name === "searchNanoSchool") {
          const { query } = call.args as { query: string };
          const searchResults = await searchNanoSchool(query);
          
          // Send tool results back to Gemini
          result = await chat.sendMessage([{
            functionResponse: {
              name: "searchNanoSchool",
              response: { results: searchResults }
            }
          }]);
          response = await result.response;
        }
      }

      const text = response.text();
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
    return NextResponse.json({ error: "Failed to connect to AI" }, { status: 500 });
  }
}
