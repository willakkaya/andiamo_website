// Akkaya Hospitality Group FOH training content. Group-wide modules and the
// Andiamo modules derive from the Ambience Notebook (Operations & Hospitality
// Reference, v1.0); Café Figaro modules from its wine/cocktail training docs.
// Single source of truth for the training app: modules -> lessons + quiz.
//
// This file is intentionally plain data so it can later seed a database when
// the app moves to a shared backend (Phase 2).

export const ROLES = [
  "Server",
  "Host",
  "Bartender",
  "Busser/Runner",
  "Manager",
] as const;
export type Role = (typeof ROLES)[number];

export const LOCATIONS = ["Andiamo", "Cafe Figaro", "Don Giovanni"] as const;
export type Location = (typeof LOCATIONS)[number];

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  /** Index into options of the correct answer. */
  answer: number;
  /** Shown after answering — reinforces the binder standard. */
  explanation: string;
};

export type LessonImage = {
  /** Path under /public, e.g. "/images/vault-dining.jpg". */
  src: string;
  alt: string;
  /** Editorial caption shown under the photo ("fig." numbering is automatic). */
  caption?: string;
};

export type Lesson = {
  heading: string;
  /** Short intro line, optional. */
  intro?: string;
  /** Bullet points — the teachable standards. */
  points: string[];
  /** Optional photo shown with the lesson (plating, table set, uniform…). */
  image?: LessonImage;
};

export type TrainingModule = {
  id: string;
  /** Display order. */
  order: number;
  section: string;
  title: string;
  /** One-line description for the module card. */
  summary: string;
  /** Estimated minutes to read + quiz. */
  minutes: number;
  /** Roles that must pass this module; everyone else sees it as an elective. */
  requiredFor: Role[];
  /** Restaurant this module belongs to. Undefined = group-wide (all restaurants). */
  location?: Location;
  lessons: Lesson[];
  quiz: QuizQuestion[];
};

// Role groups for module requirements. To change who must complete what,
// tweak these or any individual module's requiredFor below.
const EVERYONE: Role[] = [...ROLES];
const SERVICE_TEAM: Role[] = ["Server", "Bartender", "Busser/Runner", "Manager"];
const BEVERAGE_TEAM: Role[] = ["Server", "Bartender", "Manager"];

export const MODULES: TrainingModule[] = [
  {
    id: "culture",
    order: 1,
    section: "Who We Are",
    title: "The Akkaya Standard & Culture",
    summary: "Our four values, our hospitality philosophy, and why we serve.",
    minutes: 8,
    requiredFor: EVERYONE,
    lessons: [
      {
        heading: "Our Four Values",
        intro:
          "Every guest who walks through our door is a guest in our home.",
        points: [
          "Warmth — every guest deserves to feel genuinely welcome.",
          "Precision — every detail matters, every time.",
          "Passion — love what you do; it shows.",
          "Pride — represent us like it's your name on the door.",
        ],
      },
      {
        heading: "Hospitality Philosophy",
        intro:
          "People will forget what you said and did, but never how you made them feel.",
        points: [
          "Notice guest cues — read body language, tone, and pacing at the table.",
          "Anticipate needs before being asked — water refilled, bread offered, check ready.",
          "Personalize every interaction — use names; remember returning guests.",
          "Never pass judgment — every guest gets our best.",
          "Guide, never push. Promote, never impose.",
        ],
      },
      {
        heading: "Why We Serve",
        intro: "We don't serve food — we serve people.",
        points: [
          "We serve to make people feel seen and to create comfort.",
          "We never know what battles a guest is fighting — your kindness may be the brightest part of their day.",
          "Every shift is a chance to positively impact someone's life.",
        ],
        image: {
          src: "/akkaya-family.jpg",
          alt: "The Akkaya family",
          caption: "This is a family business — you're part of the family now",
        },
      },
      {
        heading: "Hospitality 101 — The Six Mindsets",
        intro:
          "You can know every step of service and still be forgettable. What makes you unforgettable is making people feel something.",
        points: [
          "See the guest — every table has a story you don't know: a first date, an anniversary, a hard week. Make it better.",
          "Anticipate — the best service is invisible. Refill before empty; bring the check when they reach; offer dessert before they ask.",
          "Recover gracefully — own it, fix it, surprise them with the recovery. They often leave happier than if nothing went wrong.",
          "Be genuinely curious — guests feel the difference between performed friendliness and real interest. Be real.",
          "Know your craft — a server who knows the menu, wines, and cocktails is a resource; one who doesn't is a liability.",
          "Own the room — you set the energy. Engaged and warm, the room feels it. Distracted and flat, it feels that too.",
        ],
      },
    ],
    quiz: [
      {
        id: "culture-1",
        question: "What are our four core values?",
        options: [
          "Speed, Volume, Profit, Growth",
          "Warmth, Precision, Passion, Pride",
          "Friendliness, Cleanliness, Value, Fun",
          "Tradition, Family, Wine, Pasta",
        ],
        answer: 1,
        explanation:
          "Warmth, Precision, Passion, and Pride — the foundation of everything we do.",
      },
      {
        id: "culture-2",
        question: "According to our hospitality philosophy, great service means you should:",
        options: [
          "Wait for guests to ask before doing anything",
          "Anticipate needs before being asked",
          "Follow the script exactly with every table",
          "Focus only on the person who seems in charge",
        ],
        answer: 1,
        explanation:
          "Anticipation is the mark of a great hospitality professional — water, bread, and the check before they signal.",
      },
      {
        id: "culture-3",
        question: "When guiding guests toward menu and wine choices, we should:",
        options: [
          "Push the most expensive items hard",
          "Guide and recommend — never push or impose",
          "Let guests figure it out themselves",
          "Only suggest items when asked directly",
        ],
        answer: 1,
        explanation: "We guide, never push. We promote, never impose.",
      },
      {
        id: "culture-4",
        question: "\"We don't serve food — we serve ____.\"",
        options: ["wine", "tables", "people", "tips"],
        answer: 2,
        explanation:
          "We serve people. Every interaction is a chance to make someone's day better.",
      },
      {
        id: "culture-5",
        question: "The value of Precision means:",
        options: [
          "Working as fast as possible",
          "Every detail matters, every time",
          "Following the POS exactly",
          "Never changing anything",
        ],
        answer: 1,
        explanation: "Precision — every detail matters, every time.",
      },
      {
        id: "culture-6",
        question:
          "A guest keeps checking their watch and glancing toward the kitchen. This is:",
        options: [
          "None of your business until they wave",
          "A guest cue — read it and act before they have to ask",
          "A reason to avoid the table",
          "Something only the manager should handle",
        ],
        answer: 1,
        explanation:
          "Notice guest cues — body language, tone, and pacing — and anticipate the need before being asked.",
      },
      {
        id: "culture-7",
        question:
          "\"People will forget what you said and did, but never ____.\"",
        options: [
          "what they ordered",
          "how much they paid",
          "how you made them feel",
          "who served them",
        ],
        answer: 2,
        explanation:
          "…how you made them feel. That feeling is the product we actually sell.",
      },
      {
        id: "culture-8",
        question: "A returning guest sits in your section. Our standard is to:",
        options: [
          "Treat them exactly like a first-timer",
          "Use their name and remember what they enjoyed last time",
          "Give them free items so they come back",
          "Send the manager to the table instead",
        ],
        answer: 1,
        explanation:
          "Personalize every interaction — use names and remember returning guests.",
      },
      {
        id: "culture-9",
        question:
          "A table looks like they 'won't spend much.' How should that change your service?",
        options: [
          "Spend less time on them",
          "Skip the specials and wine suggestions",
          "Not at all — every guest gets our best",
          "Move them to a smaller table",
        ],
        answer: 2,
        explanation:
          "Never pass judgment — every guest gets our best, every time.",
      },
      {
        id: "culture-10",
        question:
          "Why does the binder say your kindness matters more than you know?",
        options: [
          "Because kindness increases tips",
          "Because we never know what battles a guest is fighting",
          "Because managers are always watching",
          "Because reviews mention it",
        ],
        answer: 1,
        explanation:
          "We never know what battles a guest is fighting — your kindness may be the brightest part of their day.",
      },
      {
        id: "culture-11",
        question: "\"The best service is invisible\" means:",
        options: [
          "Stay out of the dining room as much as possible",
          "Anticipate — refill before it's empty, bring the check when they reach, offer dessert before they ask",
          "Never speak unless spoken to",
          "Let the food speak for itself",
        ],
        answer: 1,
        explanation:
          "Anticipation is the mark of a great hospitality professional — needs are met before the guest has to ask.",
      },
    ],
  },
  {
    id: "arrival",
    order: 2,
    section: "Who We Are",
    title: "Arrival, Readiness & Appearance",
    summary: "Clock-in standards, uniform, dress code, and professional language.",
    minutes: 7,
    requiredFor: EVERYONE,
    lessons: [
      {
        heading: "Arrival & Readiness",
        points: [
          "Clock-in window is 4:15–4:35 PM unless otherwise specified.",
          "Arrive in full uniform — never do prep in street clothes.",
          "Clock in ready to work — do not clock in and then go change.",
          "Check in with the shift lead or manager on arrival.",
        ],
      },
      {
        heading: "Why Uniform From Arrival Matters",
        points: [
          "Sanitation — street clothes carry bacteria into prep and service areas.",
          "Safety — slides and loose clothing increase the risk of slips, falls, and burns.",
          "Professionalism — guests and staff should only see FOH polished and ready.",
          "Consistency — when one person sets up out of uniform, it lowers the bar for everyone.",
        ],
      },
      {
        heading: "Dress Code & Appearance",
        intro: "There are no casual days here.",
        points: [
          "Clean, pressed uniform — no wrinkles, no stains.",
          "Closed-toe, non-slip shoes — black preferred.",
          "Name tag visible at all times; no heavy perfume or cologne.",
          "Hair neat and tied back if longer than collar length; clean trimmed nails.",
          "Phones on silent and out of sight during service.",
        ],
      },
      {
        heading: "Professional Language Standards",
        intro: "There is no 'off' switch during service.",
        points: [
          "Never say: 'cutie / sweetie / hun / honey', 'bro / dude', 'you guys'.",
          "Instead say: 'Of course.' / 'Certainly.' / 'Right away.' / 'My pleasure.'",
          "Avoid 'to be honest with you' — say 'I would be happy to…'",
          "Address each guest individually, with warmth and polish.",
        ],
      },
    ],
    quiz: [
      {
        id: "arrival-1",
        question: "What is the clock-in window for an evening shift?",
        options: ["3:00–3:30 PM", "4:15–4:35 PM", "5:00–5:15 PM", "Whenever you arrive"],
        answer: 1,
        explanation: "4:15–4:35 PM, in full uniform, ready to begin immediately.",
      },
      {
        id: "arrival-2",
        question: "You arrive a few minutes early. The correct move is to:",
        options: [
          "Clock in, then go change into uniform",
          "Do prep in your street clothes to save time",
          "Arrive already in full uniform and clock in ready to work",
          "Wait outside until exactly 4:35",
        ],
        answer: 2,
        explanation:
          "Arrive ready — never clock in and then change. Uniform from arrival is sanitation, safety, and professionalism.",
      },
      {
        id: "arrival-3",
        question: "A guest thanks you. Which response meets our language standard?",
        options: [
          "\"No problem, hun!\"",
          "\"You got it, bro.\"",
          "\"Of course — my pleasure.\"",
          "\"Yeah, no worries you guys.\"",
        ],
        answer: 2,
        explanation:
          "Warmth with polish — 'Of course' / 'Certainly' / 'My pleasure'. Never casual or dismissive.",
      },
      {
        id: "arrival-4",
        question: "Which is acceptable under the dress code?",
        options: [
          "Slides or sandals if it's hot",
          "A wrinkled shirt that's mostly clean",
          "Heavy cologne so you smell fresh",
          "Closed-toe non-slip shoes and a pressed uniform",
        ],
        answer: 3,
        explanation:
          "Clean, pressed uniform and closed-toe non-slip shoes. No slides, no heavy scents, no wrinkles.",
      },
      {
        id: "arrival-5",
        question: "Why can't prep be done in street clothes?",
        options: [
          "It looks bad on camera",
          "Street clothes carry bacteria into prep and service areas",
          "Street clothes are too comfortable",
          "It's fine as long as you're fast",
        ],
        answer: 1,
        explanation:
          "Sanitation — street clothes carry bacteria into prep and service areas. Uniform from arrival, always.",
      },
      {
        id: "arrival-6",
        question: "The first thing to do when you arrive for a shift is:",
        options: [
          "Start your side work quietly",
          "Get a coffee and settle in",
          "Check in with the shift lead or manager",
          "Check the tip pool from last night",
        ],
        answer: 2,
        explanation: "Check in with the shift lead or manager on arrival.",
      },
      {
        id: "arrival-7",
        question: "During service, your phone must be:",
        options: [
          "On vibrate in your pocket",
          "On silent and out of sight",
          "Face down at the server station",
          "Available for urgent texts",
        ],
        answer: 1,
        explanation: "Phones on silent and out of sight during service — no exceptions.",
      },
      {
        id: "arrival-8",
        question: "The hair standard is:",
        options: [
          "Any style as long as it's clean",
          "Neat, and tied back if longer than collar length",
          "Hats are required",
          "Only buns are allowed",
        ],
        answer: 1,
        explanation:
          "Hair neat and tied back if longer than collar length; clean, trimmed nails.",
      },
      {
        id: "arrival-9",
        question: "Which of these is on the never-say list?",
        options: [
          "\"Certainly.\"",
          "\"Right away.\"",
          "\"You guys\"",
          "\"My pleasure.\"",
        ],
        answer: 2,
        explanation:
          "Never 'you guys', 'hun', 'sweetie', 'bro', or 'dude'. Address each guest individually, with polish.",
      },
      {
        id: "arrival-10",
        question: "Instead of \"to be honest with you…\", say:",
        options: [
          "\"Honestly…\"",
          "\"I would be happy to…\"",
          "\"Look, between us…\"",
          "\"No problem.\"",
        ],
        answer: 1,
        explanation: "Say 'I would be happy to…' — polished, positive, professional.",
      },
    ],
  },
  {
    id: "roles",
    order: 3,
    section: "Who We Are",
    title: "Roles & Responsibilities",
    summary: "Core duties for Host, Server, Bartender, and Busser/Runner.",
    minutes: 8,
    requiredFor: EVERYONE,
    lessons: [
      {
        heading: "Host / Hostess",
        intro: "You are the first and last impression of the restaurant.",
        points: [
          "Greet every guest within 30 seconds — eye contact, warm smile, genuine welcome.",
          "Manage the reservation book and waitlist accurately; know the floor at all times.",
          "Escort guests to the table — never point, always lead.",
          "Note special occasions, dietary needs, and VIP flags in the system.",
          "Thank every guest by name as they leave if you know it.",
        ],
      },
      {
        heading: "Server",
        intro: "Servers are hospitality professionals who anticipate needs.",
        points: [
          "Greet the table within 2 minutes of being seated — introduce yourself.",
          "Know the full menu, ingredients, allergens, specials, and wine list.",
          "Deliver food by seat number — never call out names.",
          "Replace silverware between courses without being asked; keep water filled.",
          "Complete all side work and closing duties before clocking out.",
        ],
      },
      {
        heading: "Bartender",
        intro: "The bar sets the energy of the room.",
        points: [
          "Acknowledge every bar guest within 60 seconds — even if mid-build.",
          "Know every cocktail, ingredient, and preparation method.",
          "Keep the bar top clean and polished throughout service.",
          "Communicate proactively with servers on timing, 86's, and delays.",
          "Never over-serve — involve management when needed.",
        ],
      },
      {
        heading: "Busser / Food Runner",
        points: [
          "Clear and crumb tables quietly between courses; reset quickly and precisely.",
          "Runner: confirm every dish at the pass — never run a partial table.",
          "Know seat numbers; deliver without calling out names.",
          "Give a brief description on delivery: 'This is your [dish], enjoy.'",
          "Return to the floor after delivery — never linger in the kitchen.",
        ],
        image: {
          src: "/vault-red.jpg",
          alt: "The Vault private dining room at Andiamo in Banca",
          caption: "The Vault — where every role works as one team",
        },
      },
    ],
    quiz: [
      {
        id: "roles-1",
        question: "Within how long should a host greet an arriving guest?",
        options: ["30 seconds", "2 minutes", "5 minutes", "As soon as convenient"],
        answer: 0,
        explanation: "Within 30 seconds — eye contact, warm smile, genuine welcome.",
      },
      {
        id: "roles-2",
        question: "A server should greet a newly seated table within:",
        options: ["30 seconds", "2 minutes", "10 minutes", "After drinks are poured"],
        answer: 1,
        explanation: "Within 2 minutes of being seated — and introduce yourself.",
      },
      {
        id: "roles-3",
        question: "When delivering food, the correct method is to:",
        options: [
          "Call out the dish name so guests claim it",
          "Use seat numbers and never call out names",
          "Ask 'who had the salmon?'",
          "Set everything in the middle to share",
        ],
        answer: 1,
        explanation:
          "Use seat numbers; never call out dishes. Deliver with a brief description: 'This is your [dish], enjoy.'",
      },
      {
        id: "roles-4",
        question: "A food runner gets to the pass but one dish for the table isn't ready. They should:",
        options: [
          "Run the ready dishes now and bring the last one later",
          "Wait and run all dishes for the table together",
          "Ask a guest if it's okay to bring food separately",
          "Leave it for the server to handle",
        ],
        answer: 1,
        explanation: "Never run a partial table — all dishes go at once.",
      },
      {
        id: "roles-5",
        question: "How quickly should a bartender acknowledge a new bar guest?",
        options: ["Within 60 seconds, even if mid-build", "Within 5 minutes", "After finishing all current drinks", "Only once they make eye contact"],
        answer: 0,
        explanation: "Within 60 seconds — even if mid-build. The bar sets the room's energy.",
      },
      {
        id: "roles-6",
        question: "When showing guests to their table, a host should:",
        options: [
          "Point them toward it so they can settle in",
          "Escort them — never point, always lead",
          "Hand them menus and let them pick a table",
          "Ask a busser to walk them over",
        ],
        answer: 1,
        explanation: "Escort guests to the table — never point, always lead.",
      },
      {
        id: "roles-7",
        question:
          "A caller mentions it's their anniversary when booking. The host should:",
        options: [
          "Remember it mentally",
          "Note it in the system with any dietary needs or VIP flags",
          "Tell the kitchen verbally at some point",
          "Do nothing — it's just small talk",
        ],
        answer: 1,
        explanation:
          "Special occasions, dietary needs, and VIP flags get noted in the system so the whole team can deliver.",
      },
      {
        id: "roles-8",
        question: "Silverware between courses should be replaced:",
        options: [
          "When the guest asks",
          "Only for tasting menus",
          "Without being asked",
          "Only if it was used",
        ],
        answer: 2,
        explanation:
          "Replace silverware between courses without being asked; keep water filled.",
      },
      {
        id: "roles-9",
        question: "A cocktail is delayed and two dishes just got 86'd. The bartender should:",
        options: [
          "Focus on drinks — servers will figure it out",
          "Proactively communicate timing, 86's, and delays to the servers",
          "Tell only the manager",
          "Post a note at the end of the night",
        ],
        answer: 1,
        explanation:
          "Communicate proactively with servers on timing, 86's, and delays — before they get surprised at a table.",
      },
      {
        id: "roles-10",
        question: "A bar guest seems to have had too much. The standard is:",
        options: [
          "Serve one last round, then stop",
          "Never over-serve — involve management when needed",
          "Water down their next drink quietly",
          "Ask their friends what to do",
        ],
        answer: 1,
        explanation: "Never over-serve — involve management when needed.",
      },
      {
        id: "roles-11",
        question: "After running food, a runner should:",
        options: [
          "Wait in the kitchen for the next tray",
          "Take a short break",
          "Return to the floor — never linger in the kitchen",
          "Help the dishwasher",
        ],
        answer: 2,
        explanation:
          "Deliver with a brief description — 'This is your [dish], enjoy' — then return to the floor.",
      },
    ],
  },
  {
    id: "opening",
    order: 4,
    section: "How We Operate",
    title: "Opening SOP",
    summary: "Getting lighting, bar, dining room, and stations fully ready before doors.",
    minutes: 7,
    requiredFor: EVERYONE,
    location: "Andiamo",
    lessons: [
      {
        heading: "Lighting & Atmosphere",
        intro: "The restaurant must NEVER look dark, half-lit, or unprepared.",
        points: [
          "Turn on all dining room lights — including the far-side lights (switch by the bathroom).",
          "Turn on all under-the-bar lights (switch by the trash can) — the most-forgotten light.",
          "Dim to proper evening level — warmth, visibility, no harsh shadows.",
          "Music ON at correct volume the moment doors open; candles lit.",
        ],
      },
      {
        heading: "Bar & Dining Room Readiness",
        points: [
          "Ice bins full; garnish tray stocked and spotless; batches ready (not 'still need to make them').",
          "BTG wines restocked — minimum 4 of each; flutes polished; wine buckets prepped with clean linens.",
          "Rollups stocked; menus clean (no grease or curled edges); water pitchers filled and chilled.",
          "Tables leveled and aligned; chairs pushed in; no clutter or bussing trays in sight.",
        ],
      },
      {
        heading: "Server Station & Cleanliness",
        points: [
          "Silverware stocked, napkins folded, printer paper full, POS terminals signed in.",
          "Zero clutter — nothing left on counters, ever.",
          "Floors swept, bathrooms spotless, glass polished, entryway welcoming.",
          "Trash taken out before opening — not after guests arrive.",
        ],
      },
      {
        heading: "Pre-Shift Alignment",
        points: [
          "Specials confirmed; 86'd items verified.",
          "Large parties and VIP notes reviewed.",
          "Section assignments confirmed; service flow discussed.",
          "Team should feel aligned and calm — not rushed.",
        ],
      },
      {
        heading: "Opening Server Checklist",
        intro: "Your name is on the open. Run it the same way every day.",
        points: [
          "Clock in, turn the music on — the room should feel alive immediately.",
          "Set up outside tables and sweep the outside; water the outside plants.",
          "Ask the Chef about today's specials before pre-shift — never learn them from a guest's question.",
          "Make sure the bar is stocked; stock or make silverware roll-ups.",
        ],
      },
    ],
    quiz: [
      {
        id: "opening-1",
        question: "The two most commonly forgotten lights at opening are:",
        options: [
          "The kitchen lights and the office light",
          "The far-side dining lights (switch by bathroom) and the under-bar lights (switch by trash can)",
          "The patio lights and the sign",
          "The restroom lights and the hallway",
        ],
        answer: 1,
        explanation:
          "Far-side lights — switch by the bathroom; under-bar lights — switch by the trash can. Check both every day.",
      },
      {
        id: "opening-2",
        question: "Batch cocktails at opening should be:",
        options: [
          "Made to order once guests arrive",
          "Ready before service — not 'we still need to make them'",
          "Skipped unless it's busy",
          "Prepared by the servers",
        ],
        answer: 1,
        explanation: "The bar must look ready for a critic at all times — batches ready before service.",
      },
      {
        id: "opening-3",
        question: "Minimum number of each by-the-glass wine restocked before service:",
        options: ["2 of each", "4 of each", "6 of each", "As many as fit"],
        answer: 1,
        explanation: "BTG wines restocked to a minimum of 4 of each.",
      },
      {
        id: "opening-4",
        question: "Trash should be taken out:",
        options: [
          "Before opening — not after guests arrive",
          "Whenever it gets full during service",
          "At the end of the night only",
          "By the closing team next morning",
        ],
        answer: 0,
        explanation: "Take trash out before opening. Nothing should feel 'in progress' when guests arrive.",
      },
      {
        id: "opening-5",
        question: "Music and candles at opening:",
        options: [
          "Music once the first table sits; candles at dusk",
          "Music ON at correct volume the moment doors open; candles lit",
          "Music optional on slow nights",
          "Candles only in the back section",
        ],
        answer: 1,
        explanation:
          "The room must be fully alive the moment doors open — music at correct volume, candles lit.",
      },
      {
        id: "opening-6",
        question: "Wine buckets and flutes before service:",
        options: [
          "Set up on request",
          "Buckets prepped with clean linens; flutes polished",
          "Buckets stored away until a bottle sells",
          "Flutes polished only for reservations",
        ],
        answer: 1,
        explanation:
          "Wine buckets prepped with clean linens, flutes polished — before doors, not after.",
      },
      {
        id: "opening-7",
        question: "Menus going to the floor must be:",
        options: [
          "Mostly clean",
          "Clean — no grease, no curled edges",
          "New every single day",
          "Laminated",
        ],
        answer: 1,
        explanation: "Menus clean with no grease or curled edges — they're in every guest's hands.",
      },
      {
        id: "opening-8",
        question: "A ready server station means:",
        options: [
          "POS terminals on and nothing else",
          "Silverware stocked, napkins folded, printer paper full, POS signed in",
          "Whatever the last shift left",
          "Just rollups and pens",
        ],
        answer: 1,
        explanation:
          "Silverware, napkins, printer paper, POS signed in — and zero clutter on counters.",
      },
      {
        id: "opening-9",
        question: "Pre-shift alignment covers:",
        options: [
          "Only who's on which section",
          "Specials, 86'd items, large parties & VIP notes, section assignments",
          "Just the specials",
          "Gossip and schedule requests",
        ],
        answer: 1,
        explanation:
          "Specials confirmed, 86's verified, large parties and VIPs reviewed, sections confirmed — aligned and calm.",
      },
      {
        id: "opening-10",
        question: "The dining room standard before doors is:",
        options: [
          "Tables roughly in place",
          "Tables leveled and aligned, chairs in, no clutter or bussing trays in sight",
          "Chairs stacked until guests arrive",
          "Bussing trays staged on empty tables",
        ],
        answer: 1,
        explanation:
          "Tables leveled and aligned, chairs pushed in, nothing in sight that says 'still setting up'.",
      },
      {
        id: "opening-11",
        question: "Which of these is part of the opening server checklist?",
        options: [
          "Water the outside plants and set up outside tables",
          "Count the safe",
          "Prep the garnish tray in the kitchen",
          "Print the wine list",
        ],
        answer: 0,
        explanation:
          "Openers turn on music, set up and sweep outside, water the plants, confirm specials with the Chef, and stock roll-ups and the bar.",
      },
    ],
  },
  {
    id: "closing",
    order: 5,
    section: "How We Operate",
    title: "Closing SOP",
    summary: "Closing the bar, dining room, and stations so we're ready to open.",
    minutes: 6,
    requiredFor: EVERYONE,
    location: "Andiamo",
    lessons: [
      {
        heading: "The Closing Standard",
        intro: "The restaurant should look like we're about to open — even at close.",
        points: [
          "If John walks in at 5 PM or 11 PM, the restaurant should look perfect.",
          "Lights charged. Dining room set. Bar ready. Stations clean. Team aligned.",
        ],
      },
      {
        heading: "Bar Close",
        points: [
          "Garnishes wrapped and labeled; batches sealed; ice dumped.",
          "BTG wines sealed and refrigerated; bar wiped and polished; bar mats washed.",
          "Under-bar lights OFF; rechargeable lights placed on the charging station.",
        ],
      },
      {
        heading: "Dining Room & Station Close",
        points: [
          "All tables reset; chairs aligned; floors swept and mopped.",
          "Menus wiped; candles extinguished.",
          "All LED/table lights returned to the charging station and plugged in.",
          "Far-side lights OFF (switch by bathroom); silverware and napkins restocked; counters sanitized.",
        ],
      },
      {
        heading: "Final Walkthrough",
        points: [
          "All lights OFF — far-side switch by bathroom, under-bar switch by trash can.",
          "Charging station 'humming' — every light plugged in.",
          "Floors mopped; no food, drinks, or clutter anywhere; doors locked.",
        ],
      },
      {
        heading: "Closing Server Checklist",
        intro: "The closer signs the room over to tomorrow.",
        points: [
          "Clean and sanitize the menus; sweep or vacuum the floors.",
          "Restock the bar, condiment tray, and cold fridge for the next shift.",
          "Close your cash in the POS system before clocking out.",
          "Recharge the outside candle lights — place them on the charging station.",
        ],
      },
    ],
    quiz: [
      {
        id: "closing-1",
        question: "What is the guiding rule for closing?",
        options: [
          "Just get out as fast as possible",
          "The restaurant should look like we're about to open — even at close",
          "Leave setup for the morning crew",
          "Only clean what guests can see",
        ],
        answer: 1,
        explanation:
          "If John walks in at 5 PM or 11 PM, it should look perfect. Close as if we're about to open.",
      },
      {
        id: "closing-2",
        question: "At close, the rechargeable/LED table lights must be:",
        options: [
          "Left on the tables",
          "Turned off and left anywhere convenient",
          "Returned to the charging station and plugged in",
          "Taken home to charge",
        ],
        answer: 2,
        explanation: "Every light goes back to the charging station, plugged in — the station should be 'humming'.",
      },
      {
        id: "closing-3",
        question: "How should BTG wines be handled at bar close?",
        options: [
          "Left open on the bar for tomorrow",
          "Sealed and put in the fridge",
          "Poured out",
          "Moved to the dining room",
        ],
        answer: 1,
        explanation: "BTG wines sealed and refrigerated; garnishes wrapped and labeled; batches sealed.",
      },
      {
        id: "closing-4",
        question: "Garnishes at bar close are:",
        options: [
          "Thrown away every night",
          "Wrapped and labeled",
          "Left covered on the bar",
          "Moved to the kitchen walk-in unlabeled",
        ],
        answer: 1,
        explanation: "Garnishes wrapped and labeled; batches sealed; ice dumped.",
      },
      {
        id: "closing-5",
        question: "The ice in the bins at close is:",
        options: [
          "Left for the morning",
          "Dumped",
          "Topped off for tomorrow",
          "Bagged and stored",
        ],
        answer: 1,
        explanation: "Ice dumped at close — fresh ice every service.",
      },
      {
        id: "closing-6",
        question: "The under-bar lights at the end of the night:",
        options: [
          "Stay on for security",
          "OFF — and rechargeable lights go on the charging station",
          "Are the opener's responsibility",
          "Are left however they are",
        ],
        answer: 1,
        explanation:
          "Under-bar lights off (switch by the trash can); every rechargeable light on the charging station.",
      },
      {
        id: "closing-7",
        question: "Dining room floors at close:",
        options: [
          "Swept only",
          "Swept and mopped",
          "Mopped weekly",
          "Left for the morning crew",
        ],
        answer: 1,
        explanation: "All tables reset, chairs aligned, floors swept AND mopped.",
      },
      {
        id: "closing-8",
        question: "Menus and candles at close:",
        options: [
          "Menus stacked as-is; candles burn out on their own",
          "Menus wiped; candles extinguished",
          "Menus recycled nightly",
          "Candles left lit for ambiance",
        ],
        answer: 1,
        explanation: "Menus wiped clean; every candle extinguished before you leave.",
      },
      {
        id: "closing-9",
        question: "On the final walkthrough, the two light switches to check are:",
        options: [
          "Kitchen and office",
          "Far-side (by the bathroom) and under-bar (by the trash can)",
          "Patio and entry",
          "There's only one master switch",
        ],
        answer: 1,
        explanation:
          "Far-side lights — switch by the bathroom; under-bar lights — switch by the trash can. Same two as opening.",
      },
      {
        id: "closing-10",
        question: "Before leaving, stations must have:",
        options: [
          "Whatever's left from service",
          "Silverware and napkins restocked, counters sanitized",
          "Just the POS logged out",
          "A note for the openers",
        ],
        answer: 1,
        explanation:
          "Restock silverware and napkins, sanitize counters — the opener should walk into a ready room.",
      },
      {
        id: "closing-11",
        question: "Before clocking out, the closing server must:",
        options: [
          "Leave the cash drawer for the manager",
          "Close their cash in the POS and put the outside candle lights on charge",
          "Take the menus home to clean",
          "Turn the music up for the cleaning crew",
        ],
        answer: 1,
        explanation:
          "Close your cash in the POS, sanitize menus, restock bar/condiments/cold fridge, and recharge the outside candle lights.",
      },
    ],
  },
  {
    id: "service",
    order: 6,
    section: "How We Serve",
    title: "Steps of Service",
    summary: "The 10 steps, language & tone, presence on the floor, and check timing.",
    minutes: 9,
    requiredFor: SERVICE_TEAM,
    lessons: [
      {
        heading: "The 10 Steps of Service",
        intro: "Not a script — a framework. Never skip a step.",
        points: [
          "1. Greet within 2 minutes — make eye contact with everyone.",
          "2. Offer water & beverages — pour water immediately.",
          "3. Present & know the menu — know specials, 86's, and allergens before being asked.",
          "4. Take the order — listen fully, repeat back, enter into POS immediately.",
          "5. Deliver food — by seat number, all plates together.",
          "6. Check back after the first bite — not a minute in.",
          "7. Maintain the table — water, bread, clear plates, replace silverware.",
          "8. Dessert & digestif — offer before they ask for the check.",
          "9. Present the check — ready within 2 minutes when they signal.",
          "10. Farewell — thank them by name if you know it. Mean it.",
        ],
        image: {
          src: "/dining-room.jpg",
          alt: "The dining room, set for service",
          caption: "The room ready for service — every table a stage",
        },
      },
      {
        heading: "Language & Tone at the Table",
        points: [
          "Say: 'Welcome — it's wonderful to have you with us.'",
          "Say: 'How is everything tasting this evening?' (not 'Is everything OK?').",
          "Offer, don't ask: 'Can I bring over our dessert menu?' (not 'Do you want dessert?').",
          "Avoid 'No problem' — it implies it could have been a problem.",
        ],
      },
      {
        heading: "Presence, Movement & Energy",
        points: [
          "Clear from the right, serve from the left; never reach across guests.",
          "Move with quiet confidence — never rush or run in the dining room.",
          "No phones during service, ever; no clustering or socializing with cooks on the floor.",
          "Never let visible stress enter the dining room.",
        ],
      },
      {
        heading: "When to Present the Check & Slow Nights",
        points: [
          "Present after dessert is offered/declined; watch for cues (napkins down, menus closed).",
          "Never present mid-toast, mid-dessert, or mid-conversation.",
          "Slow night: 'If there is time to lean, there is time to clean' — polish at least 10 glasses and place them on tables, uniformly aligned.",
          "Check restrooms every 20 minutes; clean menus and check presenters; refill carafes, caddies, and sanitizer buckets.",
          "Side work may not begin before 8:30 PM unless approved by the shift lead — stay guest-focused until instructed.",
        ],
      },
      {
        heading: "Bread Service & Linen Standards",
        intro: "Bread is the first thing a guest touches — it must be flawless.",
        points: [
          "Use tongs at all times when handling bread for guests — never bare hands, even briefly.",
          "Use gloves when cutting or slicing behind the scenes; cut only on a sanitized cutting board.",
          "Bread baskets are lined with clean linens; basket presented neat and evenly arranged.",
          "Bread-basket napkins never touch booths, chairs, or any non-sanitized surface — only sanitized stations, side-work tables, or clean trays.",
          "Any linen (or bread) that touches an unclean surface gets replaced immediately — no exceptions.",
        ],
      },
    ],
    quiz: [
      {
        id: "service-1",
        question: "When should you check back on a table?",
        options: [
          "One minute after delivering food",
          "After the first bite",
          "Only when they wave you over",
          "When you clear the plates",
        ],
        answer: 1,
        explanation: "Check back after the first bite: 'How is everything tasting this evening?'",
      },
      {
        id: "service-2",
        question: "Which phrasing matches our standard?",
        options: [
          "\"Is everything OK?\"",
          "\"Do you want dessert?\"",
          "\"Can I bring over our dessert menu?\"",
          "\"You guys need anything?\"",
        ],
        answer: 2,
        explanation: "We offer, we don't ask. 'Can I bring over our dessert menu?'",
      },
      {
        id: "service-3",
        question: "The correct service mechanics are:",
        options: [
          "Serve from the right, clear from the left",
          "Clear from the right, serve from the left",
          "Always serve and clear from whichever side is open",
          "Reach across the guest if it's faster",
        ],
        answer: 1,
        explanation: "Clear from the right, serve from the left — and never reach across a guest.",
      },
      {
        id: "service-4",
        question: "When is it appropriate to present the check?",
        options: [
          "As soon as entrées are cleared, to turn the table",
          "Mid-dessert to save time",
          "After dessert is offered or declined, watching for cues",
          "Only when the guest explicitly asks, never before",
        ],
        answer: 2,
        explanation:
          "After dessert is offered/declined and you read the cues — never during a toast, dessert, or conversation.",
      },
      {
        id: "service-5",
        question: "On a slow night, idle standing is:",
        options: [
          "Fine once your tables are handled",
          "Never permitted — there is always reset/clean/restock work",
          "Allowed if you're near the host stand",
          "Encouraged so you look available",
        ],
        answer: 1,
        explanation: "'If there is time to lean, there is time to clean.' Idle standing is never permitted.",
      },
      {
        id: "service-6",
        question: "When taking the order, the standard is:",
        options: [
          "Write fast and confirm later",
          "Listen fully, repeat it back, enter into the POS immediately",
          "Memorize everything — pads look unprofessional",
          "Enter it after greeting your next table",
        ],
        answer: 1,
        explanation:
          "Listen fully, repeat the order back, and enter it into the POS immediately.",
      },
      {
        id: "service-7",
        question: "Water at the table should be:",
        options: [
          "Offered after the food order",
          "Poured immediately",
          "Brought only if asked",
          "Served with entrées",
        ],
        answer: 1,
        explanation: "Step 2: offer water and beverages — pour water immediately.",
      },
      {
        id: "service-8",
        question: "Dessert and digestifs are offered:",
        options: [
          "Before the guest asks for the check",
          "Only if the table lingers",
          "With the check",
          "Only on weekends",
        ],
        answer: 0,
        explanation: "Offer dessert and digestifs before they ask for the check — never after.",
      },
      {
        id: "service-9",
        question: "When a table signals for the check, it should be ready within:",
        options: ["30 seconds", "2 minutes", "5 minutes", "10 minutes"],
        answer: 1,
        explanation: "The check is presented within 2 minutes of the signal.",
      },
      {
        id: "service-10",
        question: "Why do we avoid saying \"No problem\"?",
        options: [
          "It's too casual for fine dining",
          "It implies the request could have been a problem",
          "It's fine — we don't avoid it",
          "It takes too long to say",
        ],
        answer: 1,
        explanation:
          "'No problem' implies it might have been one. Say 'Of course' or 'My pleasure.'",
      },
      {
        id: "service-11",
        question: "Movement in the dining room should be:",
        options: [
          "As fast as possible — hustle shows effort",
          "Quiet confidence — never rush or run",
          "Slow and deliberate at all times",
          "Whatever gets the food out",
        ],
        answer: 1,
        explanation:
          "Move with quiet confidence. Never rush, never run, never let visible stress reach the floor.",
      },
      {
        id: "service-12",
        question: "Side work on a regular night may begin:",
        options: [
          "Whenever your section is empty",
          "Not before 8:30 PM unless the shift lead approves",
          "At 7:00 PM",
          "Only after close",
        ],
        answer: 1,
        explanation: "No side work before 8:30 PM unless approved by the shift lead.",
      },
      {
        id: "service-13",
        question: "When handling bread for guests, you must always use:",
        options: ["Tongs", "Gloves only", "A clean napkin", "Freshly washed hands"],
        answer: 0,
        explanation:
          "Tongs at all times in front of guests; gloves are for cutting and handling behind the scenes. Bare hands never touch bread — even briefly.",
      },
      {
        id: "service-14",
        question: "A bread-basket napkin brushes against a booth seat. What happens?",
        options: [
          "It's fine if it looks clean",
          "Flip it to the other side",
          "Replace it immediately — no exceptions",
          "Use it for the same table only",
        ],
        answer: 2,
        explanation:
          "Linens go only on sanitized stations, side-work tables, or clean trays. Any linen that touches an unclean surface is replaced immediately.",
      },
    ],
  },
  {
    id: "complaints",
    order: 7,
    section: "How We Serve",
    title: "Handling Complaints",
    summary: "The LEARN method and how to handle common difficult situations.",
    minutes: 6,
    requiredFor: EVERYONE,
    lessons: [
      {
        heading: "The LEARN Method",
        intro: "A complaint handled brilliantly is an opportunity.",
        points: [
          "L — Listen: full attention, don't interrupt, don't defend.",
          "E — Empathize: acknowledge the feeling first ('I completely understand, and I'm so sorry').",
          "A — Apologize: sincerely, even if it was outside your control.",
          "R — Resolve: offer a solution immediately; if unsure, involve management.",
          "N — Notify: management must know before the guest leaves — in real time.",
        ],
      },
      {
        heading: "Common Scenarios",
        points: [
          "Food came out wrong: apologize, remove the dish, alert the kitchen, re-fire, check back.",
          "Difficult/rude guest: stay calm, lower your voice, de-escalate, take it off the floor.",
          "Long wait/delay: communicate proactively before they ask; offer bread or a small something.",
          "Unhappy with wine: never argue taste; offer a small taste of something else — a replaced glass is cheaper than a lost guest.",
        ],
      },
      {
        heading: "The Golden Rule",
        points: [
          "Never let a guest leave unhappy without management knowing.",
          "A problem management doesn't know about is a problem that can't be fixed.",
          "Notify any table waiting more than 15 minutes.",
        ],
      },
    ],
    quiz: [
      {
        id: "complaints-1",
        question: "What does the LEARN method stand for?",
        options: [
          "Listen, Empathize, Apologize, Resolve, Notify",
          "Look, Explain, Argue, React, Note",
          "Listen, Explain, Apologize, Repeat, Nod",
          "Learn, Engage, Assist, Resolve, Negotiate",
        ],
        answer: 0,
        explanation: "Listen, Empathize, Apologize, Resolve, Notify.",
      },
      {
        id: "complaints-2",
        question: "The 'N' in LEARN means:",
        options: [
          "Negotiate a discount with the guest",
          "Note it in the log for next week",
          "Notify management before the guest leaves, in real time",
          "Never bring it up again",
        ],
        answer: 2,
        explanation:
          "Notify — management must know in real time. A problem they don't know about can't be fixed.",
      },
      {
        id: "complaints-3",
        question: "A guest says their wine isn't to their taste. You should:",
        options: [
          "Explain why their palate is wrong",
          "Tell them all sales are final",
          "Never argue taste — offer a small taste of something else",
          "Ignore it; taste is subjective",
        ],
        answer: 2,
        explanation: "Never argue taste. A replaced glass of wine is always cheaper than a lost guest.",
      },
      {
        id: "complaints-4",
        question: "A guest is being rude and difficult. The right approach is to:",
        options: [
          "Match their energy so they know you're serious",
          "Argue your case on the floor",
          "Stay calm, de-escalate, and take it off the floor",
          "Walk away and ignore them",
        ],
        answer: 2,
        explanation: "Stay calm, lower your voice, de-escalate. 'Let me get a manager' is always an acceptable exit.",
      },
      {
        id: "complaints-5",
        question: "The 'E' in LEARN stands for:",
        options: [
          "Explain what went wrong",
          "Empathize — acknowledge the feeling first",
          "Escalate to a manager",
          "Excuse the kitchen",
        ],
        answer: 1,
        explanation:
          "Empathize first: 'I completely understand, and I'm so sorry' — feelings before fixes.",
      },
      {
        id: "complaints-6",
        question: "A dish comes out wrong. The full play is:",
        options: [
          "Apologize and offer a discount",
          "Apologize, remove the dish, alert the kitchen, re-fire, check back",
          "Explain that the kitchen is slammed",
          "Replace it silently without telling anyone",
        ],
        answer: 1,
        explanation:
          "Apologize, remove it, alert the kitchen, re-fire, and check back once the new dish lands.",
      },
      {
        id: "complaints-7",
        question: "The kitchen is backed up and a table's food is delayed. You should:",
        options: [
          "Stay away from the table until food is ready",
          "Communicate proactively before they ask — and offer bread or a small something",
          "Blame the kitchen when they ask",
          "Drop the check to speed things up",
        ],
        answer: 1,
        explanation:
          "Get ahead of it — tell them before they have to ask, and offer a small something for the wait.",
      },
      {
        id: "complaints-8",
        question: "A table has been waiting more than 15 minutes. The rule is:",
        options: [
          "Give them more bread and hope",
          "Notify management",
          "Comp the meal on your own",
          "Nothing — some waits are normal",
        ],
        answer: 1,
        explanation: "Any table waiting more than 15 minutes: management gets notified.",
      },
      {
        id: "complaints-9",
        question: "While a guest is voicing a complaint, you should:",
        options: [
          "Interrupt to correct the facts",
          "Explain the restaurant's side first",
          "Give full attention — don't interrupt, don't defend",
          "Wave the manager over immediately without listening",
        ],
        answer: 2,
        explanation:
          "L — Listen: full attention, no interrupting, no defending. The guest needs to be heard first.",
      },
      {
        id: "complaints-10",
        question: "The golden rule of complaints is:",
        options: [
          "The customer is always right",
          "Never let a guest leave unhappy without management knowing",
          "Always comp something",
          "Handle everything yourself",
        ],
        answer: 1,
        explanation:
          "A problem management doesn't know about is a problem that can't be fixed — notify in real time.",
      },
    ],
  },
  {
    id: "wine",
    order: 8,
    section: "What We Sell",
    title: "Wine & Upselling",
    summary: "By-the-glass list, what to suggest when, and how to upsell with confidence.",
    minutes: 8,
    requiredFor: BEVERAGE_TEAM,
    location: "Andiamo",
    lessons: [
      {
        heading: "White Wines (By the Glass)",
        points: [
          "Donini Pinot Grigio — crisp, light citrus; for an easy, light, Italian white.",
          "Flowers Chardonnay (Sonoma Coast) — full, creamy, oaked; the rich crowd-pleaser.",
          "De Forville Chardonnay (unoaked) — bright, mineral; Chard without the butter.",
          "Clos Henri Sauvignon Blanc — citrusy, zesty; crisp and refreshing.",
          "La Cala Vermentino — saline, coastal; for seafood, crudo, or fish.",
        ],
      },
      {
        heading: "Red Wines (By the Glass)",
        points: [
          "House Red — Rapitala Nero d'Avola — juicy, approachable; easy-drinking Italian.",
          "The Calling Cabernet — bold, dark fruit, firm tannin; the big full-bodied red.",
          "Routestock Pinot Noir — silky, elegant, lighter; great with salmon or poultry.",
          "Tintero Nebbiolo — red fruit, floral, 'baby Barolo'; Italian and adventurous.",
          "Villa Santa Anna Chianti — cherry, leather, bright acidity; classic with pasta or pizza.",
        ],
      },
      {
        heading: "Sparkling & The Upsell Mindset",
        points: [
          "Lamberti Prosecco — the welcome glass / aperitivo; great to start the table.",
          "Offer a bottle naturally: 'Can I bring a bottle? It works out to about the same as three glasses each.'",
          "Be specific and sensory: 'The Vermentino is drinking beautifully — saline, coastal, perfect with the branzino.'",
          "You are not selling — you are guiding. A guest who trusts your pick comes back.",
        ],
      },
    ],
    quiz: [
      {
        id: "wine-1",
        question: "A guest is ordering branzino (fish) and wants a white. Best by-the-glass suggestion?",
        options: [
          "Flowers Chardonnay (rich, oaked)",
          "La Cala Vermentino (saline, coastal)",
          "The Calling Cabernet",
          "House Red Nero d'Avola",
        ],
        answer: 1,
        explanation: "Vermentino — saline, coastal, herbal — is made for seafood, crudo, and fish.",
      },
      {
        id: "wine-2",
        question: "A guest likes Chardonnay but dislikes oaky, buttery wines. Suggest:",
        options: [
          "Flowers Chardonnay (full, creamy, toasted oak)",
          "De Forville unoaked Chardonnay (bright, mineral)",
          "Clos Henri Sauvignon Blanc",
          "Tintero Nebbiolo",
        ],
        answer: 1,
        explanation: "The unoaked De Forville is 'Chardonnay without the butter' — bright and mineral.",
      },
      {
        id: "wine-3",
        question: "A guest wants a lighter red and is having salmon. Best pick?",
        options: [
          "The Calling Cabernet (big, bold)",
          "Routestock Pinot Noir (silky, lighter)",
          "House Red Nero d'Avola",
          "Villa Santa Anna Chianti",
        ],
        answer: 1,
        explanation: "Pinot Noir — bright, silky, lighter-bodied — pairs with salmon and poultry.",
      },
      {
        id: "wine-4",
        question: "Which is the strongest way to suggest a bottle?",
        options: [
          "\"A bottle is cheaper per glass.\"",
          "\"Do you want wine?\"",
          "\"Can I bring a bottle? It works out to about the same as three glasses each.\"",
          "\"It's good, want some?\"",
        ],
        answer: 2,
        explanation:
          "Specific and guest-friendly — framing value without sounding like a pitch. Guide, don't push.",
      },
      {
        id: "wine-5",
        question: "The welcome glass / aperitivo to start a table is:",
        options: [
          "Flowers Chardonnay",
          "Lamberti Prosecco",
          "The Calling Cabernet",
          "Tintero Nebbiolo",
        ],
        answer: 1,
        explanation: "Lamberti Prosecco — the welcome glass; great to start the table.",
      },
      {
        id: "wine-6",
        question: "A guest wants an easy, light Italian white. Pour the:",
        options: [
          "Donini Pinot Grigio",
          "Flowers Chardonnay",
          "Clos Henri Sauvignon Blanc",
          "La Cala Vermentino",
        ],
        answer: 0,
        explanation: "Donini Pinot Grigio — crisp, light citrus; the easy Italian white.",
      },
      {
        id: "wine-7",
        question: "A guest asks for a big, bold red. The by-the-glass answer is:",
        options: [
          "Routestock Pinot Noir",
          "The Calling Cabernet",
          "House Red Nero d'Avola",
          "Lamberti Prosecco",
        ],
        answer: 1,
        explanation:
          "The Calling Cabernet — bold, dark fruit, firm tannin; the big full-bodied red.",
      },
      {
        id: "wine-8",
        question: "The classic pairing for pasta or pizza on our BTG list is:",
        options: [
          "Villa Santa Anna Chianti",
          "Flowers Chardonnay",
          "Routestock Pinot Noir",
          "La Cala Vermentino",
        ],
        answer: 0,
        explanation:
          "Chianti — cherry, leather, bright acidity — is the classic with pasta and pizza.",
      },
      {
        id: "wine-9",
        question: "Which wine do we describe as a 'baby Barolo'?",
        options: [
          "House Red Nero d'Avola",
          "Villa Santa Anna Chianti",
          "Tintero Nebbiolo",
          "The Calling Cabernet",
        ],
        answer: 2,
        explanation:
          "Tintero Nebbiolo — red fruit, floral — for the Italian and adventurous guest.",
      },
      {
        id: "wine-10",
        question: "The upsell mindset is:",
        options: [
          "Sell the most expensive bottle you can",
          "You're not selling — you're guiding; a guest who trusts your pick comes back",
          "Only upsell tables that look wealthy",
          "Avoid suggesting anything unless asked",
        ],
        answer: 1,
        explanation:
          "Guide with specific, sensory language. Trust builds regulars — that's the real upsell.",
      },
    ],
  },
  {
    id: "cocktails",
    order: 9,
    section: "Bar Reference",
    title: "Cocktails & Bar Builds",
    summary: "Build standards, the cocktail cheat sheet, signature recipes, and batches.",
    minutes: 9,
    requiredFor: BEVERAGE_TEAM,
    location: "Andiamo",
    lessons: [
      {
        heading: "Build Standards",
        points: [
          "Always measure with a jigger — consistency is hospitality.",
          "Shake 12–15 seconds with ice; stir spirit-forward drinks 30–40 rotations (never shake).",
          "Double strain shaken drinks into a chilled coupe.",
          "Express citrus over the glass; add garnish last — it's the guest's first impression.",
        ],
      },
      {
        heading: "Cocktail Cheat Sheet ($16 unless noted)",
        points: [
          "South City Martini — Vodka, Cocchi Americano, lemon bitters; stirred; martini glass.",
          "Negroni della Casa — Gray Whale Gin, Luxardo Bitter Bianco, Bordiga Dry Vermouth; stirred; rocks.",
          "Isola Rosa (house original) — Grey Goose, basil syrup, passion fruit, lime; shaken; coupe.",
          "Old Fashioned — Buffalo Trace, sugar, orange bitters; stirred; rocks.",
          "La Banca Manhattan — Sazerac Rye, Carpano Antica, bitters; stirred; coupe.",
          "Aperol / Hugo Spritz — built in a wine glass; light and refreshing.",
          "Weller Reserve Manhattan — $28 premium upsell for whiskey lovers.",
        ],
      },
      {
        heading: "Batch Recipes",
        intro: "Batches must be ready before service — not during.",
        points: [
          "Always label batches with name, date, and your initials; store sealed in the fridge.",
          "Batches include pre-dilution water — do not add more water at service.",
          "Vermouth-based batches (Manhattan, Martini) are perishable — use within ~5–7 days.",
          "Basil simple syrup (Isola Rosa): don't steep past 35 min or it turns bitter; 7–10 day shelf life.",
        ],
      },
    ],
    quiz: [
      {
        id: "cocktails-1",
        question: "Spirit-forward drinks (Old Fashioned, Manhattan, Negroni) should be:",
        options: [
          "Shaken hard for 12–15 seconds",
          "Stirred 30–40 rotations, never shaken",
          "Built in the glass with no ice",
          "Blended",
        ],
        answer: 1,
        explanation: "Stir spirit-forward drinks 30–40 rotations. Never shake them.",
      },
      {
        id: "cocktails-2",
        question: "A whiskey lover asks for a great Manhattan. The premium upsell is:",
        options: [
          "South City Martini",
          "Aperol Spritz",
          "Weller Reserve Manhattan ($28)",
          "House Negroni",
        ],
        answer: 2,
        explanation: "Always offer the $28 Weller Reserve Manhattan to whiskey and Manhattan lovers.",
      },
      {
        id: "cocktails-3",
        question: "Every batch must be labeled with:",
        options: [
          "Just the name",
          "Name, date, and your initials",
          "Only the date",
          "The price",
        ],
        answer: 1,
        explanation: "Name, date, and initials — stored sealed in the fridge, ready before service.",
      },
      {
        id: "cocktails-4",
        question: "Why don't you add water to a batched Old Fashioned at service?",
        options: [
          "It's against health code",
          "The batch already includes pre-dilution water",
          "Water ruins the color",
          "You should always add more water",
        ],
        answer: 1,
        explanation: "Batches include pre-dilution water. Stir briefly in the glass to temp — don't add more.",
      },
      {
        id: "cocktails-5",
        question: "Which two house originals tell our story and should be highlighted?",
        options: [
          "Old Fashioned and Aperol Spritz",
          "Negroni della Casa and Isola Rosa",
          "Lemon Drop and Hugo Spritz",
          "South City Martini and Weller Manhattan",
        ],
        answer: 1,
        explanation: "Negroni della Casa and Isola Rosa are our house originals — highlight them.",
      },
      {
        id: "cocktails-6",
        question: "Shaken cocktails are shaken:",
        options: [
          "5 seconds, no ice",
          "12–15 seconds with ice",
          "30–40 seconds with ice",
          "Until your arm is tired",
        ],
        answer: 1,
        explanation: "Shake 12–15 seconds with ice; stir spirit-forward drinks instead.",
      },
      {
        id: "cocktails-7",
        question: "After shaking, the drink is:",
        options: [
          "Poured straight into a room-temp glass",
          "Double strained into a chilled coupe",
          "Served in the shaker tin",
          "Strained once over fresh ice, always",
        ],
        answer: 1,
        explanation: "Double strain shaken drinks into a chilled coupe.",
      },
      {
        id: "cocktails-8",
        question: "Garnish goes on:",
        options: [
          "First, so you don't forget it",
          "Last — it's the guest's first impression; express citrus over the glass",
          "Whenever there's time",
          "Only for guests who ask",
        ],
        answer: 1,
        explanation:
          "Express citrus over the glass, garnish last — it's the first thing the guest sees.",
      },
      {
        id: "cocktails-9",
        question: "The South City Martini is built from:",
        options: [
          "Gin, dry vermouth, olive brine",
          "Vodka, Cocchi Americano, lemon bitters",
          "Grey Goose, basil syrup, passion fruit, lime",
          "Rye, Carpano Antica, bitters",
        ],
        answer: 1,
        explanation:
          "Vodka, Cocchi Americano, lemon bitters — stirred, in a martini glass.",
      },
      {
        id: "cocktails-10",
        question: "Vermouth-based batches (Manhattan, Martini) keep for about:",
        options: ["1 day", "5–7 days", "A month", "Indefinitely"],
        answer: 1,
        explanation:
          "Vermouth is perishable — use vermouth-based batches within ~5–7 days, sealed and refrigerated.",
      },
      {
        id: "cocktails-11",
        question: "Basil simple syrup for the Isola Rosa:",
        options: [
          "Steep as long as possible for flavor",
          "Don't steep past 35 minutes or it turns bitter; keeps 7–10 days",
          "Is made fresh per drink",
          "Uses dried basil",
        ],
        answer: 1,
        explanation:
          "Past ~35 minutes the basil turns bitter. Shelf life 7–10 days, labeled and refrigerated.",
      },
    ],
  },
  {
    id: "tasting",
    order: 10,
    section: "Bar Reference",
    title: "Tasting Notes: Spirits & Amaro",
    summary: "Describe spirits and digestifs in vivid, accurate language to build trust.",
    minutes: 6,
    requiredFor: BEVERAGE_TEAM,
    lessons: [
      {
        heading: "Spirits",
        points: [
          "London Dry Gin — juniper, coriander, citrus; piney, floral; clean dry finish.",
          "Bourbon — vanilla, caramel, toasted oak; warm sweet corn; long oaky finish.",
          "Rye Whiskey — spice, pepper, dried fruit; bold and peppery; dry spicy finish.",
          "Blanco Tequila — fresh agave, citrus; grassy and bright; crisp clean finish.",
          "Mezcal (Joven) — smoke, roasted agave, earth; complex and smoky.",
        ],
      },
      {
        heading: "Amaro & Digestifs",
        points: [
          "Campari — intensely bitter, orange peel, herbal; the gateway bitter (Negroni, Spritz).",
          "Aperol — lighter bitter, orange, rhubarb; very approachable (Aperol Spritz).",
          "Amaro Nonino — grappa base, orange, vanilla; silky; neat or in a Paper Plane.",
          "Fernet-Branca — menthol, saffron, myrrh; intensely herbal; the bartender's handshake.",
          "Limoncello — lemon zest, sweet and bright; serve ice cold as a dessert pairing.",
        ],
      },
    ],
    quiz: [
      {
        id: "tasting-1",
        question: "A guest wants something smoky and earthy. Recommend:",
        options: ["Bourbon", "Blanco Tequila", "Mezcal (Joven)", "London Dry Gin"],
        answer: 2,
        explanation: "Mezcal — smoke, roasted agave, earth — is the smoky, complex choice.",
      },
      {
        id: "tasting-2",
        question: "Which digestif is known as 'the gateway bitter' and is the base of a Negroni?",
        options: ["Limoncello", "Campari", "Amaro Nonino", "Fernet-Branca"],
        answer: 1,
        explanation: "Campari — intensely bitter, orange peel, herbal — used in the Negroni and Spritz.",
      },
      {
        id: "tasting-3",
        question: "A guest wants a sweet, bright, ice-cold finish to the meal. Suggest:",
        options: ["Fernet-Branca", "Campari", "Limoncello", "Rye whiskey"],
        answer: 2,
        explanation: "Limoncello — lemon zest, sweet, bright — served ice cold as a dessert pairing.",
      },
      {
        id: "tasting-4",
        question: "How would you describe bourbon to a guest?",
        options: [
          "Juniper, piney, dry",
          "Vanilla, caramel, toasted oak; warm with a long finish",
          "Smoke and roasted agave",
          "Pepper and dried fruit, dry and spicy",
        ],
        answer: 1,
        explanation: "Bourbon — vanilla, caramel, toasted oak; warm sweet corn; long, oaky, gentle heat.",
      },
      {
        id: "tasting-5",
        question: "London Dry Gin tastes of:",
        options: [
          "Vanilla and caramel",
          "Juniper, coriander, citrus — piney and floral with a clean dry finish",
          "Smoke and roasted agave",
          "Menthol and saffron",
        ],
        answer: 1,
        explanation:
          "Juniper-forward with coriander and citrus; piney, floral, clean and dry.",
      },
      {
        id: "tasting-6",
        question: "Compared to bourbon, rye whiskey is:",
        options: [
          "Sweeter and softer",
          "Spicier and more peppery, with a dry finish",
          "Smokier",
          "Identical",
        ],
        answer: 1,
        explanation:
          "Rye — spice, pepper, dried fruit; bold and peppery where bourbon is sweet and round.",
      },
      {
        id: "tasting-7",
        question: "Blanco tequila is best described as:",
        options: [
          "Oaky and dark",
          "Fresh agave and citrus — grassy, bright, crisp",
          "Heavily smoky",
          "Sweet like a liqueur",
        ],
        answer: 1,
        explanation: "Fresh agave, citrus; grassy and bright with a crisp, clean finish.",
      },
      {
        id: "tasting-8",
        question: "A guest is bitter-curious but new to amari. Start them on:",
        options: [
          "Fernet-Branca",
          "Aperol — the lighter, approachable bitter",
          "Straight Campari",
          "Rye whiskey",
        ],
        answer: 1,
        explanation:
          "Aperol — lighter bitter, orange, rhubarb — is the most approachable entry point.",
      },
      {
        id: "tasting-9",
        question: "\"The bartender's handshake\" refers to:",
        options: ["Limoncello", "Aperol", "Fernet-Branca", "Prosecco"],
        answer: 2,
        explanation:
          "Fernet-Branca — menthol, saffron, myrrh; intensely herbal. The industry's secret handshake.",
      },
      {
        id: "tasting-10",
        question: "Amaro Nonino is:",
        options: [
          "A lemon liqueur served frozen",
          "Grappa-based with orange and vanilla — silky; lovely neat or in a Paper Plane",
          "The most bitter amaro we carry",
          "A sparkling aperitif",
        ],
        answer: 1,
        explanation:
          "Grappa base, orange, vanilla — silky and elegant, neat or in a Paper Plane.",
      },
    ],
  },
  {
    id: "figaro-btg-2026",
    order: 11,
    section: "Bar Reference",
    title: "Caf\u00e9 Figaro: Wines by the Glass \u2014 Summer 2026",
    summary:
      "The new glass program \u2014 17 everyday pours, 5 reserve pours, and the service rules that go with them.",
    minutes: 12,
    requiredFor: BEVERAGE_TEAM,
    location: "Cafe Figaro",
    lessons: [
      {
        heading: "The Program & the Service Philosophy",
        intro:
          "The wine list opens on a two-page spread: Wines by the Glass facing Reserve by the Glass. Everyday and extraordinary, side by side \u2014 your job is to help guests cross that bridge.",
        points: [
          "Listen first \u2014 ask one clarifying question before recommending.",
          "One memorable detail per wine, not a Wikipedia entry.",
          "Present two options, recommend one, let the guest choose.",
          "The upsell is generosity: guiding a guest to a better wine gives them a better night.",
          "Our list holds the Wine Spectator BEST OF Award of Excellence for 2026 and a Star Wine List Award \u2014 worth mentioning to wine lovers.",
        ],
      },
      {
        heading: "Service Rules \u2014 Non-Negotiables",
        points: [
          "Every pour in the building is 6 oz \u2014 a full ounce more than the industry-standard restaurant pour. Say it when it helps, especially on the Billecart: the Village Pub pours it at the same $40, standard glass.",
          "Reserve reds and whites are poured through the Coravin needle \u2014 the cork NEVER comes out of a reserve bottle for a glass order. Not Coravin-trained? Get a manager.",
          "The Billecart is opened normally; sparkling stopper after every pour; note the open date on the bottle; sell through in 2\u20133 days.",
          "Giacomo Conterno \u201cSensory\u201d stemware is for reserve BOTTLE purchases only, on request \u2014 never for by-the-glass pours.",
          "Corkage is $30, waived with each bottle purchased from our list. Say it as generosity: \u201chappy to open that \u2014 and if you grab any bottle from our list, we waive it.\u201d",
        ],
      },
      {
        heading: "Reserve by the Glass \u2014 Know These Five Cold",
        intro:
          "Five prestige pours. Each has a one-sentence story \u2014 deliver it with confidence.",
        points: [
          "Billecart-Salmon Brut Ros\u00e9, Champagne ($40 / 6 oz) \u2014 the house that defined ros\u00e9 Champagne, family-owned since 1818; wild strawberry and chalk. The Village Pub pours it at the same $40, standard pour \u2014 we over-deliver on purpose.",
          "Domaines Leflaive, M\u00e2con-Verz\u00e9 ($50) \u2014 Leflaive is white-Burgundy royalty; this is their biodynamic village M\u00e2con. \u2018Leflaive, by the glass.\u2019",
          "Elvio Cogno \u2018Cascina Nuova\u2019, Barolo ($45) \u2014 Nebbiolo from the Ravera cru above Novello; rose, dried cherry, silky power. The insider\u2019s Barolo.",
          "Margaux du Ch\u00e2teau Margaux ($65) \u2014 the THIRD WINE of Ch\u00e2teau Margaux: same estate, same hands, the First Growth\u2019s younger vines. A glass of Margaux without the ceremony.",
          "Jean-Louis Chave S\u00e9lection \u2018Offerus\u2019, Saint-Joseph ($30) \u2014 the Chave family has farmed these hills since 1481 and makes the Rh\u00f4ne\u2019s greatest Hermitage. The affordable door onto the reserve page.",
        ],
      },
      {
        heading: "The Margaux Bottle Math",
        intro: "The easiest $185 in the building \u2014 if you say it out loud.",
        points: [
          "Three glasses of the Margaux ($65) nearly equals the bottle ($185).",
          "Two guests having two glasses each? Offer the bottle BEFORE the third glass: \u201cif you\u2019re each having another, the bottle is 185 and the better deal.\u201d",
          "Guests never resent being saved money \u2014 that offer builds the trust that sells the next visit.",
        ],
      },
      {
        heading: "Whites & Sparkling \u2014 the Everyday Card",
        points: [
          "Bisol \u2018Jeio\u2019 Prosecco ($12) \u2014 proper dry Prosecco; the welcome glass. Sommariva Brut Ros\u00e9 ($15) \u2014 pink bubbles, bone dry.",
          "De Forville Chardonnay, Piedmont ($16) \u2014 UNoaked; wildflowers and cream; wins back the \u2018I don\u2019t like Chardonnay\u2019 guest.",
          "Ramey, Russian River ($25) \u2014 ripe apple, kiss of oak; the buttery-California answer. Next rung: Leflaive on reserve.",
          "Maison Champy, Bourgogne Blanc ($25) \u2014 white Burgundy from Burgundy\u2019s oldest wine house; orchard blossom and chalk.",
          "Te Mata Sauvignon Blanc, NZ ($16) \u2014 zesty citrus. Trade-up: Domaine Sylvain Bailly Sancerre \u2018Terroirs\u2019 ($20) \u2014 same grape, home turf, more mineral.",
          "Elena Walch Pinot Grigio ($16) and Ronchi di Cialla Ribolla Gialla ($16) \u2014 same price; Ribolla is \u2018the more interesting version of Pinot Grigio.\u2019 Our best gateway pour.",
        ],
      },
      {
        heading: "Reds \u2014 the Everyday Card & the Ladders",
        points: [
          "Napa ladder: Routestock ($17) \u2192 Chappellet Mountain Cuv\u00e9e ($25) \u2192 Duckhorn ($28) \u2192 reserve Margaux ($65). Walk it one rung at a time.",
          "Pinot Noir: Presqu\u2019ile, Santa Barbara ($17) \u2014 juicy and smooth \u2192 Occidental \u2018Freestone-Occidental\u2019 ($35) \u2014 Steve Kistler\u2019s Pinot project; the name does the selling.",
          "Italian ladder: Villa Sant\u2019Anna Chianti ($16) \u2192 Montepeloso \u2018A Quo\u2019 Super Tuscan ($20) \u2192 Tintero Barbaresco ($25, Nebbiolo) \u2192 reserve Cogno Barolo ($45).",
          "Celebration play: Billecart, always. \u2018Something interesting\u2019 play: Ribolla Gialla (white) or Offerus (red), both under $30.",
        ],
      },
    ],
    quiz: [
      {
        id: "figaro-btg-1",
        question: "How big are our wine pours?",
        options: [
          "5 oz \u2014 the industry standard",
          "Every pour is 6 oz \u2014 a full ounce over the industry standard",
          "6 oz for reserve pours only",
          "It varies by wine",
        ],
        answer: 1,
        explanation:
          "All pours are 6 oz. Best told on the Billecart: the Village Pub charges the same $40 for a standard glass.",
      },
      {
        id: "figaro-btg-2",
        question: "A couple tells you they're celebrating an anniversary. You pour:",
        options: [
          "Bisol Prosecco",
          "Sommariva Brut Ros\u00e9",
          "Billecart-Salmon Brut Ros\u00e9 \u2014 the house that defined ros\u00e9 Champagne",
          "Ramey Chardonnay",
        ],
        answer: 2,
        explanation:
          "Celebration = Billecart, every time. Six ounces, salmon pink, a story in one sentence.",
      },
      {
        id: "figaro-btg-3",
        question: "Two guests each want a second glass of Margaux. Your move:",
        options: [
          "Pour the glasses \u2014 never interrupt an order",
          "Offer the bottle at 185 \u2014 four glasses would cost 260",
          "Suggest they switch to Routestock to save money",
          "Offer the Conterno stemware",
        ],
        answer: 1,
        explanation:
          "Three glasses nearly equals the bottle. Offering it before the third glass saves them money and sells the bottle.",
      },
      {
        id: "figaro-btg-4",
        question: "What is our corkage policy, said the Figaro way?",
        options: [
          "\u201c$30 per bottle, no exceptions.\u201d",
          "\u201cWe don't allow outside wine.\u201d",
          "\u201c$30 \u2014 and we waive it with each bottle you pick from our list.\u201d",
          "\u201cFree corkage on weekdays.\u201d",
        ],
        answer: 2,
        explanation:
          "Deliver it as generosity, not policy \u2014 the waiver turns BYO tables into list sales.",
      },
      {
        id: "figaro-btg-5",
        question: "The cork comes out of a reserve bottle for a glass order\u2026",
        options: [
          "Whenever the Coravin is busy",
          "Never \u2014 reserve stills are poured through the Coravin needle only; get a manager if untrained",
          "Only for the Margaux",
          "Only on weekends",
        ],
        answer: 1,
        explanation:
          "Coravin only. The one exception is the Billecart, which opens normally and takes the sparkling stopper.",
      },
      {
        id: "figaro-btg-6",
        question: "Who gets the Giacomo Conterno \u201cSensory\u201d stemware?",
        options: [
          "Every reserve by-the-glass pour",
          "Reserve BOTTLE purchases only, on request",
          "Anyone who asks, any order",
          "Managers only",
        ],
        answer: 1,
        explanation:
          "Bottle service on the reserve list only \u2014 never for by-the-glass pours.",
      },
      {
        id: "figaro-btg-7",
        question: "The most affordable way onto the reserve page is:",
        options: [
          "Billecart-Salmon, $40",
          "Cogno Barolo, $45",
          "Chave S\u00e9lection \u2018Offerus\u2019, $30",
          "Domaines Leflaive, $50",
        ],
        answer: 2,
        explanation:
          "Offerus at $30 \u2014 from the family that has farmed Saint-Joseph since 1481.",
      },
      {
        id: "figaro-btg-8",
        question: "Why does \u201cLeflaive\u201d matter?",
        options: [
          "It is Napa's most famous Chardonnay",
          "Leflaive of Puligny-Montrachet is white-Burgundy royalty \u2014 this glass is that pedigree at village-M\u00e2con price",
          "It is the oldest winery in Champagne",
          "It is our only biodynamic wine",
        ],
        answer: 1,
        explanation:
          "\u2018Leflaive, by the glass\u2019 \u2014 world-class pedigree in a $50 pour.",
      },
      {
        id: "figaro-btg-9",
        question: "The Margaux du Ch\u00e2teau Margaux is:",
        options: [
          "A generic Bordeaux blend",
          "The third wine of Ch\u00e2teau Margaux \u2014 same estate and team, younger vines of the First Growth",
          "A Napa Cabernet",
          "Ch\u00e2teau Margaux's grand vin at a discount",
        ],
        answer: 1,
        explanation:
          "\u201cA glass of Margaux, without the ceremony\u201d \u2014 same estate, same hands.",
      },
      {
        id: "figaro-btg-10",
        question: "Walk the Napa Cabernet ladder, low to high:",
        options: [
          "Duckhorn \u2192 Chappellet \u2192 Routestock \u2192 Margaux",
          "Routestock 17 \u2192 Chappellet 25 \u2192 Duckhorn 28 \u2192 reserve Margaux 65",
          "Routestock \u2192 Occidental \u2192 Duckhorn",
          "Chappellet \u2192 Routestock \u2192 Duckhorn",
        ],
        answer: 1,
        explanation:
          "One rung at a time \u2014 a $5\u2013$8 step is an easy yes; a $40 leap is not.",
      },
      {
        id: "figaro-btg-11",
        question:
          "A Pinot Grigio drinker wants \u2018something more interesting\u2019 at the same price:",
        options: [
          "Ramey Chardonnay",
          "Ronchi di Cialla Ribolla Gialla \u2014 same $16, more texture and depth",
          "Sancerre",
          "Billecart-Salmon",
        ],
        answer: 1,
        explanation: "Our best gateway pour \u2014 zero-risk adventure at the same price.",
      },
      {
        id: "figaro-btg-12",
        question: "A guest at table 12 loves Kistler. You pour:",
        options: [
          "Presqu'ile Pinot Noir",
          "Occidental \u2018Freestone-Occidental\u2019 \u2014 Steve Kistler's Pinot project",
          "Duckhorn Cabernet",
          "Cogno Barolo",
        ],
        answer: 1,
        explanation: "Occidental IS Kistler \u2014 say the name and the wine sells itself.",
      },
      {
        id: "figaro-btg-13",
        question: "Barolo and Barbaresco are made from which grape?",
        options: ["Sangiovese", "Syrah", "Nebbiolo", "Cabernet Sauvignon"],
        answer: 2,
        explanation:
          "Nebbiolo \u2014 Tintero Barbaresco ($25) is the everyday sibling; Cogno Barolo ($45) is the reserve step up.",
      },
      {
        id: "figaro-btg-14",
        question: "A guest asks \u201cwhat's good?\u201d Your answer is never\u2026",
        options: [
          "One white you tasted this week, with one concrete sentence",
          "\u201cEverything\u201d",
          "One red you tasted this week, with one concrete sentence",
          "A clarifying question",
        ],
        answer: 1,
        explanation:
          "Never \u2018everything.\u2019 Pick one white and one red you actually tasted and say why in one sentence.",
      },
    ],
  },
  {
    id: "figaro-cocktails",
    order: 12,
    section: "Bar Reference",
    title: "Café Figaro: Cocktails",
    summary: "Figaro's cocktails and zero-proof mocktails — ingredients and how to describe each. Cocktails $16.",
    minutes: 7,
    requiredFor: BEVERAGE_TEAM,
    location: "Cafe Figaro",
    lessons: [
      {
        heading: "Cocktails ($16 each)",
        points: [
          "Figaro Manhattan — Knob Creek Rye, Antica vermouth, Angostura bitters, Luxardo cherry.",
          "Old Fashioned — Buffalo Trace, sugar, orange bitters, orange twist, Luxardo cherry.",
          "Figaro Reserve — Bar Agricole Brandy, Gran Classico, Antica vermouth, orange bitters; a bartender's favorite, deep and balanced.",
          "Espresso Martini — vodka, coffee liqueur, espresso, sugar.",
          "The Burlingame Martini — Gin, Cocchi Americano, lemon bitters; our house martini, crisp and elegant.",
          "Aperol Spritz — Prosecco, Aperol, soda water, orange garnish.",
          "Hugo Rosé Spritz — Brut Rosé, St. Germain, soda water, mint garnish.",
        ],
      },
      {
        heading: "Zero-Proof Mocktails",
        points: [
          "The Peninsula — Ghia Le Spritz, Fever Tree Tonic, fresh lemon.",
          "La Dolce Vita — Limonata, Fever Tree Elderflower Tonic, soda, fresh mint.",
        ],
      },
      {
        heading: "How to Sell Them",
        points: [
          "Figaro Reserve — the bartender's favorite; brandy-based, deep and balanced. Offer to the curious, spirit-forward guest.",
          "The Burlingame Martini — our house signature; steer gin and martini drinkers here.",
          "Figaro Manhattan & Old Fashioned — the whiskey classics; the Espresso Martini is the after-dinner pick-me-up.",
          "Aperol & Hugo Rosé Spritz — light, refreshing aperitivos for early or warm evenings.",
          "Always offer the zero-proof mocktails enthusiastically to guests not drinking — they deserve a great drink too.",
        ],
      },
    ],
    quiz: [
      {
        id: "figaro-cocktails-1",
        question: "What is the base spirit of the Figaro Manhattan?",
        options: [
          "Buffalo Trace bourbon",
          "Knob Creek Rye whiskey",
          "Bar Agricole Brandy",
          "Gin",
        ],
        answer: 1,
        explanation:
          "Knob Creek Rye, with Antica vermouth, Angostura bitters, and a Luxardo cherry.",
      },
      {
        id: "figaro-cocktails-2",
        question: "Which drink is Figaro's house martini?",
        options: [
          "Espresso Martini",
          "The Burlingame Martini",
          "Figaro Reserve",
          "Aperol Spritz",
        ],
        answer: 1,
        explanation:
          "The Burlingame Martini — Gin, Cocchi Americano, lemon bitters; crisp, elegant, unmistakably Figaro.",
      },
      {
        id: "figaro-cocktails-3",
        question: "The Figaro Reserve is built on which base spirit?",
        options: ["Rye whiskey", "Vodka", "Bar Agricole Brandy", "Gin"],
        answer: 2,
        explanation:
          "Bar Agricole Brandy with Gran Classico, Antica vermouth, and orange bitters — a bartender's favorite.",
      },
      {
        id: "figaro-cocktails-4",
        question: "How are the cocktails on Figaro's list priced?",
        options: ["$12 each", "$14 each", "$16 each", "They vary"],
        answer: 2,
        explanation: "Every cocktail on the list is $16.",
      },
      {
        id: "figaro-cocktails-5",
        question: "A guest isn't drinking alcohol tonight. Offer the:",
        options: [
          "Aperol Spritz",
          "The Peninsula or La Dolce Vita",
          "Espresso Martini",
          "Old Fashioned",
        ],
        answer: 1,
        explanation:
          "Our zero-proof mocktails — The Peninsula and La Dolce Vita. Offer them enthusiastically.",
      },
      {
        id: "figaro-cocktails-6",
        question: "The Old Fashioned is made with which base spirit?",
        options: ["Knob Creek Rye", "Buffalo Trace bourbon", "Bar Agricole Brandy", "Vodka"],
        answer: 1,
        explanation:
          "Buffalo Trace, with sugar, orange bitters, an orange twist, and a Luxardo cherry.",
      },
      {
        id: "figaro-cocktails-7",
        question: "The after-dinner pick-me-up on the list is:",
        options: [
          "Aperol Spritz",
          "Espresso Martini — vodka, coffee liqueur, espresso",
          "The Burlingame Martini",
          "Figaro Manhattan",
        ],
        answer: 1,
        explanation:
          "The Espresso Martini — vodka, coffee liqueur, espresso, sugar — is the after-dinner pick-me-up.",
      },
      {
        id: "figaro-cocktails-8",
        question: "The Hugo Rosé Spritz is built with:",
        options: [
          "Prosecco, Aperol, soda",
          "Brut Rosé, St. Germain, soda water, mint",
          "Gin, Cocchi Americano, lemon bitters",
          "Limonata and elderflower tonic",
        ],
        answer: 1,
        explanation:
          "Brut Rosé, St. Germain elderflower, soda water, mint garnish — light and floral.",
      },
      {
        id: "figaro-cocktails-9",
        question: "The Peninsula (zero-proof) contains:",
        options: [
          "Ghia Le Spritz, Fever Tree Tonic, fresh lemon",
          "Limonata, elderflower tonic, soda, mint",
          "Non-alcoholic gin and tonic",
          "Espresso and cream",
        ],
        answer: 0,
        explanation:
          "Ghia Le Spritz, Fever Tree Tonic, fresh lemon. (La Dolce Vita is the limonata-elderflower one.)",
      },
      {
        id: "figaro-cocktails-10",
        question:
          "A curious guest who loves spirit-forward drinks asks what the bartender likes. Offer the:",
        options: [
          "Aperol Spritz",
          "Figaro Reserve — brandy-based, deep and balanced",
          "La Dolce Vita",
          "Espresso Martini",
        ],
        answer: 1,
        explanation:
          "Figaro Reserve — Bar Agricole Brandy, Gran Classico, Antica vermouth — the bartender's favorite.",
      },
      {
        id: "figaro-cocktails-11",
        question: "For a warm early evening, the light refreshing picks are:",
        options: [
          "The two Manhattans",
          "Aperol Spritz or Hugo Rosé Spritz",
          "Old Fashioned",
          "Espresso Martini",
        ],
        answer: 1,
        explanation:
          "The spritzes are the light aperitivos for early or warm evenings.",
      },
    ],
  },
];

export const TOTAL_MODULES = MODULES.length;
export const TOTAL_QUESTIONS = MODULES.reduce((n, m) => n + m.quiz.length, 0);

/** Pass threshold for a module quiz (percentage of correct answers). */
export const PASS_THRESHOLD = 0.8;

/** Questions drawn per attempt (random subset, so retakes stay meaningful).
 *  Modules with fewer questions than this use their full bank. */
export const QUIZ_DRAW = 8;

export function getModule(id: string): TrainingModule | undefined {
  return MODULES.find((m) => m.id === id);
}

/** A module applies to an employee if it's group-wide or at their restaurant. */
function atLocation(m: TrainingModule, location: Location): boolean {
  return m.location === undefined || m.location === location;
}

/** Modules this role at this restaurant must pass to be fully trained. */
export function requiredModulesFor(role: Role, location: Location): TrainingModule[] {
  return MODULES.filter((m) => atLocation(m, location) && m.requiredFor.includes(role));
}

/** In-scope modules outside the role's requirements — open to study, not counted. */
export function electiveModulesFor(role: Role, location: Location): TrainingModule[] {
  return MODULES.filter((m) => atLocation(m, location) && !m.requiredFor.includes(role));
}
