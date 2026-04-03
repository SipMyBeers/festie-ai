import {
  FESTIVAL_INFO,
  WATER_STATIONS,
  RESTROOMS,
  FOOD_AREAS,
  FAQ,
  coachellaStages,
} from "./knowledge";

// ---- Helpers ----

function normalize(msg: string): string {
  return msg.toLowerCase().trim().replace(/[?!.,]/g, "");
}

function matchesAny(msg: string, keywords: string[]): boolean {
  const norm = normalize(msg);
  return keywords.some((kw) => norm.includes(kw));
}

function getCurrentTime(): Date {
  return new Date();
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Los_Angeles",
  });
}

// ---- Response Handlers ----

function handleWhatsPlaying(msg: string): string | null {
  if (!matchesAny(msg, ["playing now", "whos on", "who is on", "whats on", "what's on", "happening now", "right now", "live now", "whos playing", "who is playing", "who's playing"])) return null;

  const now = getCurrentTime();
  const liveActs: string[] = [];

  for (const stage of coachellaStages) {
    for (const perf of stage.schedule) {
      const start = new Date(perf.startTime);
      const end = new Date(perf.endTime);
      if (start <= now && end > now) {
        liveActs.push(`\uD83C\uDFB5 ${stage.name}: ${perf.artistName} (til ${formatTime(perf.endTime)})`);
      }
    }
  }

  if (liveActs.length === 0) {
    return "No one's playing right now! Check back during festival hours (1pm-1am Fri/Sat, 1pm-12am Sun).";
  }

  return `\uD83D\uDD34 LIVE NOW:\n${liveActs.join("\n")}`;
}

function handleUpcoming(msg: string): string | null {
  if (!matchesAny(msg, ["coming up", "upcoming", "whats next", "what's next", "next up", "starting soon", "dont miss", "don't miss", "shouldn't miss", "should i see", "recommend"])) return null;

  const now = getCurrentTime();
  const upcoming: { name: string; stage: string; start: string; mins: number }[] = [];

  for (const stage of coachellaStages) {
    for (const perf of stage.schedule) {
      const start = new Date(perf.startTime);
      const minsUntil = (start.getTime() - now.getTime()) / 60000;
      if (minsUntil > 0 && minsUntil <= 90) {
        upcoming.push({
          name: perf.artistName,
          stage: stage.name,
          start: formatTime(perf.startTime),
          mins: Math.round(minsUntil),
        });
      }
    }
  }

  upcoming.sort((a, b) => a.mins - b.mins);

  if (upcoming.length === 0) {
    return "Nothing starting in the next 90 min. Grab some food or explore the art installations! \uD83C\uDFA8";
  }

  const lines = upcoming.slice(0, 5).map(
    (u) => `\u23F0 ${u.name} @ ${u.stage} in ${u.mins} min (${u.start})`
  );

  return `\uD83C\uDFB6 Coming up:\n${lines.join("\n")}`;
}

function handleWater(msg: string): string | null {
  if (!matchesAny(msg, ["water", "hydrate", "thirsty", "refill", "drinking fountain"])) return null;

  // Try to find a stage reference to give location-aware answer
  const nearStage = findStageReference(msg);
  if (nearStage) {
    const nearest = WATER_STATIONS.find((w) =>
      w.near.toLowerCase().includes(nearStage.toLowerCase()) ||
      w.landmark.toLowerCase().includes(nearStage.toLowerCase())
    );
    if (nearest) {
      return `\uD83D\uDCA7 Nearest water to ${nearStage}: ${nearest.name} \u2014 ${nearest.landmark}. Pro tip: bring an empty bottle to refill!`;
    }
  }

  const spots = WATER_STATIONS.slice(0, 3).map((w) => `\uD83D\uDCA7 ${w.name} (${w.landmark})`);
  return `Water refill stations:\n${spots.join("\n")}\n\nBring an empty bottle \u2014 free refills all day!`;
}

function handleRestrooms(msg: string): string | null {
  if (!matchesAny(msg, ["restroom", "bathroom", "toilet", "porta potty", "portapotty", "pee", "flush"])) return null;

  const nearStage = findStageReference(msg);
  if (nearStage) {
    const nearest = RESTROOMS.find((r) =>
      r.near.toLowerCase().includes(nearStage.toLowerCase())
    );
    if (nearest) {
      return `\uD83D\uDEBB Nearest to ${nearStage}: ${nearest.name} (${nearest.type})${nearest.note ? ` \u2014 ${nearest.note}` : ""}`;
    }
  }

  const spots = RESTROOMS.filter((r) => !r.note).slice(0, 3).map((r) => `\uD83D\uDEBB ${r.name} \u2014 ${r.near} (${r.type})`);
  return `Restrooms:\n${spots.join("\n")}\n\nFlush toilets near Outdoor Theatre are the cleanest! \uD83D\uDC4C`;
}

function handleFood(msg: string): string | null {
  if (!matchesAny(msg, ["food", "eat", "hungry", "restaurant", "vendor", "taco", "pizza", "burger", "vegan", "dining"])) return null;

  const lines = FOOD_AREAS.map(
    (f) => `\uD83C\uDF55 ${f.name} \u2014 ${f.near}\n   ${f.cuisine.join(", ")}${f.note ? ` (${f.note})` : ""}`
  );
  return `Food options:\n${lines.join("\n")}`;
}

function handleArtistSearch(msg: string): string | null {
  if (!matchesAny(msg, ["when is", "when does", "what time", "where is", "what stage", "find"])) return null;

  const norm = normalize(msg);
  const allPerfs = coachellaStages.flatMap((stage) =>
    stage.schedule.map((perf) => ({ ...perf, stageName: stage.name }))
  );

  // Try to find artist name in message
  const match = allPerfs.find((p) =>
    norm.includes(normalize(p.artistName))
  );

  if (match) {
    const day = new Date(match.startTime).toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "America/Los_Angeles",
    });
    return `\uD83C\uDFA4 ${match.artistName}\n\uD83D\uDCCD ${match.stageName}\n\uD83D\uDCC5 ${day}\n\u23F0 ${formatTime(match.startTime)} \u2014 ${formatTime(match.endTime)}`;
  }

  return null;
}

function handleSchedule(msg: string): string | null {
  if (!matchesAny(msg, ["schedule", "lineup", "friday", "saturday", "sunday", "today", "tonight"])) return null;

  let dayFilter: string | null = null;
  const norm = normalize(msg);
  if (norm.includes("friday") || norm.includes("fri")) dayFilter = "Friday";
  else if (norm.includes("saturday") || norm.includes("sat")) dayFilter = "Saturday";
  else if (norm.includes("sunday") || norm.includes("sun")) dayFilter = "Sunday";
  else if (norm.includes("today") || norm.includes("tonight")) {
    dayFilter = getCurrentTime().toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "America/Los_Angeles",
    });
  }

  const lines: string[] = [];
  for (const stage of coachellaStages) {
    const filtered = stage.schedule.filter((perf) => {
      if (!dayFilter) return true;
      const day = new Date(perf.startTime).toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "America/Los_Angeles",
      });
      return day === dayFilter;
    });

    if (filtered.length > 0) {
      lines.push(`\n\uD83D\uDCCD ${stage.name}:`);
      for (const perf of filtered) {
        lines.push(`  ${formatTime(perf.startTime)} ${perf.artistName}`);
      }
    }
  }

  if (lines.length === 0) {
    return "No schedule found for that day. Try: 'friday schedule' or 'saturday lineup'";
  }

  return `\uD83D\uDCCB ${dayFilter || "Full"} Schedule:${lines.join("\n")}`;
}

function handleFAQ(msg: string): string | null {
  const norm = normalize(msg);

  for (const [key, answer] of Object.entries(FAQ)) {
    if (
      norm.includes(key) ||
      (key === "parking" && matchesAny(msg, ["park", "parking", "lot", "drive"])) ||
      (key === "weather" && matchesAny(msg, ["weather", "hot", "cold", "temperature", "rain"])) ||
      (key === "camping" && matchesAny(msg, ["camp", "camping", "tent"])) ||
      (key === "prohibited" && matchesAny(msg, ["bring", "allowed", "prohibited", "banned", "can i bring"])) ||
      (key === "medical" && matchesAny(msg, ["medical", "doctor", "hurt", "emergency", "first aid"])) ||
      (key === "phone_charging" && matchesAny(msg, ["charge", "charging", "battery", "phone dying"])) ||
      (key === "lockers" && matchesAny(msg, ["locker", "store", "stash"])) ||
      (key === "shuttle" && matchesAny(msg, ["shuttle", "bus"])) ||
      (key === "rideshare" && matchesAny(msg, ["uber", "lyft", "rideshare", "ride"])) ||
      (key === "re_entry" && matchesAny(msg, ["re-entry", "reentry", "leave and come back", "leave"])) ||
      (key === "merch" && matchesAny(msg, ["merch", "merchandise", "tshirt", "hoodie", "souvenir"])) ||
      (key === "cash" && matchesAny(msg, ["cash", "atm", "card", "pay", "apple pay"])) ||
      (key === "accessibility" && matchesAny(msg, ["wheelchair", "accessible", "ada", "disability"])) ||
      (key === "set_times" && matchesAny(msg, ["set times", "set time"]))
    ) {
      return answer;
    }
  }
  return null;
}

function handleGreeting(msg: string): string | null {
  if (!matchesAny(msg, ["hello", "hi", "hey", "sup", "yo", "start", "help", "menu"])) return null;

  return `\uD83C\uDFAA Hey! I'm your Coachella 2026 guide! Here's what I can help with:\n\n\uD83C\uDFB5 "Who's playing now?"\n\u23F0 "What's coming up?"\n\uD83C\uDFA4 "When is Sabrina Carpenter?"\n\uD83D\uDCCB "Friday schedule"\n\uD83D\uDCA7 "Where's water?"\n\uD83D\uDEBB "Nearest restroom"\n\uD83C\uDF55 "Food options"\n\uD83C\uDD7F\uFE0F "Parking info"\n\nJust text me anything!`;
}

function handleStageInfo(msg: string): string | null {
  const norm = normalize(msg);
  for (const stage of FESTIVAL_INFO.stages) {
    const allNames = [stage.name.toLowerCase(), ...stage.aka];
    if (allNames.some((name) => norm.includes(name) && (norm.includes("where") || norm.includes("find") || norm.includes("how to get")))) {
      return `\uD83D\uDCCD ${stage.name} is in the ${stage.area} area of the grounds. Look for signs or ask any staff member in yellow!`;
    }
  }
  return null;
}

// ---- Stage reference finder ----

function findStageReference(msg: string): string | null {
  const norm = normalize(msg);
  for (const stage of FESTIVAL_INFO.stages) {
    const allNames = [stage.name.toLowerCase(), ...stage.aka];
    if (allNames.some((name) => norm.includes(name))) {
      return stage.name;
    }
  }
  return null;
}

// ---- Main responder ----

const handlers = [
  handleGreeting,
  handleWhatsPlaying,
  handleUpcoming,
  handleArtistSearch,
  handleSchedule,
  handleWater,
  handleRestrooms,
  handleFood,
  handleStageInfo,
  handleFAQ,
];

export function generateResponse(message: string): string {
  for (const handler of handlers) {
    const response = handler(message);
    if (response) return response;
  }

  // Fallback
  return `\uD83E\uDD14 I'm not sure about that! Try asking me:\n\u2022 "Who's playing now?"\n\u2022 "Friday schedule"\n\u2022 "Where's water near Sahara?"\n\u2022 "When is Anyma?"\n\u2022 "Parking info"\n\nOr text HELP for all options!`;
}
