import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { motion } from "framer-motion";
import { Building2, Users, Clock, MapPin, ArrowRight, Check, Plane, Briefcase, Wine, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { submitForm } from "@/lib/formspree";
import { trackContactSubmit, trackPhoneClick } from "@/lib/analytics";
import EventQuoteCalculator from "@/components/EventQuoteCalculator";
import StickyEventCTA from "@/components/StickyEventCTA";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7 },
  }),
};

export default function CorporateDining() {
  useEffect(() => {
    document.title = "Corporate Dining in a 1920s Bank Vault | South SF | Andiamo in Banca";
    document.querySelector('meta[name="description"]')?.setAttribute(
      "content",
      "Host clients, candidates, and board members in a meticulously restored 1920s bank vault. Walking distance from Genentech, Amgen, and the SSF biotech corridor. 10 minutes from SFO."
    );
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    eventDate: "",
    guestCount: "",
    eventType: "",
    message: "",
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
      toast.success("Inquiry submitted! Our corporate events team will be in touch.");
    } else {
      toast.error("Something went wrong. Please call us at (650) 745-8811.");
    }
    setSubmitting(false);
  };

  const inputClass =
    "w-full bg-transparent border-b border-charcoal/15 px-0 py-3 text-charcoal font-accent text-sm tracking-wide focus:border-gold/50 focus:outline-none transition-colors placeholder:text-charcoal/25";

  const selectClass =
    "w-full bg-transparent border-b border-charcoal/15 px-0 py-3 text-charcoal font-accent text-sm tracking-wide focus:border-gold/50 focus:outline-none transition-colors appearance-none";

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.vault} alt="The Vault private dining at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/70" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="ornament-line !bg-white/20 mx-auto mb-6" />
          <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold-light/80 mb-5">
            Corporate Dining
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white tracking-wide leading-tight mb-6">
            Host Clients in a<br />1920s Bank Vault
          </h1>
          <p className="font-accent text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
            5 minutes from Genentech, Amgen, and the South San Francisco biotech corridor.
            10 minutes from SFO. The Peninsula's most distinctive private dining experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#quote-calculator"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-500"
            >
              Get an Instant Quote <ArrowRight size={14} />
            </a>
            <a
              href="tel:+16507458811"
              onClick={() => trackPhoneClick("corporate-hero")}
              className="inline-flex items-center gap-2 px-10 py-4 border border-white/30 text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-500"
            >
              Call (650) 745-8811
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip — biotech corridor proximity */}
      <section className="bg-charcoal py-8 border-b border-cream/5">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "From Genentech HQ", value: "5 min" },
              { label: "From SFO Airport", value: "10 min" },
              { label: "Private Room Capacity", value: "Up to 60" },
              { label: "Same-Day Quote Response", value: "24 hrs" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl md:text-3xl text-gold mb-1">{stat.value}</div>
                <div className="font-accent text-cream/55 text-xs tracking-[0.15em] uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect For — use case grid */}
      <section className="section-padding section-cream">
        <div className="container max-w-5xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-16"
          >
            <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold/70 mb-4">
              Built for Business
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
              Perfect For
            </h2>
            <p className="font-accent text-charcoal/65 text-lg leading-relaxed max-w-2xl mx-auto">
              Whether you're closing a deal, recruiting a key hire, or hosting your board —
              we set the stage for the conversations that move your business forward.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Briefcase, title: "Client Dinners", desc: "Impress decision-makers in a setting they'll talk about for weeks. The Vault makes a story your clients tell." },
              { icon: Building2, title: "Board Meetings", desc: "Dignified, private, and unforgettable. Perfect for board dinners, partner meetings, and investor entertainment." },
              { icon: Users, title: "Candidate Recruiting", desc: "Close your top hire over a multi-course tasting menu. Many of our regulars use The Vault to seal the deal." },
              { icon: Plane, title: "Visiting Executives", desc: "Pick up your VIPs from SFO and have them dining 10 minutes later. Perfect for inbound C-suite visits." },
              { icon: Wine, title: "Holiday Parties", desc: "Reserve The Vault or buy out the entire restaurant for company holiday celebrations. Custom menus and full bar service." },
              { icon: Star, title: "JPM Healthcare Conference", desc: "Reserve well in advance for JPM week. Private dining minutes from SFO — book by November to lock in your dates." },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                className="bg-white border border-charcoal/8 p-7 hover:border-gold/30 transition-all duration-500"
              >
                <feat.icon size={22} className="text-gold mb-4 stroke-[1.5]" />
                <h3 className="font-display text-xl text-charcoal mb-3">{feat.title}</h3>
                <p className="font-accent text-charcoal/65 text-base leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us — biotech-specific hooks */}
      <section className="section-padding bg-background">
        <div className="container max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-16"
          >
            <div className="ornament-line mx-auto mb-6" />
            <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold/70 mb-4">
              Why Andiamo in Banca
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
              The Biotech Corridor's Best-Kept Secret
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-3xl mx-auto">
            {[
              { icon: MapPin, title: "Walking Distance from Biotech", desc: "Genentech, Amgen, Roche, Takeda — all within a few minutes. Skip the SF traffic and bring your team somewhere worth the walk." },
              { icon: Building2, title: "A Restored 1920s Bank Vault", desc: "The Vault is a meticulously restored historical landmark. Your guests won't have seen anything like it — and they'll remember it." },
              { icon: Plane, title: "10 Minutes from SFO", desc: "Inbound visitors land, drive 10 minutes, and they're at dinner. The most efficient corporate hosting in the Bay Area." },
              { icon: Clock, title: "45-Minute Business Lunches", desc: "Guaranteed turnaround for weekday lunches. Seven-course tasting if you want it, or in and out in 45 minutes." },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex gap-5"
              >
                <div className="shrink-0 mt-1">
                  <feat.icon size={20} className="text-gold stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-charcoal mb-2">{feat.title}</h3>
                  <p className="font-accent text-charcoal/65 text-base leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service tiers — kept from previous, simplified */}
      <section className="section-padding section-dark">
        <div className="container max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-16"
          >
            <div className="ornament-line !bg-white/20 mx-auto mb-6" />
            <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold-light/70 mb-4">
              Service Options
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
              Every Event Is Custom
            </h2>
            <p className="font-accent text-cream/65 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
              We don't do cookie-cutter packages. Our events team works with you to design the
              perfect experience — from a quick business lunch to a full restaurant buyout.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto divide-y divide-cream/10">
            {[
              {
                title: "Business Lunch",
                price: "From $35/person",
                desc: "Efficient, elegant weekday lunches for your team or clients. 45-minute guaranteed service. Curated three-course menus — perfect for working lunches between meetings.",
              },
              {
                title: "Client Dinner",
                price: "From $65/person",
                desc: "Multi-course dinner in our main dining room or The Vault. Optional sommelier-curated wine pairings. Standard dinner service that scales from a 4-top to a 30-person dinner.",
              },
              {
                title: "The Vault Buyout",
                price: "From $80/person",
                desc: "Reserve The Vault exclusively — our restored 1920s bank vault private room. Up to 60 guests. Custom menus, sommelier, and personalized service.",
              },
              {
                title: "Full Restaurant Buyout",
                price: "Custom pricing",
                desc: "Reserve the entire restaurant for large-scale corporate events, product launches, or holiday parties. Full customization of menu, decor, AV, and service. Up to 100+ guests.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="py-10 first:pt-0 last:pb-0"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-3">
                  <h3 className="font-display text-2xl text-cream">{item.title}</h3>
                  <span className="font-accent text-gold text-base tracking-wide">{item.price}</span>
                </div>
                <p className="font-accent text-cream/70 text-base md:text-lg leading-relaxed max-w-xl">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Calculator — embedded */}
      <EventQuoteCalculator />

      {/* Inquiry Form — for those who prefer to write */}
      <section className="section-padding section-warm">
        <div className="container max-w-2xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            id="corporate-inquiry"
          >
            <div className="text-center mb-14">
              <div className="ornament-line mx-auto mb-6" />
              <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold/70 mb-4">
                Or Send Us a Detailed Inquiry
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Tell Us About Your Event</h2>
              <p className="font-accent text-charcoal/65 text-base md:text-lg tracking-wide">
                For custom requests, full buyouts, or events outside the standard packages —
                our corporate events team will respond within 24 hours.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-16 border border-gold/20 px-8">
                <Check size={48} className="text-gold mx-auto mb-4" />
                <h3 className="font-display text-2xl text-charcoal mb-3">Thank You</h3>
                <p className="font-accent text-charcoal/70 tracking-wide">
                  Our corporate events team will be in touch within 24 hours with a custom proposal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Company *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={inputClass}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={inputClass}
                      placeholder="your@company.com"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClass}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Guest Count</label>
                    <select
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      className={selectClass}
                    >
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
                  <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Select</option>
                    <option value="client-dinner">Client Dinner</option>
                    <option value="board-meeting">Board / Partner Meeting</option>
                    <option value="candidate-recruiting">Candidate Recruiting</option>
                    <option value="business-lunch">Business Lunch</option>
                    <option value="team-event">Team Event / Celebration</option>
                    <option value="product-launch">Product Launch</option>
                    <option value="holiday-party">Holiday Party</option>
                    <option value="jpm-conference">JPM Healthcare Conference</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Tell Us More</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border border-charcoal/20 px-4 py-3 text-charcoal font-accent text-sm tracking-wide focus:border-gold/50 focus:outline-none transition-colors resize-none placeholder:text-charcoal/25"
                    placeholder="Budget range, dietary requirements, A/V needs, AV-ready setup, special requests..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-charcoal/85 transition-all duration-500 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Request a Custom Proposal"}
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Final CTA — phone */}
      <section className="bg-charcoal py-16">
        <div className="container max-w-3xl text-center">
          <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold-light/60 mb-4">
            Prefer to Talk?
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-cream mb-6">
            Speak with our events team directly.
          </h2>
          <a
            href="tel:+16507458811"
            onClick={() => trackPhoneClick("corporate-footer")}
            className="inline-block font-display text-3xl md:text-4xl text-gold hover:text-gold-light transition-colors"
          >
            (650) 745-8811
          </a>
          <p className="font-accent text-cream/55 text-sm mt-4">
            Mon–Fri 9am–6pm · Same-day response
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <Link href="/the-vault" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors">
              Tour The Vault
            </Link>
            <Link href="/menu" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors">
              View Menus
            </Link>
            <Link href="/banquet-catering" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors">
              All Private Events
            </Link>
          </div>
        </div>
      </section>

      <StickyEventCTA />
    </PageLayout>
  );
}
