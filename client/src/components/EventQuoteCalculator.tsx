import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Users, Wine, ChevronDown, ChevronUp, ArrowRight, Check } from "lucide-react";
import { submitForm } from "@/lib/formspree";
import { toast } from "sonner";

type MenuTier = "lunch35" | "dinner65" | "dinner80" | "dinner120";

const MENU_TIERS: { key: MenuTier; label: string; price: number; desc: string }[] = [
  { key: "lunch35", label: "$35 Lunch", price: 35, desc: "Salad, entrée choice, dessert" },
  { key: "dinner65", label: "$65 Dinner", price: 65, desc: "Bruschetta, salad, entrée, dessert" },
  { key: "dinner80", label: "$80 Dinner", price: 80, desc: "Burrata, crab cakes, filet mignon & more" },
  { key: "dinner120", label: "$120 Premier", price: 120, desc: "Champagne, oysters, lobster, osso buco" },
];

const WINE_PAIRINGS = [
  { key: "none", label: "No Wine Pairing", price: 0 },
  { key: "standard", label: "Standard Pairing", price: 30 },
  { key: "rare", label: "Rare Pairing", price: 75 },
  { key: "legendary", label: "Legendary Pairing", price: 150 },
];

const ENHANCEMENTS = [
  { key: "champagne", label: "Champagne Toast", price: 12, includedIn120: true },
  { key: "oysters", label: "Oysters Rockefeller", price: 18, includedIn120: true },
  { key: "antipasto", label: "Antipasto & Cheese Display", price: 15, includedIn120: false },
  { key: "limoncello", label: "Limoncello Toast", price: 6, includedIn120: false },
  { key: "espresso", label: "Espresso & Cappuccino Bar", price: 8, includedIn120: false },
  { key: "softdrinks", label: "Soft Drinks & Beverages", price: 5, includedIn120: false },
];

const HORS_DOEUVRES = [
  { key: "bruschetta", label: "Bruschetta al Pomodoro", price: 4 },
  { key: "meatballs", label: "Italian Meatballs", price: 5 },
  { key: "shrimp", label: "Shrimp Cocktail", price: 7 },
  { key: "calamari", label: "Calamari Fritti", price: 6 },
  { key: "chicken_skewer", label: "Grilled Chicken Skewer", price: 5 },
  { key: "garlic_bread", label: "Garlic Bread", price: 3 },
];

export default function EventQuoteCalculator() {
  const [guestCount, setGuestCount] = useState(20);
  const [menuTier, setMenuTier] = useState<MenuTier>("dinner65");
  const [winePairing, setWinePairing] = useState("none");
  const [selectedEnhancements, setSelectedEnhancements] = useState<string[]>([]);
  const [selectedHors, setSelectedHors] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", eventDate: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const tier = MENU_TIERS.find((t) => t.key === menuTier)!;
  const wine = WINE_PAIRINGS.find((w) => w.key === winePairing)!;
  const is120 = menuTier === "dinner120";

  // Calculate totals
  const menuTotal = tier.price * guestCount;
  const wineTotal = wine.price * guestCount;

  const enhancementTotal = selectedEnhancements.reduce((sum, key) => {
    const e = ENHANCEMENTS.find((x) => x.key === key);
    if (!e) return sum;
    if (is120 && e.includedIn120) return sum; // included free
    return sum + e.price * guestCount;
  }, 0);

  const horsTotal = selectedHors.reduce((sum, key) => {
    const h = HORS_DOEUVRES.find((x) => x.key === key);
    return h ? sum + h.price * guestCount : sum;
  }, 0);

  const grandTotal = menuTotal + wineTotal + enhancementTotal + horsTotal;
  const perPerson = guestCount > 0 ? grandTotal / guestCount : 0;

  const toggleEnhancement = (key: string) => {
    setSelectedEnhancements((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const toggleHors = (key: string) => {
    setSelectedHors((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const quoteDetails = {
      ...formData,
      _subject: `Event Quote — ${guestCount} guests, ${tier.label}`,
      source: "quote-calculator",
      guestCount: String(guestCount),
      menuTier: tier.label,
      winePairing: wine.label,
      enhancements: selectedEnhancements.join(", "),
      horsDoeuves: selectedHors.join(", "),
      estimatedTotal: `$${grandTotal.toLocaleString()}`,
      perPerson: `$${perPerson.toFixed(0)}`,
    };
    const ok = await submitForm(quoteDetails);
    if (ok) {
      setSubmitted(true);
      toast.success("Quote request sent! We'll follow up within 24 hours.");
    } else {
      toast.error("Something went wrong. Please call us at (650) 745-8811.");
    }
    setSubmitting(false);
  };

  return (
    <section className="section-dark" id="quote-calculator">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-14">
          <div className="ornament-line mx-auto mb-8 opacity-40" />
          <p className="font-accent tracking-[0.3em] text-xs uppercase text-gold-light/60 mb-5">
            <Calculator size={14} className="inline mr-2 -mt-0.5" />
            Instant Estimate
          </p>
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
            Build Your Event Quote
          </h2>
          <p className="font-accent text-cream/50 text-base max-w-xl mx-auto leading-relaxed">
            Select your menu, add enhancements, and see your estimated total in real time.
            No commitment — just a starting point for planning.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Guest Count */}
            <div className="bg-cream/[0.04] border border-cream/10 p-6">
              <label className="flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-gold mb-4">
                <Users size={14} />
                Guest Count
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={1}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="flex-1 accent-gold h-1"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={10}
                    max={200}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-transparent border border-cream/20 text-cream text-center py-1.5 font-display text-lg focus:border-gold/50 focus:outline-none"
                  />
                  <span className="text-cream/40 text-sm font-accent">guests</span>
                </div>
              </div>
            </div>

            {/* Menu Tier */}
            <div className="bg-cream/[0.04] border border-cream/10 p-6">
              <label className="font-body text-[11px] tracking-[0.2em] uppercase text-gold mb-4 block">
                Menu Selection
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {MENU_TIERS.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setMenuTier(t.key)}
                    className={`p-3 border text-center transition-all duration-300 ${
                      menuTier === t.key
                        ? "border-gold bg-gold/10 text-cream"
                        : "border-cream/10 text-cream/50 hover:border-cream/30"
                    }`}
                  >
                    <span className="font-display text-lg block">{t.label.split(" ")[0]}</span>
                    <span className="font-accent text-[10px] tracking-wider uppercase block mt-0.5 opacity-60">
                      {t.label.split(" ").slice(1).join(" ")}
                    </span>
                  </button>
                ))}
              </div>
              <p className="font-accent text-cream/40 text-xs mt-3 italic">{tier.desc}</p>
            </div>

            {/* Wine Pairing */}
            <div className="bg-cream/[0.04] border border-cream/10 p-6">
              <label className="flex items-center gap-2 font-body text-[11px] tracking-[0.2em] uppercase text-gold mb-4">
                <Wine size={14} />
                Wine Pairing
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {WINE_PAIRINGS.map((w) => (
                  <button
                    key={w.key}
                    onClick={() => setWinePairing(w.key)}
                    className={`p-3 border text-center transition-all duration-300 ${
                      winePairing === w.key
                        ? "border-gold bg-gold/10 text-cream"
                        : "border-cream/10 text-cream/50 hover:border-cream/30"
                    }`}
                  >
                    <span className="font-accent text-sm block">{w.label}</span>
                    {w.price > 0 && (
                      <span className="font-accent text-[10px] text-gold/70 block mt-0.5">${w.price}/pp</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhancements — collapsible */}
            <div className="bg-cream/[0.04] border border-cream/10 p-6">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center justify-between w-full"
              >
                <span className="font-body text-[11px] tracking-[0.2em] uppercase text-gold">
                  Add-Ons & Hors d'Oeuvres
                </span>
                {showDetails ? (
                  <ChevronUp size={16} className="text-cream/40" />
                ) : (
                  <ChevronDown size={16} className="text-cream/40" />
                )}
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-2">
                      <p className="font-accent text-cream/30 text-[10px] tracking-wider uppercase mb-2">Enhancements</p>
                      {ENHANCEMENTS.map((e) => {
                        const included = is120 && e.includedIn120;
                        return (
                          <label
                            key={e.key}
                            className={`flex items-center justify-between p-2.5 border cursor-pointer transition-all duration-200 ${
                              selectedEnhancements.includes(e.key)
                                ? "border-gold/30 bg-gold/5"
                                : "border-cream/5 hover:border-cream/15"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={selectedEnhancements.includes(e.key)}
                                onChange={() => toggleEnhancement(e.key)}
                                className="accent-gold"
                              />
                              <span className="font-accent text-cream/70 text-sm">{e.label}</span>
                            </div>
                            <span className="font-accent text-xs text-gold/60">
                              {included ? "Included" : `$${e.price}/pp`}
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="mt-6 space-y-2">
                      <p className="font-accent text-cream/30 text-[10px] tracking-wider uppercase mb-2">Hors d'Oeuvres</p>
                      {HORS_DOEUVRES.map((h) => (
                        <label
                          key={h.key}
                          className={`flex items-center justify-between p-2.5 border cursor-pointer transition-all duration-200 ${
                            selectedHors.includes(h.key)
                              ? "border-gold/30 bg-gold/5"
                              : "border-cream/5 hover:border-cream/15"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedHors.includes(h.key)}
                              onChange={() => toggleHors(h.key)}
                              className="accent-gold"
                            />
                            <span className="font-accent text-cream/70 text-sm">{h.label}</span>
                          </div>
                          <span className="font-accent text-xs text-gold/60">${h.price}/pp</span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Live Quote Summary */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-cream/[0.06] border border-gold/20 p-6 md:p-8">
              <h3 className="font-display text-xl text-cream mb-6">Your Estimate</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="font-accent text-cream/50">{tier.label} × {guestCount}</span>
                  <span className="font-accent text-cream/70">${menuTotal.toLocaleString()}</span>
                </div>
                {wineTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="font-accent text-cream/50">{wine.label}</span>
                    <span className="font-accent text-cream/70">${wineTotal.toLocaleString()}</span>
                  </div>
                )}
                {enhancementTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="font-accent text-cream/50">Enhancements</span>
                    <span className="font-accent text-cream/70">${enhancementTotal.toLocaleString()}</span>
                  </div>
                )}
                {horsTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="font-accent text-cream/50">Hors d'Oeuvres</span>
                    <span className="font-accent text-cream/70">${horsTotal.toLocaleString()}</span>
                  </div>
                )}
                {is120 && selectedEnhancements.some((k) => ENHANCEMENTS.find((e) => e.key === k)?.includedIn120) && (
                  <div className="flex justify-between text-sm">
                    <span className="font-accent text-gold/50 italic">Included extras</span>
                    <span className="font-accent text-gold/50">$0</span>
                  </div>
                )}
              </div>

              <div className="border-t border-cream/15 pt-4 mb-2">
                <div className="flex justify-between items-baseline">
                  <span className="font-display text-lg text-cream">Estimated Total</span>
                  <span className="font-display text-2xl text-gold">${grandTotal.toLocaleString()}</span>
                </div>
                <p className="font-accent text-cream/40 text-xs mt-1 text-right">
                  ${perPerson.toFixed(0)} per person
                </p>
              </div>

              <p className="font-accent text-cream/30 text-[10px] mt-4 leading-relaxed italic">
                Estimate only. Tax and gratuity not included. Final pricing confirmed by our events team.
              </p>

              <button
                onClick={() => setShowInquiry(true)}
                className="w-full mt-6 py-3.5 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-300 flex items-center justify-center gap-2"
              >
                Send This Quote
                <ArrowRight size={14} />
              </button>

              <a
                href="tel:+16507458811"
                className="block text-center font-accent text-cream/40 text-xs mt-3 hover:text-gold/70 transition-colors"
              >
                or call (650) 745-8811
              </a>
            </div>
          </div>
        </div>

        {/* Inquiry Form — slides in when "Send This Quote" is clicked */}
        <AnimatePresence>
          {showInquiry && !submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-12 max-w-2xl mx-auto"
            >
              <div className="bg-cream/[0.04] border border-cream/10 p-8">
                <h3 className="font-display text-xl text-cream mb-2">Send Your Quote</h3>
                <p className="font-accent text-cream/40 text-sm mb-6">
                  We'll follow up within 24 hours with availability and a finalized proposal.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name *"
                      className="w-full bg-transparent border border-cream/15 px-4 py-3 text-cream font-accent text-sm placeholder:text-cream/25 focus:border-gold/40 focus:outline-none transition-all"
                    />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email *"
                      className="w-full bg-transparent border border-cream/15 px-4 py-3 text-cream font-accent text-sm placeholder:text-cream/25 focus:border-gold/40 focus:outline-none transition-all"
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Phone"
                      className="w-full bg-transparent border border-cream/15 px-4 py-3 text-cream font-accent text-sm placeholder:text-cream/25 focus:border-gold/40 focus:outline-none transition-all"
                    />
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-transparent border border-cream/15 px-4 py-3 text-cream font-accent text-sm placeholder:text-cream/25 focus:border-gold/40 focus:outline-none transition-all"
                    />
                  </div>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Anything else we should know? (dietary needs, A/V, etc.)"
                    rows={3}
                    className="w-full bg-transparent border border-cream/15 px-4 py-3 text-cream font-accent text-sm placeholder:text-cream/25 focus:border-gold/40 focus:outline-none transition-all resize-none"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-300 disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Submit Quote Request"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 max-w-md mx-auto text-center bg-cream/[0.04] border border-gold/20 py-12 px-8"
            >
              <Check size={40} className="text-gold mx-auto mb-4 stroke-[1.5]" />
              <h3 className="font-display text-2xl text-cream mb-3">Quote Sent!</h3>
              <p className="font-accent text-cream/50">
                We'll be in touch within 24 hours with availability and a finalized proposal for your {guestCount}-guest event.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
