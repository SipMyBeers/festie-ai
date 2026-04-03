import { NextRequest } from "next/server";
import { generateResponse } from "@/lib/sms/responder";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const incomingMessage = formData.get("Body") as string;
    const fromNumber = formData.get("From") as string;

    if (!incomingMessage || !fromNumber) {
      return new Response("Missing required fields", { status: 400 });
    }

    const responseText = generateResponse(incomingMessage);

    // Respond with TwiML
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${escapeXml(responseText)}</Message>
</Response>`;

    return new Response(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("SMS webhook error:", error);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Oops! Something went wrong. Text HELP to try again.</Message>
</Response>`;
    return new Response(twiml, {
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
