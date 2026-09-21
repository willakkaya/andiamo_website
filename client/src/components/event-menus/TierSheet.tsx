import { SERVICE_TEXT, SECTION_IDS, WINE_PAIRINGS, type Tier, type MenuTier } from "@/data/eventMenus";
import CopyLinkButton from "./CopyLinkButton";

/* One prix-fixe menu, set like a ledger page: the price is pinned in the left
   margin while the courses run down the right. Nothing here animates or waits
   on script — it is printed matter. */

const ACTION =
  "font-body text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/80";
const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal";

const fromPairing = Math.min(...WINE_PAIRINGS.filter((w) => w.price > 0).map((w) => w.price));

export default function TierSheet({ tier, onEstimate }: { tier: Tier; onEstimate: (k: MenuTier) => void }) {
  const headingId = `${tier.anchor}-heading`;

  const actions = (
    <ul className={`space-y-3 ${ACTION}`}>
      <li>
        <CopyLinkButton tier={tier.key} />
      </li>
      <li>
        {/* Native anchor: the browser scrolls, so repeat clicks and Back both work */}
        <a href={`#${SECTION_IDS.estimate}`} onClick={() => onEstimate(tier.key)} className={`link-line ${FOCUS}`}>
          Estimate with this menu
        </a>
      </li>
      <li>
        <a href={`#${SECTION_IDS.rates}`} className={`link-line text-charcoal/60 ${FOCUS}`}>
          All four menus &uarr;
        </a>
      </li>
    </ul>
  );

  return (
    <section id={tier.anchor} aria-labelledby={headingId} className="scroll-mt-12">
      <div className="container">
        <div className="rule-double grid grid-cols-1 lg:grid-cols-[12rem_1fr] lg:gap-x-14">
          {/* Ledger margin */}
          <div className="lg:sticky lg:top-40 self-start lg:border-r lg:border-charcoal/15 lg:pr-8 pt-9 pb-2 lg:pb-12">
            <p className="font-display lining-nums text-charcoal text-6xl xl:text-7xl leading-none">
              <span className="text-[0.45em] align-[0.85em] mr-0.5 text-gold-dark">$</span>
              {tier.price}
            </p>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/70 mt-3">
              per guest
            </p>
            <h2 id={headingId} className="font-display text-2xl md:text-3xl text-charcoal mt-6 leading-tight">
              {tier.name}
              <span className="sr-only">, ${tier.price} per guest</span>
            </h2>
            <p className="font-accent text-charcoal/70 text-base mt-1">
              {tier.coursesLabel}
              {tier.note ? ` · ${tier.note}` : ""}
            </p>
            {tier.winePairing && (
              <p className="font-accent text-charcoal/70 text-base mt-4">
                <a href={`#${SECTION_IDS.wine}`} className={`link-line ${FOCUS}`}>
                  Wine pairing optional, from ${fromPairing}
                </a>
              </p>
            )}
            <div className="hidden lg:block mt-8" data-no-print>
              {actions}
            </div>
          </div>

          {/* Courses */}
          <div className="pb-10 lg:pt-3">
            {tier.courses.map((course) => (
              <div
                key={course.label}
                data-course
                className="grid grid-cols-1 xl:grid-cols-[10rem_1fr] gap-x-8 gap-y-4 border-t border-charcoal/10 first:border-t-0 py-6"
              >
                <div>
                  <h3 className="font-display text-xl text-charcoal leading-tight">{course.label}</h3>
                  <p className="font-accent italic text-charcoal/60 text-[0.95rem] mt-1">{SERVICE_TEXT[course.rule]}</p>
                </div>
                <ul className={`grid gap-x-10 gap-y-5 ${course.dishes.length > 1 ? "sm:grid-cols-2" : ""}`}>
                  {course.dishes.map((dish) => (
                    <li key={dish.name}>
                      <p className="font-display text-lg md:text-xl text-charcoal leading-snug">{dish.name}</p>
                      {dish.diet && (
                        <p className="font-body text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/70 mt-1.5">
                          {dish.diet.join(" · ")}
                        </p>
                      )}
                      <p className="font-accent text-charcoal/70 text-base leading-relaxed mt-1.5">{dish.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="lg:hidden border-t border-charcoal/10 pt-7" data-no-print>
              {actions}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
