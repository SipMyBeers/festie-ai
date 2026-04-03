import { generateResponse } from "../responder";

const tests: [string, string, (r: string) => boolean][] = [
  ["greeting", "hey", (r) => r.includes("guide")],
  ["help", "help", (r) => r.includes("help with")],
  ["artist search sabrina", "when is Sabrina Carpenter?", (r) => r.includes("Coachella Stage")],
  ["artist search anyma", "what time is anyma", (r) => r.includes("Sahara")],
  ["schedule friday", "friday schedule", (r) => r.includes("Schedule")],
  ["schedule saturday", "saturday lineup", (r) => r.includes("Schedule")],
  ["parking faq", "where do i park?", (r) => r.toLowerCase().includes("parking")],
  ["weather faq", "is it gonna be hot?", (r) => r.includes("85-100")],
  ["prohibited faq", "can i bring a camera?", (r) => r.includes("professional cameras")],
  ["water", "where can i get water", (r) => r.toLowerCase().includes("water")],
  ["restrooms", "where is the nearest bathroom", (r) => r.toLowerCase().includes("restroom")],
  ["food", "im hungry", (r) => r.toLowerCase().includes("food")],
  ["fallback", "xyzzy gibberish", (r) => r.includes("not sure")],
];

let passed = 0;
let failed = 0;

for (const [name, input, check] of tests) {
  const response = generateResponse(input);
  if (check(response)) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL: ${name}\n  Input: "${input}"\n  Response: "${response}"\n`);
  }
}

console.log(`\n${passed}/${passed + failed} tests passed`);
if (failed > 0) process.exit(1);
