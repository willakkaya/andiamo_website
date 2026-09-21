import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { toast } from "sonner";
import { submitForm } from "@/lib/formspree";
import { trackContactSubmit, trackPhoneClick, trackEventMenusClick } from "@/lib/analytics";
import EventQuoteCalculator from "@/components/EventQuoteCalculator";
import { Link } from "wouter";
import EventMenuRates from "@/components/event-menus/EventMenuRates";
import { tierHref } from "@/data/eventMenus";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const reveal = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } },
};

// What you can host — quiet, editorial, no icon cards
const OCCASIONS = [
  { title: "Client dinners", desc: "Close the deal somewhere they'll talk about for weeks." },
  { title: "Board & partner dinners", desc: "Private, dignified, and entirely yours for the evening." },
  { title: "Candidate recruiting", desc: "Court your top hire over a long, unhurried tasting menu." },
  { title: "Visiting executives", desc: "Land at SFO, dine ten minutes later. No city traffic." },
  { title: "Team celebrations", desc: "Milestones, launches, and year-end dinners in the round." },
  { title: "JPM Healthcare week", desc: "Conference-week dinners book early. Reserve by November." },
];

// Ways to dine — pricing presented with restraint, not as packages to "buy"
const WAYS = [
  { title: "The business lunch", href: tierHref("lunch35"), note: "from $35 / guest", desc: "An efficient, elegant weekday lunch. Three courses, and you're back in your meeting in forty-five minutes if you need to be." },
  { title: "The client dinner", href: tierHref("dinner65"), note: "from $65 / guest", desc: "A multi-course dinner in the main room or The Vault. Scales gracefully from a four-top to a table of thirty." },
  { title: "The Vault, exclusively", href: "/the-vault", note: "from $80 / guest", desc: "The restored bank vault, yours alone: twelve to twenty-two guests, a dedicated captain, and a menu built with the chef." },
  { title: "The whole restaurant", href: undefined as string | undefined, note: "by arrangement", desc: "A full buyout for launches, holidays, and large gatherings. The room, the menu, and the evening, shaped around you." },
];

export default function CorporateDining() {
  usePageMeta("/private-dining");

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "",
    eventDate: "", guestCount: "", eventType: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await submitForm({ ...formData, _subject: "Corporate Dining Inquiry", source: "corporate-dining" });
    if (ok) {
      setSubmitted(true);
      trackContactSubmit("corporate-dining");
      toast.success("Thank you. The events desk will be in touch.");
    } else {
      toast.error("Something went wrong. Please call us at (650) 745-8811.");
    }
    setSubmitting(false);
  };

  const inputClass =
    "w-full bg-transparent border-b border-charcoal/15 px-0 py-3 text-charcoal font-accent text-sm tracking-wide focus:border-gold/50 focus:outline-none transition-colors placeholder:text-charcoal/60";
  const selectClass = inputClass + " appearance-none";

  return (
    <PageLayout>
      {/* ========== HERO ========== */}
      <section className="relative h-[82vh] min-h-[600px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.vault} alt="The Vault private dining room at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.9 }}
            className="eyebrow !text-cream/60 mb-6"
          >
            Private Dining &amp; Events
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.9 }}
            className="font-display text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.04]"
          >
            Host clients in a<br />1920s bank vault
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.9 }}
            className="font-accent italic text-cream/70 text-lg md:text-xl max-w-xl mx-auto mt-6 leading-relaxed"
          >
            Five minutes from the biotech corridor, ten from SFO, and unlike any room
            your guests have dined in before.
          </motion.p>
          <motion.a
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95, duration: 0.9 }}
            href="#inquiry"
            onClick={(e) => { e.preventDefault(); document.getElementById("inquiry")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-3 mt-10 px-10 py-4 border border-cream/35 text-cream font-body text-[12px] tracking-[0.2em] uppercase hover:bg-cream hover:text-charcoal transition-all duration-500"
          >
            Begin an inquiry <ArrowRight size={14} />
          </motion.a>
          <p className="mt-6">
            <Link
              href="/banquet-catering"
              onClick={() => trackEventMenusClick("corporate-hero")}
              className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-cream/80 hover:text-cream"
            >
              Event menus &amp; pricing
            </Link>
          </p>
        </div>
      </section>

      {/* ========== OPENING STATEMENT ========== */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-16 items-start">
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
              className="lg:col-span-6"
            >
              <span className="chapter mb-7">Private Dining</span>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-[1.08] mt-7">
                The room does the
                <br />
                convincing.
              </h2>
            </motion.div>
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="lg:col-span-6 lg:pt-4"
            >
              <p className="font-accent text-charcoal/75 leading-[1.85] text-lg mb-6">
                When the conversation matters, whether it&rsquo;s a client you&rsquo;re closing, a candidate you&rsquo;re courting, or a board you&rsquo;re hosting, the setting is part of the argument.
              </p>
              <p className="font-accent text-charcoal/75 leading-[1.85] text-lg mb-8">
                The Vault was a working bank vault until 2019: marble, a two-ton steel door,
                and now a single long table set for your evening. Your guests will remember
                exactly where they were.
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-accent text-charcoal/55 border-t border-charcoal/10 pt-6">
                <span>5 min from Genentech &amp; the biotech corridor</span>
                <span>10 min from SFO</span>
                <span>12 to 22 in The Vault &middot; up to 100 in the dining room</span>
              </div>
              <EventMenuRates variant="line" source="corporate-facts" className="mt-6" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== THE ROOM — image-led ========== */}
      <section className="relative h-[70vh] min-h-[460px] overflow-hidden">
        <motion.img
          variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}
          src={IMAGES.vaultAlt}
          alt="A table set for a private dinner inside The Vault"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14">
          <div className="container">
            <p className="font-accent italic text-cream/75 text-xl md:text-2xl max-w-2xl leading-relaxed">
              &ldquo;The historic bank setting is unlike anything else on the Peninsula.&rdquo;
            </p>
            <p className="eyebrow !text-cream/70 mt-4">Via Yelp, after a corporate dinner in The Vault</p>
          </div>
        </div>
      </section>

      {/* ========== OCCASIONS ========== */}
      <section className="section-padding section-cream">
        <div className="container max-w-5xl">
          <div className="mb-14">
            <span className="chapter mb-6">Occasions</span>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mt-5 max-w-2xl">
              What you might host here
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {OCCASIONS.map((o, i) => (
              <motion.div
                key={o.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 2}
                className="flex items-baseline justify-between gap-6 py-6 border-b border-charcoal/10"
              >
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-charcoal mb-1.5">{o.title}</h3>
                  <p className="font-accent text-charcoal/60 text-base leading-relaxed">{o.desc}</p>
                </div>
                <span className="font-accent text-gold/40 text-sm shrink-0">0{i + 1}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY HERE ========== */}
      <section className="section-padding section-dark grain">
        <div className="container max-w-4xl relative z-[2]">
          <div className="text-center mb-16">
            <div className="divider-diamond mb-7 opacity-70"><i /></div>
            <h2 className="font-display text-3xl md:text-4xl text-cream">
              Why the conversations land here
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            {[
              { title: "A room they won't have seen", desc: "A restored 1920s bank vault, steel door intact. It does more for a first impression than any boardroom can." },
              { title: "Walking distance from biotech", desc: "Genentech, Amgen, Roche and Takeda are minutes away. Skip the drive into the city and bring the team somewhere worth the walk." },
              { title: "Ten minutes from SFO", desc: "Inbound executives land and are at the table before they'd have cleared city traffic. The most efficient hosting in the Bay." },
              { title: "Lunches that respect the clock", desc: "A forty-five-minute weekday lunch when you need it, or a seven-course afternoon when you don't." },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i % 2}
              >
                <h3 className="font-display text-xl md:text-2xl text-cream mb-3">{f.title}</h3>
                <p className="font-accent text-cream/60 text-base leading-[1.8]">{f.desc}</p>
              </motion.div>
            ))}
          </div>
          {/* Wine program — a quiet, relevant note */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="mt-16 pt-10 border-t border-cream/10 flex items-center gap-6"
          >
            <img
              src={IMAGES.wineSpectatorAward}
              alt="Wine Spectator Award of Excellence 2026"
              width={48} height={89}
              className="w-[44px] h-auto shrink-0 opacity-90"
              loading="lazy"
            />
            <p className="font-accent text-cream/65 text-base md:text-lg italic leading-relaxed">
              A cellar recognized with the 2026 Wine Spectator Award of Excellence, with the right bottle for the table, whatever the occasion calls for.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========== WAYS TO DINE ========== */}
      <section className="section-padding bg-background">
        <div className="container max-w-4xl">
          <div className="mb-14">
            <span className="chapter mb-6">Ways to dine</span>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mt-5">
              Four ways to gather
            </h2>
          </div>
          <div className="divide-y divide-charcoal/10">
            {WAYS.map((w, i) => (
              <motion.div
                key={w.title}
                variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="py-9 first:pt-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5 mb-3">
                  <h3 className="font-display text-2xl md:text-3xl text-charcoal">
                    {w.href ? (
                      <Link href={w.href} onClick={() => trackEventMenusClick("corporate-ways")} className="link-line">
                        {w.title}
                      </Link>
                    ) : (
                      w.title
                    )}
                  </h3>
                  <span className="font-accent italic text-gold text-lg shrink-0">{w.note}</span>
                </div>
                <p className="font-accent text-charcoal/65 text-base md:text-lg leading-relaxed max-w-2xl">{w.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-charcoal/10">
            <Link
              href="/banquet-catering"
              className="link-line inline-flex items-center gap-3 text-gold font-body text-[12px] tracking-[0.2em] uppercase"
            >
              Event menus &amp; pricing
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== QUOTE CALCULATOR (kept, quieter framing) ========== */}
      <EventQuoteCalculator />

      {/* ========== INQUIRY ========== */}
      <section className="section-padding section-warm" id="inquiry">
        <div className="container max-w-2xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <div className="text-center mb-14">
              <div className="divider-diamond mb-7"><i /></div>
              <span className="eyebrow mb-4 block">Begin a conversation</span>
              <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-4">Tell us about your evening</h2>
              <p className="font-accent text-charcoal/65 text-base md:text-lg leading-relaxed">
                A few details is all we need to start. Our events team will reply within a day,
                personally.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-16 border border-gold/20 px-8">
                <Check size={44} className="text-gold mx-auto mb-4 stroke-[1.5]" />
                <h3 className="font-display text-2xl text-charcoal mb-3">Thank you</h3>
                <p className="font-accent text-charcoal/70 tracking-wide">
                  We&rsquo;ll be in touch within a day with availability and a few thoughts for your event.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <label htmlFor="corp-name" className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Name *</label>
                    <input id="corp-name" type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} placeholder="Your name" />
                  </div>
                  <div>
                    <label htmlFor="corp-company" className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Company</label>
                    <input id="corp-company" type="text" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} placeholder="Company name" />
                  </div>
                  <div>
                    <label htmlFor="corp-email" className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Email *</label>
                    <input id="corp-email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="your@company.com" />
                  </div>
                  <div>
                    <label htmlFor="corp-phone" className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Phone</label>
                    <input id="corp-phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <label htmlFor="corp-preferred-date" className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Preferred date</label>
                    <input id="corp-preferred-date" type="date" value={formData.eventDate} onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="corp-guests" className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Guests</label>
                    <select id="corp-guests" value={formData.guestCount} onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })} className={selectClass}>
                      <option value="">Select</option>
                      <option value="10">6–10 guests</option>
                      <option value="20">11–20 guests</option>
                      <option value="40">21–40 guests</option>
                      <option value="60">41–60 guests</option>
                      <option value="100">60+ guests</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="corp-occasion" className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Occasion</label>
                  <select id="corp-occasion" value={formData.eventType} onChange={(e) => setFormData({ ...formData, eventType: e.target.value })} className={selectClass}>
                    <option value="">Select</option>
                    <option value="client-dinner">Client dinner</option>
                    <option value="board-meeting">Board / partner dinner</option>
                    <option value="candidate-recruiting">Candidate recruiting</option>
                    <option value="business-lunch">Business lunch</option>
                    <option value="team-event">Team event / celebration</option>
                    <option value="holiday-party">Holiday party</option>
                    <option value="jpm-conference">JPM Healthcare week</option>
                    <option value="other">Something else</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="corp-anything-we-should-know" className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Anything we should know</label>
                  <textarea id="corp-anything-we-should-know" rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full bg-transparent border border-charcoal/20 px-4 py-3 text-charcoal font-accent text-sm tracking-wide focus:border-gold/50 focus:outline-none transition-colors resize-none placeholder:text-charcoal/60" placeholder="Dietary needs, A/V, a budget in mind, the feeling you're after…" />
                </div>
                <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-espresso transition-all duration-500 disabled:opacity-50">
                  {submitting ? "Sending…" : "Send inquiry"}
                  <ArrowRight size={14} />
                </button>
                <p className="text-center font-accent text-charcoal/55 text-sm">
                  Or call us at{" "}
                  <a href="tel:+16507458811" onClick={() => trackPhoneClick("corporate-inquiry")} className="text-gold hover:text-gold-light transition-colors">
                    (650) 745-8811
                  </a>
                  , Tuesday through Sunday.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ========== CLOSING ========== */}
      <section className="bg-charcoal py-16">
        <div className="container max-w-3xl text-center">
          <p className="font-accent italic text-cream/70 text-xl md:text-2xl leading-relaxed mb-8">
            Whatever the evening is for, we&rsquo;ll make it feel considered.
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Link href="/the-vault" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold-light">
              Tour The Vault
            </Link>
            <Link href="/banquet-catering" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold-light">
              Event menus &amp; pricing
            </Link>
            <Link href="/menu" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold-light">
              The dinner menu
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
