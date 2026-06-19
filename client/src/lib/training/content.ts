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

export type Lesson = {
  heading: string;
  /** Short intro line, optional. */
  intro?: string;
  /** Bullet points — the teachable standards. */
  points: string[];
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
          "Slow night: 'If there is time to lean, there is time to clean' — polish glasses, restock, check restrooms every 20 minutes.",
          "Side work may not begin before 8:30 PM unless approved by the shift lead.",
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
    ],
  },
  {
    id: "figaro-wine",
    order: 11,
    section: "Bar Reference",
    title: "Café Figaro: Wine by the Glass",
    summary: "Figaro's by-the-glass list — what to pour for whom, and how to guide an upsell.",
    minutes: 10,
    requiredFor: BEVERAGE_TEAM,
    location: "Cafe Figaro",
    lessons: [
      {
        heading: "The Service Philosophy",
        intro:
          "When a guest asks about wine, they're not asking for a fact — they're asking for help.",
        points: [
          "Listen first — ask one clarifying question before recommending.",
          "Educate without lecturing — give one memorable detail, not a Wikipedia entry.",
          "Present, don't prescribe — offer two options, give a recommendation, let the guest choose.",
          "The upsell is an act of generosity — guiding a guest to a better wine gives them a better experience.",
        ],
      },
      {
        heading: "Whites & Sparkling",
        points: [
          "Bisol 'Jeio' Prosecco ($12) — crisp apple & pear bubbles; the approachable welcome glass.",
          "Mas de Daumas Gassac Brut Rosé ($15) — strawberry, brioche, more structured; the step-up sparkler.",
          "De Forville Chardonnay, Piedmont ($16) — UNoaked, light, floral; win back the 'I don't like Chardonnay' guest.",
          "Hartford Court Chardonnay ($18, from magnum) — ripe, buttery, oaked; for the full California lover.",
          "Te Mata Sauvignon Blanc, NZ ($16) — zesty citrus; the Sancerre ($20) is also Sauvignon Blanc, more mineral and refined.",
          "Elena Walch Pinot Grigio ($16) & Ronchi di Cialla Ribolla Gialla ($16) — same price; Ribolla is a rare indigenous Italian grape worth suggesting.",
        ],
      },
      {
        heading: "Reds",
        points: [
          "Big Reds: Routestock Napa Cab ($17, entry) → Chappellet Mountain Cuvée ($25, concentrated mountain fruit) → Château Margaux 'Margaux du Margaux' ($65), the second wine of a Bordeaux First Growth.",
          "Pinot Noir: Faila, Oregon ($17, silky & easy) → Occidental, Sonoma Coast ($35), benchmark California Pinot by Steve Kistler.",
          "Italian Red: Frescobaldi 'Nipozzano' Chianti Rufina Riserva ($16) → Le Macchiole Super Tuscan, Bolgheri ($23) → Oddero 'Convento' Barolo ($25), the 'King of Italian Wine'.",
        ],
      },
      {
        heading: "Guiding the Upsell",
        points: [
          "Never default to the cheapest — when a guest says 'a Chardonnay,' ask: 'lighter and crisp, or fuller with a bit of oak?'",
          "Sancerre sells itself — 'same grape, but a completely different, more special experience.'",
          "'I would' is your most powerful phrase — confide a recommendation, don't pitch.",
          "Same-price suggestions like the Ribolla Gialla are pure generosity — an experience guests can't get elsewhere.",
        ],
      },
    ],
    quiz: [
      {
        id: "figaro-wine-1",
        question:
          "A guest says they don't like Chardonnay because it's too oaky/buttery. Pour the:",
        options: [
          "Hartford Court (ripe, buttery, oaked)",
          "De Forville Piedmont (unoaked, light, floral)",
          "Routestock Cabernet",
          "Bisol Prosecco",
        ],
        answer: 1,
        explanation:
          "The unoaked De Forville wins those guests back — light and floral with bright acidity.",
      },
      {
        id: "figaro-wine-2",
        question: "Sancerre is made from which grape?",
        options: ["Pinot Grigio", "Chardonnay", "Sauvignon Blanc", "Nebbiolo"],
        answer: 2,
        explanation:
          "Sancerre is Sauvignon Blanc from the Loire Valley — most guests don't realize it.",
      },
      {
        id: "figaro-wine-3",
        question: "Which red is known as 'the King of Italian Wine'?",
        options: [
          "Chianti Rufina Riserva",
          "Super Tuscan",
          "Oddero 'Convento' Barolo",
          "Routestock Cabernet",
        ],
        answer: 2,
        explanation:
          "Barolo (Nebbiolo, Piedmont) — our Oddero 'Convento' is an accessibly priced example.",
      },
      {
        id: "figaro-wine-4",
        question: "A guest just says 'give me a Chardonnay.' The best move is to:",
        options: [
          "Pour the cheapest one by default",
          "Pour the most expensive one",
          "Ask whether they prefer lighter and crisp, or fuller with oak",
          "Tell them all three taste the same",
        ],
        answer: 2,
        explanation:
          "One question matches them perfectly and naturally guides toward the right wine — a service move, not a sales move.",
      },
      {
        id: "figaro-wine-5",
        question: "The Château Margaux 'Margaux du Margaux' on our list is:",
        options: [
          "A California Cabernet",
          "The second wine of a Bordeaux First Growth estate",
          "A sweet dessert wine",
          "An Italian Barolo",
        ],
        answer: 1,
        explanation:
          "It's the second wine of Château Margaux — one of only five Bordeaux First Growths. Know that story cold.",
      },
      {
        id: "figaro-wine-6",
        question: "A guest is having fish and wants a white. A great pick is:",
        options: [
          "Hartford Court oaked Chardonnay",
          "Sancerre or the NZ Sauvignon Blanc",
          "Routestock Cabernet",
          "Oddero Barolo",
        ],
        answer: 1,
        explanation:
          "Citrus-bright Sauvignon Blanc (Sancerre or Te Mata) is beautiful with seafood.",
      },
    ],
  },
  {
    id: "figaro-cocktails",
    order: 12,
    section: "Bar Reference",
    title: "Café Figaro: Cocktails",
    summary: "Figaro's cocktail list — ingredients and how to describe each. All $16.",
    minutes: 6,
    requiredFor: BEVERAGE_TEAM,
    location: "Cafe Figaro",
    lessons: [
      {
        heading: "The Cocktail List ($16 each)",
        points: [
          "Aperol Spritz — Aperol, Prosecco, soda water, orange peel.",
          "Old Fashioned — Uncle Nearest Bourbon, sugar, bitters, orange twist.",
          "Elderflower Gin & Tonic — Botanist Gin, elderflower tonic, orange.",
          "Pomegranate Limoncello Martini — Tito's vodka, pomegranate, lemon juice, limoncello.",
          "Hibiscus Mule — Noble Oak Bourbon, Q Hibiscus Ginger Beer, lemon.",
          "Figaro Manhattan — Sazerac Rye, Antica vermouth, bitters, Luxardo cherry.",
          "Broadway Boulevardier — Highland Park 12yr, Campari, Antica vermouth.",
        ],
      },
      {
        heading: "How to Sell Them",
        points: [
          "Aperol Spritz & Elderflower G&T — light, refreshing aperitivo options for early or warm evenings.",
          "Old Fashioned & Figaro Manhattan — the classics for whiskey drinkers; the Manhattan is rye-forward and stirred.",
          "Broadway Boulevardier — a whiskey lover's Negroni (Campari + vermouth); recommend to Negroni fans.",
          "Pomegranate Limoncello Martini & Hibiscus Mule — bright, fruit-forward house signatures for guests who want something different.",
        ],
      },
    ],
    quiz: [
      {
        id: "figaro-cocktails-1",
        question: "What is the base spirit of the Figaro Manhattan?",
        options: [
          "Uncle Nearest Bourbon",
          "Sazerac Rye whiskey",
          "Botanist Gin",
          "Tito's vodka",
        ],
        answer: 1,
        explanation: "Sazerac Rye, with Antica vermouth, bitters, and a Luxardo cherry.",
      },
      {
        id: "figaro-cocktails-2",
        question: "Which cocktail is built with Botanist Gin?",
        options: [
          "Aperol Spritz",
          "Elderflower Gin & Tonic",
          "Hibiscus Mule",
          "Broadway Boulevardier",
        ],
        answer: 1,
        explanation: "The Elderflower Gin & Tonic — Botanist Gin, elderflower tonic, orange.",
      },
      {
        id: "figaro-cocktails-3",
        question: "The Broadway Boulevardier is made with:",
        options: [
          "Vodka, pomegranate, limoncello",
          "Highland Park 12, Campari, Antica vermouth",
          "Bourbon, ginger beer, lemon",
          "Aperol, Prosecco, soda",
        ],
        answer: 1,
        explanation:
          "It's a whiskey lover's Negroni — Highland Park 12, Campari, and Antica vermouth.",
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
        question: "A Negroni fan asks for a recommendation. Steer them to the:",
        options: [
          "Aperol Spritz",
          "Pomegranate Limoncello Martini",
          "Broadway Boulevardier",
          "Hibiscus Mule",
        ],
        answer: 2,
        explanation:
          "The Boulevardier is a whiskey-based Negroni (Campari + vermouth) — a natural fit for Negroni lovers.",
      },
    ],
  },
];

export const TOTAL_MODULES = MODULES.length;
export const TOTAL_QUESTIONS = MODULES.reduce((n, m) => n + m.quiz.length, 0);

/** Pass threshold for a module quiz (percentage of correct answers). */
export const PASS_THRESHOLD = 0.8;

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
