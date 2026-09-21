import type { ReactNode } from "react";
import { Link } from "wouter";
import { TIERS, EVENT_MENUS_PATH, tierHref, type MenuTier, type Tier } from "@/data/eventMenus";
import { trackEventMenusClick } from "@/lib/analytics";

/* The four event menus as a bank's posted rates.
   sheet — the full comparison table (the menus page)
   rows  — compact ledger rows (the private-events hub)
   line  — one ruled row of prices (spoke pages) */

type Variant = "sheet" | "rows" | "line";
type Tone = "cream" | "dark";

interface Props {
  variant: Variant;
  tone?: Tone;
  tiers?: MenuTier[];
  inPage?: boolean; // on /banquet-catering itself: native #anchors, no tracking
  source: string; // analytics label for cross-page clicks
  className?: string;
}

const TONES = {
  cream: {
    ink: "text-charcoal",
    muted: "text-charcoal/70",
    rule: "border-charcoal",
    hair: "border-charcoal/10",
    hairStrong: "border-charcoal/20",
    hover: "hover:bg-warm-white",
    focus: "focus-visible:outline-charcoal",
  },
  dark: {
    ink: "text-cream",
    muted: "text-cream/65",
    rule: "border-cream/70",
    hair: "border-cream/12",
    hairStrong: "border-cream/25",
    hover: "hover:bg-white/[0.03]",
    focus: "focus-visible:outline-gold-light",
  },
} as const;

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4";
const LABEL = "font-body text-[11px] font-medium uppercase tracking-[0.2em]";

const FOOTNOTES = [
  "Per guest, before tax and gratuity. Wine pairings ($30, $75 or $150 per guest), soft drinks ($5) and coffee service ($8) are optional additions, listed below.",
  "The Vault seats 12 to 22, privately. Parties of 23 to 100 take the main dining room, no buyout required. A full-restaurant buyout is available.",
  "Every menu has a vegetarian main course. Gluten-free and other needs on request.",
];

function Price({ amount, className = "" }: { amount: number; className?: string }) {
  return (
    <span className={`font-display lining-nums leading-none ${className}`}>
      <span className="text-[0.5em] align-[0.65em] mr-px">$</span>
      {amount}
    </span>
  );
}

export default function EventMenuRates({
  variant,
  tone = "cream",
  tiers,
  inPage = false,
  source,
  className = "",
}: Props) {
  const c = TONES[tone];
  const list = tiers ? TIERS.filter((t) => tiers.includes(t.key)) : TIERS;

  const TierLink = ({
    tier,
    className: cls = "",
    label,
    children,
  }: {
    tier: Tier;
    className?: string;
    label?: string;
    children: ReactNode;
  }) =>
    inPage ? (
      <a href={`#${tier.anchor}`} aria-label={label} className={`${FOCUS} ${c.focus} ${cls}`}>
        {children}
      </a>
    ) : (
      <Link
        href={tierHref(tier.key)}
        aria-label={label}
        onClick={() => trackEventMenusClick(source)}
        className={`${FOCUS} ${c.focus} ${cls}`}
      >
        {children}
      </Link>
    );

  const menuName = (t: Tier) => `${t.name} menu, $${t.price} per guest`;

  if (variant === "line") {
    return (
      <div
        className={`flex flex-wrap items-baseline gap-x-7 gap-y-2 border-y ${c.hair} py-4 ${c.ink} ${className}`}
      >
        <span className={`${LABEL} ${c.muted}`}>Event menus, per guest</span>
        <span className="font-accent lining-nums text-lg md:text-xl">
          {list.map((t, i) => (
            <span key={t.key}>
              {i > 0 && <span className={`mx-2 ${c.muted}`} aria-hidden="true">·</span>}
              <TierLink tier={t} label={menuName(t)} className="link-line">
                ${t.price}
                {t.meal === "lunch" ? " lunch" : ""}
              </TierLink>
            </span>
          ))}
        </span>
        <Link
          href={EVENT_MENUS_PATH}
          onClick={() => trackEventMenusClick(source)}
          className={`link-line sm:ml-auto ${LABEL} ${FOCUS} ${c.focus}`}
        >
          Event menus &amp; pricing
        </Link>
      </div>
    );
  }

  if (variant === "rows") {
    return (
      <div className={`${c.ink} ${className}`}>
        <ul className={`border-t-[3px] border-double ${c.rule}`}>
          {list.map((t) => (
            <li key={t.key} className={`border-b ${c.hair}`}>
              <TierLink
                tier={t}
                label={menuName(t)}
                className={`group grid grid-cols-[4.75rem_1fr_auto] md:grid-cols-[5.5rem_9.5rem_1fr_auto] items-baseline gap-x-5 md:gap-x-7 py-4 transition-colors duration-300 ${c.hover}`}
              >
                <Price amount={t.price} className="text-3xl md:text-4xl text-right" />
                <span>
                  <span className="font-display text-lg md:text-xl block leading-tight">{t.name}</span>
                  <span className={`font-accent text-[0.95rem] ${c.muted}`}>{t.coursesLabel}</span>
                </span>
                <span className={`hidden md:block font-accent text-[0.97rem] leading-snug ${c.muted}`}>
                  {t.mainsSummary.join(" · ")}
                </span>
                <span
                  aria-hidden="true"
                  className={`font-accent text-xl ${c.muted} transition-transform duration-300 group-hover:translate-x-1`}
                >
                  &rarr;
                </span>
              </TierLink>
            </li>
          ))}
        </ul>
        <p className="mt-5">
          <Link
            href={EVENT_MENUS_PATH}
            onClick={() => trackEventMenusClick(source)}
            className={`link-line ${LABEL} ${FOCUS} ${c.focus}`}
          >
            All four menus, additions and wine pairings
          </Link>
        </p>
      </div>
    );
  }

  // sheet
  const seeMenu = (t: Tier) => (
    <TierLink tier={t} className={`link-line ${LABEL}`}>
      See the menu <span aria-hidden="true">&rarr;</span>
    </TierLink>
  );
  const th = `${LABEL} ${c.muted} font-medium py-2.5 align-bottom text-left`;
  return (
    <div className={`${c.ink} ${className}`}>
      <table className={`w-full md:table-fixed border-collapse border-y-[3px] border-double ${c.rule}`}>
        <caption className="sr-only">The four event menus, side by side</caption>
        <colgroup>
          <col className="w-24 md:w-[6.5rem]" />
          <col className="md:w-[12.75rem]" />
          <col className="hidden md:table-column" />
          <col className="hidden lg:table-column lg:w-[31%]" />
        </colgroup>
        <thead>
          <tr className={`border-b ${c.hairStrong}`}>
            <th scope="col" className={`${th} pr-5 !text-right`}>Per guest</th>
            <th scope="col" className={`${th} pl-5 md:pl-7`}>Menu</th>
            <th scope="col" className={`${th} hidden md:table-cell pl-6`}>Main course, each guest chooses one</th>
            <th scope="col" className={`${th} hidden lg:table-cell pl-8`}>Also served</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => (
            <tr key={t.key} className={`border-b last:border-b-0 ${c.hair} align-top transition-colors duration-300 ${c.hover}`}>
              <td className={`border-r ${c.hairStrong} pr-5 py-3.5 text-right`}>
                <TierLink tier={t} label={menuName(t)}>
                  <Price amount={t.price} className="text-4xl md:text-[2.4rem]" />
                </TierLink>
              </td>
              <th scope="row" className="pl-5 md:pl-7 py-3.5 text-left font-normal">
                <span className="font-display text-xl md:text-2xl leading-none block">{t.name}</span>
                <span className={`block font-accent text-[0.95rem] leading-snug mt-1.5 ${c.muted}`}>
                  {t.coursesLabel}
                  {t.note ? ` · ${t.note}` : ""}
                </span>
                <p className={`md:hidden font-accent text-[0.95rem] leading-snug mt-1.5 ${c.muted}`}>
                  {t.mainsSummary.join(" · ")}
                </p>
                <span className="block mt-2 md:hidden">{seeMenu(t)}</span>
              </th>
              <td className="hidden md:table-cell pl-6 py-3.5 font-accent text-[1.02rem] leading-snug">
                {t.mainsSummary.join(" · ")}
                <span className="lg:hidden block mt-1.5">{seeMenu(t)}</span>
              </td>
              <td className={`hidden lg:table-cell pl-8 py-3.5 font-accent text-[0.98rem] leading-snug ${c.muted}`}>
                {t.alsoServed}.{" "}
                <span className={`whitespace-nowrap ${c.ink}`}>{seeMenu(t)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={`mt-5 space-y-1.5 font-accent text-[0.95rem] leading-relaxed ${c.muted} max-w-4xl`}>
        {FOOTNOTES.map((f) => (
          <p key={f}>{f}</p>
        ))}
      </div>
    </div>
  );
}
