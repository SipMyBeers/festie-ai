import { describe, it, expect } from "vitest";

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const MODEL = process.env.OLLAMA_MODEL || "gemma3:4b";

// These tests require Ollama running locally
// Run with: OLLAMA_URL=http://localhost:11434 npx vitest run lib/sms/__tests__/ollama.integration.test.ts

async function askFestie(question: string): Promise<string> {
  const res = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are Festie, a concise SMS festival guide for Coachella 2026 at Empire Polo Club, Indio CA.
Weekend 1: April 10-12, Weekend 2: April 17-19.

SCHEDULE (Weekend 1):
Coachella Stage:
  Sabrina Carpenter: Fri 9:30 PM - 11:00 PM
  Justin Bieber: Sat 10:00 PM - 11:30 PM
  The Strokes: Sun 8:30 PM - 10:00 PM

Sahara Tent:
  Anyma: Fri 11:00 PM - 12:30 AM
  Skrillex: Sat 11:00 PM - 12:30 AM

WATER STATIONS:
- Main Entrance Water: near the ferris wheel
- Sahara Water: between Sahara and Gobi
- Outdoor Water: left side of Outdoor Theatre

RULES:
- Keep responses SHORT (2-3 sentences max for SMS)
- Only use data provided above — never make up info
- Be friendly and casual`,
        },
        { role: "user", content: question },
      ],
      stream: false,
      options: { temperature: 0.3, num_predict: 200 },
    }),
  });

  const data = await res.json();
  return data.message?.content?.trim() || "";
}

describe("Ollama Integration (requires local Ollama)", () => {
  it("responds to artist query with schedule info", async () => {
    const response = await askFestie("When is Sabrina Carpenter playing?");
    expect(response.length).toBeGreaterThan(10);
    // Should mention Friday or the time
    const lower = response.toLowerCase();
    expect(
      lower.includes("friday") || lower.includes("fri") || lower.includes("9:30") || lower.includes("coachella stage")
    ).toBe(true);
  }, 15000);

  it("answers water station questions", async () => {
    const response = await askFestie("Where can I get water near Sahara?");
    const lower = response.toLowerCase();
    expect(lower.includes("sahara") || lower.includes("water") || lower.includes("gobi")).toBe(true);
  }, 15000);

  it("keeps responses concise for SMS", async () => {
    const response = await askFestie("Tell me everything about Coachella");
    // SMS responses should be under ~320 chars (2 SMS segments)
    expect(response.length).toBeLessThan(500);
  }, 15000);

  it("does not hallucinate artists not in the schedule", async () => {
    const response = await askFestie("When is Taylor Swift playing?");
    const lower = response.toLowerCase();
    // Should NOT confidently give a time — should indicate not found
    expect(
      lower.includes("don't") || lower.includes("not") || lower.includes("isn't") ||
      lower.includes("doesn't") || lower.includes("no ") || lower.includes("sorry") ||
      lower.includes("unable") || lower.includes("can't find")
    ).toBe(true);
  }, 15000);

  it("responds quickly enough for SMS (<3s)", async () => {
    const start = Date.now();
    await askFestie("Who's playing tonight?");
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  }, 15000);
});
