import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import PageLayout from "@/components/PageLayout";
import { LINKS } from "@/lib/images";
import EventQuoteCalculator from "@/components/EventQuoteCalculator";
import EventMenuRates from "@/components/event-menus/EventMenuRates";
import ViewSwitch from "@/components/event-menus/ViewSwitch";
import JumpBar from "@/components/event-menus/JumpBar";
import TierSheet from "@/components/event-menus/TierSheet";
import AdditionsLedger from "@/components/event-menus/AdditionsLedger";
import CateringView from "@/components/event-menus/CateringView";
import { TIERS, ROOMS, FAQ, SECTION_IDS, CATERING_HREF, PLANNER_PDF, type MenuTier } from "@/data/eventMenus";
import { trackPhoneClick, trackTierEstimate, trackPlannerPdf } from "@/lib/analytics";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal";

const SPOKES = [
  { href: "/the-vault", label: "The Vault" },
  { href: "/private-dining", label: "Corporate dinners" },
  { href: "/holiday-parties", label: "Holiday parties" },
  { href: "/rehearsal-dinners", label: "Rehearsal dinners" },
];

/* Event menus & pricing — the four prix-fixe menus, posted like a bank's rates:
   the comparison first, then each menu in full. */
function EventsView() {
  // Stays undefined until a planner picks "Estimate with this menu", so the
  // calculator behaves exactly as before for everyone else.
  const [estimateTier, setEstimateTier] = useState<MenuTier | undefined>();

  // FAQ structured data — built from the same array as the visible answers
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "banquet-faq-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => { document.getElementById("banquet-faq-schema")?.remove(); };
  }, []);

  const onEstimate = (tier: MenuTier) => {
    setEstimateTier(tier);
    trackTierEstimate(tier);
  };

  return (
    <div data-print-root className="event-menus">
      {/* Masthead — type only, so the rates sit on the first screen */}
      <section className="bg-background pt-24 md:pt-[7.25rem]">
        <div className="container">
          <ViewSwitch view="events" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-6 mt-6 md:mt-7">
            <div className="lg:col-span-7">
              <h1 className="font-display text-4xl md:text-5xl text-charcoal leading-[1.05]">
                Event menus &amp; pricing
              </h1>
              <p className="font-accent text-charcoal/75 text-lg leading-relaxed mt-4 max-w-2xl">
                Four prix-fixe banquet menus for private events and group dinners, priced per guest. Every
                course is served at the table.
              </p>
              <p className="lg:hidden font-accent text-charcoal/75 text-base mt-3">
                Events desk{" "}
                <a
                  href="tel:+16507458811"
                  onClick={() => trackPhoneClick("banquet-catering")}
                  className={`link-line lining-nums text-charcoal ${FOCUS}`}
                >
                  (650) 745-8811
                </a>
              </p>
            </div>
            {/* On a phone the prices come first; these facts repeat in the rate-sheet footnote */}
            <dl className="hidden lg:block lg:col-span-5 self-end font-accent text-base">
              {[
                { term: "The Vault", desc: "12 to 22 guests, private" },
                { term: "Dining room", desc: "23 to 100 guests, no buyout needed" },
              ].map((row) => (
                <div key={row.term} className="flex items-baseline justify-between gap-6 border-t border-charcoal/15 py-2">
                  <dt className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/70">{row.term}</dt>
                  <dd className="text-charcoal text-right">{row.desc}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-6 border-y border-charcoal/15 py-2">
                <dt className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/70">Events desk</dt>
                <dd className="text-charcoal text-right">
                  <a
                    href="tel:+16507458811"
                    onClick={() => trackPhoneClick("banquet-catering")}
                    className={`link-line lining-nums whitespace-nowrap ${FOCUS}`}
                  >
                    (650) 745-8811
                  </a>
                </dd>
              </div>
              {PLANNER_PDF.published && (
                <p className="pt-3 text-right">
                  <a
                    href={PLANNER_PDF.href}
                    onClick={() => trackPlannerPdf("masthead")}
                    className={`link-line font-body text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal ${FOCUS}`}
                  >
                    Planner packet (PDF)
                  </a>
                </p>
              )}
            </dl>
          </div>
        </div>
      </section>

      {/* The posted rates */}
      <section id={SECTION_IDS.rates} aria-label="The four menus at a glance" className="bg-background pt-6 md:pt-7 pb-12 md:pb-14 scroll-mt-4">
        <div className="container">
          <EventMenuRates variant="sheet" inPage source="page-rates" />
        </div>
      </section>

      <JumpBar />

      {/* The four menus in full */}
      <div className="section-cream pt-12 md:pt-16 pb-8 space-y-10 md:space-y-14">
        {TIERS.map((tier) => (
          <TierSheet key={tier.key} tier={tier} onEstimate={onEstimate} />
        ))}
      </div>

      <AdditionsLedger />

      {/* Rooms */}
      <section id={SECTION_IDS.rooms} aria-labelledby="rooms-heading" className="bg-background py-16 md:py-20 scroll-mt-12">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-8">
          <h2 id="rooms-heading" className="lg:col-span-4 font-display text-3xl md:text-4xl text-charcoal leading-tight">
            Where your group sits
          </h2>
          <dl className="lg:col-span-8 border-t border-charcoal/25">
            {ROOMS.map((room) => (
              <div key={room.name} className="grid grid-cols-1 sm:grid-cols-[13rem_1fr] gap-x-8 gap-y-1 border-b border-charcoal/10 py-5">
                <dt className="font-display text-xl text-charcoal">{room.name}</dt>
                <dd className="font-accent text-base leading-relaxed">
                  <span className="text-charcoal lining-nums">{room.capacity}.</span>{" "}
                  <span className="text-charcoal/70">{room.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Questions — everything visible, no accordion */}
      <section id={SECTION_IDS.questions} aria-labelledby="questions-heading" className="section-cream py-16 md:py-20 scroll-mt-12">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-8">
          <h2 id="questions-heading" className="lg:col-span-4 lg:sticky lg:top-40 self-start font-display text-3xl md:text-4xl text-charcoal leading-tight">
            Questions
          </h2>
          <dl className="lg:col-span-8 border-t border-charcoal/25">
            {FAQ.map((f) => (
              <div key={f.q} className="border-b border-charcoal/10 py-6">
                <dt className="font-display text-xl md:text-2xl text-charcoal leading-snug">{f.q}</dt>
                <dd className="font-accent text-charcoal/75 text-base md:text-lg leading-[1.75] mt-2 max-w-2xl">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <EventQuoteCalculator tier={estimateTier} onTierChange={setEstimateTier} />

      {/* Closing row */}
      <section data-no-print className="bg-background py-14 md:py-16">
        <div className="container">
          <div className="border-t border-charcoal/25 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-8">
            <p className="lg:col-span-5 font-display text-2xl md:text-3xl text-charcoal leading-snug">
              <a
                href="tel:+16507458811"
                onClick={() => trackPhoneClick("banquet-catering")}
                className={`link-line lining-nums ${FOCUS}`}
              >
                (650) 745-8811
              </a>
              <br />
              <a href={`mailto:${LINKS.email}`} className={`link-line text-xl md:text-2xl ${FOCUS}`}>{LINKS.email}</a>
            </p>
            <div className="lg:col-span-7">
              <ul className="flex flex-wrap gap-x-8 gap-y-3 font-body text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/80">
                {SPOKES.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} className={`link-line ${FOCUS}`}>{s.label}</Link>
                  </li>
                ))}
              </ul>
              <p className="font-accent text-charcoal/70 text-base mt-6">
                Ordering trays for the office instead?{" "}
                <Link href={CATERING_HREF} className={`link-line text-charcoal ${FOCUS}`}>
                  Catering delivery is separate, through ezCater.
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function BanquetCatering() {
  usePageMeta("/banquet-catering");

  // The view is derived from the URL, never held in state: nav "Catering",
  // Back/Forward and shared links all stay in step.
  const view = new URLSearchParams(useSearch()).get("tab") === "catering" ? "catering" : "events";

  return <PageLayout>{view === "catering" ? <CateringView /> : <EventsView />}</PageLayout>;
}
