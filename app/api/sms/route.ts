import { NextRequest, NextResponse } from "next/server";
import { generateOllamaResponse } from "@/lib/sms/ollama";
import { generateResponse } from "@/lib/sms/responder";

const USE_OLLAMA = process.env.OLLAMA_URL ? true : false;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const incomingMessage = formData.get("Body") as string;
    const fromNumber = formData.get("From") as string;

    if (!incomingMessage || !fromNumber) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Rule-based responder handles structured queries (artist lookup, schedule,
    // water, FAQ) with 100% accuracy. Gemma handles conversational/open-ended
    // questions where the rule-based responder returns the generic fallback.
    const ruleResponse = generateResponse(incomingMessage);
    const isFallback = ruleResponse.includes("I'm not sure about that");

    let responseText: string;

    if (isFallback && USE_OLLAMA) {
      responseText = await generateOllamaResponse(incomingMessage, []);
    } else {
      responseText = ruleResponse;
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(responseText)}</Message>
</Response>`;

    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("SMS webhook error:", error);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Oops! Something went wrong. Try again in a sec!</Message>
</Response>`;
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
