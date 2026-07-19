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
  /** Tall photos render in a 3:4 frame, face-safe, instead of the wide 16:10 crop. */
  portrait?: boolean;
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
  /** If true, the module never appears as an elective — only roles in requiredFor see it. */
  hiddenUnlessRequired?: boolean;
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
          portrait: true,
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
    summary:
      "Andiamo's by-the-glass program \u2014 the one-question method, every pour's formula, and the five moments that sell.",
    minutes: 14,
    requiredFor: BEVERAGE_TEAM,
    location: "Andiamo",
    lessons: [
      {
        heading: "The One-Question Method",
        intro:
          "You don\u2019t need to be a sommelier \u2014 you need one pattern: ask one question \u2192 pick the pour \u2192 say one sentence \u2192 stop talking. And \u2018great question \u2014 let me find out\u2019 is always a professional answer.",
        points: [
          "THE CHARDONNAY WALKTHROUGH \u2014 guest: \u2018I\u2019ll just have a Chardonnay.\u2019 You: \u2018crisp and bright, or rich and buttery?\u2019 Buttery \u2192 Flowers (Sonoma Coast, full and creamy). Crisp \u2192 De Forville (unoaked, bright, mineral \u2014 \u2018Chard without the butter\u2019). Every answer has a pour waiting.",
          "Pinot Grigio: \u2018the classic, or something with a coastal twist?\u2019 \u2192 Donini / La Cala Vermentino (saline \u2014 the branzino wine).",
          "Sauvignon Blanc \u2192 Clos Henri: citrusy, zesty, refreshing. One sentence, done.",
          "Reds: \u2018smooth and easy, or big and bold?\u2019 \u2192 smooth: House Nero d\u2019Avola or Routestock Pinot Noir; bold: The Calling Cabernet.",
          "Italian mood: \u2018for the pasta, or something adventurous?\u2019 \u2192 Chianti with red sauce / Tintero Nebbiolo, the \u2018baby Barolo.\u2019",
          "Why it works: the question does the selling; you sound like an expert by asking, not lecturing; the price comes last, plainly, no apology.",
        ],
      },
      {
        heading: "Price Transparency & Wine Words",
        intro:
          "One rule above all: no guest ever learns a price from the check.",
        points: [
          "ALWAYS say the price when you recommend \u2014 plainly, at the end, straight off the printed list: \u201cthe Flowers \u2014 [price].\u201d Confidence with numbers reads as honesty.",
          "Picking for a guest? Confirm pick AND price before you pour: \u201cI\u2019ll bring the Vermentino \u2014 [price] \u2014 perfect with the branzino.\u201d",
          "DRY = not sweet (nearly everything we pour is dry \u2014 ask \u2018crisp or rich?\u2019 instead). BODY = weight: skim milk \u2192 whole milk \u2192 cream.",
          "TANNIN = the tea-bag grip in reds (big in the Calling, gentle in Pinot). ACIDITY = mouth-watering brightness (Chianti loves food for this reason). OAK = vanilla/butter from barrels (Flowers yes, De Forville no).",
          "CORKED = musty wet-cardboard smell from a faulty cork. It happens to good bottles: apologize, replace immediately without debate, tell a manager.",
        ],
      },
      {
        heading: "Whites & Sparkling \u2014 Formula \u00b7 Sentence \u00b7 For",
        points: [
          "Lamberti Prosecco: Glera \u00b7 Veneto \u00b7 green apple \u00b7 light, frothy. \u201cThe welcome glass \u2014 dry, crisp, celebratory.\u201d FOR every table at greeting.",
          "Donini Pinot Grigio: PG \u00b7 Italy \u00b7 light citrus \u00b7 crisp, easy. \u201cThe classic \u2014 crisp and clean.\u201d FOR the PG guest; never talk them out of it.",
          "Flowers Chardonnay: Chard \u00b7 Sonoma Coast \u00b7 cream & ripe orchard fruit \u00b7 full, rich. \u201cThe rich crowd-pleaser from one of Sonoma\u2019s great coastal names.\u201d FOR the buttery-Chard guest \u2014 their yes.",
          "De Forville Chardonnay: Chard \u00b7 Piedmont \u00b7 bright minerality \u00b7 zero oak. \u201cChardonnay without the butter.\u201d FOR crisp-white drinkers and the \u2018I don\u2019t like Chardonnay\u2019 guest.",
          "Clos Henri Sauvignon Blanc: SB \u00b7 Marlborough (founded by Sancerre\u2019s Bourgeois family) \u00b7 citrus & zest \u00b7 crisp. \u201cA Sancerre family making Sauvignon in New Zealand.\u201d FOR the SB-by-default guest.",
          "La Cala Vermentino: Vermentino \u00b7 Sardinia \u00b7 saline & coastal \u00b7 fresh. \u201cThe seafood wine \u2014 tastes like the coast.\u201d FOR the branzino, crudo, anything from the sea.",
        ],
      },
      {
        heading: "Reds \u2014 Formula \u00b7 Sentence \u00b7 For",
        points: [
          "House Nero d\u2019Avola (Rapital\u00e0): Nero d\u2019Avola \u00b7 Sicily \u00b7 juicy dark fruit \u00b7 smooth, easy. \u201cOur house red \u2014 Sicilian sunshine, smooth and generous.\u201d FOR the \u2018just a red\u2019 guest.",
          "Routestock Pinot Noir: Pinot \u00b7 California \u00b7 red berries \u00b7 silky, lighter. \u201cSilky and elegant \u2014 the red that loves salmon and chicken.\u201d FOR the easy-red guest; whites crossing over.",
          "Villa Sant\u2019Anna Chianti: Sangiovese \u00b7 Tuscany \u00b7 cherry & leather \u00b7 bright, food-first. \u201cThe classic with anything red-sauce.\u201d FOR the traditional Italian order.",
          "Tintero Nebbiolo: Nebbiolo \u00b7 Piedmont \u00b7 red fruit & rose \u00b7 elegant, floral. \u201cA baby Barolo \u2014 the noble grape at a friendly price.\u201d FOR the curious; the step up from Chianti.",
          "The Calling Cabernet: Cab \u00b7 California \u00b7 dark fruit \u00b7 bold, firm. \u201cThe big one \u2014 dark fruit and structure.\u201d FOR the bold-red guest and the steak.",
          "The Italian ladder: Nero d\u2019Avola \u2192 Chianti \u2192 Tintero Nebbiolo \u2014 one friendly rung at a time.",
        ],
      },
      {
        heading: "The Moments That Sell",
        points: [
          "THE WELCOME: offer the Lamberti at greeting, with price \u2014 \u201ca glass of Prosecco while you look things over?\u201d An opened table drinks more all night.",
          "THE SECOND GLASS: offer at a third full, never after empty \u2014 \u201canother Flowers, or should I bring the De Forville so you can taste the two styles side by side?\u201d The compare play turns a glass into a tasting.",
          "THE BOTTLE MATH: \u201cCan I bring a bottle? It works out to about the same as three glasses each.\u201d Offer BEFORE the third round \u2014 guests never resent being saved money.",
          "THE DESSERT HANDOFF: when dessert lands, hand the table to the after-dinner round \u2014 amaro, limoncello, or a caff\u00e8 corretto (see the Spirits & Amaro module).",
          "THE CHECK MOMENT: every price was said out loud earlier, so the check holds zero surprises. No surprises = trust = tips = regulars.",
          "The mindset under all of it: you are not selling \u2014 you are guiding. Be specific and sensory: \u201cthe Vermentino is drinking beautifully \u2014 saline, coastal, perfect with the branzino.\u201d",
        ],
      },
    ],
    quiz: [
      {
        id: "wine-1",
        question: "A guest ordering the branzino wants a white. The strongest pairing logic:",
        options: [
          "Clos Henri Sauvignon Blanc \u2014 crisp cuts through fish",
          "La Cala Vermentino \u2014 saline and coastal, the wine literally made for seafood",
          "Donini Pinot Grigio \u2014 light enough to stay out of the way",
          "Flowers Chardonnay \u2014 richness matches a whole fish",
        ],
        answer: 1,
        explanation:
          "Three of these \u2018work\u2019 \u2014 but the Vermentino\u2019s salinity is the story pick, and the story sells: \u2018tastes like the coast.\u2019",
      },
      {
        id: "wine-2",
        question: "\u2018I like Chardonnay but hate that buttery thing.\u2019 Pour:",
        options: [
          "Flowers, but ask the kitchen to pair it lighter",
          "Clos Henri \u2014 no butter in Sauvignon Blanc",
          "De Forville \u2014 unoaked Chardonnay, bright and mineral: \u2018Chard without the butter\u2019",
          "Donini Pinot Grigio \u2014 the closest clean white",
        ],
        answer: 2,
        explanation:
          "They asked for Chardonnay \u2014 keep them in the grape, drop the oak. Switching grapes ignores what they said.",
      },
      {
        id: "wine-3",
        question: "Salmon entr\u00e9e, guest wants red. Best call:",
        options: [
          "Villa Sant\u2019Anna Chianti \u2014 acidity loves rich fish",
          "House Nero d\u2019Avola \u2014 smooth enough for anything",
          "The Calling Cabernet \u2014 our best red",
          "Routestock Pinot Noir \u2014 silky, lighter, made for salmon",
        ],
        answer: 3,
        explanation:
          "Chianti\u2019s a defensible second \u2014 but Pinot\u2019s silk against salmon is the classic, and \u2018made for salmon\u2019 is a one-sentence sell.",
      },
      {
        id: "wine-4",
        question: "The strongest bottle-upsell line:",
        options: [
          "\u201cCan I bring a bottle? It works out to about the same as three glasses each.\u201d",
          "\u201cA bottle is our best value per ounce.\u201d",
          "\u201cMost tables your size do a bottle.\u201d",
          "\u201cShould we just make it a bottle?\u201d",
        ],
        answer: 0,
        explanation:
          "Specific math framed as guest value \u2014 not per-ounce economics, not peer pressure, not vagueness.",
      },
      {
        id: "wine-5",
        question: "The welcome-glass offer at greeting is:",
        options: [
          "The House Nero d\u2019Avola \u2014 it\u2019s the house pour",
          "Lamberti Prosecco \u2014 light, celebratory, opens the table",
          "Whatever pairs with their likely entr\u00e9e",
          "Water first \u2014 wine talk comes with menus",
        ],
        answer: 1,
        explanation:
          "Bubbles at hello \u2014 an opened table drinks more all night. Pairing talk comes later.",
      },
      {
        id: "wine-6",
        question: "\u2018Just something easy and light, Italian white.\u2019 Pour:",
        options: [
          "La Cala Vermentino \u2014 light and Italian",
          "De Forville \u2014 light and Italian",
          "Donini Pinot Grigio \u2014 the easy, crisp classic they\u2019re describing",
          "Clos Henri \u2014 light and zesty",
        ],
        answer: 2,
        explanation:
          "Vermentino and De Forville are Italian too \u2014 but \u2018easy and light\u2019 is the Pinot Grigio guest describing their own wine. Give the classic; never over-correct.",
      },
      {
        id: "wine-7",
        question: "\u2018Big, bold red\u2019 \u2014 the by-the-glass answer:",
        options: [
          "Tintero Nebbiolo \u2014 the most serious red we pour",
          "House Nero d\u2019Avola \u2014 dark Sicilian fruit",
          "Villa Sant\u2019Anna Chianti \u2014 the classic",
          "The Calling Cabernet \u2014 dark fruit and firm tannin",
        ],
        answer: 3,
        explanation:
          "Nebbiolo is elegant, not big; Nero d\u2019Avola is smooth, not bold. \u2018Big and bold\u2019 = the Calling, every time.",
      },
      {
        id: "wine-8",
        question: "Red-sauce pasta, guest wants the classic match:",
        options: [
          "Villa Sant\u2019Anna Chianti \u2014 acidity built for tomato",
          "House Nero d\u2019Avola \u2014 the house red with the house pasta",
          "Routestock Pinot Noir \u2014 won\u2019t overpower",
          "The Calling Cabernet \u2014 stands up to the sauce",
        ],
        answer: 0,
        explanation:
          "The house red is tempting \u2014 but tomato\u2019s acid wants Chianti\u2019s acid. That\u2019s the pairing rule worth knowing.",
      },
      {
        id: "wine-9",
        question: "We call the Tintero a \u2018baby Barolo\u2019 because:",
        options: [
          "It\u2019s made by a Barolo producer in a lighter vintage",
          "It\u2019s the same Nebbiolo grape as Barolo, in a friendlier, earlier-drinking style",
          "It\u2019s a declassified Barolo from young vines",
          "It comes from a village next to Barolo",
        ],
        answer: 1,
        explanation:
          "Same noble grape, gentler expression \u2014 that\u2019s the whole phrase. Don\u2019t claim declassification you can\u2019t back up.",
      },
      {
        id: "wine-10",
        question: "The upsell mindset that actually builds revenue:",
        options: [
          "Always suggest one rung above what they named",
          "Read the table \u2014 upsell only when they signal budget",
          "Guide with specific, sensory language \u2014 a guest who trusts your pick comes back, and regulars are the real revenue",
          "Lead with the most expensive option so everything else feels reasonable",
        ],
        answer: 2,
        explanation:
          "Anchoring tricks and blanket one-rung rules read as selling. Trust compounds \u2014 that\u2019s the long game.",
      },
      {
        id: "wine-11",
        question: "\u2018I\u2019ll just have a Chardonnay.\u2019 Your first move:",
        options: [
          "\u201cCrisp and bright, or rich and buttery?\u201d \u2014 De Forville or Flowers, either answer has a pour",
          "\u201cCalifornia or Italian?\u201d",
          "Bring the Flowers \u2014 it\u2019s the crowd-pleaser",
          "Describe both Chardonnays fully, then let them decide",
        ],
        answer: 0,
        explanation:
          "Geography doesn\u2019t map to taste, defaulting decides for them, and the double-recitation is a lecture. One question, then stop.",
      },
      {
        id: "wine-12",
        question: "A guest says \u2018you pick for me.\u2019 Before pouring you must:",
        options: [
          "Nothing \u2014 they delegated the choice",
          "Check their entr\u00e9e order first",
          "Bring two options so they still choose",
          "Confirm the pick AND the price: \u201cI\u2019ll bring the Vermentino \u2014 [price] \u2014 perfect with the branzino\u201d",
        ],
        answer: 3,
        explanation:
          "Delegation isn\u2019t a blank check \u2014 no guest ever learns a price from the check. Pick and price, out loud, before the pour.",
      },
      {
        id: "wine-13",
        question: "A guest is a third from finishing a Flowers they love. Best line:",
        options: [
          "\u201cAnother Flowers \u2014 or should I bring the De Forville so you can taste the two styles side by side?\u201d",
          "\u201cReady for another?\u201d when the glass is empty",
          "\u201cShall I just bring the bottle?\u201d",
          "Refill quietly \u2014 they clearly want more",
        ],
        answer: 0,
        explanation:
          "Offer before empty; never pour unasked. The compare play is the easiest second sale in the building.",
      },
      {
        id: "wine-14",
        question: "\u2018This smells like a wet basement.\u2019 You:",
        options: [
          "Suggest decanting to blow off the aroma",
          "Apologize, replace it immediately without debate, tell a manager \u2014 the bottle is corked",
          "Bring a fresh glass from the same bottle",
          "Explain that older wines can smell earthy",
        ],
        answer: 1,
        explanation:
          "Cork taint doesn\u2019t blow off and it\u2019s in the whole bottle. Replace, report, never argue.",
      },
    ]
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
    title: "Spirits & Amaro \u2014 the After-Dinner Round",
    summary:
      "Aperitivo and digestivo culture, the amaro ladder, and how to sell the most profitable ten minutes of the night.",
    minutes: 12,
    requiredFor: BEVERAGE_TEAM,
    lessons: [
      {
        heading: "Why the After-Dinner Round Matters",
        intro:
          "In Italy, dinner doesn\u2019t end with dessert \u2014 it ends with a digestivo. Bringing that ritual to the table is hospitality first and the most profitable ten minutes of the night second.",
        points: [
          "The table has already decided to linger \u2014 the after-dinner offer meets them where they are. Nobody ever felt sold a limoncello.",
          "It is nearly pure margin, it extends the evening, and it is the thing guests remember: \u2018they brought us amaro and told us the story.\u2019",
          "The offer is one sentence, made when dessert is ordered or the last plates clear: \u201cespresso for the table \u2014 and something to settle the meal? An amaro, or an ice-cold limoncello?\u201d",
          "Price transparency applies here like everywhere: say the price plainly when you name a pour. No surprises on the check, ever.",
        ],
      },
      {
        heading: "Aperitivo & Digestivo \u2014 Plain English",
        points: [
          "APERITIVO = before dinner. Light, bitter, often bubbly \u2014 it wakes up the appetite. Aperol Spritz territory.",
          "DIGESTIVO = after dinner. Herbal, stronger, sipped slowly \u2014 Italians swear it settles a big meal.",
          "AMARO = Italian for \u2018bitter\u2019 \u2014 a family of herbal liqueurs made from secret blends of roots, herbs, and citrus peel. Every region has its own.",
          "GRAPPA = a spirit distilled from grape skins after winemaking \u2014 the vineyard\u2019s nightcap (Amaro Nonino is built on it).",
          "NEAT = as-is, no ice. ROCKS = over ice. CHILLED = shaken cold. Limoncello lives in the freezer.",
          "CAFF\u00c8 CORRETTO = an espresso \u2018corrected\u2019 with a splash of spirit \u2014 a very Italian yes for the guest who \u2018shouldn\u2019t have another drink.\u2019",
        ],
      },
      {
        heading: "Spirits \u2014 Formula \u00b7 Sentence \u00b7 For",
        points: [
          "London Dry Gin: juniper & citrus \u00b7 piney, floral \u00b7 clean dry finish. \u201cCrisp and botanical \u2014 the classic martini spirit.\u201d FOR the martini drinker; ties to the Burlingame Martini.",
          "Bourbon: vanilla, caramel & toasted oak \u00b7 warm and sweet \u00b7 long gentle finish. \u201cAmerica\u2019s whiskey \u2014 round, sweet, comforting.\u201d FOR the Old Fashioned drinker; the sweet side of the whiskey axis.",
          "Rye: spice, pepper & dried fruit \u00b7 bold \u00b7 dry spicy finish. \u201cBourbon\u2019s spicier sibling \u2014 drier, more pepper.\u201d FOR the Manhattan drinker; ask \u2018sweet and round, or dry and spicy?\u2019 \u2014 that one question picks the whiskey.",
          "Blanco Tequila: fresh agave & citrus \u00b7 grassy, bright \u00b7 crisp finish. \u201cUnaged and pure \u2014 the plant, not the barrel.\u201d FOR margarita drinkers going neat.",
          "Mezcal (Joven): smoke, roasted agave & earth \u00b7 complex. \u201cTequila\u2019s wilder cousin \u2014 smoky and earthy.\u201d FOR the adventurer and the peated-Scotch drinker.",
        ],
      },
      {
        heading: "The Amaro Ladder \u2014 Meet the Guest Where They Are",
        intro:
          "Amari run from training wheels to the deep end. Never start a newcomer at the bottom of the list \u2014 walk them down the ladder.",
        points: [
          "Rung 1 \u2014 APEROL: light bitter, orange & rhubarb. \u201cThe gentlest bitter there is \u2014 if you like an Aperol Spritz, this is where it comes from.\u201d FOR the amaro-curious.",
          "Rung 2 \u2014 CAMPARI: firmly bitter, orange peel & herbs. \u201cThe backbone of the Negroni \u2014 bracing, grown-up, iconic.\u201d FOR the guest who liked rung one.",
          "Rung 3 \u2014 AMARO NONINO: grappa base, orange & vanilla, silky. \u201cThe elegant one \u2014 silky, gently bitter, gorgeous neat.\u201d FOR the wine drinker; the best first AFTER-DINNER amaro on the shelf.",
          "Rung 4 \u2014 FERNET-BRANCA: menthol, saffron & myrrh, intensely herbal. \u201cThe deep end \u2014 the industry calls it the bartender\u2019s handshake.\u201d FOR the initiated and the brave; watch their face, enjoy it.",
          "Off the ladder \u2014 LIMONCELLO: lemon zest, sweet, ice-cold from the freezer. \u201cSunshine, frozen.\u201d FOR the sweet finisher and the celebration table \u2014 a round of limoncello ends a birthday properly.",
        ],
      },
      {
        heading: "The After-Dinner Moments",
        points: [
          "THE OFFER: as dessert is ordered \u2014 \u201cespresso \u2014 and something to settle the meal? An amaro, or an ice-cold limoncello?\u201d One sentence, everyone at once.",
          "THE PAIRING SPLIT: sweet tooth \u2192 limoncello or the Moscato half; savory-curious \u2192 the amaro ladder; coffee lover \u2192 caff\u00e8 corretto or espresso + Fernet on the side.",
          "THE STORY BEAT: one line makes the pour an event \u2014 \u2018every region of Italy has its own amaro; this one\u2019s built on grappa.\u2019 Story turns a drink into a memory.",
          "THE CELEBRATION CLOSE: birthdays and anniversaries end with a limoncello round \u2014 offer it to the table, name the price, let them feel the generosity of the ritual.",
          "THE WHISKEY QUESTION: \u2018sweet and round, or dry and spicy?\u2019 \u2014 bourbon or rye, one question, same method as the wine list.",
        ],
      },
    ],
    quiz: [
      {
        id: "tasting-1",
        question: "A guest wants something \u2018smoky and earthy\u2019 to sip. Your pour:",
        options: [
          "Bourbon \u2014 toasted oak has smoke in it",
          "Rye \u2014 the boldest whiskey we pour",
          "Mezcal \u2014 roasted agave, genuinely smoky",
          "Blanco tequila \u2014 agave-forward and pure",
        ],
        answer: 2,
        explanation:
          "Oak toast reads warm, not smoky, and blanco is bright, not earthy. Mezcal is the real smoke.",
      },
      {
        id: "tasting-2",
        question: "The bitter backbone of a Negroni is:",
        options: [
          "Campari",
          "Aperol",
          "Amaro Nonino",
          "Fernet-Branca",
        ],
        answer: 0,
        explanation:
          "Aperol is the Spritz; Campari is the Negroni. Confusing the two is the most common bar mix-up there is.",
      },
      {
        id: "tasting-3",
        question: "A guest wants something sweet, bright, and ice-cold after dinner \u2014 not coffee, not bitter. Pour:",
        options: [
          "Amaro Nonino, chilled",
          "Limoncello from the freezer",
          "A caff\u00e8 corretto",
          "Grappa, neat",
        ],
        answer: 1,
        explanation:
          "Nonino is still gently bitter, corretto is coffee, grappa is fiery. Sweet + bright + frozen = limoncello.",
      },
      {
        id: "tasting-4",
        question: "Describing bourbon accurately:",
        options: [
          "Pepper and dried fruit with a dry, spicy finish",
          "Smoke and roasted earth",
          "Green apple and floral notes, unaged and light",
          "Vanilla, caramel, toasted oak \u2014 warm, sweet, long",
        ],
        answer: 3,
        explanation:
          "Sweet-and-round is bourbon\u2019s signature; pepper-and-dry is rye\u2019s. Keep the axis straight and the whiskey question works.",
      },
      {
        id: "tasting-5",
        question: "London Dry gin, in a sentence:",
        options: [
          "Juniper, coriander, citrus \u2014 piney and clean with a dry finish",
          "Elderflower and cucumber \u2014 soft and floral",
          "Caramel and baking spice from barrel aging",
          "Saline and briny, made for martinis with olives",
        ],
        answer: 0,
        explanation:
          "Elderflower-cucumber describes a contemporary style, not London Dry. Juniper first \u2014 always.",
      },
      {
        id: "tasting-6",
        question: "The one-question whiskey move \u2014 \u2018sweet and round, or dry and spicy?\u2019 \u2014 maps to:",
        options: [
          "Sweet = rye \u00b7 spicy = bourbon",
          "Sweet = bourbon \u00b7 spicy = rye",
          "Sweet = bourbon \u00b7 spicy = mezcal",
          "It depends on the barrel, not the grain",
        ],
        answer: 1,
        explanation:
          "Corn makes bourbon sweet; rye grain brings pepper. The grain sets the style \u2014 that\u2019s why the question works.",
      },
      {
        id: "tasting-7",
        question: "A guest asks why the blanco tequila doesn\u2019t taste \u2018oaky like a good one should.\u2019 You explain:",
        options: [
          "Ours is a value bottling \u2014 aged tequilas cost more",
          "Blanco is unaged on purpose \u2014 it\u2019s the pure expression of the agave plant; oak comes with reposado and a\u00f1ejo",
          "Tequila never touches oak \u2014 they\u2019re thinking of mezcal",
          "We chill it, which mutes the oak",
        ],
        answer: 1,
        explanation:
          "Blanco\u2019s brightness is the style, not a shortcut \u2014 aging tiers (blanco \u2192 reposado \u2192 a\u00f1ejo) add the oak.",
      },
      {
        id: "tasting-8",
        question: "A guest is amaro-curious but has never had one. Start them on:",
        options: [
          "Fernet-Branca \u2014 the most authentic introduction",
          "Campari \u2014 the icon",
          "Aperol \u2014 the gentlest rung of the ladder",
          "Limoncello \u2014 technically the easiest",
        ],
        answer: 2,
        explanation:
          "Fernet first scares people off for years, and limoncello isn\u2019t an amaro. Start gentle, walk down the ladder.",
      },
      {
        id: "tasting-9",
        question: "\u2018The bartender\u2019s handshake\u2019 is:",
        options: [
          "A shot of grappa",
          "Amaro Nonino, neat",
          "A caff\u00e8 corretto",
          "Fernet-Branca",
        ],
        answer: 3,
        explanation:
          "Fernet \u2014 menthol, saffron, intensely herbal \u2014 the industry\u2019s secret salute.",
      },
      {
        id: "tasting-10",
        question: "Amaro Nonino\u2019s distinguishing trait among our amari:",
        options: [
          "Grappa-based, orange and vanilla, silky \u2014 the elegant first after-dinner amaro",
          "The most bitter pour on the shelf",
          "Served exclusively in cocktails, never neat",
          "A sweet lemon liqueur from the freezer",
        ],
        answer: 0,
        explanation:
          "Built on grappa, silky rather than punishing \u2014 the best first AFTER-DINNER amaro on the list.",
      },
      {
        id: "tasting-11",
        question: "The after-dinner offer \u2014 when and how:",
        options: [
          "As you clear mains: \u201canyone still working on wine?\u201d",
          "With the dessert menus or as plates clear: \u201cespresso \u2014 and something to settle the meal? An amaro, or an ice-cold limoncello?\u201d",
          "After espresso is served, offer a pairing pour",
          "When you drop the check, mention digestivi for next time",
        ],
        answer: 1,
        explanation:
          "One sentence, whole table, at the dessert moment \u2014 after espresso lands you\u2019ve missed it; with the check it\u2019s over.",
      },
      {
        id: "tasting-12",
        question: "Aperitivo vs. digestivo:",
        options: [
          "Aperitivo after dinner, digestivo before",
          "Both are after-dinner; aperitivo is just sweeter",
          "Aperitivo before dinner to wake the appetite; digestivo after, sipped to settle the meal",
          "Aperitivo means appetizer course, not a drink",
        ],
        answer: 2,
        explanation:
          "Before opens, after closes \u2014 the entire Italian drinking arc in one line.",
      },
      {
        id: "tasting-13",
        question: "The amaro ladder, gentlest first:",
        options: [
          "Campari \u2192 Aperol \u2192 Fernet \u2192 Nonino",
          "Aperol \u2192 Nonino \u2192 Campari \u2192 Fernet",
          "Nonino \u2192 Aperol \u2192 Campari \u2192 Fernet",
          "Aperol \u2192 Campari \u2192 Nonino \u2192 Fernet",
        ],
        answer: 3,
        explanation:
          "Aperol (training wheels) \u2192 Campari (firmly bitter) \u2192 Nonino (deep but silky) \u2192 Fernet (the deep end).",
      },
      {
        id: "tasting-14",
        question: "A lingering guest says \u2018I really shouldn\u2019t have another drink\u2019 over their espresso. The graceful move:",
        options: [
          "Respect it completely \u2014 never mention alcohol again",
          "Offer a half-pour of amaro since they\u2019re staying",
          "Offer once, lightly: \u201ca caff\u00e8 corretto? Just a splash in the espresso \u2014 the Italian nightcap\u201d \u2014 then accept the answer gracefully",
          "Bring the limoncello on the house",
        ],
        answer: 2,
        explanation:
          "\u2018Shouldn\u2019t\u2019 while lingering is ambivalence, not refusal \u2014 the corretto is the tiny ritual middle path. Offer once, never push.",
      },
    ]
    ],
  },
  {
    id: "figaro-btg-2026",
    order: 11,
    section: "Bar Reference",
    title: "Caf\u00e9 Figaro: Wines by the Glass \u2014 Summer 2026",
    summary:
      "The new glass program \u2014 17 everyday pours, 5 reserve pours, the service rules, and how to sell them with one question.",
    minutes: 20,
    requiredFor: BEVERAGE_TEAM,
    location: "Cafe Figaro",
    lessons: [
      {
        heading: "Start Here \u2014 How to Actually Learn This",
        intro:
          "Nobody memorizes 22 wines in a night. The pros learn in passes \u2014 do the same.",
        points: [
          "Pass 1 (5 min): skim every Formula line \u2014 grape \u00b7 place \u00b7 flavor \u00b7 feel. Just get the map.",
          "Pass 2 (10 min): read the stories, and say each Sentence OUT LOUD once. Out loud is the trick \u2014 your mouth remembers what your eyes forget.",
          "Pass 3: run the Dialogues with a coworker or in the mirror. Sixty seconds each.",
          "Then taste: wine of the day at pre-shift locks it in. Tasting one wine you\u2019ve already read about beats reading ten.",
          "Learn YOUR wines first: the five reserve pours + the three you pour most. Own eight, then grow.",
          "Different brains, different doors: readers \u2014 study the cards; talkers \u2014 role-play; doers \u2014 taste and pour. Use yours.",
        ],
      },
      {
        heading: "The Program & the Service Philosophy",
        intro:
          "The wine list opens on a two-page spread: Wines by the Glass facing Reserve by the Glass. Everyday and extraordinary, side by side \u2014 your job is to help guests cross that bridge.",
        points: [
          "Listen first \u2014 ask one clarifying question before recommending.",
          "One memorable detail per wine, not a Wikipedia entry.",
          "Present two options, recommend one, let the guest choose.",
          "The upsell is generosity: guiding a guest to a better wine gives them a better night.",
          "You don\u2019t need to be a sommelier. The whole skill: ask one question \u2192 pick the pour \u2192 say one sentence \u2192 stop talking. And \u2018great question \u2014 let me find out\u2019 is a professional answer.",
          "Our list holds the Wine Spectator BEST OF Award of Excellence for 2026 and a Star Wine List Award \u2014 worth mentioning to wine lovers.",
        ],
      },
      {
        heading: "Service Rules & Price Transparency",
        intro:
          "One rule above all: no guest ever learns a price from the check. Surprise is the enemy of trust \u2014 and trust is what sells the second visit.",
        points: [
          "ALWAYS say the price when you recommend \u2014 plainly, at the end, no apology: \u201cthe Ramey \u2014 twenty-five.\u201d Confidence with numbers reads as honesty.",
          "Reserve pours: the guest hears or sees the price BEFORE the wine is poured, every time. \u201cThe Margaux is sixty-five a glass \u2014 shall I bring it?\u201d",
          "Guest says \u2018just a Chardonnay\u2019 and you pick for them? Confirm pick AND price: \u201cI\u2019ll bring the Ramey, twenty-five \u2014 perfect with the Alfredo.\u201d",
          "Every pour in the building is 6 oz \u2014 a full ounce more than the industry standard. Say it when it helps, especially on the Billecart: the Village Pub pours it at the same $40, standard glass. Generosity is only generous if the guest knows.",
          "The Billecart is opened normally; sparkling stopper after every pour; note the open date; sell through in 2\u20133 days.",
          "Corkage is $30, waived with each bottle purchased from our list. Say it as generosity: \u201chappy to open that \u2014 and if you grab any bottle from our list, we waive it.\u201d",
        ],
      },
      {
        heading: "Wine Words in Plain English",
        intro:
          "Ten words cover 95% of wine talk at the table. Plain definitions \u2014 use them exactly like this with guests.",
        points: [
          "DRY = not sweet. Almost everything we pour is dry. When a guest asks for \u2018dry,\u2019 they usually mean crisp \u2014 ask \u2018crisp and bright, or rich?\u2019",
          "BODY = weight in your mouth. Skim milk (light) \u2192 whole milk (medium) \u2192 cream (full).",
          "TANNIN = the tea-bag grip in reds \u2014 that drying feeling on your gums. Softens with food; big in Barolo and Cab, gentle in Pinot.",
          "ACIDITY = the mouth-watering brightness. High-acid wines (Chianti, Sancerre) love food.",
          "OAK = vanilla, toast, butter notes from barrel aging. Ramey has it; De Forville has none.",
          "MINERALITY = stone, chalk, saline notes instead of fruit \u2014 the word for Sancerre and Leflaive.",
          "VINTAGE = the year the grapes were picked. N.V. = a blend of years (normal for Champagne and Prosecco).",
          "CRU = a named great vineyard site. Ravera (our Cogno) is a cru of Barolo.",
          "BRUT = dry, in sparkling-wine language.",
          "CORKED = a musty, wet-cardboard smell from a faulty cork. It happens to good bottles. Never argue \u2014 apologize, replace the glass immediately, tell a manager.",
        ],
      },
      {
        heading: "Reserve by the Glass \u2014 Know These Five Cold",
        intro:
          "Five prestige pours. Each has a one-sentence story \u2014 deliver it with confidence.",
        points: [
          "Billecart-Salmon Brut Ros\u00e9 ($40 / 6 oz): founded 1818, one of the last great family-owned Champagne houses, and THE benchmark ros\u00e9 \u2014 the pink Champagne every other house measures against. Wild strawberry, blood orange, chalk. PAIR oysters, fritto, salty starters. FOR every celebration. Say the Village Pub line: same $40, standard pour there \u2014 six ounces here.",
          "Domaines Leflaive, M\u00e2con-Verz\u00e9 ($50): Leflaive of Puligny-Montrachet is the most famous white-wine estate in Burgundy \u2014 grand crus that sell for thousands \u2014 and a biodynamic pioneer. This is their village M\u00e2con: the same farming, same cellar discipline, at a human price. White peach, toasted almond, limestone. PAIR the halibut, chicken, shellfish. FOR the Chardonnay drinker ready for France.",
          "Elvio Cogno \u2018Cascina Nuova\u2019, Barolo ($45): Nebbiolo from Ravera, one of Barolo\u2019s truly great hillsides, above the village of Novello. Rose petal, dried cherry, iron \u2014 power carried on silk. PAIR the veal, braises, anything truffle or mushroom. FOR the serious red drinker and the Barbaresco fan stepping up. \u2018The insider\u2019s Barolo.\u2019",
          "Margaux du Ch\u00e2teau Margaux ($65): Ch\u00e2teau Margaux is a First Growth \u2014 ranked at the very top of Bordeaux in the famous 1855 classification and never displaced. This is its third wine: the same estate, same winemaking team, from younger vines \u2014 made to drink now. Cassis, violet, cedar, polish. PAIR the lamb chops, steak, veal chop. FOR the name-driven guest and the special occasion. Price FIRST, always: \u2018sixty-five a glass.\u2019",
          "Jean-Louis Chave S\u00e9lection \u2018Offerus\u2019 ($30): the Chave family has farmed these Rh\u00f4ne hills since 1481 \u2014 sixteen generations \u2014 and their Hermitage is one of the greatest wines on earth. Offerus is their Saint-Joseph: violets, black pepper, smoked meat. PAIR peppery meats, sausage, mushrooms. FOR the adventurer and the value hunter \u2014 the $30 door onto this page.",
        ],
      },
      {
        heading: "The Moments That Sell",
        intro:
          "Wine revenue isn\u2019t one big move \u2014 it\u2019s five small moments, every table, every night.",
        points: [
          "THE WELCOME: offer a glass at greeting, by name, with price \u2014 \u201ca glass of Prosecco while you look things over? Twelve.\u201d An opened table drinks more all night.",
          "THE SECOND GLASS: offer when the glass is a third full, never after empty \u2014 \u201canother Ramey, or should I bring the Champy so you can taste them side by side?\u201d The compare play turns a glass into a tasting.",
          "THE BOTTLE MATH: two guests, two rounds of the same wine \u2192 offer the bottle BEFORE the third glass. On the Margaux: \u201cif you\u2019re each having another, the bottle is 185 and the better deal.\u201d Guests never resent being saved money.",
          "THE DESSERT MOMENT: when dessert is ordered, offer the La Spinetta Moscato d\u2019Asti half bottle \u2014 \u201ca half of Moscato for the table with dessert? Thirty-two, and it\u2019s gently sparkling.\u201d The easiest add-on in the building.",
          "THE CHECK MOMENT: because every price was said out loud earlier, the check holds zero surprises. No surprises = trust = tips = regulars. That is the whole system.",
        ],
      },
      {
        heading: "The One-Question Method \u2014 the Chardonnay Walkthrough",
        intro:
          "Learn this pattern once and every category on the card works the same way. Guest: \u2018I\u2019ll just have a Chardonnay.\u2019 You: \u2018Love it \u2014 do you like it crisp and bright, or rich and buttery?\u2019",
        points: [
          "\u2018Buttery\u2019 \u2192 \u201cThen the Ramey \u2014 classic Russian River, ripe apple, a kiss of oak. Twenty-five.\u201d",
          "\u2018Crisp\u2019 \u2192 \u201cThe De Forville from Piedmont \u2014 no oak at all, wildflowers and cream. Sixteen.\u201d",
          "\u2018What do YOU like?\u2019 \u2192 \u201cThe Maison Champy \u2014 real white Burgundy from Burgundy\u2019s oldest house. Twenty-five.\u201d",
          "Wine-lover energy \u2192 \u201cIf you want to see how far Chardonnay goes, we pour Leflaive on the reserve page. Fifty.\u201d",
          "Why it works: the question does the selling; every answer has a pour waiting; the price comes last, plainly, no apology.",
          "The one question per category \u2014 Sauvignon Blanc: \u2018zesty NZ style or the French mineral one?\u2019 (Te Mata 16 / Sancerre 20). Pinot Grigio: \u2018the classic or the more interesting version?\u2019 (Walch 16 / Ribolla 16). Big reds: \u2018smooth and easy or big and bold?\u2019 (Routestock 17 / Chappellet 25 / Duckhorn 28). Pinot Noir: \u2018light and juicy or silky and serious?\u2019 (Presqu\u2019ile 17 / Occidental 35). Italian: \u2018for the pasta or the steak?\u2019 (Chianti 16, A Quo 20 / Barbaresco 25).",
          "The second glass: offer when the glass is a third full, never after empty \u2014 \u201canother Ramey, or should I bring the Champy so you can taste them side by side?\u201d The compare play is the easiest second sale in the building.",
        ],
      },
      {
        heading: "Real Tables \u2014 the Scripts",
        intro:
          "The most common order isn\u2019t a question \u2014 it\u2019s a grape. The move is always the same: name BOTH pours, one descriptor each, price each, let them choose. Two options (three max), never the whole list.",
        points: [
          "\u201cI\u2019ll have a Pinot Noir.\u201d \u2192 \u201cWe pour two \u2014 the Presqu\u2019ile from Santa Barbara, juicy and smooth, seventeen; or the Occidental from the Sonoma Coast \u2014 Steve Kistler\u2019s project, silky and layered, thirty-five. Which sounds like tonight?\u201d",
          "\u201cA glass of Cabernet.\u201d \u2192 \u201cThree Napa pours \u2014 Routestock, smooth and classic, seventeen; Chappellet, mountain fruit, twenty-five; or Duckhorn, the velvet one, twenty-eight.\u201d",
          "\u201cChardonnay.\u201d \u2192 \u201cCrisp or rich? The De Forville is bright with no oak, sixteen \u2014 the Ramey is the classic California style, twenty-five. And there\u2019s a real white Burgundy in between at the same price.\u201d",
          "\u201cSauvignon Blanc.\u201d \u2192 \u201cTe Mata from New Zealand, zesty and bright, sixteen \u2014 or the Sancerre, the same grape in its French home, more mineral, twenty.\u201d",
          "\u201cPinot Grigio.\u201d \u2192 \u201cElena Walch from the Alps, sixteen \u2014 and if you ever want its more interesting cousin, the Ribolla Gialla is the same price.\u201d",
          "\u201cSomething red with my pasta.\u201d \u2192 \u201cThe Chianti \u2014 made for red sauce, sixteen \u2014 or the A Quo, a baby Super Tuscan, rounder, twenty.\u201d",
          "\u201cDo you have Prosecco?\u201d \u2192 \u201cBisol Jeio \u2014 proper dry Prosecco, twelve. And pink bubbles at fifteen if the table\u2019s celebrating.\u201d",
          "\u201cChampagne by the glass?\u201d \u2192 \u201cBillecart-Salmon ros\u00e9 \u2014 the house that defined ros\u00e9 Champagne \u2014 forty, and we pour six ounces.\u201d",
          "\u201cWhat\u2019s your best glass of wine?\u201d \u2192 \u201cDepends what you love \u2014 the reserve page pours Leflaive white Burgundy at fifty, a beautiful Barolo at forty-five, and a glass of Ch\u00e2teau Margaux\u2019s third wine at sixty-five.\u201d",
          "The pattern, always: both names \u00b7 one descriptor each \u00b7 both prices \u00b7 \u201cwhich sounds like tonight?\u201d Then stop talking.",
        ],
      },
      {
        heading: "Whites & Sparkling \u2014 Formula \u00b7 Sentence \u00b7 Pair \u00b7 For",
        intro:
          "Every wine reduces to four lines: grape \u00b7 place \u00b7 one flavor \u00b7 one feel. Then a pairing and a person. That is all you need.",
        points: [
          "Bisol \u2018Jeio\u2019 Prosecco ($12): Glera \u00b7 Veneto \u00b7 green apple \u00b7 light & frothy. PAIR arrival, fritto. FOR everyone \u2014 the welcome glass.",
          "Sommariva Brut Ros\u00e9 ($15): ros\u00e9 bubbles \u00b7 Veneto \u00b7 strawberry \u00b7 bone dry. PAIR antipasti. FOR the patio/pink-drink table; big budget \u2192 Billecart.",
          "De Forville Chardonnay ($16): Chardonnay \u00b7 Piedmont \u00b7 wildflowers & cream \u00b7 zero oak. PAIR the pesto, seafood pasta. FOR crisp-white drinkers; wins back the \u2018I don\u2019t like Chardonnay\u2019 guest.",
          "Ramey ($25): Chardonnay \u00b7 Russian River \u00b7 ripe apple & vanilla \u00b7 round and rich. PAIR the Alfredo, roast chicken. FOR the buttery-Chard guest \u2014 their yes. Next rung: Leflaive.",
          "Maison Champy Bourgogne Blanc ($25): Chardonnay \u00b7 Burgundy \u00b7 orchard blossom & chalk \u00b7 silky. PAIR veal in cream, shellfish. FOR the \u2018what do YOU like?\u2019 guest.",
          "Te Mata Sauvignon Blanc ($16): SB \u00b7 New Zealand \u00b7 grapefruit & lemon \u00b7 zippy. PAIR salads, goat cheese. FOR the SB-by-default guest.",
          "Bailly \u2018Terroirs\u2019 Sancerre ($20): SB \u00b7 Loire \u00b7 white peach & flint \u00b7 precise, dry. PAIR oysters, the gamberi. FOR the Te Mata drinker trading up.",
          "Elena Walch Pinot Grigio ($16): PG \u00b7 Alto Adige \u00b7 green apple & pear \u00b7 clean, light. PAIR anything light. FOR the PG guest \u2014 never talk them out of it.",
          "Ronchi di Cialla Ribolla Gialla ($16): Ribolla \u00b7 Friuli \u00b7 citrus & almond \u00b7 textured, fresh. PAIR antipasti, richer fish. FOR the curious \u2014 same price, zero-risk adventure.",
        ],
      },
      {
        heading: "Reds \u2014 Formula \u00b7 Sentence \u00b7 Pair \u00b7 For",
        points: [
          "Routestock ($17): Cabernet \u00b7 Napa \u00b7 blackberry & cedar \u00b7 smooth. PAIR steak, the grill. FOR the \u2018just a Cab\u2019 guest.",
          "Chappellet Mountain Cuv\u00e9e ($25): Cab blend \u00b7 Napa mountains \u00b7 black cherry & spice \u00b7 polished, fuller. PAIR the lamb. FOR the step-up.",
          "Duckhorn ($28): Cabernet \u00b7 Napa \u00b7 cassis & cocoa \u00b7 velvet, full. PAIR ribeye, short rib. FOR the brand-name Napa guest. Ladder: 17 \u2192 25 \u2192 28 \u2192 Margaux 65.",
          "Presqu\u2019ile ($17): Pinot \u00b7 Santa Barbara coast \u00b7 red berries \u00b7 juicy, soft. PAIR salmon, mushroom risotto. FOR the easy-red guest; whites crossing over.",
          "Occidental ($35): Pinot \u00b7 Sonoma Coast \u00b7 dark cherry & spice \u00b7 silky, layered. PAIR duck, mushrooms. FOR the Pinot obsessive \u2014 \u2018Steve Kistler\u2019s Pinot project.\u2019",
          "Villa Sant\u2019Anna Chianti ($16): Sangiovese \u00b7 Tuscany \u00b7 sour cherry & earth \u00b7 bright, food-first. PAIR anything with red sauce. FOR the classic Italian order.",
          "Montepeloso \u2018A Quo\u2019 ($20): Tuscan blend \u00b7 coastal Tuscany \u00b7 plum & spice \u00b7 smooth, medium-full. PAIR the veal, mushroom pasta. FOR the Chianti step-up.",
          "Tintero Barbaresco ($25): Nebbiolo \u00b7 Piedmont \u00b7 cherry, rose & truffle \u00b7 elegant, firm. PAIR braises, truffle anything. FOR the intrigued. Ladder: 16 \u2192 20 \u2192 25 \u2192 Cogno 45.",
        ],
      },
    ],
    quiz: [
      {
        id: "figaro-btg-1",
        question: "A guest asks why our glass of Billecart costs the same $40 as the Village Pub's. The accurate answer:",
        options: [
          "Ours is a reserve pour, theirs is not",
          "We pour six ounces \u2014 a full ounce more than their standard pour \u2014 and every pour in our building is six ounces",
          "Ours is a newer disgorgement",
          "We include the sparkling stopper service",
        ],
        answer: 1,
        explanation:
          "Same price, more wine \u2014 all our pours are 6 oz. That comparison is the story; tell it.",
      },
      {
        id: "figaro-btg-2",
        question: "An anniversary couple, budget unknown. Your FIRST offer:",
        options: [
          "The Sommariva Brut Ros\u00e9 at 15 \u2014 pink, festive, safe on price",
          "Ask their budget before suggesting anything",
          "The Billecart at 40 with the story \u2014 then gracefully offer the Sommariva if you feel hesitation",
          "A bottle from the Sparkling page",
        ],
        answer: 2,
        explanation:
          "Lead with the moment-marker; read the response. Opening with the cheap option decides FOR them \u2014 opening with a budget question is crass.",
      },
      {
        id: "figaro-btg-3",
        question: "A Pinot Grigio lover wants \u2018something more interesting.\u2019 Best move:",
        options: [
          "The Ribolla Gialla \u2014 same 16, more texture and depth",
          "The Sancerre \u2014 20, more mineral",
          "The De Forville \u2014 16, unoaked and bright",
          "The Ramey \u2014 25, a serious step up",
        ],
        answer: 0,
        explanation:
          "All four are defensible \u2014 but same-price-same-freshness Ribolla is the zero-risk adventure built for exactly this guest.",
      },
      {
        id: "figaro-btg-4",
        question: "Two guests are each finishing a second glass of Margaux (65) and clearly settling in. You:",
        options: [
          "Keep pouring by the glass \u2014 at 65 each, glasses out-earn the bottle",
          "Offer the bottle at 185 before the third glass \u2014 four glasses would run 260",
          "Suggest they try the Cogno for variety",
          "Mention the bottle price when you drop the check",
        ],
        answer: 1,
        explanation:
          "Do the math out loud before glass three. Guests never resent being saved money \u2014 and 185 now beats resentment later.",
      },
      {
        id: "figaro-btg-5",
        question: "Our corkage policy, exactly:",
        options: [
          "$30 per bottle, capped at two bottles",
          "$30, waived for wine club members",
          "$30 for the first bottle, $15 after",
          "$30, waived with each bottle purchased from our list",
        ],
        answer: 3,
        explanation:
          "The waiver is per bottle purchased \u2014 say it as generosity, and it converts BYO tables into list sales.",
      },
      {
        id: "figaro-btg-6",
        question: "\u2018I\u2019ll just have a Chardonnay.\u2019 The most useful first question:",
        options: [
          "\u201cCalifornia or French?\u201d",
          "\u201cDry or sweet?\u201d",
          "\u201cCrisp and bright, or rich and buttery?\u201d",
          "\u201cWould you like our most popular one?\u201d",
        ],
        answer: 2,
        explanation:
          "Geography doesn\u2019t map taste, and all our Chardonnays are dry \u2014 crisp-vs-rich is the question guests can actually answer.",
      },
      {
        id: "figaro-btg-7",
        question: "The right moment and line for the second glass:",
        options: [
          "Glass a third full: \u201canother Ramey \u2014 or the Champy so you can taste them side by side?\u201d",
          "Glass two-thirds full: get the reorder in early",
          "Glass empty: \u201ccan I get you another?\u201d",
          "Leave it \u2014 asking twice pressures the table",
        ],
        answer: 0,
        explanation:
          "Too early interrupts, empty is too late. A third full \u2014 and the compare option turns a refill into a tasting.",
      },
      {
        id: "figaro-btg-8",
        question: "The least expensive way for a guest to drink off the reserve page:",
        options: [
          "The Bisol Prosecco, 12",
          "The Cogno Barolo, 45",
          "The Chave Offerus, 30",
          "The Billecart, 40",
        ],
        answer: 2,
        explanation:
          "Bisol is the cheapest glass in the building \u2014 but it lives on the everyday card. The reserve door is the Offerus at 30.",
      },
      {
        id: "figaro-btg-9",
        question: "Why is the Leflaive M\u00e2con-Verz\u00e9 a deal at 50, said accurately:",
        options: [
          "It is itself a grand cru from Puligny-Montrachet",
          "Leflaive is Burgundy\u2019s oldest wine house",
          "It is our only biodynamic wine",
          "It\u2019s the village-M\u00e2con wine of an estate whose Puligny grands crus sell for thousands \u2014 same farming, same cellar",
        ],
        answer: 3,
        explanation:
          "Careful: it is NOT a grand cru (it\u2019s a village wine \u2014 that\u2019s the point), and \u2018oldest house\u2019 is Champy\u2019s claim. Pedigree at a human price is the true story.",
      },
      {
        id: "figaro-btg-10",
        question: "The Napa Cabernet ladder, low to high:",
        options: [
          "Routestock 17 \u2192 Duckhorn 25 \u2192 Chappellet 28 \u2192 Margaux 65",
          "Routestock 17 \u2192 Chappellet 25 \u2192 Duckhorn 28 \u2192 Margaux 65",
          "Chappellet 17 \u2192 Routestock 25 \u2192 Duckhorn 28 \u2192 Margaux 65",
          "Routestock 17 \u2192 Chappellet 25 \u2192 Occidental 35 \u2192 Margaux 65",
        ],
        answer: 1,
        explanation:
          "Routestock, Chappellet, Duckhorn, then the reserve Margaux \u2014 and Occidental is a Pinot, not a rung on this ladder.",
      },
      {
        id: "figaro-btg-11",
        question: "The four-line formula for the Tintero Barbaresco:",
        options: [
          "Nebbiolo \u00b7 Piedmont \u00b7 cherry, rose & truffle \u00b7 elegant with a firm finish",
          "Sangiovese \u00b7 Piedmont \u00b7 cherry & leather \u00b7 bright and food-first",
          "Nebbiolo \u00b7 Tuscany \u00b7 plum & spice \u00b7 smooth and round",
          "Barbera \u00b7 Piedmont \u00b7 dark fruit & cocoa \u00b7 velvet, full",
        ],
        answer: 0,
        explanation:
          "Nebbiolo from Piedmont \u2014 Sangiovese is Chianti\u2019s grape and Tuscany is the wrong region. The formula has to be exact to be useful.",
      },
      {
        id: "figaro-btg-12",
        question: "A guest mentions they love Kistler Chardonnay but is drinking red tonight. Your pour:",
        options: [
          "The Presqu\u2019ile \u2014 our smoothest Pinot",
          "The Duckhorn \u2014 the famous California name",
          "The Cogno \u2014 our most serious red pour",
          "The Occidental \u2014 \u201cthis is Steve Kistler\u2019s Pinot Noir project\u201d",
        ],
        answer: 3,
        explanation:
          "The name they already love IS the sell. Occidental is Kistler\u2019s own Pinot estate \u2014 one sentence, done.",
      },
      {
        id: "figaro-btg-13",
        question: "Presqu\u2019ile is pronounced:",
        options: [
          "press-KWILE",
          "press-KEEL",
          "PRES-kwe-lay",
          "press-KWEEL",
        ],
        answer: 1,
        explanation: "press-KEEL. Saying it wrong at the table costs more confidence than not knowing a tasting note.",
      },
      {
        id: "figaro-btg-14",
        question: "\u2018What\u2019s good here?\u2019 The professional answer:",
        options: [
          "\u201cHonestly, everything \u2014 you can\u2019t go wrong\u201d",
          "Hand them the reserve page \u2014 it\u2019s our best wine",
          "One white and one red you actually tasted this week, one concrete sentence each",
          "\u201cWhat do you usually drink at home?\u201d",
        ],
        answer: 2,
        explanation:
          "\u2018Everything\u2019 says nothing, and leading with the priciest page reads as a sell. (The at-home question is a fine follow-up \u2014 but give them something first.)",
      },
      {
        id: "figaro-btg-15",
        question: "Which of these reserve-pour sequences breaks our price rule?",
        options: [
          "\u201cThe Margaux is sixty-five a glass \u2014 shall I bring it?\u201d \u2192 pour",
          "Guest points at the printed reserve page \u2192 you confirm the wine \u2192 pour",
          "\u201cYou have to try the Margaux\u201d \u2192 pour \u2192 price appears on the check",
          "\u201cI\u2019ll bring the Offerus \u2014 thirty \u2014 it\u2019s perfect with the pepper\u201d \u2192 pour",
        ],
        answer: 2,
        explanation:
          "Seen-or-said before poured \u2014 pointing at the printed price counts. Learning $65 from the check never does.",
      },
      {
        id: "figaro-btg-16",
        question: "A guest says their glass smells musty, like wet cardboard. You:",
        options: [
          "Explain that\u2019s minerality \u2014 a sign of serious wine",
          "Bring them a fresh glass poured from the same bottle",
          "Offer to move them to a different wine at the same price",
          "Apologize, replace the pour immediately, and tell a manager \u2014 the bottle is corked",
        ],
        answer: 3,
        explanation:
          "Cork taint lives in the BOTTLE \u2014 a fresh glass from it is the same flaw. Replace, report, never debate.",
      },
      {
        id: "figaro-btg-17",
        question: "A guest insists they want a \u2018really dry\u2019 white. What are they most likely actually asking for?",
        options: [
          "Low alcohol",
          "Crisp and unoaked \u2014 nearly all our whites are technically dry, so ask crisp-vs-rich",
          "High acidity specifically",
          "A wine with firm tannin",
        ],
        answer: 1,
        explanation:
          "Dry technically means not-sweet \u2014 which describes almost our whole list. Guests who say \u2018dry\u2019 usually mean crisp; the follow-up question finds out.",
      },
      {
        id: "figaro-btg-18",
        question: "Two desserts just landed at a four-top that finished their wine. Best offer:",
        options: [
          "Espresso for the table",
          "Another round of the reds they were drinking",
          "The Moscato d\u2019Asti half bottle \u2014 \u201cthirty-two, gently sparkling, made for dessert\u201d",
          "A reserve pour as a nightcap",
        ],
        answer: 2,
        explanation:
          "Big reds fight dessert and espresso ends the spending. Sweet, sparkling, shareable \u2014 the Moscato half is built for this exact table.",
      },
    ]
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
  {
    id: "figaro-somm-method",
    order: 13,
    section: "Coaching",
    title: "The Sommelier\u2019s Method \u2014 Coaching the Floor",
    summary:
      "Manager playbook: how to run pre-shift tastings, drills, and guest-reading so the wine program lives on the floor.",
    minutes: 8,
    requiredFor: ["Manager"],
    location: "Cafe Figaro",
    hiddenUnlessRequired: true,
    lessons: [
      {
        heading: "The System in Five Parts",
        intro:
          "Master sommeliers build floors with a system, not a syllabus. Yours to run:",
        points: [
          "Taste in small doses \u2014 wine of the day at every pre-shift: one ounce, ninety seconds, one wine.",
          "The four-line formula \u2014 grape \u00b7 place \u00b7 one flavor \u00b7 one feel \u2014 is the complete floor vocabulary. Hold servers to it; nothing more is required.",
          "Say it out loud \u2014 knowledge isn\u2019t knowledge until spoken. Drill it (below).",
          "Read the guest, then pour \u2014 teach the four guest types (below).",
          "Honesty is the brand \u2014 celebrate \u2018let me find out\u2019 publicly; kill fake tasting notes on sight. And coach: recommend ONE wine, not three.",
        ],
      },
      {
        heading: "Running Pre-Shift",
        points: [
          "WINE OF THE DAY (90 seconds): pour one ounce for everyone \u2192 look, smell, taste \u2192 each person says ONE word out loud \u2192 you read the wine\u2019s Sentence from the module \u2192 done. No wrong words \u2014 the word is theirs forever.",
          "ROLE-PLAY DRILL (60 seconds, pairs): one plays the guest \u2014 \u2018what\u2019s good?\u2019, \u2018I\u2019ll have a Pinot Noir\u2019, \u2018we\u2019re celebrating\u2019, \u2018something like a Caymus\u2019 \u2014 the other answers in two sentences or fewer, price included. Swap. Awkward week one, automatic week two.",
          "NEW LIST ROLLOUT: three kickoff pre-shifts \u2014 whites, reds, reserve \u2014 then the daily cadence covers the whole card in about a month, then repeat.",
          "The quiz is a coaching tool, not a gate \u2014 retakes are unlimited, scores are conversation starters.",
        ],
      },
      {
        heading: "The Four Guest Types",
        points: [
          "SAFETY SEEKER \u2014 wants the familiar. Coach servers to give the classic (Walch, Ramey, Duckhorn) and never challenge. Comfort is hospitality.",
          "CURIOUS \u2014 wants a nudge. Same-price swaps: Ribolla for Pinot Grigio, Offerus for \u2018surprise me.\u2019 Zero-risk adventure.",
          "CELEBRATOR \u2014 wants the moment marked. Billecart, six ounces, no hesitation.",
          "COLLECTOR \u2014 wants to talk. Servers should engage, mention the reserve page and the awards, and hand off to Will when it goes deep \u2014 frame the handoff as a compliment, never a failure.",
        ],
      },
      {
        heading: "Coaching with the Dashboard",
        points: [
          "The admin view shows per-module score chips per employee \u2014 best %, attempts, and untouched modules at a glance.",
          "Amber chips (attempted, not passed) are your coaching list \u2014 ask what tripped them up at pre-shift, then have them retake.",
          "Celebrate passes out loud. Public wins make the next person study.",
          "When the glass list changes, the module regenerates and completions reset by design \u2014 send the team message again and re-run the three kickoff pre-shifts.",
        ],
      },
    ],
    quiz: [
      {
        id: "somm-method-1",
        question: "Wine-of-the-day exists because:",
        options: [
          "Tasting one wine you then say something about beats reading about ten \u2014 small doses, spoken aloud, compound",
          "Staff should taste expensive wine as a perk",
          "It uses up open Coravin bottles efficiently",
          "It replaces the need for the training modules",
        ],
        answer: 0,
        explanation:
          "The ritual is memory engineering, not perks or inventory management \u2014 and it reinforces the modules, not replaces them.",
      },
      {
        id: "somm-method-2",
        question: "A server describes a wine as \u2018notes of morello cherry, garrigue, and cigar box.\u2019 Your coaching:",
        options: [
          "Praise it \u2014 that\u2019s sommelier-level vocabulary",
          "Pull them back to the four-line formula \u2014 grape, place, one flavor, one feel \u2014 memorized poetry breaks under one guest question",
          "Have them teach the vocabulary at pre-shift",
          "Correct the descriptors for accuracy",
        ],
        answer: 1,
        explanation:
          "Recited complexity collapses when a guest asks a follow-up. The formula survives contact with real tables.",
      },
      {
        id: "somm-method-3",
        question: "The role-play drill that actually works:",
        options: [
          "You quiz servers in front of the group for accountability",
          "Servers study cards silently, then self-report",
          "Pairs, sixty seconds, guest-and-server, answers in two sentences or fewer with the price included",
          "New hires shadow your tables for a week instead",
        ],
        answer: 2,
        explanation:
          "Public quizzing breeds fear and shadowing breeds silence \u2014 short spoken reps in pairs build the muscle.",
      },
      {
        id: "somm-method-4",
        question: "A regular is deep in the reserve page telling Burgundy stories. The behavior you coach:",
        options: [
          "Serve efficiently and let them enjoy their evening",
          "Have the server share their own wine opinions to bond",
          "Engage, mention the awards, and hand off to Will when it goes deep \u2014 framed as a compliment",
          "Send over a taste on the house",
        ],
        answer: 2,
        explanation:
          "The Collector\u2019s product IS the conversation. The handoff isn\u2019t failure \u2014 it\u2019s the house paying attention.",
      },
      {
        id: "somm-method-5",
        question: "An employee has attempted the wine quiz twice, scoring 70% both times. You:",
        options: [
          "Let them keep retaking until it clicks \u2014 that\u2019s what unlimited retakes are for",
          "Ask what tripped them up, coach that gap at pre-shift, then have them retake",
          "Lower the pass bar \u2014 the quiz may be too hard",
          "Move them off wine service until they pass",
        ],
        answer: 1,
        explanation:
          "Repeated identical failure means a specific gap \u2014 unlimited retakes without coaching just grooves the mistake.",
      },
      {
        id: "somm-method-6",
        question: "At pre-shift, a server admits they told a guest \u2018let me find out\u2019 about a vintage question. You:",
        options: [
          "Note they need to study vintages",
          "Roll the question into the next quiz",
          "Remind everyone to review before shift",
          "Praise it publicly \u2014 honesty plus the follow-up is the brand; make it safe to not know",
        ],
        answer: 3,
        explanation:
          "Punish honesty once and the floor starts faking answers \u2014 celebrate it and everyone learns it\u2019s safe.",
      },
    ]
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
  return MODULES.filter(
    (m) =>
      atLocation(m, location) &&
      !m.requiredFor.includes(role) &&
      !m.hiddenUnlessRequired,
  );
}
