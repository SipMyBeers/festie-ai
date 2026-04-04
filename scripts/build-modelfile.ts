/**
 * Build an Ollama Modelfile with the FULL Coachella knowledge base baked into the system prompt.
 * This gives Gemma all the facts it needs to answer accurately without hallucinating.
 *
 * Usage: npx tsx scripts/build-modelfile.ts
 * Then:  ollama create festie-coachella -f training-data/Modelfile
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { coachellaStages } from "../lib/data/coachella-lineup";
import { FESTIVAL_INFO, WATER_STATIONS, RESTROOMS, FOOD_AREAS, FAQ } from "../lib/sms/knowledge";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });
}

function dayName(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", timeZone: "America/Los_Angeles" });
}

// Build full schedule text
const scheduleLines: string[] = [];
for (const stage of coachellaStages) {
  scheduleLines.push(`\n${stage.name}:`);
  for (const perf of stage.schedule) {
    scheduleLines.push(`  ${perf.artistName}: ${dayName(perf.startTime)} ${formatTime(perf.startTime)} - ${formatTime(perf.endTime)} [${perf.genreTags.join(", ")}]`);
  }
}

const waterLines = WATER_STATIONS.map((w) => `- ${w.name}: ${w.landmark} (near ${w.near})`);
const restroomLines = RESTROOMS.map((r) => `- ${r.name}: near ${r.near} (${r.type})${r.note ? " — " + r.note : ""}`);
const foodLines = FOOD_AREAS.map((f) => `- ${f.name}: near ${f.near} — ${f.cuisine.join(", ")}${f.note ? " (" + f.note + ")" : ""}`);
const faqLines = Object.entries(FAQ).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v}`);
const stageLines = FESTIVAL_INFO.stages.map((s) => `- ${s.name} (aka: ${s.aka.join(", ")}): ${s.area} area`);

const systemPrompt = `You are Festie, a friendly and concise SMS festival guide for Coachella 2026 at ${FESTIVAL_INFO.venue}, ${FESTIVAL_INFO.address}.

Festival dates: Weekend 1 April 10-12, Weekend 2 April 17-19, 2026.
Hours: ${FESTIVAL_INFO.hours}

COMPLETE SCHEDULE (Weekend 1):
${scheduleLines.join("\n")}

STAGES:
${stageLines.join("\n")}

WATER STATIONS:
${waterLines.join("\n")}

RESTROOMS:
${restroomLines.join("\n")}

FOOD & DRINK:
${foodLines.join("\n")}

FAQ:
${faqLines.join("\n")}

CRITICAL RULES:
1. Keep responses SHORT. This is SMS — max 2-3 sentences unless listing a schedule.
2. Be friendly and casual, like a knowledgeable friend at the festival.
3. NEVER make up information. ONLY use the data provided above.
4. If an artist is NOT in the schedule above, say "I don't see them on the lineup" — do NOT invent times or stages.
5. If you don't know something specific, say so honestly.
6. Use a few emojis but don't overdo it.`;

// Escape triple quotes in system prompt for Modelfile
const escaped = systemPrompt.replace(/"""/g, '\\"\\"\\"');

const modelfile = `FROM gemma3:4b

SYSTEM """${escaped}"""

PARAMETER temperature 0.3
PARAMETER num_predict 300
PARAMETER top_p 0.9
PARAMETER repeat_penalty 1.1
`;

const outDir = path.join(__dirname, "..", "training-data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "Modelfile"), modelfile, "utf-8");

console.log(`✅ Modelfile written with full knowledge base`);
console.log(`   System prompt: ${systemPrompt.length} chars`);
console.log(`   Artists in schedule: ${coachellaStages.flatMap((s) => s.schedule).length}`);
console.log(`   FAQ entries: ${Object.keys(FAQ).length}`);
console.log(`\nNext: ollama create festie-coachella -f training-data/Modelfile`);
