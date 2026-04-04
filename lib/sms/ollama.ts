const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "gemma3:12b";

import {
  FESTIVAL_INFO,
  WATER_STATIONS,
  RESTROOMS,
  FOOD_AREAS,
  FAQ,
  coachellaStages,
} from "./knowledge";

function buildSystemPrompt(): string {
  const stageSchedule = coachellaStages
    .map((stage) => {
      const perfs = stage.schedule
        .map(
          (p) =>
            `  ${p.artistName}: ${new Date(p.startTime).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Los_Angeles" })} - ${new Date(p.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Los_Angeles" })}`
        )
        .join("\n");
      return `${stage.name}:\n${perfs}`;
    })
    .join("\n\n");

  const waterInfo = WATER_STATIONS.map(
    (w) => `- ${w.name}: ${w.landmark}`
  ).join("\n");

  const restroomInfo = RESTROOMS.map(
    (r) =>
      `- ${r.name}: near ${r.near} (${r.type})${r.note ? " - " + r.note : ""}`
  ).join("\n");

  const foodInfo = FOOD_AREAS.map(
    (f) =>
      `- ${f.name}: near ${f.near} — ${f.cuisine.join(", ")}${f.note ? " (" + f.note + ")" : ""}`
  ).join("\n");

  const faqInfo = Object.entries(FAQ)
    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`)
    .join("\n");

  return `You are Festie, a friendly and concise SMS festival guide for Coachella 2026 at ${FESTIVAL_INFO.venue}, ${FESTIVAL_INFO.address}.

Festival dates: Weekend 1 April 10-12, Weekend 2 April 17-19, 2026.
Hours: ${FESTIVAL_INFO.hours}

SCHEDULE:
${stageSchedule}

WATER STATIONS:
${waterInfo}

RESTROOMS:
${restroomInfo}

FOOD & DRINK:
${foodInfo}

FAQ:
${faqInfo}

RULES:
- Keep responses SHORT. This is SMS — max 2-3 sentences unless listing a schedule.
- Be friendly and casual, like a knowledgeable friend at the festival.
- Use a few emojis but don't overdo it.
- If someone asks what's playing NOW, check the current time against the schedule.
- If you don't know something specific, say so honestly and suggest what you CAN help with.
- Never make up information. Only use the data provided above.
- Current time context will be provided with each message.`;
}

const SYSTEM_PROMPT = buildSystemPrompt();

interface OllamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateOllamaResponse(
  userMessage: string,
  conversationHistory: OllamaMessage[] = []
): Promise<string> {
  const now = new Date().toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });

  const messages: OllamaMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...conversationHistory.slice(-6), // Keep last 3 exchanges for context
    { role: "user", content: `[Current time: ${now}]\n\n${userMessage}` },
  ];

  try {
    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 300,
        },
      }),
    });

    if (!response.ok) {
      console.error("Ollama error:", response.status, await response.text());
      return fallbackResponse(userMessage);
    }

    const data = await response.json();
    return data.message?.content?.trim() || fallbackResponse(userMessage);
  } catch (error) {
    console.error("Ollama connection error:", error);
    return fallbackResponse(userMessage);
  }
}

function fallbackResponse(msg: string): string {
  // If Ollama is down, fall back to the rule-based responder
  const { generateResponse } = require("./responder");
  return generateResponse(msg);
}
