// Coachella 2026 — Empire Polo Club, Indio CA
// Weekend 1: April 10-12, Weekend 2: April 17-19

export const FESTIVAL_INFO = {
  name: "Coachella 2026",
  venue: "Empire Polo Club",
  address: "81-800 Avenue 51, Indio, CA 92201",
  dates: {
    weekend1: { start: "2026-04-10", end: "2026-04-12" },
    weekend2: { start: "2026-04-17", end: "2026-04-19" },
  },
  hours: "Gates open at 12pm, music 1pm-1am Fri/Sat, 1pm-12am Sun",

  stages: [
    { name: "Coachella Stage", aka: ["main stage", "mainstage"], area: "center" },
    { name: "Outdoor Theatre", aka: ["outdoor"], area: "north" },
    { name: "Gobi Tent", aka: ["gobi"], area: "northeast" },
    { name: "Mojave Tent", aka: ["mojave"], area: "east" },
    { name: "Sahara Tent", aka: ["sahara"], area: "southeast" },
    { name: "Yuma Tent", aka: ["yuma"], area: "south" },
    { name: "Sonora Tent", aka: ["sonora"], area: "southwest" },
    { name: "Do LaB", aka: ["dolab", "do lab"], area: "northwest" },
  ],
};

export const WATER_STATIONS = [
  { name: "Main Entrance Water", near: "main entrance", landmark: "near the ferris wheel" },
  { name: "Sahara Water", near: "Sahara Tent", landmark: "between Sahara and Gobi" },
  { name: "Outdoor Water", near: "Outdoor Theatre", landmark: "left side of Outdoor Theatre" },
  { name: "VIP Water", near: "VIP area", landmark: "inside VIP section" },
  { name: "Campground Water", near: "camping area", landmark: "near lot 8 entrance" },
];

export const RESTROOMS = [
  { name: "Main Field Restrooms", near: "Coachella Stage", type: "porta-potty" },
  { name: "Sahara Restrooms", near: "Sahara Tent", type: "porta-potty" },
  { name: "Outdoor Restrooms", near: "Outdoor Theatre", type: "flush" },
  { name: "VIP Restrooms", near: "VIP area", type: "flush", note: "VIP only" },
  { name: "Campground Restrooms", near: "camping area", type: "flush + showers" },
];

export const FOOD_AREAS = [
  { name: "Terrace Food Court", near: "between mainstage and outdoor", cuisine: ["pizza", "tacos", "burgers", "vegan"] },
  { name: "Indio Central Market", near: "center of grounds", cuisine: ["asian", "mediterranean", "BBQ", "seafood"] },
  { name: "Outstanding in the Field", near: "VIP area", cuisine: ["fine dining"], note: "reservation required" },
  { name: "Rose Garden", near: "near Gobi", cuisine: ["cocktails", "light bites"] },
];

export const FAQ: Record<string, string> = {
  parking: "Parking lots open at 10am. Preferred parking is $60, general is $40. Take Avenue 50 or Monroe St exits.",
  camping: "Car camping and tent camping available. Check-in starts Thursday at 9am. Bring earplugs!",
  weather: "Expect 85-100\u00B0F during the day, drops to 60s at night. Bring sunscreen, hat, and a light jacket for after dark.",
  prohibited: "No professional cameras, drones, glass, outside food/drinks, chairs, or umbrellas. Sealed sunscreen + empty water bottles OK.",
  medical: "Medical tents are near the main entrance and between Sahara/Gobi. Text HELP to festival staff or find anyone in a yellow shirt.",
  phone_charging: "Charging lockers available near the main entrance ($5 for all day). Bring a portable charger.",
  lockers: "Rental lockers are near the main entrance. Reserve online at coachella.com \u2014 they sell out!",
  shuttle: "Festival shuttles run from hotels in Palm Springs, La Quinta, and Indio. $80 round trip for the weekend.",
  rideshare: "Uber/Lyft drop-off is at Lot 10. Expect 30-60 min wait after headliner. Leave 15 min early to beat the rush.",
  re_entry: "Yes you can leave and re-enter! Your wristband is scanned. Don't cut it too tight.",
  accessibility: "ADA viewing areas at every stage. Wheelchairs and companion seats available. Register at Guest Services.",
  age: "All ages. Under 5 free. Under 18 must be with adult.",
  cash: "Most vendors accept cards/Apple Pay. A few cash-only spots \u2014 ATMs are near the main entrance (expect fees).",
  merch: "Official merch tent is near the main entrance. Lines are shortest Friday afternoon. They sell out of popular sizes by Sunday.",
  set_times: "Set times are usually released 3-5 days before the festival. I'll have them as soon as they drop!",
};

// Re-export lineup data
export { coachellaStages } from "../data/coachella-lineup";
export { festivals, getFestivalBySlug } from "../data/festivals";
