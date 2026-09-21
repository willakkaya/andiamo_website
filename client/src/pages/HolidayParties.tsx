import { useState } from "react";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { trackPhoneClick, trackEventMenusClick } from "@/lib/analytics";
import EventMenuRates from "@/components/event-menus/EventMenuRates";
import InquirySlip from "@/components/event-menus/InquirySlip";

/* Holiday parties, organised the way a planner thinks: by headcount.
   The hero is a building directory; each room is a band; the inquiry is a bank slip. */

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
    directory: "Private, behind the steel door",
    body:
      "The bank's original vault: red walls, one long table, and a steel door that weighs two tons. Screen and sound are built in for a toast or a year-end review.",
    facts: [
      ["Seated", "12 to 22 guests"],
      ["Menus", "$65 · $80 · $120 per guest"],
      ["Private", "Yes, the room is yours"],
    ],
    cta: "Hold The Vault",
    image: IMAGES.vault,
    alt: "The Vault private dining room: red walls and one long table set for dinner",
  },
  {
    id: "dining-room",
    slipRoom: "The dining room",
    from: "23",
    to: "100",
    name: "The dining room",
    directory: "The banking hall. No buyout needed.",
    body:
      "The banking hall itself, with marble, tall windows and tables set in long rows under the columns. Take a section for forty or the full room for a hundred.",
    facts: [
      ["Seated", "23 to 100 guests"],
      ["Menus", "$65 · $80 · $120 per guest"],
      ["Buyout", "Not required"],
    ],
    cta: "Hold the dining room",
    image: IMAGES.diningRoom,
    alt: "The main dining room at Andiamo in Banca, tables set in long rows beneath the original columns",
  },
  {
    id: "whole-bank",
    slipRoom: "The whole bank",
    from: "",
    to: "100",
    name: "The whole bank",
    directory: "Every room, closed to the public",
    body:
      "Every room, the bar and The Vault, closed to the public for the evening. There is room for a reception hour before dinner.",
    facts: [
      ["Guests", "Up to 100"],
      ["Menus", "Any dinner menu, plus a reception hour"],
      ["Arranged", "With the events desk"],
    ],
    cta: "Ask about the whole bank",
    image: IMAGES.exterior,
    alt: "The 1920s bank building at Grand and Linden that houses Andiamo in Banca",
  },
];

export default function HolidayParties() {
  usePageMeta("/holiday-parties");
  const [room, setRoom] = useState("");

  return (
    <PageLayout>
      {/* ========== HERO — a building directory, not a banner ========== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[clamp(44rem,100vh,54rem)]">
        <div className="order-2 lg:order-1 section-dark grain">
          <div className="relative z-[2] h-full flex flex-col justify-end px-6 sm:px-10 lg:pl-[max(3rem,calc((100vw-1320px)/2+3rem))] lg:pr-16 pt-14 lg:pt-28 pb-14 lg:pb-12">
            <p className={`${LABEL} text-cream/70`}>Holiday parties</p>
            <h1 className="font-display text-[2.75rem] md:text-5xl xl:text-[3.4rem] text-cream leading-[1.04] mt-4">
              How many are you bringing?
            </h1>
            <p className="font-accent text-cream/75 text-lg leading-relaxed mt-5 max-w-xl">
              A planner knows one number first. Start there and the building does the sorting: a private
              vault for twenty, the banking hall for a hundred, or the whole bank with the doors closed.
            </p>

            <nav aria-label="Rooms by party size" className="mt-8 border-t-[3px] border-double border-cream/70 max-w-xl">
              {ROOMS.map((r) => (
                <a
                  key={r.id}
                  href={`#${r.id}`}
                  className="group grid grid-cols-[6.5rem_1fr_auto] sm:grid-cols-[8.5rem_1fr_auto] items-baseline gap-x-5 py-3.5 border-b border-cream/20 hover:bg-white/[0.04] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-light"
                >
                  <span className="font-display lining-nums text-3xl sm:text-4xl text-cream leading-none">
                    {r.from ? `${r.from}–${r.to}` : r.to}
                  </span>
                  <span>
                    <span className="block font-display text-[0.8rem] uppercase tracking-[0.32em] text-cream">{r.name}</span>
                    <span className="block font-accent text-[0.95rem] text-cream/70 mt-1">{r.directory}</span>
                  </span>
                  <span aria-hidden="true" className="font-accent text-xl text-cream/70 transition-transform duration-300 group-hover:translate-y-0.5">&darr;</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
        <div className="relative order-1 lg:order-2 h-80 sm:h-96 lg:h-auto bg-espresso overflow-hidden">
          <img
            src={IMAGES.diningRoom}
            alt="The dining room at Andiamo in Banca set for a private party"
            className="absolute inset-x-0 bottom-0 top-20 lg:top-0 w-full h-[calc(100%-5rem)] lg:h-full object-cover"
          />
        </div>
      </section>

      {/* ========== THE ROOMS, by headcount ========== */}
      {ROOMS.map((r, i) => (
        <section
          key={r.id}
          id={r.id}
          aria-labelledby={`${r.id}-heading`}
          className={`grid grid-cols-1 lg:grid-cols-2 scroll-mt-0 ${i % 2 ? "section-cream" : "bg-background"}`}
        >
          <div className={`relative h-72 sm:h-96 lg:h-auto lg:min-h-[34rem] overflow-hidden ${i % 2 ? "lg:order-2" : ""}`}>
            <img src={r.image} alt={r.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="px-6 sm:px-10 lg:px-16 xl:px-20 py-14 lg:py-20 flex flex-col justify-center">
            <p className="font-display lining-nums text-charcoal leading-[0.82] text-[5.5rem] sm:text-[7rem] xl:text-[8.5rem] tracking-[-0.02em]" aria-hidden="true">
              {r.from ? (
                <>
                  {r.from}
                  <span className="font-accent italic text-[0.3em] tracking-normal align-[1.1em] mx-[0.15em] text-gold-dark">to</span>
                  {r.to}
                </>
              ) : (
                <>
                  <span className="font-accent italic text-[0.3em] tracking-normal align-[1.1em] mr-[0.2em] text-gold-dark">up to</span>
                  {r.to}
                </>
              )}
            </p>
            <h2 id={`${r.id}-heading`} className="font-display text-[0.9rem] uppercase tracking-[0.32em] text-charcoal border-t border-charcoal/30 pt-5 mt-7">
              {r.name}
              <span className="sr-only">, {r.from ? `${r.from} to ${r.to}` : `up to ${r.to}`} guests</span>
            </h2>
            <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-4 max-w-lg">{r.body}</p>
            <dl className="mt-6 border-t border-charcoal/10 max-w-lg">
              {r.facts.map(([term, desc]) => (
                <div key={term} className="flex items-baseline justify-between gap-6 border-b border-charcoal/10 py-2.5">
                  <dt className={`${LABEL} text-charcoal/70`}>{term}</dt>
                  <dd className="font-accent lining-nums text-charcoal text-right">{desc}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              {/* Native anchor: the browser scrolls to the slip; the click only presets the room */}
              <a href="#hold-a-date" onClick={() => setRoom(r.slipRoom)} className={`link-line ${LABEL} text-charcoal ${FOCUS}`}>
                {r.cta} <span aria-hidden="true">&darr;</span>
              </a>
            </p>
          </div>
        </section>
      ))}

      {/* ========== THE MENUS ========== */}
      <section className="bg-background py-20 md:py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-8">
          <div className="lg:col-span-4">
            <p className={`${LABEL} text-gold-dark`}>The menus</p>
            <h2 className="font-display text-3xl md:text-[2.6rem] text-charcoal leading-[1.08] mt-4">
              Three dinners, posted per guest.
            </h2>
            <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-5 max-w-sm">
              Every course is served at the table and each guest chooses their own main course on the
              night. Wine pairings start at $30.
            </p>
          </div>
          <div className="lg:col-span-8">
            <EventMenuRates variant="rows" tiers={["dinner65", "dinner80", "dinner120"]} source="holiday-rates" />
          </div>
        </div>
      </section>

      {/* ========== One real review ========== */}
      <section className="section-warm border-y border-charcoal/10 py-14 md:py-16">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-x-14">
          <blockquote className="lg:col-start-5 lg:col-span-8">
            <p className="font-accent italic text-charcoal/80 text-xl md:text-2xl leading-relaxed max-w-3xl">
              &ldquo;We hosted a corporate dinner in The Vault and it was perfect. Attentive staff, exceptional
              food, and clients who were genuinely impressed. The historic bank setting is unlike anything
              else on the Peninsula.&rdquo;
            </p>
            <footer className={`${LABEL} text-charcoal/70 mt-5`}>
              <a href={LINKS.yelp} target="_blank" rel="noopener noreferrer" className={`link-line ${FOCUS}`}>Via Yelp</a>
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ========== THE SLIP ========== */}
      <section id="hold-a-date" aria-labelledby="slip-heading" className="section-cream py-20 md:py-24 scroll-mt-0">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-10">
          <div className="lg:col-span-4">
            <p className={`${LABEL} text-gold-dark`}>Withdrawal slip</p>
            <h2 id="slip-heading" className="font-display text-3xl md:text-[2.6rem] text-charcoal leading-[1.08] mt-4">
              Hold a date for your party.
            </h2>
            <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-5 max-w-sm">
              Send the slip or call the events desk. You get availability and a written proposal back
              from the owner, who coordinates every private event personally.
            </p>
            <p className="font-display lining-nums text-2xl md:text-3xl text-charcoal mt-7">
              <a href="tel:+16507458811" onClick={() => trackPhoneClick("holiday-parties")} className={`link-line ${FOCUS}`}>
                {LINKS.phone}
              </a>
            </p>
            <p className="font-accent text-lg mt-1">
              <a href={`mailto:${LINKS.email}`} className={`link-line text-charcoal ${FOCUS}`}>{LINKS.email}</a>
            </p>
          </div>
          <div className="lg:col-span-8">
            <InquirySlip
              source="holiday-parties"
              subject="Holiday Party Inquiry"
              slipNo="301"
              room={room}
              onRoomChange={setRoom}
            />
          </div>
        </div>
      </section>

      {/* ========== Closing row ========== */}
      <section className="bg-background py-12">
        <div className="container">
          <ul className={`flex flex-wrap gap-x-9 gap-y-3 border-t border-charcoal/25 pt-7 ${LABEL} text-charcoal/80`}>
            <li>
              <Link href="/banquet-catering" onClick={() => trackEventMenusClick("holiday-closing")} className={`link-line ${FOCUS}`}>
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
