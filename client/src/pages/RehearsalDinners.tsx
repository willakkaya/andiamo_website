import { useState } from "react";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { trackPhoneClick, trackEventMenusClick } from "@/lib/analytics";
import { ADDITIONS } from "@/data/eventMenus";
import EventMenuRates from "@/components/event-menus/EventMenuRates";
import InquirySlip from "@/components/event-menus/InquirySlip";

/* Rehearsal dinners. A sibling of the holiday page, not a copy: the lead is the
   Vault's one long table, the rooms sit side by side, and the toasts get their own ledger. */

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal";
const LABEL = "font-body text-[11px] font-medium uppercase tracking-[0.2em]";

const ROOMS = [
  {
    id: "vault",
    slipRoom: "The Vault",
    from: "12",
    to: "22",
    name: "The Vault",
    directory: "One long table, behind the steel door",
    body:
      "One long table, red walls, and a door that closes. Screen and sound are built in for the slideshow and the speeches.",
    facts: [
      ["Seated", "12 to 22 guests"],
      ["Private", "Yes, the room is yours"],
      ["Menus", "$65 · $80 · $120 per guest"],
    ],
    cta: "Hold The Vault",
    image: IMAGES.vaultAlt,
    alt: "Inside The Vault: red walls, framed photographs of old Linden Avenue, and a table set for dinner",
  },
  {
    id: "dining-room",
    slipRoom: "The dining room",
    from: "23",
    to: "100",
    name: "The dining room",
    directory: "The banking hall, for bigger families",
    body:
      "The banking hall, under the original columns. Take a section or the full room. No buyout is required.",
    facts: [
      ["Seated", "23 to 100 guests"],
      ["Buyout", "Not required"],
      ["Menus", "$65 · $80 · $120 per guest"],
    ],
    cta: "Hold the dining room",
    image: IMAGES.diningRoom,
    alt: "The main dining room at Andiamo in Banca, tables set in long rows beneath the original columns",
  },
];

// Straight from the shared menu data, so these prices can never drift from the menus page
const TOASTS = ["champagne", "limoncello", "antipasto"]
  .map((key) => ADDITIONS.find((a) => a.key === key))
  .filter((a): a is (typeof ADDITIONS)[number] => Boolean(a));

export default function RehearsalDinners() {
  usePageMeta("/rehearsal-dinners");
  const [room, setRoom] = useState("");

  return (
    <PageLayout>
      {/* ========== HERO — the long table leads ========== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:h-screen lg:min-h-[44rem] lg:max-h-[54rem]">
        <div className="h-80 sm:h-96 lg:h-auto pt-20 lg:pt-0 bg-espresso">
          <img
            src={IMAGES.vault}
            alt="The Vault private dining room: red walls and one long table set for dinner"
            width={1600}
            height={1067}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="section-cream">
          <div className="h-full flex flex-col justify-end px-6 sm:px-10 lg:pl-16 lg:pr-[max(3rem,calc((100vw-1320px)/2+3rem))] pt-14 lg:pt-28 pb-14 lg:pb-12">
            <p className={`${LABEL} text-charcoal/70`}>Rehearsal dinners</p>
            <h1 className="font-display text-[2.75rem] md:text-5xl xl:text-[3.4rem] text-charcoal leading-[1.04] mt-4">
              The night before, at one long table.
            </h1>
            <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-5 max-w-xl">
              Most rehearsal dinners fit The Vault: twelve to twenty-two guests at one long table, behind
              the bank&rsquo;s original steel door. Bigger families take the dining room.
            </p>

            <nav aria-label="Rooms by party size" className="mt-8 rule-double max-w-xl">
              {ROOMS.map((r) => (
                <a
                  key={r.id}
                  href={`#${r.id}`}
                  className={`group grid grid-cols-[6.5rem_1fr_auto] sm:grid-cols-[8.5rem_1fr_auto] items-baseline gap-x-5 py-3.5 border-b border-charcoal/15 hover:bg-warm-white transition-colors duration-300 ${FOCUS}`}
                >
                  <span className="font-display lining-nums text-3xl sm:text-4xl text-charcoal leading-none">
                    {r.from}–{r.to}
                  </span>
                  <span>
                    <span className="block font-display text-[0.8rem] uppercase tracking-[0.32em] text-charcoal">{r.name}</span>
                    <span className="block font-accent text-[0.95rem] text-charcoal/70 mt-1">{r.directory}</span>
                  </span>
                  <span aria-hidden="true" className="font-accent text-xl text-charcoal/70 transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ========== THE TWO ROOMS, side by side ========== */}
      <section className="bg-background py-20 md:py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-16">
          {ROOMS.map((r) => (
            <article key={r.id} id={r.id} aria-labelledby={`${r.id}-heading`} className="scroll-mt-8">
              <div className="aspect-[3/2] overflow-hidden">
                <img src={r.image} alt={r.alt} loading="lazy" width={1200} height={800} className="w-full h-full object-cover" />
              </div>
              <p className="font-display lining-nums text-charcoal leading-[0.82] text-[5rem] sm:text-[6rem] xl:text-[7rem] tracking-[-0.02em] mt-9" aria-hidden="true">
                {r.from}
                <span className="font-accent italic text-[0.3em] tracking-normal align-[1.1em] mx-[0.15em] text-gold-dark">to</span>
                {r.to}
              </p>
              <h2 id={`${r.id}-heading`} className="font-display text-[0.9rem] uppercase tracking-[0.32em] text-charcoal border-t border-charcoal/30 pt-5 mt-6">
                {r.name}
                <span className="sr-only">, {r.from} to {r.to} guests</span>
              </h2>
              <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-4">{r.body}</p>
              <dl className="mt-6 border-t border-charcoal/10">
                {r.facts.map(([term, desc]) => (
                  <div key={term} className="flex items-baseline justify-between gap-6 border-b border-charcoal/10 py-2.5">
                    <dt className={`${LABEL} text-charcoal/70`}>{term}</dt>
                    <dd className="font-accent lining-nums text-charcoal text-right">{desc}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-7">
                <a href="#hold-a-date" onClick={() => setRoom(r.slipRoom)} className={`link-line ${LABEL} text-charcoal ${FOCUS}`}>
                  {r.cta} <span aria-hidden="true">&darr;</span>
                </a>
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ========== THE MENUS ========== */}
      <section className="section-cream py-20 md:py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-8">
          <div className="lg:col-span-4">
            <p className={`${LABEL} text-gold-dark`}>The menus</p>
            <h2 className="font-display text-3xl md:text-[2.6rem] text-charcoal leading-[1.08] mt-4">
              Three dinners, posted per guest.
            </h2>
            <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-5 max-w-sm">
              Every course is served at the table, each guest chooses their own main course, and dietary
              needs are handled on request.
            </p>
          </div>
          <div className="lg:col-span-8">
            <EventMenuRates variant="rows" tiers={["dinner65", "dinner80", "dinner120"]} source="rehearsal-rates" />
          </div>
        </div>
      </section>

      {/* ========== FOR THE TOASTS ========== */}
      <section className="bg-background py-20 md:py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-8">
          <div className="lg:col-span-4">
            <p className={`${LABEL} text-gold-dark`}>For the toasts</p>
            <h2 className="font-display text-3xl md:text-[2.6rem] text-charcoal leading-[1.08] mt-4">
              Someone will want to say a few words.
            </h2>
            <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-5 max-w-sm">
              The Vault has a screen and sound for the slideshow. The owner coordinates every private
              event personally, and handles the timing on the night, toasts included.
            </p>
          </div>
          <ul className="lg:col-span-8 border-t border-charcoal/25 self-start">
            {TOASTS.map((a) => (
              <li key={a.key} className="py-4 border-b border-charcoal/10">
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-lg md:text-xl text-charcoal">{a.label}</span>
                  <span aria-hidden="true" className="flex-1 border-b border-dotted border-charcoal/30 mb-1.5 min-w-[1.5rem]" />
                  <span className="font-accent lining-nums tabular-nums text-lg text-charcoal shrink-0">${a.price} per guest</span>
                </div>
                <p className="font-accent text-charcoal/70 text-base leading-relaxed mt-1 max-w-xl">{a.desc}</p>
                {a.includedIn120 && (
                  <p className={`${LABEL} text-charcoal/70 mt-1.5`}>Included in the $120 menu</p>
                )}
              </li>
            ))}
            <li className="pt-5">
              <Link href="/banquet-catering#additions" onClick={() => trackEventMenusClick("rehearsal-toasts")} className={`link-line ${LABEL} text-charcoal ${FOCUS}`}>
                Wine pairings and every addition
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ========== THE SLIP ========== */}
      <section id="hold-a-date" aria-labelledby="slip-heading" className="section-cream py-20 md:py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-10">
          <div className="lg:col-span-4">
            <p className={`${LABEL} text-gold-dark`}>Withdrawal slip</p>
            <h2 id="slip-heading" className="font-display text-3xl md:text-[2.6rem] text-charcoal leading-[1.08] mt-4">
              Hold the night before.
            </h2>
            <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-5 max-w-sm">
              Send the slip or call the events desk. You get availability and a written proposal back
              from the owner, who coordinates every private event personally.
            </p>
            <p className="font-display lining-nums text-2xl md:text-3xl text-charcoal mt-7">
              <a href="tel:+16507458811" onClick={() => trackPhoneClick("rehearsal-dinners")} className={`link-line ${FOCUS}`}>
                {LINKS.phone}
              </a>
            </p>
            <p className="font-accent text-lg mt-1">
              <a href={`mailto:${LINKS.email}`} className={`link-line text-charcoal ${FOCUS}`}>{LINKS.email}</a>
            </p>
          </div>
          <div className="lg:col-span-8">
            <InquirySlip
              source="rehearsal-dinners"
              subject="Rehearsal Dinner Inquiry"
              slipNo="301"
              room={room}
              onRoomChange={setRoom}
              dateLabel="Date of the dinner"
              companyLabel="Names of the couple"
            />
          </div>
        </div>
      </section>

      {/* ========== Closing row ========== */}
      <section className="bg-background py-12">
        <div className="container">
          <ul className={`flex flex-wrap gap-x-9 gap-y-3 border-t border-charcoal/25 pt-7 ${LABEL} text-charcoal/80`}>
            <li>
              <Link href="/banquet-catering" onClick={() => trackEventMenusClick("rehearsal-closing")} className={`link-line ${FOCUS}`}>
                Event menus &amp; pricing
              </Link>
            </li>
            <li><Link href="/banquet-catering#quote-calculator" className={`link-line ${FOCUS}`}>Estimate your event</Link></li>
            <li><Link href="/the-vault" className={`link-line ${FOCUS}`}>The Vault</Link></li>
            <li><Link href="/private-events" className={`link-line ${FOCUS}`}>All private events</Link></li>
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
