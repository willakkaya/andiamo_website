import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { motion } from "framer-motion";
import { Users, Utensils, Monitor, Wine, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { submitForm } from "@/lib/formspree";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

export default function TheVault() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", company: "",
    eventDate: "", guestCount: "", eventType: "", message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await submitForm({ ...formData, _subject: "The Vault Inquiry", source: "the-vault" });
    if (ok) {
      setSubmitted(true);
      toast.success("Inquiry submitted! We'll be in touch within 24 hours.");
    } else {
      toast.error("Something went wrong. Please call us at (650) 745-8811.");
    }
    setSubmitting(false);
  };

  return (
    <PageLayout>
      {/* Hero — full bleed vault image */}
      <section className="relative h-[70vh] min-h-[560px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.vault} alt="The Vault private dining room" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pb-16">
          <p className="font-accent tracking-[0.3em] text-xs uppercase text-cream/60 mb-5">
            Private Dining
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream mb-5">The Vault</h1>
          <p className="font-accent text-cream/50 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Once a secure bank vault, now South San Francisco's most exclusive private dining experience.
          </p>
        </div>
      </section>

      {/* Editorial intro — warm cream section */}
      <section className="section-cream">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-20"
          >
            <div className="ornament-line mx-auto mb-8" />
            <p className="font-accent tracking-[0.3em] text-xs uppercase text-gold/80 mb-5">
              An Unforgettable Setting
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-8">
              History You Can Touch
            </h2>
            <p className="font-accent text-charcoal/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Step through the original vault door into a space that blends the gravitas
              of a historic bank vault with the warmth of Italian hospitality.
            </p>
          </motion.div>

          {/* Features — editorial row, no cards */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gold/10 mb-24"
          >
            {[
              { icon: Users, title: "12 \u2013 20 Guests", desc: "Intimate to mid-size gatherings" },
              { icon: Utensils, title: "Custom Menus", desc: "Prix fixe tailored to your event" },
              { icon: Monitor, title: "A/V Ready", desc: "Screen and sound for presentations" },
              { icon: Wine, title: "Wine Pairings", desc: "Curated selections from our list" },
            ].map((feat) => (
              <div
                key={feat.title}
                className="bg-cream p-8 md:p-10 text-center"
              >
                <feat.icon size={24} className="text-gold mx-auto mb-4 stroke-[1.5]" />
                <h3 className="font-display text-base md:text-lg text-charcoal mb-2">{feat.title}</h3>
                <p className="font-accent text-charcoal/50 text-sm">{feat.desc}</p>
              </div>
            ))}
          </motion.div>

          {/* Two-column editorial with image */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <p className="font-accent text-charcoal/60 text-lg leading-[1.8] mb-8">
                The rich red walls, intimate lighting, and white tablecloths create an atmosphere
                where every gathering feels significant. Whether you're hosting a corporate client dinner,
                celebrating a milestone, or bringing your team together, The Vault provides a setting
                that elevates any occasion.
              </p>
              <p className="font-accent text-charcoal/50 text-base leading-[1.8] mb-10">
                Our dedicated events team will work with you to create a custom menu and experience
                tailored to your vision.
              </p>
              <h3 className="font-body text-[11px] tracking-[0.2em] uppercase text-gold mb-5">Perfect For</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  "Corporate dinners", "Client entertainment",
                  "Team celebrations", "Birthday parties",
                  "Rehearsal dinners", "Holiday gatherings",
                  "Product launches", "Wine dinners",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5 font-accent text-sm text-charcoal/60">
                    <Check size={13} className="text-gold shrink-0 stroke-[1.5]" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="aspect-[4/5] overflow-hidden"
            >
              <img
                src={IMAGES.vault}
                alt="The Vault dining setup with red walls and white tablecloths"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dining Options — dark section */}
      <section className="section-dark">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-16"
          >
            <div className="ornament-line mx-auto mb-8" />
            <p className="font-accent tracking-[0.3em] text-xs uppercase text-gold-light/60 mb-5">
              Your Event, Your Way
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-6">Dining Options</h2>
            <p className="font-accent text-cream/40 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Every event in The Vault is custom-tailored. Choose from our banquet prix fixe menus
              or work with our chef to create a bespoke dining experience.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="grid grid-cols-1 md:grid-cols-2 gap-px bg-cream/10"
          >
            {/* Banquet Prix Fixe */}
            <div className="bg-espresso p-10 md:p-14 text-center">
              <h3 className="font-display text-2xl text-gold-light mb-6">Banquet Prix Fixe</h3>
              <div className="flex items-center justify-center gap-8 mb-6">
                <div>
                  <span className="font-display text-3xl text-cream">$35</span>
                  <span className="font-accent text-cream/40 text-sm block mt-1">per person, lunch</span>
                </div>
                <div className="w-px h-12 bg-cream/10" />
                <div>
                  <span className="font-display text-3xl text-cream">$65</span>
                  <span className="font-accent text-cream/40 text-sm block mt-1">per person, dinner</span>
                </div>
              </div>
              <p className="font-accent text-cream/40 text-sm mb-8 leading-relaxed">
                Curated multi-course menus with optional wine pairings from our cellar.
              </p>
              <a
                href="/banquet-catering"
                className="inline-flex items-center px-8 py-3 border border-cream/20 text-cream font-body text-[12px] tracking-[0.2em] uppercase hover:bg-cream hover:text-charcoal transition-all duration-300"
              >
                View Banquet Menus
              </a>
            </div>

            {/* Custom Experience */}
            <div className="bg-espresso p-10 md:p-14 text-center">
              <h3 className="font-display text-2xl text-gold-light mb-6">Custom Experience</h3>
              <div className="mb-6">
                <span className="font-display text-3xl text-cream">Bespoke</span>
                <span className="font-accent text-cream/40 text-sm block mt-1">tailored to your vision</span>
              </div>
              <p className="font-accent text-cream/40 text-sm mb-8 leading-relaxed">
                Work directly with our chef and events team to design a completely
                personalized menu and experience for your group.
              </p>
              <a
                href="#inquiry"
                className="inline-flex items-center px-8 py-3 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase hover:bg-gold-light transition-all duration-300"
              >
                Inquire Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Inquiry Form — warm section */}
      <section className="section-warm">
        <div className="max-w-2xl mx-auto px-6 py-24 md:py-32" id="inquiry">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-14"
          >
            <div className="ornament-line mx-auto mb-8" />
            <p className="font-accent tracking-[0.3em] text-xs uppercase text-gold/80 mb-5">
              Book The Vault
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Inquire About Your Event</h2>
            <p className="font-accent text-charcoal/50 text-sm">
              Fill out the form below and our events team will respond within 24 hours.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            {submitted ? (
              <div className="text-center py-20 bg-charcoal/5 border border-gold/10 px-8">
                <Check size={40} className="text-gold mx-auto mb-5 stroke-[1.5]" />
                <h3 className="font-display text-2xl text-charcoal mb-3">Thank You</h3>
                <p className="font-accent text-charcoal/50">
                  We've received your inquiry and will be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Name *", key: "name", type: "text", placeholder: "Your name", required: true },
                    { label: "Email *", key: "email", type: "email", placeholder: "your@email.com", required: true },
                    { label: "Phone", key: "phone", type: "tel", placeholder: "(555) 123-4567", required: false },
                    { label: "Company", key: "company", type: "text", placeholder: "Company name", required: false },
                    { label: "Preferred Date", key: "eventDate", type: "date", placeholder: "", required: false },
                    { label: "Guest Count", key: "guestCount", type: "number", placeholder: "12\u201320", required: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/50 mb-2.5">{field.label}</label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={formData[field.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full bg-charcoal/[0.03] border border-charcoal/10 px-4 py-3.5 text-charcoal font-accent text-sm placeholder:text-charcoal/25 focus:border-gold/40 focus:bg-white focus:outline-none transition-all duration-300"
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/50 mb-2.5">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-charcoal/[0.03] border border-charcoal/10 px-4 py-3.5 text-charcoal font-accent text-sm focus:border-gold/40 focus:bg-white focus:outline-none transition-all duration-300"
                  >
                    <option value="">Select event type</option>
                    <option value="corporate-dinner">Corporate Dinner</option>
                    <option value="client-entertainment">Client Entertainment</option>
                    <option value="team-celebration">Team Celebration</option>
                    <option value="birthday">Birthday / Anniversary</option>
                    <option value="rehearsal-dinner">Rehearsal Dinner</option>
                    <option value="wine-dinner">Wine Dinner</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/50 mb-2.5">Additional Details</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-charcoal/[0.03] border border-charcoal/10 px-4 py-3.5 text-charcoal font-accent text-sm placeholder:text-charcoal/25 focus:border-gold/40 focus:bg-white focus:outline-none transition-all duration-300 resize-none"
                    placeholder="Tell us about your event..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-charcoal text-cream font-body text-[12px] tracking-[0.2em] uppercase hover:bg-espresso transition-all duration-300 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Inquiry"}
                </button>
                <p className="text-center font-accent text-charcoal/40 text-xs">
                  Or call us directly at{" "}
                  <a href="tel:+16507458811" className="text-gold hover:text-gold-light transition-colors">
                    {LINKS.phone}
                  </a>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
