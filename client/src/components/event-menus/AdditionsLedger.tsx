import { WINE_PAIRINGS, ADDITIONS, HORS_DOEUVRES, SECTION_IDS } from "@/data/eventMenus";

/* Wine pairings and per-guest additions, once for the whole page, set as
   priced ledgers: name, dotted leader, a real right-aligned figure. */

const byPrice = <T extends { price: number }>(rows: T[]) => [...rows].sort((a, b) => a.price - b.price);

function Row({ name, price, desc, note }: { name: string; price: number; desc?: string; note?: string }) {
  return (
    <li className="py-4 border-b border-charcoal/10">
      <div className="flex items-baseline gap-3">
        <span className="font-display text-lg text-charcoal">{name}</span>
        <span aria-hidden="true" className="flex-1 border-b border-dotted border-charcoal/30 mb-1.5 min-w-[1.5rem]" />
        <span className="font-accent lining-nums tabular-nums text-lg text-charcoal shrink-0">${price}</span>
      </div>
      {desc && <p className="font-accent text-charcoal/70 text-base leading-relaxed mt-1 max-w-xl">{desc}</p>}
      {note && (
        <p className="font-body text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/70 mt-1.5">{note}</p>
      )}
    </li>
  );
}

function Ledger({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-xl md:text-2xl text-charcoal">{title}</h3>
      {sub && <p className="font-accent italic text-charcoal/60 text-[0.95rem] mt-1">{sub}</p>}
      <ul className="mt-4 border-t border-charcoal/25">{children}</ul>
    </div>
  );
}

export default function AdditionsLedger() {
  const pairings = WINE_PAIRINGS.filter((w) => w.key !== "none");

  return (
    <div className="section-warm">
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-14">
          <section id={SECTION_IDS.wine} aria-labelledby="wine-heading" className="lg:col-span-5 scroll-mt-12">
            <h2 id="wine-heading" className="font-display text-3xl md:text-4xl text-charcoal">Wine pairings</h2>
            <p className="font-accent text-charcoal/70 text-base mt-2">Optional, per guest, with the dinner menus.</p>
            <ul className="mt-6 border-t border-charcoal/25">
              {pairings.map((w) => (
                <Row key={w.key} name={w.displayName} price={w.price} desc={w.desc} />
              ))}
            </ul>
          </section>

          <section id={SECTION_IDS.additions} aria-labelledby="additions-heading" className="lg:col-span-7 scroll-mt-12">
            <h2 id="additions-heading" className="font-display text-3xl md:text-4xl text-charcoal">Additions</h2>
            <p className="font-accent text-charcoal/70 text-base mt-2">Priced per guest.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mt-6">
              <Ledger title="For a reception hour">
                {byPrice(HORS_DOEUVRES).map((h) => (
                  <Row key={h.key} name={h.label} price={h.price} desc={h.desc} />
                ))}
              </Ledger>
              <Ledger title="Add to any menu">
                {byPrice(ADDITIONS).map((a) => (
                  <Row
                    key={a.key}
                    name={a.label}
                    price={a.price}
                    desc={a.desc}
                    note={a.includedIn120 ? "Included in the $120 menu" : undefined}
                  />
                ))}
              </Ledger>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
