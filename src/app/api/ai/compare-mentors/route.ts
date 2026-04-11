import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { mentors } = await req.json();

    if (!mentors || !Array.isArray(mentors) || mentors.length < 2) {
      return NextResponse.json({ error: "At least two mentors are required for comparison" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash-preview",
      systemInstruction: `You are the NanoSchool Intelligence Engine, a high-level educational auditor and career matching specialist. 
      Your task is to provide a deep, qualitative comparison between 2-4 elite mentors.
      
      CORE REQUIREMENTS:
      1. CRITICAL ANALYSIS: Identify specialized niche expertise and real-world industrial impact.
      2. DECISION MATRIX: Determine the optimal order for these mentors based on user career growth.
      
      OUTPUT FORMAT: You MUST return ONLY a JSON object. No other text.
      {
        "rankings": ["mentor_id_1", "mentor_id_2"],
        "justification": "A short, powerful 2-3 sentence explanation of why the top mentor is the best fit.",
        "weights": {"domain": 0.X, "skills": 0.X, "experience": 0.X, "organization": 0.X, "quality": 0.X, "location": 0.X}
      }
      
      Ensure "weights" sum to 1.0.`
    });

    const prompt = `Compare the following mentors in high detail:
    ${mentors.map((m: any, i: number) => `
    MENTOR ${i + 1}: ${m.name}
    Designation: ${m.designation} at ${m.organization}
    Experience: ${m.experience}
    Domains: ${m.domains.join(", ")}
    Skills: ${m.skills.join(", ")}
    Bio Extract: ${m.bio}
    Rating: ${m.mentorship_rating}/5
    Mentees: ${m.total_mentees}
    `).join("\n---\n")}
    
    Provide a multi-section comparison identifying the clear winner for specific career paths.`;

    const result = await model.generateContentStream(prompt);
    
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(encoder.encode(chunkText));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error: any) {
    console.error("AI Comparison Error:", error);
    return NextResponse.json({ error: "Failed to generate AI comparison", details: error.message }, { status: 500 });
  }
}
