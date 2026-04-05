/**
 * Generate fine-tuning training data for Gemma from the Coachella knowledge base.
 *
 * Output: JSONL file with conversation pairs for Ollama modelfile training
 * Usage: npx tsx scripts/generate-training-data.ts
 */

import { coachellaStages } from "../lib/data/coachella-lineup";
import { FESTIVAL_INFO, WATER_STATIONS, RESTROOMS, FOOD_AREAS, FAQ } from "../lib/sms/knowledge";

interface TrainingPair {
  prompt: string;
  response: string;
}

const pairs: TrainingPair[] = [];

// Helper
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });
}

function dayName(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "America/Los_Angeles",
  });
}

// --- Artist schedule questions ---
for (const stage of coachellaStages) {
  for (const perf of stage.schedule) {
    const day = dayName(perf.startTime);
    const start = formatTime(perf.startTime);
    const end = formatTime(perf.endTime);
    const genres = perf.genreTags.join(", ");

    // "When is X playing?"
    pairs.push({
      prompt: `When is ${perf.artistName} playing?`,
      response: `🎤 ${perf.artistName} plays ${day} at ${stage.name}, ${start} – ${end}.`,
    });

    // "What time is X?"
    pairs.push({
      prompt: `What time is ${perf.artistName}?`,
      response: `${perf.artistName} is on ${day} from ${start} to ${end} at the ${stage.name}. Don't miss it! 🔥`,
    });

    // "What stage is X on?"
    pairs.push({
      prompt: `What stage is ${perf.artistName} on?`,
      response: `📍 ${perf.artistName} is at the ${stage.name}. ${day}, ${start}.`,
    });

    // "What genre is X?"
    pairs.push({
      prompt: `What kind of music does ${perf.artistName} play?`,
      response: `${perf.artistName} is ${genres}. Catch them at ${stage.name} on ${day}!`,
    });
  }
}

// --- Day schedule questions ---
const days = ["Friday", "Saturday", "Sunday"];

for (const day of days) {
  const acts: string[] = [];
  for (const stage of coachellaStages) {
    for (const perf of stage.schedule) {
      if (dayName(perf.startTime) === day) {
        acts.push(`  ${formatTime(perf.startTime)} ${perf.artistName} @ ${stage.name}`);
      }
    }
  }
  acts.sort();

  pairs.push({
    prompt: `${day} schedule`,
    response: `📋 ${day} Schedule:\n${acts.join("\n")}`,
  });

  pairs.push({
    prompt: `Who's playing ${day}?`,
    response: `📋 ${day} lineup:\n${acts.join("\n")}`,
  });

  pairs.push({
    prompt: `What's happening ${day.toLowerCase()}?`,
    response: `Here's the ${day} lineup! 🎶\n${acts.join("\n")}`,
  });
}

// --- Stage questions ---
for (const stage of FESTIVAL_INFO.stages) {
  pairs.push({
    prompt: `Where is ${stage.name}?`,
    response: `📍 ${stage.name} is in the ${stage.area} area of the grounds. Look for signs or ask anyone in a yellow shirt!`,
  });

  pairs.push({
    prompt: `How do I get to ${stage.aka[0] || stage.name}?`,
    response: `Head to the ${stage.area} section — ${stage.name} is there. Follow the crowd or look for directional signs!`,
  });
}

// --- Water station questions ---
pairs.push({
  prompt: "Where can I get water?",
  response: `Water refill stations:\n${WATER_STATIONS.slice(0, 3).map((w) => `💧 ${w.name} (${w.landmark})`).join("\n")}\n\nBring an empty bottle — free refills all day!`,
});

for (const station of WATER_STATIONS) {
  pairs.push({
    prompt: `Where's water near ${station.near}?`,
    response: `💧 ${station.name} — ${station.landmark}. Bring an empty bottle to refill!`,
  });
}

pairs.push({
  prompt: "I'm so thirsty",
  response: `💧 Nearest water refill stations:\n${WATER_STATIONS.slice(0, 3).map((w) => `- ${w.name}: ${w.landmark}`).join("\n")}\n\nStay hydrated — it's hot out there!`,
});

// --- Restroom questions ---
pairs.push({
  prompt: "Where are the restrooms?",
  response: `🚻 Restrooms:\n${RESTROOMS.filter((r) => !r.note).slice(0, 3).map((r) => `- ${r.name} — ${r.near} (${r.type})`).join("\n")}\n\nFlush toilets near Outdoor Theatre are the cleanest! 👌`,
});

pairs.push({
  prompt: "I need a bathroom",
  response: `🚻 Closest options:\n${RESTROOMS.slice(0, 3).map((r) => `- ${r.name}: near ${r.near} (${r.type})`).join("\n")}`,
});

// --- Food questions ---
pairs.push({
  prompt: "I'm hungry",
  response: `Food options:\n${FOOD_AREAS.map((f) => `🍕 ${f.name} — ${f.near}\n   ${f.cuisine.join(", ")}${f.note ? ` (${f.note})` : ""}`).join("\n")}`,
});

pairs.push({
  prompt: "Where can I eat?",
  response: `Food options:\n${FOOD_AREAS.map((f) => `🍕 ${f.name} — ${f.near}\n   ${f.cuisine.join(", ")}`).join("\n")}`,
});

pairs.push({
  prompt: "Any vegan food?",
  response: `🥗 Terrace Food Court (between mainstage and outdoor) has vegan options! Indio Central Market also has great Mediterranean picks.`,
});

// --- FAQ questions ---
const faqQuestions: Record<string, string[]> = {
  parking: ["Where do I park?", "How much is parking?", "Parking info"],
  camping: ["Is there camping?", "Tell me about camping"],
  weather: ["What's the weather like?", "Is it gonna be hot?", "Do I need a jacket?"],
  prohibited: ["What can't I bring?", "Can I bring a camera?", "What's not allowed?"],
  medical: ["Where's the medical tent?", "I need a doctor", "First aid?"],
  phone_charging: ["Where can I charge my phone?", "My phone is dying", "Phone charging?"],
  lockers: ["Are there lockers?", "Where can I store my stuff?"],
  shuttle: ["Is there a shuttle?", "How do I get there without driving?"],
  rideshare: ["Where's the Uber drop-off?", "Lyft pickup?", "Rideshare info"],
  re_entry: ["Can I leave and come back?", "Re-entry allowed?"],
  accessibility: ["Is it wheelchair accessible?", "ADA info?"],
  age: ["Is it all ages?", "Can I bring my kid?"],
  cash: ["Do they accept cards?", "Is there an ATM?", "Cash only?"],
  merch: ["Where's the merch tent?", "Can I buy a hoodie?"],
  set_times: ["When do set times come out?", "Are set times released yet?"],
};

for (const [key, questions] of Object.entries(faqQuestions)) {
  const answer = FAQ[key];
  if (!answer) continue;
  for (const q of questions) {
    pairs.push({ prompt: q, response: answer });
  }
}

// --- Greeting / help ---
pairs.push({
  prompt: "Hey",
  response: `🎪 Hey! I'm your Coachella 2026 guide! Ask me about:\n🎵 "Who's playing now?"\n🎤 "When is Sabrina Carpenter?"\n📋 "Friday schedule"\n💧 "Where's water?"\n🍕 "Food options"\n\nJust text me anything!`,
});

pairs.push({
  prompt: "Help",
  response: `🎪 I can help with:\n🎵 "Who's playing now?" — live acts\n⏰ "What's coming up?" — next 90 min\n🎤 "When is [artist]?" — find any act\n📋 "Friday schedule" — day lineup\n💧 "Water" / 🚻 "Restroom" / 🍕 "Food"\n🅿️ "Parking" — logistics\n\nJust ask!`,
});

// --- Negative / unknown artist ---
pairs.push({
  prompt: "When is Taylor Swift playing?",
  response: `🤔 I don't see Taylor Swift on the Coachella 2026 lineup. Want me to help you find who IS playing? Try "Friday schedule" or "Saturday lineup"!`,
});

pairs.push({
  prompt: "Is Drake performing?",
  response: `Drake isn't on the 2026 lineup. Check out the full schedule — there's amazing acts every day! Text "Friday schedule" to see who's on.`,
});

// --- General festival info ---
pairs.push({
  prompt: "When is Coachella?",
  response: `🎪 Coachella 2026: Weekend 1 is April 10-12, Weekend 2 is April 17-19. Gates open at 12pm, music runs 1pm-1am (1pm-12am Sunday).`,
});

pairs.push({
  prompt: "Where is Coachella?",
  response: `📍 Empire Polo Club, 81-800 Avenue 51, Indio, CA 92201. About 2 hours east of LA in the desert!`,
});

// --- Output as JSONL ---
const systemPrompt = `You are Festie, a friendly and concise SMS festival guide for Coachella 2026 at Empire Polo Club, Indio CA. Weekend 1: April 10-12, Weekend 2: April 17-19. Keep responses SHORT (2-3 sentences for SMS). Be casual and friendly. Only share facts you know — never make up information.`;

// Ollama-compatible format (conversations)
const conversations = pairs.map((p) => ({
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: p.prompt },
    { role: "assistant", content: p.response },
  ],
}));

// Write JSONL
const jsonl = conversations.map((c) => JSON.stringify(c)).join("\n");
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "training-data");
const outPath = path.join(outDir, "coachella-festie.jsonl");

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, jsonl + "\n");

console.log(`✅ Generated ${pairs.length} training pairs`);
console.log(`📁 Output: training-data/coachella-festie.jsonl`);
console.log(`\nTo create a fine-tuned model:`);
console.log(`  1. Review the training data`);
console.log(`  2. Create an Ollama Modelfile (see training-data/Modelfile)`);
console.log(`  3. Run: ollama create festie-coachella -f training-data/Modelfile`);

// Also write the Modelfile
const modelfile = `FROM gemma3:4b

SYSTEM """${systemPrompt}"""

PARAMETER temperature 0.5
PARAMETER num_predict 300
PARAMETER top_p 0.9
`;

fs.writeFileSync(path.join(outDir, "Modelfile"), modelfile, "utf-8");
console.log(`📄 Modelfile written to training-data/Modelfile`);
