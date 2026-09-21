import { TIERS, SECTION_IDS, PLANNER_PDF } from "@/data/eventMenus";
import { trackPlannerPdf } from "@/lib/analytics";

/* Pinned under the site nav. Native anchors only — no observer, no script:
   the browser does the scrolling and html{scroll-padding-top} clears the nav. */
const LINK =
  "font-body text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/70 hover:text-charcoal transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal";

export default function JumpBar() {
  return (
    <nav
      aria-label="On this page"
      data-no-print
      className="sticky top-20 md:top-24 z-30 bg-background border-y border-charcoal/10"
    >
      <div className="container flex items-center h-11 gap-x-4 sm:gap-x-6">
        {TIERS.map((t) => (
          <a
            key={t.key}
            href={`#${t.anchor}`}
            aria-label={`${t.name} menu, $${t.price} per guest`}
            className="font-accent lining-nums text-lg text-charcoal hover:text-gold-dark transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal"
          >
            ${t.price}
          </a>
        ))}
        <span aria-hidden="true" className="h-4 border-l border-charcoal/20" />
        <a href={`#${SECTION_IDS.additions}`} className={LINK}>Additions</a>
        <a href={`#${SECTION_IDS.rooms}`} className={`${LINK} hidden md:inline`}>Rooms</a>
        <a href={`#${SECTION_IDS.questions}`} className={`${LINK} hidden md:inline`}>Questions</a>
        <a href={`#${SECTION_IDS.estimate}`} className={`${LINK} ml-auto`}>Estimate</a>
        {PLANNER_PDF.published && (
          <a href={PLANNER_PDF.href} onClick={() => trackPlannerPdf("jump-bar")} className={LINK}>PDF</a>
        )}
      </div>
    </nav>
  );
}
