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
  /** Per-module quiz draw size; falls back to the global QUIZ_DRAW. */
  quizDraw?: number;
  /**
   * Onboarding phase — drives each new hire's plan and due dates:
   * 1 = before your first shift · 2 = your first week · 3 = week two.
   */
  phase: 1 | 2 | 3;
  lessons: Lesson[];
  quiz: QuizQuestion[];
};

/**
 * California compliance certifications tracked per employee. Validity here
 * mirrors the server (api/training.ts CERT_VALID_YEARS) — keep in sync.
 */
export type CertType = {
  id: string;
  label: string;
  short: string;
  validYears: number;
  /** Roles this certification applies to; others show as n/a. */
  appliesTo: Role[];
  note: string;
};

export const CERT_TYPES: CertType[] = [
  {
    id: "rbs",
    label: "RBS — Responsible Beverage Service",
    short: "RBS",
    validYears: 3,
    appliesTo: ["Server", "Bartender", "Manager"],
    note: "CA ABC requires certification within 60 days for anyone serving alcohol.",
  },
  {
    id: "food-handler",
    label: "Food Handler Card",
    short: "Food Handler",
    validYears: 3,
    appliesTo: [...ROLES],
    note: "Required within 30 days of hire in California.",
  },
  {
    id: "harassment",
    label: "Harassment Prevention Training",
    short: "Harassment Prev.",
    validYears: 2,
    appliesTo: [...ROLES],
    note: "CA requires 1hr (2hr for supervisors) within 6 months of hire, renewed every 2 years.",
  },
];

/** Days from hire (first sign-in) each phase is due. */
export const PHASE_DUE_DAYS: Record<1 | 2 | 3, number> = { 1: 3, 2: 7, 3: 14 };

export const PHASE_TITLES: Record<1 | 2 | 3, string> = {
  1: "Before your first shift",
  2: "Your first week",
  3: "Week two — know what we sell",
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
    phase: 1,
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
    phase: 1,
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
    id: "figaro-appearance",
    order: 16,
    phase: 1,
    section: "Who We Are",
    title: "Café Figaro: Dress Code & Uniform",
    summary:
      "The Figaro floor runs a step more formal — the shirt-and-tie floor uniform for Servers, Bartenders and Bussers/Runners, business professional for Hosts and Managers (a blazer for managers), and the grooming behind all of it.",
    minutes: 5,
    requiredFor: EVERYONE,
    location: "Cafe Figaro",
    lessons: [
      {
        heading: "The Floor Uniform — Servers, Bartenders & Bussers/Runners",
        intro:
          "Café Figaro runs a step more formal than the group standard. Servers, bartenders, and bussers/runners all wear the same uniform — and the tie is not optional, every shift.",
        points: [
          "Non-slip shoes — closed-toe, black. Safety first, and they finish the look.",
          "A pressed dress shirt — clean, buttoned, no wrinkles.",
          "Slacks — tailored and pressed. No jeans, no chinos, no shorts.",
          "A tie, always. It is part of the uniform, not an accessory — no tie, not on the floor.",
          "There are no casual days here — the same head to toe whether you're serving, behind the bar, or running food.",
        ],
      },
      {
        heading: "The Host Stand — Business Professional",
        intro:
          "The host is the first face a guest sees and the last goodbye — dressed to match. Business professional, not the Server floor uniform.",
        points: [
          "Business professional — think polished office or a nice interview. Formal dress wear, always.",
          "Absolutely no t-shirts. Nothing casual — no jeans, no sneakers, no athleisure, no shorts.",
          "A blazer, blouse, button-down, tailored dress, or slacks — clean, pressed, and put-together.",
          "Closed-toe, polished shoes — kept comfortable, because you are on your feet all night.",
          "When in doubt, dress up, not down. You set the tone the moment a guest walks in.",
        ],
      },
      {
        heading: "Managers — Business Professional, Plus a Blazer",
        intro:
          "Managers set the bar for the whole floor — dressed a notch above, so the team has a standard to reach.",
        points: [
          "Business professional with a blazer — the blazer is the manager's standard, on the floor every shift.",
          "A pressed shirt or blouse, slacks or a tailored dress underneath; polished, closed-toe shoes.",
          "No t-shirts, no casual wear — guests read the manager first, and the team dresses to match.",
        ],
      },
      {
        heading: "Grooming & the Rest",
        intro: "The group appearance standards apply to everyone on the Figaro floor.",
        points: [
          "Pressed and polished head to toe — give yourself a mirror check before you clock in.",
          "Hair neat and tied back if longer than collar length; clean, trimmed nails.",
          "No heavy cologne or perfume; name tag visible at all times.",
          "Phones on silent and out of sight during service.",
          "Arrive dressed and ready — never clock in and then finish getting dressed.",
        ],
      },
    ],
    quiz: [
      {
        id: "figaro-appearance-1",
        question:
          "What does the Café Figaro floor uniform require that the general dress code does not?",
        options: ["An apron", "A tie", "A vest", "A pocket square"],
        answer: 1,
        explanation:
          "The Figaro floor is more formal — a tie is part of the uniform every shift, not optional.",
      },
      {
        id: "figaro-appearance-2",
        question: "The correct footwear on the Café Figaro floor is:",
        options: [
          "White sneakers",
          "Leather-soled dress loafers",
          "Closed-toe, non-slip black shoes",
          "Sandals when it's warm",
        ],
        answer: 2,
        explanation: "Closed-toe, non-slip, black — safety first, and they finish the look.",
      },
      {
        id: "figaro-appearance-3",
        question:
          "Someone on the floor shows up in a pressed dress shirt and slacks but forgot a tie. The right outcome:",
        options: [
          "Work the shift and bring one tomorrow",
          "Not on the floor without a tie — get one before service",
          "A tie is optional in summer",
          "Borrow one from a guest",
        ],
        answer: 1,
        explanation: "No tie, not on the floor — it is part of the uniform, not an accessory.",
      },
      {
        id: "figaro-appearance-4",
        question: "Which outfit meets the Café Figaro floor dress code?",
        options: [
          "A clean polo and dark chinos",
          "Dark jeans and a dress shirt",
          "Pressed dress shirt, slacks, tie, and non-slip shoes",
          "Shorts and a dress shirt on hot days",
        ],
        answer: 2,
        explanation:
          "Pressed dress shirt, slacks, a tie, and closed-toe non-slip shoes — clean and pressed, every shift.",
      },
      {
        id: "figaro-appearance-8",
        question: "Who wears the dress shirt, slacks, and tie floor uniform at Café Figaro?",
        options: [
          "Servers only",
          "Servers, bartenders, and bussers/runners",
          "Only Servers and Managers",
          "Everyone except the bartenders",
        ],
        answer: 1,
        explanation:
          "Servers, bartenders, and bussers/runners all wear the same floor uniform. Hosts are business professional; managers add a blazer.",
      },
      {
        id: "figaro-appearance-9",
        question: "What does the Café Figaro manager's dress standard add over business professional?",
        options: [
          "A tie, like the floor team",
          "A blazer",
          "An apron",
          "Nothing — it's identical to the hosts",
        ],
        answer: 1,
        explanation:
          "Managers wear business professional with a blazer — dressed a notch above, setting the standard the floor reaches for.",
      },
      {
        id: "figaro-appearance-5",
        question: "When should you be dressed and ready for the floor?",
        options: [
          "Right after you clock in",
          "By the time the first guests arrive",
          "Before you clock in, ready to work",
          "Whenever a manager is checking",
        ],
        answer: 2,
        explanation: "Arrive already dressed and ready — never clock in and then finish dressing.",
      },
      {
        id: "figaro-appearance-6",
        question: "The dress standard for a Café Figaro host is:",
        options: [
          "The same dress shirt and tie as the Servers",
          "Business professional — formal dress wear, no t-shirts",
          "Casual, as long as it's clean and neat",
          "Anything, as long as it's black",
        ],
        answer: 1,
        explanation:
          "Hosts wear business professional — formal, polished, no t-shirts. You are the first and last impression of the room.",
      },
      {
        id: "figaro-appearance-7",
        question: "A host arrives in a clean t-shirt and dark jeans. This is:",
        options: [
          "Fine — it's clean and neat",
          "Fine for a slow night",
          "Not acceptable — the host stand is business professional, no t-shirts or casual wear",
          "Fine as long as a blazer goes over it",
        ],
        answer: 2,
        explanation:
          "No t-shirts and nothing casual at the host stand — business professional, every shift.",
      },
    ],
  },
  {
    id: "andiamo-appearance",
    order: 17,
    phase: 1,
    section: "Who We Are",
    title: "Andiamo: Dress Code & Uniform",
    summary:
      "The Andiamo floor runs a step more formal — the shirt-and-tie floor uniform for Servers, Bartenders and Bussers/Runners, business professional for Hosts and Managers (a blazer for managers), and the grooming behind all of it.",
    minutes: 5,
    requiredFor: EVERYONE,
    location: "Andiamo",
    lessons: [
      {
        heading: "The Floor Uniform — Servers, Bartenders & Bussers/Runners",
        intro:
          "Andiamo runs a step more formal than the group standard. Servers, bartenders, and bussers/runners all wear the same uniform — and the tie is not optional, every shift.",
        points: [
          "Non-slip shoes — closed-toe, black. Safety first, and they finish the look.",
          "A pressed dress shirt — clean, buttoned, no wrinkles.",
          "Slacks — tailored and pressed. No jeans, no chinos, no shorts.",
          "A tie, always. It is part of the uniform, not an accessory — no tie, not on the floor.",
          "There are no casual days here — the same head to toe whether you're serving, behind the bar, or running food.",
        ],
      },
      {
        heading: "The Host Stand — Business Professional",
        intro:
          "The host is the first face a guest sees and the last goodbye — dressed to match. Business professional, not the Server floor uniform.",
        points: [
          "Business professional — think polished office or a nice interview. Formal dress wear, always.",
          "Absolutely no t-shirts. Nothing casual — no jeans, no sneakers, no athleisure, no shorts.",
          "A blazer, blouse, button-down, tailored dress, or slacks — clean, pressed, and put-together.",
          "Closed-toe, polished shoes — kept comfortable, because you are on your feet all night.",
          "When in doubt, dress up, not down. You set the tone the moment a guest walks in.",
        ],
      },
      {
        heading: "Managers — Business Professional, Plus a Blazer",
        intro:
          "Managers set the bar for the whole floor — dressed a notch above, so the team has a standard to reach.",
        points: [
          "Business professional with a blazer — the blazer is the manager's standard, on the floor every shift.",
          "A pressed shirt or blouse, slacks or a tailored dress underneath; polished, closed-toe shoes.",
          "No t-shirts, no casual wear — guests read the manager first, and the team dresses to match.",
        ],
      },
      {
        heading: "Grooming & the Rest",
        intro: "The group appearance standards apply to everyone on the Andiamo floor.",
        points: [
          "Pressed and polished head to toe — give yourself a mirror check before you clock in.",
          "Hair neat and tied back if longer than collar length; clean, trimmed nails.",
          "No heavy cologne or perfume; name tag visible at all times.",
          "Phones on silent and out of sight during service.",
          "Arrive dressed and ready — never clock in and then finish getting dressed.",
        ],
      },
    ],
    quiz: [
      {
        id: "andiamo-appearance-1",
        question:
          "What does the Andiamo floor uniform require that the general dress code does not?",
        options: ["An apron", "A tie", "A vest", "A pocket square"],
        answer: 1,
        explanation:
          "The Andiamo floor is more formal — a tie is part of the uniform every shift, not optional.",
      },
      {
        id: "andiamo-appearance-2",
        question: "The correct footwear on the Andiamo floor is:",
        options: [
          "White sneakers",
          "Leather-soled dress loafers",
          "Closed-toe, non-slip black shoes",
          "Sandals when it's warm",
        ],
        answer: 2,
        explanation: "Closed-toe, non-slip, black — safety first, and they finish the look.",
      },
      {
        id: "andiamo-appearance-3",
        question:
          "Someone on the floor shows up in a pressed dress shirt and slacks but forgot a tie. The right outcome:",
        options: [
          "Work the shift and bring one tomorrow",
          "Not on the floor without a tie — get one before service",
          "A tie is optional in summer",
          "Borrow one from a guest",
        ],
        answer: 1,
        explanation: "No tie, not on the floor — it is part of the uniform, not an accessory.",
      },
      {
        id: "andiamo-appearance-4",
        question: "Which outfit meets the Andiamo floor dress code?",
        options: [
          "A clean polo and dark chinos",
          "Dark jeans and a dress shirt",
          "Pressed dress shirt, slacks, tie, and non-slip shoes",
          "Shorts and a dress shirt on hot days",
        ],
        answer: 2,
        explanation:
          "Pressed dress shirt, slacks, a tie, and closed-toe non-slip shoes — clean and pressed, every shift.",
      },
      {
        id: "andiamo-appearance-5",
        question: "Who wears the dress shirt, slacks, and tie floor uniform at Andiamo?",
        options: [
          "Servers only",
          "Servers, bartenders, and bussers/runners",
          "Only Servers and Managers",
          "Everyone except the bartenders",
        ],
        answer: 1,
        explanation:
          "Servers, bartenders, and bussers/runners all wear the same floor uniform. Hosts are business professional; managers add a blazer.",
      },
      {
        id: "andiamo-appearance-6",
        question: "The dress standard for an Andiamo host is:",
        options: [
          "The same dress shirt and tie as the Servers",
          "Business professional — formal dress wear, no t-shirts",
          "Casual, as long as it's clean and neat",
          "Anything, as long as it's black",
        ],
        answer: 1,
        explanation:
          "Hosts wear business professional — formal, polished, no t-shirts. You are the first and last impression of the room.",
      },
      {
        id: "andiamo-appearance-7",
        question: "A host arrives in a clean t-shirt and dark jeans. This is:",
        options: [
          "Fine — it's clean and neat",
          "Fine for a slow night",
          "Not acceptable — the host stand is business professional, no t-shirts or casual wear",
          "Fine as long as a blazer goes over it",
        ],
        answer: 2,
        explanation:
          "No t-shirts and nothing casual at the host stand — business professional, every shift.",
      },
      {
        id: "andiamo-appearance-8",
        question: "What does the Andiamo manager's dress standard add over business professional?",
        options: [
          "A tie, like the floor team",
          "A blazer",
          "An apron",
          "Nothing — it's identical to the hosts",
        ],
        answer: 1,
        explanation:
          "Managers wear business professional with a blazer — dressed a notch above, setting the standard the floor reaches for.",
      },
      {
        id: "andiamo-appearance-9",
        question: "When should you be dressed and ready for the floor?",
        options: [
          "Right after you clock in",
          "By the time the first guests arrive",
          "Before you clock in, ready to work",
          "Whenever a manager is checking",
        ],
        answer: 2,
        explanation: "Arrive already dressed and ready — never clock in and then finish dressing.",
      },
    ],
  },
  {
    id: "roles",
    order: 3,
    phase: 2,
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
    phase: 2,
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
    phase: 2,
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
    phase: 2,
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
    phase: 2,
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
    phase: 3,
    section: "What We Sell",
    title: "Wines by the Glass \u2014 Summer 2026",
    quizDraw: 12,
    summary:
      "Andiamo\u2019s ten by-the-glass pours plus the bubbles \u2014 every wine\u2019s formula, the one-question method, the table scripts, and the five moments that sell.",
    minutes: 18,
    requiredFor: BEVERAGE_TEAM,
    location: "Andiamo",
    lessons: [
      {
        heading: "Start Here \u2014 How to Actually Learn This",
        intro:
          "Nobody memorizes a dozen wines in one sitting. The pros learn in passes \u2014 do the same.",
        points: [
          "Pass 1 (3 min): skim every Formula line \u2014 grape \u00b7 place \u00b7 flavor \u00b7 feel. Just get the map.",
          "Pass 2 (8 min): read the stories and say each Sentence OUT LOUD once. Out loud is the trick \u2014 your mouth remembers what your eyes forget.",
          "Pass 3: run the Table Scripts with a coworker or in the mirror. Sixty seconds each.",
          "Then taste: the wine of the day at pre-shift locks it in. Tasting one wine you\u2019ve already read about beats reading ten.",
          "Learn YOUR anchors first: the House White, the House Red, and the three you pour most. Own five, then grow.",
          "Different brains, different doors: readers \u2014 study the formulas; talkers \u2014 role-play the scripts; doers \u2014 taste and pour. Use yours.",
        ],
      },
      {
        heading: "Why This Matters \u2014 You Are the Wine List",
        intro:
          "A beautiful list doesn\u2019t sell wine. You do. A guest guided to the right glass has a better night, spends a little more, and comes back \u2014 and regulars are the whole business.",
        points: [
          "You don\u2019t need to be a sommelier. The entire skill: ask one question \u2192 pick the pour \u2192 say one sentence \u2192 stop talking.",
          "\u2018Great question \u2014 let me find out\u2019 is always a professional answer. Never bluff a guest.",
          "The upsell is generosity, not pressure: guiding someone to a wine they\u2019ll love is a gift.",
          "Present two options, recommend one, let the guest choose. Two feels like help; the whole list feels like a quiz.",
          "One memorable detail per wine \u2014 not a Wikipedia entry. \u2018Tastes like the coast\u2019 beats three sentences of geography.",
          "Every pour in the building is 6 oz \u2014 a full ounce over the standard. It\u2019s real generosity; let it show in how you pour and how you talk.",
        ],
      },
      {
        heading: "Service Rules & Price Transparency",
        intro:
          "One rule above all: no guest ever learns a price from the check. Surprise is the enemy of trust \u2014 and trust is what sells the second visit.",
        points: [
          "ALWAYS say the price when you recommend \u2014 plainly, at the end, no apology: \u201cthe Tyler \u2014 eighteen.\u201d Confidence with numbers reads as honesty.",
          "Picking for a guest who said \u2018you choose\u2019? Confirm the pick AND the price before you pour: \u201cI\u2019ll bring the Vermentino \u2014 thirteen \u2014 perfect with the branzino.\u201d",
          "Say the price at the welcome too: \u201ca glass of Prosecco while you look? Twelve.\u201d Named and priced up front, never a surprise later.",
          "CORKED = a musty, wet-cardboard smell from a faulty cork. It happens to good bottles. Never argue \u2014 apologize, replace the glass immediately, tell a manager.",
          "If you don\u2019t know a wine, say so and find out. A confident \u2018let me check\u2019 beats a wrong answer every time.",
        ],
      },
      {
        heading: "Wine Words in Plain English",
        intro:
          "A handful of words cover almost every wine question at the table. Use these definitions exactly like this with guests.",
        points: [
          "DRY = not sweet. Almost everything we pour is dry. When a guest asks for \u2018dry,\u2019 they usually mean crisp \u2014 ask \u2018crisp and bright, or rich and rounded?\u2019",
          "BODY = weight in your mouth: skim milk (light) \u2192 whole milk (medium) \u2192 cream (full).",
          "TANNIN = the tea-bag grip in reds, that drying feel on your gums. Softens with food; firm in the Cabernet, gentle in the Pinot.",
          "ACIDITY = mouth-watering brightness. High-acid wines like Chianti love food \u2014 that\u2019s why Chianti and red sauce are magic.",
          "OAK = vanilla, toast, and butter from barrel aging. The Tyler has a touch; the De Forville has none.",
          "MINERALITY = stone, chalk, or saline instead of fruit \u2014 the word for the Vermentino and the Sauvignon Blanc.",
          "VINTAGE = the year the grapes were picked. N.V. = a blend of years, normal for Prosecco and most sparkling.",
          "Say them with confidence \u2014 a clean pronunciation sells the wine: NERO D\u2019AVOLA (NEH-ro DAH-vo-lah), VERMENTINO (ver-men-TEE-no), NEBBIOLO (neh-bee-OH-lo).",
        ],
      },
      {
        heading: "Whites & Bubbles \u2014 Formula \u00b7 Sentence \u00b7 For",
        intro:
          "Grape \u00b7 place \u00b7 flavor \u00b7 feel, then the one sentence you say, then who it\u2019s for.",
        points: [
          "Lamberti Prosecco (12 / bottle 38): Glera \u00b7 Veneto \u00b7 green apple \u00b7 light, frothy. \u201cThe welcome glass \u2014 dry, crisp, celebratory.\u201d FOR every table at greeting.",
          "Sommariva \u2018Il Rosa\u2019 Ros\u00e9 (15 / 45): sparkling ros\u00e9 \u00b7 Veneto \u00b7 wild strawberry \u00b7 dry, festive. \u201cPink bubbles \u2014 dry, not sweet, made for a celebration.\u201d FOR birthdays, toasts, any table that wants an occasion.",
          "House White \u2014 Donini Pinot Grigio (12 / 40): Pinot Grigio \u00b7 Venezia \u00b7 light citrus \u00b7 crisp, clean. \u201cThe easy classic \u2014 crisp and clean.\u201d FOR the Pinot Grigio guest; never talk them out of it.",
          "De Forville Chardonnay (12 / 40): Chardonnay \u00b7 Piedmont \u00b7 bright, mineral \u00b7 zero oak. \u201cChardonnay without the butter.\u201d FOR crisp-white drinkers and the \u2018I don\u2019t like Chardonnay\u2019 guest.",
          "Tyler Chardonnay (18 / 58): Chardonnay \u00b7 Santa Barbara \u00b7 orchard fruit, a touch of cream \u00b7 richer, rounded. \u201cThe step-up Chardonnay \u2014 Santa Barbara elegance, fuller and rounder.\u201d FOR the guest who wants a real, generous white.",
          "Clos Henri Sauvignon Blanc (14 / 45): Sauvignon Blanc \u00b7 Marlborough, New Zealand \u00b7 citrus & zest \u00b7 crisp. \u201cA Sancerre family \u2014 from France \u2014 making Sauvignon in New Zealand.\u201d FOR the Sauvignon-by-default guest.",
          "La Cala Vermentino (13 / 45): Vermentino \u00b7 Sardinia \u00b7 saline, coastal \u00b7 fresh. \u201cThe seafood wine \u2014 it tastes like the coast.\u201d FOR the branzino, the crudo, anything from the sea.",
        ],
      },
      {
        heading: "Reds \u2014 Formula \u00b7 Sentence \u00b7 For",
        points: [
          "House Red \u2014 Rapital\u00e0 Nero d\u2019Avola (12 / 45): Nero d\u2019Avola \u00b7 Sicily \u00b7 juicy dark fruit \u00b7 smooth, easy. \u201cOur house red \u2014 Sicilian sunshine, smooth and generous.\u201d FOR the \u2018just a red\u2019 guest.",
          "Routestock Pinot Noir (16 / 55): Pinot Noir \u00b7 Sonoma Coast \u00b7 red berries \u00b7 silky, lighter. \u201cSilky and elegant \u2014 the red that loves salmon and chicken.\u201d FOR the easy-red guest and whites crossing over.",
          "Villa Sant\u2019Anna Chianti (13 / 45): Sangiovese \u00b7 Tuscany \u00b7 cherry & leather \u00b7 bright, food-first. \u201cThe classic with anything red-sauce.\u201d FOR the traditional Italian order.",
          "Tintero Nebbiolo (15 / 50): Nebbiolo \u00b7 Piedmont \u00b7 red fruit & rose \u00b7 elegant, floral. \u201cA baby Barolo \u2014 the noble grape at a friendly price.\u201d FOR the curious drinker; the step up from Chianti.",
          "Wild Horse Cabernet (17 / 58): Cabernet Sauvignon \u00b7 Paso Robles \u00b7 dark fruit \u00b7 bold, firm. \u201cThe big one \u2014 dark fruit and backbone, built for the steak.\u201d FOR the bold-red guest and the griglia.",
          "The Italian ladder \u2014 walk a curious guest up one friendly rung at a time: Nero d\u2019Avola \u2192 Chianti \u2192 Tintero Nebbiolo.",
        ],
      },
      {
        heading: "The One-Question Method",
        intro:
          "Learn this pattern once and every category works the same way. The question does the selling \u2014 you sound like an expert by asking, not lecturing.",
        points: [
          "\u2018I\u2019ll just have a Chardonnay.\u2019 \u2192 \u2018Love it \u2014 crisp and bright, or rich and rounded?\u2019 Crisp \u2192 De Forville, no oak, twelve. Rich \u2192 Tyler, fuller and rounder, eighteen. Every answer has a pour waiting.",
          "Pinot Grigio: \u2018the classic, or something coastal?\u2019 \u2192 Donini (classic, twelve) / La Cala Vermentino (saline, the seafood wine, thirteen).",
          "Sauvignon Blanc \u2192 Clos Henri: \u2018citrusy and zesty \u2014 a Sancerre family making it in New Zealand.\u2019 Fourteen. One sentence, done.",
          "Reds: \u2018smooth and easy, or big and bold?\u2019 \u2192 smooth: House Nero d\u2019Avola (twelve) or Routestock Pinot (sixteen); bold: Wild Horse Cabernet (seventeen).",
          "Italian mood: \u2018for the pasta, or something to explore?\u2019 \u2192 Chianti with red sauce (thirteen) / Tintero Nebbiolo, the baby Barolo (fifteen).",
          "Bubbles: \u2018a glass to start?\u2019 \u2192 Lamberti Prosecco (twelve); pink and celebrating \u2192 Sommariva Ros\u00e9 (fifteen).",
          "Why it works: the question does the selling; every answer has a pour ready; the price comes last, plainly, no apology.",
        ],
      },
      {
        heading: "Real Tables \u2014 the Scripts",
        intro:
          "The most common order isn\u2019t a question \u2014 it\u2019s a grape. The move is always the same: name the pour, one descriptor, the price, and where it shines. Two options at most, never the whole list.",
        points: [
          "\u201cI\u2019ll have a Pinot Noir.\u201d \u2192 \u201cThe Routestock from the Sonoma Coast \u2014 silky and elegant, sixteen. Beautiful with the salmon or the chicken if that\u2019s where you\u2019re headed.\u201d",
          "\u201cA glass of Cabernet.\u201d \u2192 \u201cThe Wild Horse from Paso Robles \u2014 bold, dark fruit, seventeen. It\u2019s the one for the steak.\u201d",
          "\u201cChardonnay.\u201d \u2192 \u201cCrisp or rich? The De Forville is bright with no oak, twelve \u2014 the Tyler is fuller and rounder, from Santa Barbara, eighteen.\u201d",
          "\u201cSomething Italian and white, easy.\u201d \u2192 \u201cThe Donini Pinot Grigio, crisp and clean, twelve \u2014 or if you love the sea, the Sardinian Vermentino at thirteen.\u201d",
          "\u201cA red for my pasta.\u201d \u2192 \u201cThe Chianti \u2014 made for red sauce, thirteen \u2014 or the Nebbiolo, a baby Barolo, a little more serious, fifteen.\u201d",
          "\u201cDo you have Prosecco?\u201d \u2192 \u201cThe Lamberti \u2014 proper dry Prosecco, twelve. And pink bubbles at fifteen if the table\u2019s celebrating.\u201d",
          "\u201cYou pick for me.\u201d \u2192 confirm both the pick and the price before you pour: \u201cI\u2019ll bring the Vermentino \u2014 thirteen \u2014 it\u2019s perfect with the branzino.\u201d",
          "\u201cWhat\u2019s good?\u201d \u2192 don\u2019t recite the list. \u201cDepends what you love \u2014 for a white the Vermentino is singing right now, thirteen; for a red the Nebbiolo is a baby Barolo, fifteen.\u201d",
        ],
      },
      {
        heading: "The Five Moments That Sell",
        intro:
          "Wine revenue isn\u2019t one big move \u2014 it\u2019s five small moments, every table, every night.",
        points: [
          "THE WELCOME: offer the Lamberti at greeting, by name, with price \u2014 \u201ca glass of Prosecco while you look things over? Twelve.\u201d An opened table drinks more all night.",
          "THE SECOND GLASS: offer at a third full, never after empty \u2014 \u201canother Tyler, or should I bring the De Forville so you can taste the two styles side by side?\u201d The compare play turns a glass into a tasting.",
          "THE BOTTLE MATH: two guests, two rounds of the same wine \u2192 offer the bottle BEFORE the third glass \u2014 \u201ccan I bring the bottle? It\u2019s about the same as three glasses each.\u201d Guests never resent being saved money.",
          "THE DESSERT HANDOFF: when dessert lands, pass the table to the after-dinner round \u2014 amaro, limoncello, or a caff\u00e8 corretto (see the Spirits & Amaro module).",
          "THE CHECK MOMENT: every price was said out loud earlier, so the check holds zero surprises. No surprises = trust = tips = regulars. That is the whole system.",
        ],
      },
    ],
    quiz: [
      {
        id: "wine-1",
        question: "A guest ordering the branzino wants a white. The strongest pairing logic:",
        options: [
          "Clos Henri Sauvignon Blanc \u2014 crisp cuts through fish",
          "La Cala Vermentino \u2014 saline and coastal, the wine practically made for seafood",
          "Donini Pinot Grigio \u2014 light enough to stay out of the way",
          "Tyler Chardonnay \u2014 richness matches a whole fish",
        ],
        answer: 1,
        explanation:
          "Several of these \u2018work\u2019 \u2014 but the Vermentino\u2019s salinity is the story pick, and the story sells: \u2018tastes like the coast.\u2019",
      },
      {
        id: "wine-2",
        question: "\u2018I like Chardonnay but hate that buttery thing.\u2019 Pour:",
        options: [
          "Tyler \u2014 but ask the kitchen to pair it lighter",
          "Clos Henri \u2014 no butter in Sauvignon Blanc",
          "De Forville \u2014 unoaked Chardonnay, bright and mineral: \u2018Chard without the butter\u2019",
          "Donini Pinot Grigio \u2014 the closest clean white",
        ],
        answer: 2,
        explanation:
          "They asked for Chardonnay \u2014 keep them in the grape, just drop the oak. Switching grapes ignores what they said.",
      },
      {
        id: "wine-3",
        question: "Salmon entr\u00e9e, guest wants red. Best call:",
        options: [
          "Villa Sant\u2019Anna Chianti \u2014 acidity loves rich fish",
          "House Nero d\u2019Avola \u2014 smooth enough for anything",
          "Wild Horse Cabernet \u2014 our biggest red",
          "Routestock Pinot Noir \u2014 silky and lighter, made for salmon",
        ],
        answer: 3,
        explanation:
          "Chianti is a defensible second \u2014 but Pinot\u2019s silk against salmon is the classic, and \u2018made for salmon\u2019 is a one-sentence sell.",
      },
      {
        id: "wine-4",
        question: "The strongest bottle-upsell line:",
        options: [
          "\u201cCan I bring the bottle? It\u2019s about the same as three glasses each.\u201d",
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
          "Tyler Chardonnay \u2014 a rounder white",
          "Donini Pinot Grigio \u2014 the easy, crisp classic they\u2019re describing",
          "Clos Henri \u2014 light and zesty",
        ],
        answer: 2,
        explanation:
          "The Vermentino is Italian too \u2014 but \u2018easy and light\u2019 is the Pinot Grigio guest describing their own wine. Give the classic; never over-correct.",
      },
      {
        id: "wine-7",
        question: "\u2018Big, bold red\u2019 \u2014 the by-the-glass answer:",
        options: [
          "Tintero Nebbiolo \u2014 the most serious red we pour",
          "House Nero d\u2019Avola \u2014 dark Sicilian fruit",
          "Villa Sant\u2019Anna Chianti \u2014 the classic",
          "Wild Horse Cabernet \u2014 dark fruit and firm tannin",
        ],
        answer: 3,
        explanation:
          "Nebbiolo is elegant, not big; Nero d\u2019Avola is smooth, not bold. \u2018Big and bold\u2019 = the Cabernet, every time.",
      },
      {
        id: "wine-8",
        question: "Red-sauce pasta, guest wants the classic match:",
        options: [
          "Villa Sant\u2019Anna Chianti \u2014 acidity built for tomato",
          "House Nero d\u2019Avola \u2014 the house red with the house pasta",
          "Routestock Pinot Noir \u2014 won\u2019t overpower",
          "Wild Horse Cabernet \u2014 stands up to the sauce",
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
          "\u201cCrisp and bright, or rich and rounded?\u201d \u2014 De Forville or Tyler, either answer has a pour",
          "\u201cCalifornia or Italian?\u201d",
          "Bring the Tyler \u2014 it\u2019s the nicer glass",
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
          "Confirm the pick AND the price: \u201cI\u2019ll bring the Vermentino \u2014 thirteen \u2014 perfect with the branzino\u201d",
        ],
        answer: 3,
        explanation:
          "Delegation isn\u2019t a blank check \u2014 no guest ever learns a price from the check. Pick and price, out loud, before the pour.",
      },
      {
        id: "wine-13",
        question: "A guest is a third from finishing a Tyler they love. Best line:",
        options: [
          "\u201cAnother Tyler \u2014 or should I bring the De Forville so you can taste the two styles side by side?\u201d",
          "\u201cReady for another?\u201d once the glass is empty",
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
          "Explain that some wines just smell earthy",
        ],
        answer: 1,
        explanation:
          "Cork taint doesn\u2019t blow off and it\u2019s in the whole bottle. Replace, report, never argue.",
      },
      {
        id: "wine-15",
        question: "A guest orders the New York steak and asks for \u2018a red that can handle it.\u2019 Pour:",
        options: [
          "Routestock Pinot Noir \u2014 silky and elegant",
          "Tintero Nebbiolo \u2014 floral and refined",
          "Wild Horse Cabernet \u2014 bold, dark fruit and backbone, built for the steak",
          "House Nero d\u2019Avola \u2014 smooth and easy",
        ],
        answer: 2,
        explanation:
          "Steak wants structure. The Cabernet\u2019s tannin is the grip that stands up to a char \u2014 \u2018the one for the steak.\u2019",
      },
      {
        id: "wine-16",
        question: "How much do we pour by the glass, and why say it?",
        options: [
          "5 oz \u2014 the standard; no need to mention it",
          "6 oz \u2014 a full ounce over standard; generosity only counts if the guest knows",
          "Whatever the glass holds; pours aren\u2019t measured",
          "6 oz \u2014 but keep it quiet so it feels like a bonus",
        ],
        answer: 1,
        explanation:
          "Every pour is a generous 6 oz. It\u2019s a real edge \u2014 name it when it helps, the way we do on the reserve pours at Figaro.",
      },
    ],
  },
  {
    id: "cocktails",
    order: 9,
    phase: 3,
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
    phase: 3,
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
    ],
  },
  {
    id: "figaro-btg-fall-2026",
    order: 11,
    phase: 3,
    section: "Bar Reference",
    title: "Café Figaro: Wines by the Glass — Fall 2026",
    quizDraw: 12,
    summary:
      "The fall glass program: 19 everyday pours, 3 reserve pours, what’s new, the service rules, and how to sell any of them with one question.",
    minutes: 20,
    requiredFor: BEVERAGE_TEAM,
    location: "Cafe Figaro",
    lessons: [
      {
        heading: "Start Here — How to Actually Learn This",
        intro:
          "Nobody memorizes 22 wines in a night. The pros learn in passes, so do the same.",
        points: [
          "Pass 1 (5 min): skim every formula line (grape · place · flavor · feel). Just get the map.",
          "Pass 2 (10 min): read the stories and say each sentence OUT LOUD once. Your mouth remembers what your eyes forget.",
          "Pass 3: run the scripts with a coworker or in the mirror. Sixty seconds each.",
          "Then taste: the wine of the day at pre-shift locks it in. Tasting one wine you’ve read about beats reading ten.",
          "Learn the six new pours plus the other two reserve pours (the Buisson and the Margaux) first. Own those eight, then grow.",
          "Different brains, different doors. Readers: study the cards. Talkers: role-play. Doers: taste and pour. Use yours.",
        ],
      },
      {
        heading: "What’s New This Fall",
        intro:
          "Six new pours since the October list, one new kind of wine, and new words on the list. If a regular asks for an old favorite, offer the wine that replaced it.",
        points: [
          "Ramey Chardonnay → Bevan Cellars, Bennett Valley, Sonoma (25). Also a rich, creamy California Chardonnay.",
          "Bitouzet-Prieur → Domaine Chavy-Chouet ‘Les Femelottes’, white Burgundy (22). Lightly oaked.",
          "Ronchi di Cialla Ribolla Gialla → Hermann Ludes ‘Hermann’ Riesling, Mosel (16). Crisp, light, tastes dry.",
          "Chappellet Mountain Cuvée → Hamel Family ‘Stratum’, Sonoma Valley red blend (25).",
          "Cogno Cascina Nuova (reserve) → Faugier-Gonnet Hermitage, northern Rhône Syrah (35 a glass).",
          "NEW: a chilled red, Vino di Anna ‘Sfuso’ from Mount Etna (15). Served lightly chilled, about 60–64°F.",
          "Also gone since the summer card: Maison Champy, Duckhorn, Presqu’ile, Occidental, Tintero Barbaresco, Billecart rosé, Leflaive Mâcon, Chave Offerus and Montepeloso A Quo. If a guest asks for one, ask the one question for that grape and pour from the current card.",
          "Also new since the summer card: Champagne Aubry (27), Keenan Cabernet (28), the Volpolo from Podere Sapaio (22), Schiavenza Barolo (25), Failla Pinot Noir (17), Benjamin Leroux Bourgogne Rouge (30) and the monthly reserve selection, now the Buisson (23).",
          "The list now prints a style line under each Chardonnay (Crisp, no oak · Lightly oaked · Rich and creamy), and the Pinot Grigio and Riesling sit under a new heading, Crisp Whites. Point to the words; they do half the selling.",
        ],
      },
      {
        heading: "The Program & the Service Philosophy",
        intro:
          "The wine list opens on Wines by the Glass, facing Reserve by the Glass. Everyday and special, side by side. Your job is to help guests cross that bridge.",
        points: [
          "Listen first: ask one clarifying question before recommending.",
          "One memorable detail per wine, not a Wikipedia entry.",
          "Present two options, recommend one, let the guest choose.",
          "The upsell is generosity: guiding a guest to a better wine gives them a better night.",
          "You don’t need to be a sommelier. The whole skill: ask one question → pick the pour → say one sentence → stop talking. And ‘great question, let me find out’ is a professional answer.",
          "Our wine list holds the Wine Spectator Best of Award of Excellence for 2026, and the restaurant holds a DiRoNA Award of Excellence. Worth mentioning to wine lovers.",
        ],
      },
      {
        heading: "Service Rules & Price Transparency",
        intro:
          "One rule above all: no guest ever learns a price from the check. Surprise is the enemy of trust, and trust is what sells the second visit.",
        points: [
          "ALWAYS say the price when you recommend, plainly, at the end, no apology: “the Bevan, twenty-five.” Confidence with numbers reads as honesty.",
          "Reserve pours: SAY the price before the wine is poured, every time, even if the guest pointed to it on the page. “The Hermitage is thirty-five a glass. Shall I bring it?”",
          "Guest says ‘just a Chardonnay’ and you pick for them? Confirm the pick AND the price: “I’ll bring the Bevan, twenty-five. Perfect with the Adriatica.”",
          "Every pour in the building is 6 oz, an ounce more than the common 5 oz pour. Say it when it helps, especially on the reserve page. Generosity is only generous if the guest knows.",
          "The chilled red goes out lightly chilled, about 60–64°F: cool, not cold. Tell the guest it’s meant to be served that way.",
          "Corkage is $30 a bottle, and we waive one corkage for each bottle bought from our list. Say it as generosity: “happy to open that. It’s thirty, and for every bottle you get from our list, we waive one.”",
        ],
      },
      {
        heading: "Wine Words in Plain English",
        intro:
          "Ten words cover almost all wine talk at the table. Plain definitions; use them exactly like this with guests.",
        points: [
          "DRY = not sweet. Almost everything we pour is dry. When a guest asks for ‘dry,’ they usually mean crisp, so ask ‘crisp and bright, or rich?’",
          "BODY = weight in your mouth. Skim milk (light) → whole milk (medium) → cream (full).",
          "TANNIN = the tea-bag grip in reds, that drying feeling on your gums. Softens with food. Firm in Barolo and mountain Cabernet, gentle in Pinot Noir.",
          "ACIDITY = the mouth-watering brightness. High-acid wines (Chianti, Sancerre, Riesling) love food.",
          "OAK = vanilla or toast notes from barrels. De Forville has none (steel only), Chavy-Chouet a little. Bevan is our richest, creamiest Chardonnay, but the winery doesn’t publish its oak, so call it rich and creamy, never oaky.",
          "MINERALITY = stony, chalky or salty notes instead of fruit. The word for Sancerre, and for the volcanic Etna red.",
          "VINTAGE = the year the grapes were picked. N.V. = a blend of years (normal for Champagne and Prosecco).",
          "BRUT = dry, in sparkling-wine language. Dry, but not necessarily bone dry.",
          "NATURAL WINE = made with as little added as possible: wild yeast, no fining or filtering, a touch of sulfur at most. Our Vino di Anna is made this way.",
          "CORKED = a musty, wet-cardboard smell from a faulty cork. It happens to good bottles. Never argue: apologize, pour a fresh glass from a NEW bottle (the flaw is in the whole bottle), tell a manager.",
        ],
      },
      {
        heading: "Reserve by the Glass — Know These Three Cold",
        intro:
          "Three special pours, each with a one-sentence story. Say the price before you pour, every time.",
        points: [
          "Monthly selection from Will’s cellar, Henri & Gilles Buisson Bourgogne Rouge ($23): Pinot Noir from Saint-Romain in Burgundy, where the Buisson family has worked vines since 1758, certified organic since 2009. Bright cherry, lithe and fresh. PAIR Gnocchi Ripieni, the veal. FOR the Burgundy-curious guest. This pour changes monthly, so check at pre-shift.",
          "Faugier-Gonnet Hermitage Rouge 2017 ($35): 100% Syrah from the hill of Hermitage in the northern Rhône, about 340 acres of vines on one granite hill and home to some of France’s great reds. Made by Franck Faugier, a fifth-generation grower; our importer says the label is a joint project with his longtime friend Bruno Gonnet. Nine years old, from a hot, early Rhône vintage. No critic has reviewed this bottle, so taste it at pre-shift and describe what you taste. PAIR Agnello (lamb chops), Bistecca. FOR the adventurer. Limited bottles: when it’s gone, it’s gone. Say it: foh-ZHYAY goh-NAY, air-mee-TAHZH.",
          "Margaux du Château Margaux 2018 ($65): the third wine of Château Margaux, which has been a First Growth since 1855 (the estate is; this wine isn’t, so never call the glass a First Growth), made only from the estate’s own vineyards. The second wine is Pavillon Rouge. Cabernet-led; ripe, spicy red fruit and a silky texture. PAIR the lamb chops, Bistecca. FOR the name-driven guest and the special occasion. Say the price before you pour, always: ‘sixty-five a glass.’",
        ],
      },
      {
        heading: "The Moments That Sell",
        intro:
          "Wine revenue isn’t one big move. It’s five small moments, every table, every night.",
        points: [
          "THE WELCOME: offer a glass at greeting, by name, with price: “a glass of Prosecco while you look things over? Twelve.” An opened table drinks more all night.",
          "THE SECOND GLASS: offer when the glass is a third full, never after empty: “another Bevan, or the Chavy-Chouet so you can taste them side by side?” The compare play turns a refill into a tasting.",
          "THE BOTTLE MATH: a bottle is four of our 6 oz glasses. Two guests on the same wine who will each want two glasses → offer the bottle BEFORE the first pour, but only when the bottle costs less than four glasses. It does on the Margaux: “if you’re each having two, the bottle is 185; four glasses would be 260.” It doesn’t on the Hermitage (four glasses are 140, the bottle 165), so keep pouring by the glass there. Guests never resent being saved money.",
          "THE DESSERT MOMENT: when dessert is ordered, offer the La Spinetta Moscato d’Asti half bottle, lightly sweet and made for dessert: “a half of Moscato for the table with dessert? Thirty-two, and it’s gently sparkling.” The easiest add-on in the building.",
          "THE CHECK MOMENT: because every price was said out loud earlier, the check holds zero surprises. No surprises = trust = tips = regulars. That is the whole system.",
        ],
      },
      {
        heading: "The One-Question Method — the Chardonnay Walkthrough",
        intro:
          "Learn this pattern once and every category works the same way. Guest: ‘I’ll just have a Chardonnay.’ You: ‘Love it. Do you like it crisp, or rich and creamy?’",
        points: [
          "‘Crisp’ → “The De Forville from Piedmont. No oak at all, bright and floral. Sixteen.”",
          "‘Somewhere in between’ or ‘I like white Burgundy’ → “The Chavy-Chouet, a real white Burgundy, silky and lemony with a touch of oak. Twenty-two.”",
          "‘Buttery’ or ‘rich’ → “The Bevan Cellars from Sonoma. Rich and creamy, ripe apple and a crème brûlée finish. Twenty-five.”",
          "Why it works: the question does the selling, every answer has a pour waiting, and the price comes last, plainly, no apology. The same three styles are printed under each Chardonnay on the list (Crisp, no oak · Lightly oaked · Rich and creamy), so you can point.",
          "One question per category. Sauvignon Blanc: ‘bright New Zealand style or the French one?’ (Te Mata 16 / Sancerre 20). Crisp whites: ‘Pinot Grigio, or something a little different?’ (Walch 16 / Ludes Riesling 16). Big reds: ‘smooth, or big and structured?’ (RouteStock 17 / Hamel 25 / Keenan 28). Pinot Noir: ‘light and lively, or Burgundy?’ (Failla 17 / Leroux 30). Italian: ‘for the pasta, or for the steak?’ (Chianti 16 / Volpolo 22 / Barolo 25).",
          "‘Surprise me’ or ‘something different’ → the chilled red: “A light, juicy red from Mount Etna, served a little chilled. Fifteen.”",
        ],
      },
      {
        heading: "Real Tables — the Scripts",
        intro:
          "The most common order isn’t a question. It’s a grape. The move is always the same: name BOTH pours, one descriptor each, price each, let them choose. Two options (three max), never the whole list.",
        points: [
          "“I’ll have a Pinot Noir.” → “Two on the main list. The Failla from Oregon, lively and fresh, seventeen; or the Benjamin Leroux, red Burgundy, cherry and raspberry, thirty. Which sounds like tonight?”",
          "“A glass of Cabernet.” → “Three from Northern California. RouteStock from Napa, rich and supple, seventeen; the Hamel Stratum, an organic Sonoma blend, smooth and savory, twenty-five; or Keenan, a structured mountain Cab from Napa, twenty-eight.”",
          "“Chardonnay.” → “Crisp or rich? The De Forville has no oak, sixteen. The Bevan is rich and creamy, twenty-five. And there’s a real white Burgundy in between at twenty-two.”",
          "“Sauvignon Blanc.” → “Te Mata from New Zealand, bright and vibrant, sixteen; or the Sancerre, the same grape in its French home, crisp and citrusy, twenty.”",
          "“Pinot Grigio.” → “Elena Walch from the Alps, sixteen. And if you ever want something a little different, the Riesling from the Mosel is crisp and light, tastes dry, same price.”",
          "“Something red with my pasta.” → “The Chianti, made for red sauce, sixteen; or the Volpolo from Podere Sapaio, a Super Tuscan from the coast, fuller and polished, twenty-two.”",
          "“Do you have Prosecco?” → “The Bisol, light and lively, twelve. And pink bubbles at fifteen if the table’s celebrating.”",
          "“Champagne by the glass?” → “Yes, the Aubry, Premier Cru Champagne from a family that’s grown grapes there since 1790. Twenty-seven, and we pour six ounces.”",
          "“What’s your best glass of wine?” → “Depends what you love. The reserve page pours a nine-year-old Hermitage at thirty-five and Château Margaux’s third wine at sixty-five.”",
          "The pattern, always: both names · one descriptor each · both prices · “which sounds like tonight?” Then stop talking.",
        ],
      },
      {
        heading: "Whites & Sparkling — Formula · Story · Pair · For",
        intro:
          "Every wine reduces to four lines: grape · place · one flavor · one feel. Then a pairing and a person. That is all you need.",
        points: [
          "Bisol ‘Jeio’ Prosecco ($12): Glera · Veneto · pear and citrus · light, lively bubbles. ‘Jeio’ was the family patriarch Desiderio Bisol’s nickname. Brut, Prosecco’s drier style, but fruity rather than bone dry. PAIR Calamari Fritti. FOR everyone: the welcome glass.",
          "Sommariva ‘Il Rosa’ Brut Rosé ($15): Raboso and Pinot Nero · Conegliano hills, Veneto · wild berries · dry and brisk. Pink bubbles, but not Prosecco (no Glera). PAIR Burrata e Prosciutto, antipasti. FOR the pink-bubbles table.",
          "Champagne Aubry Premier Cru Brut ($27): Pinot Meunier, Chardonnay and Pinot Noir · Champagne · red apple and toast · generous. The Aubry family has grown grapes there since 1790 and brought back forgotten old Champagne grapes; about 5% of this Brut comes from them. Say it: oh-BREE. PAIR Calamari Fritti, Carpaccio di Manzo, any celebration. FOR the real-Champagne guest.",
          "De Forville Chardonnay ($16): Chardonnay · Piedmont · white flowers and apple · crisp, no oak (stainless steel only). PAIR Linguine alle Vongole, seafood pasta. FOR crisp-white drinkers; wins back the ‘I don’t like Chardonnay’ guest.",
          "Chavy-Chouet ‘Les Femelottes’ ($22): Chardonnay · Burgundy, from vines just outside Puligny-Montrachet · orchard fruit and lemon · silky, lightly oaked. A family estate based in Meursault, but the label says Bourgogne Blanc, not Meursault. Say it: shah-VEE shoo-EH, lay fuhm-LOT. PAIR Pesce del Giorno, Risotto ai Funghi Porcini, the piccatas. FOR the ‘in between’ guest and white-Burgundy fans.",
          "Bevan Cellars Chardonnay ($25): Chardonnay · Bennett Valley, Sonoma · ripe apple and crème brûlée · rich and creamy. The richer of Bevan’s two Chardonnays. Say it: BEV-in. PAIR Fettuccine Adriatica, Heirloom Burrata Caprese. FOR the buttery-Chardonnay guest: their yes.",
          "Te Mata Sauvignon Blanc ($16): Sauvignon Blanc · Hawke’s Bay, New Zealand · passionfruit and lime zest · vibrant and dry, no oak. Te Mata dates to 1896 and calls itself home to New Zealand’s oldest vineyards. Say it: teh MAH-tah. PAIR Insalata d’Autunno, goat cheese. FOR the Sauvignon-Blanc-by-default guest.",
          "Domaine Sylvain Bailly ‘Terroirs’ Sancerre ($20): Sauvignon Blanc · Sancerre, Loire Valley · citrus · crisp. The Bailly family has made wine in Sancerre since 1700. Say it: seel-VAN bah-YEE, sahn-SAIR. PAIR Insalata d’Autunno, Gamberi Mediterranea. FOR the Te Mata drinker trading up.",
          "Elena Walch Pinot Grigio ($16): Pinot Grigio · Alto Adige · ripe pear · crisp, dry, no oak. PAIR anything light. FOR the Pinot Grigio guest; never talk them out of it.",
          "Hermann Ludes ‘Hermann’ Riesling ($16): Riesling · Mosel, Germany · ripe fruit and racy acidity · light (about 10% alcohol), tastes dry: a touch of natural sugar balanced by racy acidity, so never promise ‘bone dry.’ A family estate in Thörnich. Say it: HAIR-mahn LOO-dess. PAIR Calamari Fritti, Rigatoni alla Vodka, anything with a little heat. FOR the curious Pinot Grigio drinker: same price, more personality.",
        ],
      },
      {
        heading: "Reds — Formula · Story · Pair · For",
        points: [
          "RouteStock Cabernet ($17): Cabernet Sauvignon · Napa Valley · blackberry and licorice · rich and supple. It’s the own label of Wilson Daniels, the Napa importer that brings Domaine de la Romanée-Conti to the US. PAIR Bistecca, the grill. FOR the ‘just a Cab’ guest.",
          "Hamel Family ‘Stratum’ ($25): mostly Cabernet Sauvignon with Merlot and Cabernet Franc · Sonoma Valley · plum and wild cherry · velvety, savory rather than heavy. From the family’s certified organic, Biodynamic estate. PAIR Bistecca, Pappardelle Figaro. FOR the step-up from RouteStock.",
          "Keenan Cabernet ($28): Cabernet Sauvignon · Napa Valley, mostly from Keenan’s Spring Mountain estate · black cherry · structured, firm tannins. In 1974 Robert Keenan revived an abandoned 1890s winery high on Spring Mountain. PAIR Bistecca, Agnello. FOR the big-mountain-Cab guest. Ladder: 17 → 25 → 28 → Margaux 65.",
          "Villa Sant’Anna Chianti Colli Senesi ($16): Sangiovese · the Sienese hills near Montepulciano, southern Tuscany (Chianti Colli Senesi, not Classico) · red fruit with a touch of spice · bright and smooth. A small family estate run by a mother and her two daughters. PAIR Spaghetti Bolognese, Lasagna, anything with red sauce. FOR the classic Italian order.",
          "Podere Sapaio ‘Volpolo’ ($22): Cabernet-led, with Merlot and Petit Verdot · Bolgheri, on the Tuscan coast · plum and herbs · full but polished. A Super Tuscan: the informal name for Tuscan reds made outside the old rules, often from French grapes. Certified organic. PAIR Pappardelle Figaro, Bistecca. FOR the Chianti drinker stepping up.",
          "Schiavenza Barolo ($25): Nebbiolo · Serralunga d’Alba, Piedmont · red cherry and rose · refined but firm. ‘Schiavenza’ is local dialect for the sharecroppers who once worked the land. Say it: skyah-VEN-tsah. PAIR Risotto ai Funghi Porcini, Veal Marsala. FOR the serious Italian-red guest.",
          "Failla Pinot Noir ($17): Pinot Noir · Willamette Valley, Oregon · red berries · lively and fresh. Say it: FAY-luh, wil-AM-it. PAIR Pesce del Giorno, Gnocchi Sorrentina. FOR the easy-red guest and white drinkers crossing over.",
          "Maison Benjamin Leroux Bourgogne Rouge ($30): Pinot Noir · Burgundy · cherry and raspberry · medium-bodied, savory. Benjamin Leroux ran Domaine Comte Armand in Pommard for 15 vintages from age 24, and in 2007 started his own house, with no family vineyards to inherit. Say it: luh-ROO. PAIR Gnocchi Ripieni. FOR the Burgundy lover.",
          "Vino di Anna ‘Sfuso’ ($15): mostly Nerello Mascalese · Mount Etna, Sicily · cherry and plum · light and juicy, served lightly chilled. Natural wine from old vines on volcanic soil. ‘Sfuso’ means loose: on Etna, wine was sold straight from the barrel. Say it: SFOO-zoh. PAIR Polpette, Bruschetta, Spaghetti Bolognese. FOR the ‘surprise me’ guest.",
        ],
      },
    ],
    quiz: [
      {
        id: "figaro-btg-f26-1",
        question: "Every glass of wine at Café Figaro is poured at:",
        options: [
          "5 oz, the industry standard",
          "6 oz for reserve pours, 5 oz for everyday pours",
          "6 oz, every pour in the building",
          "4 oz for reserve pours so they last longer",
        ],
        answer: 2,
        explanation:
          "Every pour is 6 oz, an ounce more than the common 5 oz glass. Say it when it helps; generosity only counts if the guest knows.",
      },
      {
        id: "figaro-btg-f26-2",
        question: "‘I’ll have a Chardonnay, the buttery kind.’ You bring:",
        options: [
          "The Chavy-Chouet, 22: it’s a white Burgundy, so it’s the richest",
          "The Bevan Cellars, 25: rich and creamy",
          "The De Forville, 16: it’s the most popular",
          "Offer the list instead: ‘buttery’ means different things to everyone",
        ],
        answer: 1,
        explanation:
          "Bevan is our rich, creamy Chardonnay. Chavy-Chouet is only lightly oaked, and De Forville has no oak at all.",
      },
      {
        id: "figaro-btg-f26-3",
        question: "A regular asks for ‘the Ramey, like last time.’ Best answer:",
        options: [
          "“We’re out of the Ramey, sorry. Would you like to look at the list again?”",
          "“We’ve moved to Bevan Cellars, also a rich, creamy California Chardonnay. Twenty-five.”",
          "“The Chavy-Chouet is the closest thing we have now, a white Burgundy. Twenty-two.”",
          "“The Bevan replaced it. It’s lighter and crisper, same price.”",
        ],
        answer: 1,
        explanation:
          "Name the replacement, one honest descriptor, the price. Bevan is the rich, creamy one, not lighter, and sending a regular to the list makes them do your job.",
      },
      {
        id: "figaro-btg-f26-4",
        question: "Which statement about the Chavy-Chouet ‘Les Femelottes’ is accurate?",
        options: [
          "It’s unoaked: fermented and aged only in stainless steel",
          "It’s a Meursault, since the family domaine is based in Meursault",
          "It’s a lightly oaked white Burgundy from vines just outside Puligny-Montrachet",
          "It’s the richest, most buttery Chardonnay that we pour by the glass",
        ],
        answer: 2,
        explanation:
          "It’s labeled Bourgogne Blanc, not Meursault, even though the family estate is based there. Lightly oaked sits between De Forville (no oak) and Bevan (rich and creamy).",
      },
      {
        id: "figaro-btg-f26-5",
        question: "The Vino di Anna should reach the guest:",
        options: [
          "Ice-cold, like a white wine, around 40°F",
          "Lightly chilled, about 60–64°F",
          "At room temperature, like every red",
          "Decanted for an hour first",
        ],
        answer: 1,
        explanation:
          "It’s a light, juicy red meant to be served cool, not cold. Tell the guest it’s served that way on purpose.",
      },
      {
        id: "figaro-btg-f26-6",
        question: "Which of these reserve-pour sequences breaks our price rule?",
        options: [
          "“The Hermitage is thirty-five a glass. Shall I bring it?” → pour",
          "Guest points to the Hermitage on the reserve page → “The Hermitage, thirty-five a glass. Coming right up.” → pour",
          "“You have to try the Hermitage” → pour → the price appears on the check",
          "“I’ll bring the Margaux, sixty-five, perfect with the lamb” → pour",
        ],
        answer: 2,
        explanation:
          "Said before it’s poured, every time, even when the guest pointed to it. Learning the price from the check never counts.",
      },
      {
        id: "figaro-btg-f26-7",
        question: "A guest asks about our Hermitage. The accurate one-liner:",
        options: [
          "A Syrah blend from vineyards all along the Rhône Valley",
          "100% Syrah from one granite hill in the northern Rhône",
          "Grenache from the southern Rhône, the same as Châteauneuf-du-Pape",
          "A Cabernet blend from Bordeaux’s Right Bank",
        ],
        answer: 1,
        explanation:
          "Hermitage is a single hill of about 340 acres of vines above the Rhône. Ours is 100% Syrah, nine years old.",
      },
      {
        id: "figaro-btg-f26-8",
        question: "Two guests each order a glass of the Margaux (65) and say they’ll both want a second. You:",
        options: [
          "Pour by the glass; at 65 each, glasses out-earn the bottle",
          "Offer the bottle at 185 before the first pour; four glasses would run 260",
          "Suggest the Hermitage for variety",
          "Mention the bottle price when you drop the check",
        ],
        answer: 1,
        explanation:
          "A bottle is four of our 6 oz glasses. Four Margaux glasses are 260 and the bottle is 185, so say the math before you pour. Guests never resent being saved money.",
      },
      {
        id: "figaro-btg-f26-9",
        question: "Margaux du Château Margaux is accurately described as:",
        options: [
          "The second wine of Château Margaux",
          "The third wine of Château Margaux, from the estate’s own vineyards",
          "Château Margaux’s top wine from a lighter vintage",
          "A Margaux blended from several neighboring estates",
        ],
        answer: 1,
        explanation:
          "The second wine is Pavillon Rouge; Margaux du Château Margaux is the third, made only from the estate’s vineyards. The estate is a First Growth; this wine isn’t, so never call the glass one.",
      },
      {
        id: "figaro-btg-f26-10",
        question: "Our corkage policy, exactly:",
        options: [
          "$30 per bottle, capped at two bottles per table",
          "$30 a bottle, waived for members of our wine club",
          "$30 for the first bottle, then $15 for each one after",
          "$30 a bottle, one waived for each bottle bought from our list",
        ],
        answer: 3,
        explanation:
          "The waiver is per bottle purchased. Say it as generosity, and it turns bring-your-own tables into list sales.",
      },
      {
        id: "figaro-btg-f26-11",
        question: "A Pinot Grigio lover wants ‘something different, but nothing heavy.’ Best move:",
        options: [
          "The Hermann Ludes Riesling, same 16: crisp, light, tastes dry",
          "The Sancerre, 20: “it’s basically a Pinot Grigio”",
          "The Chavy-Chouet, 22: “white Burgundy is our lightest Chardonnay”",
          "The Bevan, 25: a serious step up",
        ],
        answer: 0,
        explanation:
          "The Riesling is the pour built for this guest: same price, same crispness, more personality. Sancerre is a different grape at a higher price, De Forville (not Chavy-Chouet) is our lightest Chardonnay, and Bevan is rich, the opposite of ‘nothing heavy.’",
      },
      {
        id: "figaro-btg-f26-12",
        question: "‘Isn’t Riesling sweet?’ About the Hermann Ludes, the accurate reply:",
        options: [
          "“Yes, but it’s nicely balanced.”",
          "“Not this one. It tastes dry: crisp, light and racy.”",
          "“It’s a dessert wine, so it’s best after dinner.”",
          "“It’s completely bone dry, with zero sugar.”",
        ],
        answer: 1,
        explanation:
          "It has a touch of natural sugar, balanced by high acidity, so it tastes dry. Don’t overclaim ‘zero sugar,’ and don’t call it sweet.",
      },
      {
        id: "figaro-btg-f26-13",
        question: "The Cabernet ladder by the glass, low to high:",
        options: [
          "RouteStock 17 → Keenan 25 → Hamel 28 → Margaux 65",
          "RouteStock 17 → Hamel 25 → Keenan 28 → Margaux 65",
          "Hamel 17 → RouteStock 25 → Keenan 28 → Margaux 65",
          "RouteStock 17 → Hamel 25 → Leroux 30 → Margaux 65",
        ],
        answer: 1,
        explanation:
          "RouteStock, Hamel Stratum, Keenan, then the reserve Margaux. Leroux is a Pinot Noir, not a rung on this ladder.",
      },
      {
        id: "figaro-btg-f26-14",
        question: "A guest loves red Burgundy and is happy to spend. Your pour:",
        options: [
          "The Failla, 17: “Oregon Pinot is the same as Burgundy”",
          "The Benjamin Leroux, 30: “Pinot Noir from Burgundy itself”",
          "The Keenan, 28: “our most serious red by the glass”",
          "The Schiavenza Barolo, 25: “it’s like Burgundy”",
        ],
        answer: 1,
        explanation:
          "The Leroux is the red Burgundy on the everyday card. (This month’s reserve selection may be a Burgundy too; check at pre-shift.) Never claim one region tastes the same as another.",
      },
      {
        id: "figaro-btg-f26-15",
        question: "A guest asks what makes the Sapaio a ‘Super Tuscan.’ The accurate answer:",
        options: [
          "It’s a Chianti Classico aged extra long before release",
          "It’s any Tuscan red that sells for over $20 a glass",
          "The informal name for Tuscan reds made outside the old rules",
          "It’s a Sangiovese from Montalcino, aged five years",
        ],
        answer: 2,
        explanation:
          "‘Super Tuscan’ isn’t a legal category. It describes Tuscan reds that broke with tradition, often using Bordeaux grapes, like the Sapaio from Bolgheri on the coast.",
      },
      {
        id: "figaro-btg-f26-16",
        question: "Faugier-Gonnet Hermitage is said:",
        options: [
          "FAW-jee-er GON-et HER-mih-tij",
          "foh-ZHYAY goh-NAY, air-mee-TAHZH",
          "foh-GEER goh-NET, her-MEE-tahzh",
          "foh-ZHAY GON-ay, air-MIT-ij",
        ],
        answer: 1,
        explanation:
          "foh-ZHYAY goh-NAY, air-mee-TAHZH. Saying it wrong at the table costs more confidence than not knowing a tasting note.",
      },
      {
        id: "figaro-btg-f26-17",
        question: "A guest says their glass smells musty, like wet cardboard. You:",
        options: [
          "Explain that’s minerality, a sign of serious wine",
          "Bring them a fresh glass poured from the same bottle",
          "Offer to move them to a different wine at the same price",
          "Apologize, pour from a new bottle, and tell a manager",
        ],
        answer: 3,
        explanation:
          "Cork taint lives in the BOTTLE, so a fresh glass from it has the same flaw. Replace, report, never debate.",
      },
      {
        id: "figaro-btg-f26-18",
        question: "Two desserts just landed at a four-top that finished their wine. Best offer:",
        options: [
          "Espresso for the table, to wind the meal down",
          "Another round of the reds they were drinking at dinner",
          "The Moscato d’Asti half bottle: “thirty-two, made for dessert”",
          "A reserve pour each, offered as a nightcap",
        ],
        answer: 2,
        explanation:
          "Big reds fight dessert, and espresso ends the spending. Sweet, sparkling and shareable, the Moscato half is built for this exact table.",
      },
    ],
  },
  {
    id: "figaro-cocktails",
    order: 12,
    phase: 3,
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
    phase: 3,
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
          "SAFETY SEEKER \u2014 wants the familiar. Coach servers to give the classic (Walch, Bevan, RouteStock) and never challenge. Comfort is hospitality.",
          "CURIOUS \u2014 wants a nudge. Same-price swaps: the Ludes Riesling for Pinot Grigio, the chilled Vino di Anna for \u2018surprise me.\u2019 Zero-risk adventure.",
          "CELEBRATOR \u2014 wants the moment marked. Champagne Aubry by the glass, six ounces, or the Margaux on the reserve page. No hesitation.",
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
    ],
  },
  {
    id: "andiamo-menu",
    order: 14,
    phase: 3,
    section: "What We Sell",
    title: "Andiamo: The Dinner Menu",
    summary:
      "Every dish on the current menu \u2014 what's in it, who it's for, and how to sell it.",
    minutes: 12,
    requiredFor: SERVICE_TEAM,
    location: "Andiamo",
    lessons: [
      {
        heading: "Antipasti & Insalate",
        intro: "The first order sets the table's pace \u2014 know these cold.",
        points: [
          "Calamari Fritti ($20) \u2014 fresh squid, garlic, lemon, chipotle aioli. The crowd-pleaser while a table decides.",
          "Saut\u00e9ed Prawns ($25, GF) \u2014 lemon butter, garlic, white wine. For the seafood table that wants to start rich.",
          "Bruschetta al Pomodoro ($11, V) and Burrata Caprese ($17, GF\u00b7V) \u2014 the light, fresh openers.",
          "Polpette di Manzo ($16) \u2014 Snake River Farms wagyu meatballs. Say 'wagyu' \u2014 it sells itself.",
          "Apple & Brie Flatbread ($17, V) \u2014 caramelized apple, onion, brie, arugula, honey, truffle oil. The unexpected one guests remember.",
          "Brussels Sprouts & Pancetta ($15, GF) \u00b7 Octopus 'Pulpo' ($19, GF) \u00b7 Steamed Mussels ($21) round out the starters.",
          "Salads: Cesare (one $12 / two $17), Watermelon (GF\u00b7V \u2014 feta, candied walnut, lemon-mint), Rucola (GF\u00b7V). Add chicken $6, prawns $9, salmon $16.",
        ],
      },
      {
        heading: "Pizza & Pasta",
        intro: "The heart of the menu \u2014 and where regulars have their favorites.",
        points: [
          "Pizza: Margherita $22 \u00b7 Diavola $23 (spicy sausage, mushroom) \u00b7 Vegetariana $23 \u00b7 Pepperoni $23 \u00b7 Bianca con Prosciutto $25 (no tomato \u2014 crimini, arugula, prosciutto, truffle oil).",
          "SIGNATURE \u2014 Lobster Ravioli ($35): lemon butter cream, tiger prawns. Lead with this for celebrations.",
          "Seafood pastas: Fettuccine alla Adriatica ($30 \u2014 rock shrimp, scallop, sun-dried tomato cream), Linguine con Vongole ($30 \u2014 manila clams, chili), Linguine Frutti di Mare ($36 \u2014 mixed seafood, tomato saffron).",
          "Wild Mushroom Agnolotti ($31, V): truffle tartufata cream, roasted cherry tomato. The vegetarian showstopper.",
          "Comfort row: Pappardelle Bolognese $28 \u00b7 Spaghetti & Meatballs $29 (two wagyu) \u00b7 Fettuccine Alfredo $23 \u00b7 Rigatoni alla Vodka $26 \u00b7 Linguine al Pesto $25 (pine nuts) \u00b7 Gnocchi Gorgonzola $27.",
          "Distinctive: Bucatini alla Calabrese ($29 \u2014 calabrese sausage, calabrian chili: the spicy one), Tortellini Michelangelo ($28 \u2014 chicken & veal, pancetta, peas, cream), SIGNATURE Rigatoni alla Norma ($28, V \u2014 roasted eggplant, ricotta), Pappardelle al Filetto ($33 \u2014 filet mignon, marsala).",
        ],
        image: {
          src: "/mushroom-agnolotti.jpg",
          alt: "Wild Mushroom Agnolotti",
          caption: "Wild Mushroom Agnolotti \u2014 truffle tartufata cream, the vegetarian showstopper",
        },
      },
      {
        heading: "Secondi: Chicken, Veal, Grill & Seafood",
        points: [
          "Pollo ($30\u201331): Parmigiana (breaded, marinara, mozzarella, linguini), Piccata (caper-lemon-butter), Marsala.",
          "Vitello ($34\u201335): Marsala, Piccata, and Saltimbocca \u2014 prosciutto, sage, mozzarella, demi-glace.",
          "Grill (GF): New York Steak $43 (12oz choice, peppercorn brandy) \u00b7 Skirt Steak $43 (chimichurri, onion rings, mash).",
          "SIGNATURE \u2014 Rack of Lamb ($45, GF): garlic, rosemary, balsamic reduction. The premium anchor of the menu.",
          "SIGNATURE \u2014 Branzino ($38, GF): cherry tomato, olives, capers, white wine, orzo. The elegant lighter choice.",
          "Frutti di Mare 'Cioppino' ($36, GF \u2014 tomato-saffron broth, crostini) and Salmon Piccata ($36, GF) complete the seafood.",
        ],
        image: {
          src: "/lamb-chops.jpg",
          alt: "Rack of lamb",
          caption: "Rack of Lamb \u2014 garlic, rosemary, balsamico. Our premium anchor",
        },
      },
      {
        heading: "Dietary Flags & the Allergy Rule",
        intro: "These flags are printed on the menu \u2014 anything beyond them, ask the kitchen. Never guess.",
        points: [
          "GF on the menu: Saut\u00e9ed Prawns, Brussels & Pancetta, Octopus, Burrata Caprese, Watermelon Salad, Rucola, both steaks, Rack of Lamb, Branzino, Cioppino, Salmon Piccata.",
          "Gluten-free & vegan lentil pasta can replace the pasta in ANY pasta dish \u2014 the single most useful sentence for dietary tables.",
          "V (vegetarian): Bruschetta, Flatbread, Burrata, Watermelon, Rucola, Margherita, Vegetariana, Gnocchi Gorgonzola, Vodka, Alfredo, Pesto, Agnolotti, Norma.",
          "The menu asks guests to tell us ('please inform your server of any allergies or intolerances') \u2014 our house standard goes further: we ask every table, and every allergy goes to the kitchen, flagged in the POS and said out loud.",
          "If a modification isn't printed here, the answer is 'let me confirm with the kitchen' \u2014 never 'I think so.'",
        ],
      },
      {
        heading: "Selling the Menu",
        points: [
          "Know the four printed signatures by heart \u2014 Lobster Ravioli, Rigatoni alla Norma, Rack of Lamb, Branzino \u2014 and lead with one when a guest says 'what's good?'",
          "Celebration table \u2192 Lobster Ravioli or Rack of Lamb. Light and elegant \u2192 Branzino. Vegetarian who wants special \u2192 Agnolotti. Spice-seeker \u2192 Bucatini alla Calabrese or Diavola.",
          "Salad add-ons are the easiest honest upsell: 'Would you like grilled prawns or salmon on the Rucola?'",
          "Describe with the defining ingredient, not adjectives: 'the Adriatica is rock shrimp and scallops in a sun-dried tomato cream' beats 'it's really good.'",
        ],
      },
    ],
    quiz: [
      {
        id: "andiamo-menu-1",
        question: "A guest asks what's in the Fettuccine alla Adriatica:",
        options: [
          "Rock shrimp and scallops in a sun-dried tomato white-wine cream",
          "Manila clams, garlic, and chili",
          "Mixed seafood in tomato saffron",
          "Tiger prawns in lemon butter cream",
        ],
        answer: 0,
        explanation:
          "Adriatica = rock shrimp + scallop, sun-dried tomato, white wine cream. (Clams = Vongole; mixed seafood = Frutti di Mare; tiger prawns = Lobster Ravioli.)",
      },
      {
        id: "andiamo-menu-2",
        question: "Our meatballs are made from:",
        options: [
          "House-ground beef and pork",
          "Snake River Farms wagyu",
          "Veal and ricotta",
          "Angus chuck",
        ],
        answer: 1,
        explanation:
          "Snake River Farms wagyu \u2014 in the Polpette starter and Spaghetti & Meatballs. Say 'wagyu'; it's a selling point.",
      },
      {
        id: "andiamo-menu-3",
        question: "A gluten-free guest wants pasta. What do you tell them?",
        options: [
          "Unfortunately pasta isn't possible",
          "Only the risotto works",
          "Any pasta dish can be made with our gluten-free & vegan lentil pasta",
          "The gnocchi is gluten-free",
        ],
        answer: 2,
        explanation:
          "Printed right on the menu: gluten-free & vegan lentil pasta is available for any pasta dish.",
      },
      {
        id: "andiamo-menu-4",
        question: "Which pasta has filet mignon in it?",
        options: [
          "Tortellini alla Michelangelo",
          "Pappardelle alla Bolognese",
          "Pappardelle al Filetto",
          "Bucatini alla Calabrese",
        ],
        answer: 2,
        explanation:
          "Pappardelle al Filetto ($33) \u2014 filet mignon, cherry tomato, mushroom, marsala.",
      },
      {
        id: "andiamo-menu-5",
        question: "A guest wants something spicy. Best recommendations:",
        options: [
          "Alfredo or Margherita",
          "Bucatini alla Calabrese or the Diavola pizza",
          "Branzino or Salmon Piccata",
          "Gnocchi Gorgonzola",
        ],
        answer: 1,
        explanation:
          "Calabrese = calabrese sausage + calabrian chili; Diavola = spicy Italian sausage. Those are the heat.",
      },
      {
        id: "andiamo-menu-6",
        question: "The Bianca con Prosciutto pizza is different from the others because:",
        options: [
          "It's the only one with mushrooms",
          "It has no tomato \u2014 mozzarella base with crimini, arugula, prosciutto, and truffle oil",
          "It's gluten-free",
          "It comes in two sizes",
        ],
        answer: 1,
        explanation:
          "Bianca = white pizza. No tomato; finished with prosciutto, arugula, parmigiano, truffle oil.",
      },
      {
        id: "andiamo-menu-7",
        question: "Which of these is NOT one of our printed signatures?",
        options: [
          "Lobster Ravioli",
          "Rack of Lamb",
          "Branzino",
          "Fettuccine Alfredo",
        ],
        answer: 3,
        explanation:
          "Signatures on the menu: Lobster Ravioli, Rigatoni alla Norma, Rack of Lamb, Branzino. Alfredo is a classic, not a signature.",
      },
      {
        id: "andiamo-menu-8",
        question: "A celebration table asks 'what's special here?' Your best lead:",
        options: [
          "List the whole pasta section",
          "The Lobster Ravioli \u2014 lemon butter cream with tiger prawns \u2014 or the Rack of Lamb",
          "Whatever is cheapest",
          "Spaghetti & Meatballs",
        ],
        answer: 1,
        explanation:
          "Lead with a signature. Celebrations want the dish with a story \u2014 ravioli or the lamb.",
      },
      {
        id: "andiamo-menu-9",
        question: "What comes with the Branzino?",
        options: [
          "Mashed potato and onion rings",
          "Cherry tomato, olives, capers, lemon, white wine \u2014 over orzo",
          "Linguini marinara",
          "Risotto",
        ],
        answer: 1,
        explanation:
          "Branzino (GF, $38): cherry tomato, olives, capers, lemon, white wine, orzo. The elegant lighter signature.",
      },
      {
        id: "andiamo-menu-10",
        question: "Salad protein add-ons are priced:",
        options: [
          "Chicken $6 \u00b7 prawns $9 \u00b7 salmon $16",
          "Chicken $9 \u00b7 prawns $12 \u00b7 salmon $18",
          "All add-ons $10",
          "Chicken $5 \u00b7 prawns $10 \u00b7 steak $15",
        ],
        answer: 0,
        explanation:
          "Chicken 6, prawns 9, salmon 16 \u2014 the easiest honest upsell on the menu.",
      },
      {
        id: "andiamo-menu-11",
        question: "A guest mentions a shellfish allergy and orders the Cioppino. You:",
        options: [
          "Serve it \u2014 the broth is what matters",
          "Suggest removing the mussels",
          "Stop \u2014 Cioppino is clams, mussels, and shrimp; guide them elsewhere and flag the allergy to the kitchen",
          "Offer extra crostini instead",
        ],
        answer: 2,
        explanation:
          "Cioppino IS shellfish. Redirect (Branzino, Salmon Piccata, a steak) and make sure the kitchen knows about the allergy either way.",
      },
      {
        id: "andiamo-menu-12",
        question: "The vegetarian guest who wants something special gets steered to:",
        options: [
          "Fettuccine Alfredo",
          "The Wild Mushroom Agnolotti \u2014 truffle tartufata cream, roasted cherry tomato",
          "A side of Brussels sprouts",
          "The Margherita",
        ],
        answer: 1,
        explanation:
          "The Agnolotti is the vegetarian showstopper \u2014 truffle tartufata cream, roasted cherry tomato, $31.",
      },
    ],
  },
  {
    id: "figaro-menu",
    order: 15,
    phase: 3,
    section: "What We Sell",
    title: "Caf\u00e9 Figaro: The Summer Menu",
    summary:
      "The Summer 2026 menu \u2014 every dish, the seasonal features, and how to guide the table.",
    minutes: 12,
    requiredFor: SERVICE_TEAM,
    location: "Cafe Figaro",
    lessons: [
      {
        heading: "Antipasti, Zuppe & Insalate",
        intro: "Figaro since 1989 \u2014 guests expect you to know this menu like family.",
        points: [
          "Bruschetta $13 (heirloom tomato) \u00b7 Funghi Ripieni $18 (stuffed mushroom, sausage, mozzarella) \u00b7 Calamari Fritti $21 (chipotle aioli).",
          "Carpaccio di Manzo $22 \u2014 raw beef fillet, capers, lemon, parmigiano. For the confident palate.",
          "Polpette $18 \u2014 Snake River Farms wagyu meatballs. Capesante $28 \u2014 seared scallops, lemon butter: the premium starter.",
          "Burrata e Prosciutto $21 \u2014 parma prosciutto, balsamico, truffle honey.",
          "SUMMER \u2014 Pesche Grigliate $23: grilled peach, burrata, prosciutto, mint. Lead with this while it lasts.",
          "Soups & salads: Minestrone $11 \u00b7 Cesare (one $14 / two $22 \u2014 NOTE: contains anchovy) \u00b7 Caprese $16 (bufala) \u00b7 Rucola $16 (cranberry, walnut) \u00b7 Napa Cabbage $18 (pepper bacon, blue cheese, warm red-wine dijon).",
          "SUMMER \u2014 Insalata California $16: baby greens, avocado, castelvetrano olives, sun-dried tomato, dijon-apple cider. Add-ons: chicken $6 \u00b7 prawns $9 \u00b7 salmon $16.",
        ],
      },
      {
        heading: "Pasta & Risotto",
        points: [
          "Spaghetti Bolognese $27 (slow-cooked rag\u00f9) \u00b7 Lasagna alla Figaro $28 (rag\u00f9, b\u00e9chamel) \u00b7 Rigatoni alla Vodka $27 \u00b7 Gnocchi Sorrentina $26 (tomato, mozzarella, basil).",
          "Tortellini Michelangelo $28 \u2014 chicken & veal, pancetta, peas, cream. A Figaro classic.",
          "Seafood: Linguine alle Vongole $31 (manila clams, chili) \u00b7 Fettuccine Adriatica $29 (rock shrimp, scallop, sun-dried tomato cream) \u00b7 Linguine Mediterranea $29 (tiger prawn, olive, mushroom, FETA, white wine).",
          "Pappardelle Figaro $36 \u2014 filet mignon, cherry tomato, mushroom, marsala. The pasta for steak people.",
          "Fusilloni al Pesto $24 \u00b7 Fettuccine Alfredo $23. Lentil pasta available for any dish.",
          "RISOTTO \u2014 made with acquerello (aged carnaroli rice, the best there is): Ai Frutti di Mare $36 (prawn, scallop, clam, saffron) \u00b7 Ai Funghi Porcini $28. Tell guests why acquerello matters \u2014 it's a story worth $36.",
        ],
      },
      {
        heading: "Pollo, Vitello, Pesce & Griglia",
        points: [
          "Pollo: Parmigiana $32 \u00b7 Piccata $30 \u00b7 Monterey $32 \u2014 grilled breast, peas, artichoke cream, over risotto. Monterey is the one guests haven't had elsewhere.",
          "Vitello ($35\u201337): Saltimbocca (prosciutto, sage, white wine demi) \u00b7 Piccata \u00b7 Marsala \u00b7 Impanate (breaded cutlet, garlic butter \u2014 the only breaded one).",
          "SUMMER \u2014 Halibut all'Acqua Pazza $45: pacific halibut, san marzano, castelvetrano olives, white wine, grilled bread. The seasonal showpiece.",
          "Frutti di Mare 'Cioppino' $36 \u2014 prawn, scallop, clam, mussel, CRAB, saffron tomato.",
          "Gamberi Mediterranea $30 \u2014 tiger prawns, olive, cherry tomato, feta, white wine.",
          "Grill: Bistecca $49 (12oz PRIME New York, peppercorn brandy) \u00b7 Agnello $49 (lamb chops, garlic, rosemary, balsamico).",
        ],
      },
      {
        heading: "House Rules of the Menu",
        intro: "Printed at the bottom of the menu \u2014 and part of the Figaro story.",
        points: [
          "'Don't see something you remember? Ask \u2014 many of our dishes still live in the kitchen.' Long-time regulars order off-menu classics; take the request to the kitchen, never say no outright.",
          "Kindly share any allergies \u2014 ask every table, flag every allergy to the kitchen.",
          "The Cesare contains anchovy \u2014 say it before a fish-averse or allergic guest finds out.",
          "Lentil pasta swaps into any pasta dish for gluten-free guests.",
          "Anything not printed \u2014 modifications, prep questions \u2014 is a kitchen question. 'Let me confirm' beats guessing, every time.",
        ],
      },
      {
        heading: "Selling the Summer",
        points: [
          "Seasonal features are your openers: Pesche Grigliate to start, Halibut all'Acqua Pazza as the main event, Insalata California for the light lunch crowd.",
          "Premium anchors: Bistecca and Agnello at $49, halibut at $45, seafood risotto at $36 \u2014 describe with ingredients, recommend with confidence.",
          "The acquerello risotto story and 'dishes that still live in the kitchen' are what make Figaro feel like it's been on Broadway since 1989 \u2014 use them.",
          "Steak-lover at a pasta table \u2192 Pappardelle Figaro. Adventurous starter \u2192 Carpaccio or Capesante. Peach season is short \u2014 say so.",
        ],
      },
    ],
    quiz: [
      {
        id: "figaro-menu-1",
        question: "A guest with a fish allergy orders the Cesare. What do you need to know?",
        options: [
          "Nothing \u2014 it's just romaine and parmigiano",
          "The house caesar contains anchovy \u2014 tell them and flag the kitchen",
          "Only the two-person size has anchovy",
          "Swap the dressing silently",
        ],
        answer: 1,
        explanation:
          "Printed on the menu: romaine, ANCHOVY, parmigiano, house caesar. Say it before it becomes a problem.",
      },
      {
        id: "figaro-menu-2",
        question: "What is the Pesche Grigliate?",
        options: [
          "Grilled prawns with peach salsa",
          "A summer starter \u2014 grilled peach, burrata, prosciutto, mint",
          "A peach dessert",
          "A prosciutto flatbread",
        ],
        answer: 1,
        explanation:
          "The summer feature starter, $23. Peach season is short \u2014 lead with it while it lasts.",
      },
      {
        id: "figaro-menu-3",
        question: "Our risotto is special because:",
        options: [
          "It's made to order in 10 minutes",
          "It's made with acquerello \u2014 aged carnaroli rice",
          "It's baked",
          "It comes with truffle on every version",
        ],
        answer: 1,
        explanation:
          "Acquerello aged carnaroli \u2014 the finest risotto rice. That story is what justifies $36 for the Frutti di Mare.",
      },
      {
        id: "figaro-menu-4",
        question: "The Pappardelle Figaro is the pasta you recommend to:",
        options: [
          "The vegetarian",
          "The steak lover \u2014 it's filet mignon, cherry tomato, mushroom, marsala",
          "The guest avoiding cream",
          "Kids",
        ],
        answer: 1,
        explanation:
          "Filet mignon in a pasta, $36 \u2014 the bridge for the guest who always orders steak.",
      },
      {
        id: "figaro-menu-5",
        question: "This summer's seasonal fish entr\u00e9e is:",
        options: [
          "Salmon Piccata",
          "Branzino",
          "Halibut all'Acqua Pazza \u2014 san marzano, castelvetrano olives, white wine, grilled bread",
          "Grilled ahi",
        ],
        answer: 2,
        explanation:
          "Pacific halibut 'in crazy water' \u2014 the $45 summer showpiece.",
      },
      {
        id: "figaro-menu-6",
        question: "A regular asks for a dish that isn't on the menu anymore. You:",
        options: [
          "Tell them it's discontinued",
          "Say 'many of our dishes still live in the kitchen' and ask the kitchen",
          "Offer the closest current dish without asking",
          "Suggest they visit Andiamo instead",
        ],
        answer: 1,
        explanation:
          "It's printed on the menu itself \u2014 off-menu classics live in the kitchen. Never a flat no at Figaro.",
      },
      {
        id: "figaro-menu-7",
        question: "Which pasta contains feta?",
        options: [
          "Linguine Mediterranea",
          "Fusilloni al Pesto",
          "Gnocchi Sorrentina",
          "Lasagna alla Figaro",
        ],
        answer: 0,
        explanation:
          "Mediterranea = tiger prawn, olive, mushroom, feta, white wine \u2014 same flavors as the Gamberi entr\u00e9e.",
      },
      {
        id: "figaro-menu-8",
        question: "The Chicken Monterey is:",
        options: [
          "Breaded with marinara and mozzarella",
          "Grilled breast with peas and artichoke cream over risotto",
          "Scallopini with capers and lemon",
          "Stuffed with prosciutto",
        ],
        answer: 1,
        explanation:
          "Monterey ($32) \u2014 grilled, artichoke cream, risotto. The chicken dish guests haven't had elsewhere.",
      },
      {
        id: "figaro-menu-9",
        question: "Which veal preparation is breaded?",
        options: ["Saltimbocca", "Piccata", "Marsala", "Impanate"],
        answer: 3,
        explanation:
          "Impanate ($35) = breaded cutlet, garlic butter, olive oil. 'Impanate' literally means breaded.",
      },
      {
        id: "figaro-menu-10",
        question: "What makes Figaro's Cioppino different from a typical one?",
        options: [
          "It has no shellfish",
          "It includes crab along with prawn, scallop, clam, and mussel in saffron tomato",
          "It's served over pasta",
          "It's a cream base",
        ],
        answer: 1,
        explanation:
          "Prawn, scallop, clam, mussel, AND crab \u2014 saffron tomato broth, $36.",
      },
      {
        id: "figaro-menu-11",
        question: "The Bistecca is:",
        options: [
          "12oz USDA choice New York",
          "12oz PRIME New York strip with peppercorn brandy \u2014 $49",
          "A ribeye with chimichurri",
          "8oz filet",
        ],
        answer: 1,
        explanation:
          "Prime grade \u2014 a step above choice. That word belongs in your description at $49.",
      },
      {
        id: "figaro-menu-12",
        question: "A gluten-free guest at Figaro wants pasta. You offer:",
        options: [
          "Only the risotto",
          "Lentil pasta \u2014 available for any pasta dish",
          "Half portions",
          "The lasagna without noodles",
        ],
        answer: 1,
        explanation:
          "Same house rule as Andiamo: lentil pasta swaps into any dish. (Risotto is a great second option.)",
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
  return MODULES.filter(
    (m) =>
      atLocation(m, location) &&
      !m.requiredFor.includes(role) &&
      !m.hiddenUnlessRequired,
  );
}
