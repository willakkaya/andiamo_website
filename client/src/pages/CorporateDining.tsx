import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { motion } from "framer-motion";
import { Building2, Users, Clock, MapPin, ArrowRight, Check, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { submitForm } from "@/lib/formspree";

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
    document.title = "Corporate Dining | Andiamo in Banca";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Corporate lunches, client dinners, and team events minutes from the SSF biotech corridor. Andiamo in Banca.");
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
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.vault} alt="The Vault at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 text-center">
          <div className="ornament-line !bg-white/20 mb-6" />
          <h1 className="font-display text-4xl md:text-6xl text-white tracking-wide">Corporate Dining</h1>
          <p className="font-accent text-sm tracking-[0.3em] uppercase text-white/50 mt-4">
            Steps from the Biotech Corridor
          </p>
        </div>
      </section>

      {/* Why Andiamo — Editorial Layout */}
      <section className="section-padding section-cream">
        <div className="container max-w-4xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-20"
          >
            <div className="ornament-line mb-6" />
            <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold/70 mb-4">
              Why Andiamo in Banca
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
              The Perfect Corporate Venue
            </h2>
            <p className="font-accent text-charcoal/60 text-lg leading-relaxed max-w-2xl mx-auto tracking-wide">
              Impress clients, celebrate your team, and host unforgettable corporate events
              in South San Francisco's most distinctive restaurant.
            </p>
          </motion.div>

          {/* Two-column editorial benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 max-w-3xl mx-auto">
            {[
              { icon: MapPin, title: "Prime Location", desc: "Minutes from Genentech, Roche, and the entire Oyster Point biotech corridor." },
              { icon: Building2, title: "Iconic Setting", desc: "A restored 1920s bank building that makes a lasting impression on clients." },
              { icon: Users, title: "Flexible Capacity", desc: "From intimate dinners of 12 to full buyouts for 100+ guests." },
              { icon: Clock, title: "Business Lunch", desc: "45-minute guaranteed service for weekday business lunches." },
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
                  <feat.icon size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-display text-lg text-charcoal mb-2">{feat.title}</h3>
                  <p className="font-accent text-charcoal/50 text-sm leading-relaxed tracking-wide">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Options — Elegant Editorial */}
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
            <div className="ornament-line !bg-white/20 mb-6" />
            <p className="font-accent text-sm tracking-[0.3em] uppercase text-white/40 mb-4">
              Tailored Experiences
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">
              Every Event Is Custom
            </h2>
            <p className="font-accent text-white/50 max-w-2xl mx-auto leading-relaxed tracking-wide">
              We don't do cookie-cutter packages. Whether it's a quick business lunch or an
              elaborate multi-course dinner, our team works with you to design the perfect experience.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto divide-y divide-white/10">
            {[
              {
                title: "Business Lunch",
                price: "From $35/person",
                desc: "Efficient, elegant weekday lunches for your team or clients. Our lunch banquet menu features curated courses with guaranteed 45-minute service.",
              },
              {
                title: "Client Dinner",
                price: "From $65/person",
                desc: "Impress your most important clients with a multi-course dinner in our main dining room or The Vault. Optional sommelier-curated wine pairings available.",
              },
              {
                title: "Full Buyout",
                price: "Contact for availability",
                desc: "Reserve the entire restaurant for large-scale corporate events, holiday parties, or product launches. Full customization of menu, decor, and service.",
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
                  <span className="font-accent text-gold text-sm tracking-wide">{item.price}</span>
                </div>
                <p className="font-accent text-white/45 text-sm leading-relaxed tracking-wide max-w-xl">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            className="text-center mt-14"
          >
            <a
              href="/banquet-catering"
              className="inline-flex items-center gap-2 px-10 py-4 border border-white/20 text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-white/5 transition-all duration-500"
            >
              View Our Banquet & Catering Menus <ArrowRight size={14} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Inquiry Form */}
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
              <div className="ornament-line mb-6" />
              <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold/70 mb-4">
                Get Started
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Plan Your Corporate Event</h2>
              <p className="font-accent text-charcoal/50 text-sm tracking-wide">
                Tell us about your event and our corporate dining team will create a custom proposal.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-16 border border-gold/20 px-8">
                <Check size={48} className="text-gold mx-auto mb-4" />
                <h3 className="font-display text-2xl text-charcoal mb-3">Thank You</h3>
                <p className="font-accent text-charcoal/50 tracking-wide">
                  Our corporate events team will be in touch within 24 hours with a custom proposal.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Name *</label>
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
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Company *</label>
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
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Email *</label>
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
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={inputClass}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Guest Count</label>
                    <select
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      className={selectClass}
                    >
                      <option value="">Select</option>
                      <option value="10">6-10 guests</option>
                      <option value="20">11-20 guests</option>
                      <option value="40">21-40 guests</option>
                      <option value="60">41-60 guests</option>
                      <option value="100">60+ guests</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className={selectClass}
                  >
                    <option value="">Select</option>
                    <option value="business-lunch">Business Lunch</option>
                    <option value="client-dinner">Client Dinner</option>
                    <option value="team-event">Team Event / Celebration</option>
                    <option value="product-launch">Product Launch</option>
                    <option value="holiday-party">Holiday Party</option>
                    <option value="networking">Networking Event</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40 mb-1">Tell Us More</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-transparent border border-charcoal/10 px-4 py-3 text-charcoal font-accent text-sm tracking-wide focus:border-gold/50 focus:outline-none transition-colors resize-none placeholder:text-charcoal/25"
                    placeholder="Budget range, dietary requirements, A/V needs, special requests..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-charcoal/85 transition-all duration-500 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Request a Proposal"}
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
