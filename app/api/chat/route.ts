import { NextRequest, NextResponse } from "next/server";
import { generateResponse } from "@/lib/sms/responder";
import { generateOllamaResponse, type OllamaMessage } from "@/lib/sms/ollama";

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    // Same hybrid approach as SMS: rule-based first, Gemma for open-ended
    const ruleResponse = generateResponse(message);
    const isFallback = ruleResponse.includes("I'm not sure about that");

    let response: string;

    if (isFallback && process.env.OLLAMA_URL) {
      const ollamaHistory: OllamaMessage[] = history.map(
        (m: { role: string; content: string }) => ({
          role: m.role === "user" ? "user" as const : "assistant" as const,
          content: m.content,
        })
      );
      response = await generateOllamaResponse(message, ollamaHistory);
    } else {
      response = ruleResponse;
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({
      response: "Oops! Something went wrong. Try asking again!"
    });
  }
}
