import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/sms/responder";

// Try Ollama if available, fall back to rule-based
async function getResponse(message: string, history: { role: string; content: string }[]): Promise<string> {
  if (process.env.OLLAMA_URL) {
    try {
      const { generateOllamaResponse } = await import("@/lib/sms/ollama");
      return await generateOllamaResponse(message, history as any);
    } catch {
      return generateResponse(message);
    }
  }
  return generateResponse(message);
}

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const response = await getResponse(message, history);
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      response: "Oops! Something went wrong. Try asking again!"
    });
  }
}
