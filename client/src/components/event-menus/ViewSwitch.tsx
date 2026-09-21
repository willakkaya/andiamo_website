import { Link } from "wouter";
import { EVENT_MENUS_PATH, CATERING_HREF } from "@/data/eventMenus";

/* /banquet-catering holds two documents behind ?tab=. These are plain links,
   so Back works and each view has its own URL. */
const VIEWS = [
  { key: "events", href: EVENT_MENUS_PATH, eyebrow: "Hosted at the restaurant", label: "Event menus" },
  { key: "catering", href: CATERING_HREF, eyebrow: "Delivered to your office", label: "Catering trays" },
] as const;

export default function ViewSwitch({ view }: { view: "events" | "catering" }) {
  return (
    <nav aria-label="Menu type" data-no-print className="flex gap-8 md:gap-12 border-b border-charcoal/10">
      {VIEWS.map((v) => {
        const active = v.key === view;
        return (
          <Link
            key={v.key}
            href={v.href}
            aria-current={active ? "page" : undefined}
            className={`block pt-2.5 pb-3 border-t-2 -mb-px transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-charcoal ${
              active
                ? "border-charcoal text-charcoal"
                : "border-transparent text-charcoal/60 hover:text-charcoal"
            }`}
          >
            <span className="font-body text-[11px] font-medium uppercase tracking-[0.2em]">{v.label}</span>
            <span className="hidden sm:inline font-accent italic text-[0.95rem] text-charcoal/60 ml-3">{v.eyebrow.toLowerCase()}</span>
          </Link>
        );
      })}
    </nav>
  );
}
