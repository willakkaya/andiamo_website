import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Instagram, Car, Train, ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";
import { submitForm } from "@/lib/formspree";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" },
  }),
};

function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await submitForm({ ...formData, _subject: "Website Inquiry", source: "contact" });
    if (ok) {
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } else {
      toast.error("Something went wrong. Please call us at (650) 745-8811.");
    }
    setSubmitting(false);
  };

  const inputClass =
    "w-full bg-transparent border-b border-charcoal/15 px-0 py-3 text-charcoal font-accent text-sm tracking-wide focus:border-gold/50 focus:outline-none transition-colors placeholder:text-charcoal/25";

  return (
    <section className="section-padding bg-background">
      <div className="container max-w-2xl">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
          <div className="text-center mb-14">
            <div className="ornament-line mb-6" />
            <p className="font-accent text-sm tracking-[0.3em] uppercase text-gold/70 mb-4">
              Get in Touch
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">Send Us a Message</h2>
            <p className="font-accent text-charcoal/65 text-sm tracking-wide">
              Questions, feedback, or special requests — we'd love to hear from you.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-16 border border-gold/20 px-8">
              <Check size={48} className="text-gold mx-auto mb-4" />
              <h3 className="font-display text-2xl text-charcoal mb-3">Thank You</h3>
              <p className="font-accent text-charcoal/65 tracking-wide">
                We'll get back to you within 24 hours.
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
                  <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClass}
                    placeholder="your@email.com"
                  />
                </div>
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
                <label className="block font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/60 mb-1">Message *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-transparent border border-charcoal/20 px-4 py-3 text-charcoal font-accent text-sm tracking-wide focus:border-gold/50 focus:outline-none transition-colors resize-none placeholder:text-charcoal/25"
                  placeholder="How can we help?"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-charcoal/85 transition-all duration-500 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Message"}
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default function Contact() {
  useEffect(() => {
    document.title = "Contact & Hours | Andiamo in Banca";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Visit us at 301 Linden Ave, South San Francisco. Reservations, hours, and directions for Andiamo in Banca.");
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[380px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.exterior} alt="Andiamo in Banca exterior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center pb-14">
          <p className="font-accent tracking-[0.3em] text-xs uppercase text-cream/60 mb-4">
            Visit Us
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-cream">Contact</h1>
        </div>
      </section>

      {/* Location & Contact — warm cream section */}
      <section className="section-cream">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">

            {/* Left column — contact info, flowing editorial */}
            <div className="lg:col-span-2">
              {/* Address */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="mb-14"
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <MapPin size={14} className="text-gold stroke-[1.5]" />
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-gold">Location</span>
                </div>
                <p className="font-display text-2xl text-charcoal mb-3">Andiamo in Banca</p>
                <a
                  href="https://maps.google.com/?q=301+Linden+Avenue+South+San+Francisco+CA+94080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-accent text-charcoal/65 hover:text-charcoal transition-colors leading-relaxed block mb-6"
                >
                  301 Linden Avenue<br />
                  South San Francisco, CA 94080
                </a>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Car size={15} className="text-gold/50 shrink-0 mt-0.5 stroke-[1.5]" />
                    <span className="font-accent text-charcoal/60 text-sm leading-relaxed">Free street parking on Linden Ave and surrounding streets</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Train size={15} className="text-gold/50 shrink-0 mt-0.5 stroke-[1.5]" />
                    <span className="font-accent text-charcoal/60 text-sm leading-relaxed">10 minutes from South San Francisco BART station</span>
                  </div>
                </div>
              </motion.div>

              {/* Divider */}
              <div className="w-12 h-px bg-gold/20 mb-14" />

              {/* Phone, Email, Social */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                className="mb-14"
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <Phone size={14} className="text-gold stroke-[1.5]" />
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-gold">Reservations & Inquiries</span>
                </div>
                <div className="space-y-5">
                  <a
                    href="tel:+16507458811"
                    className="flex items-center gap-3 font-display text-xl text-charcoal hover:text-gold transition-colors"
                  >
                    {LINKS.phone}
                  </a>
                  <a
                    href={`mailto:${LINKS.email}`}
                    className="flex items-center gap-3 font-accent text-charcoal/60 hover:text-gold transition-colors"
                  >
                    <Mail size={16} className="text-gold/70 stroke-[1.5]" />
                    {LINKS.email}
                  </a>
                  <a
                    href={LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-accent text-charcoal/60 hover:text-gold transition-colors"
                  >
                    <Instagram size={16} className="text-gold/70 stroke-[1.5]" />
                    @andiamoinbanca
                  </a>
                </div>
              </motion.div>

              {/* Divider */}
              <div className="w-12 h-px bg-gold/20 mb-14" />

              {/* Reservation CTA */}
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
              >
                <a
                  href={LINKS.opentable}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-10 py-4 bg-charcoal text-cream font-body text-[12px] tracking-[0.2em] uppercase hover:bg-espresso transition-all duration-300"
                >
                  Reserve on OpenTable
                </a>
              </motion.div>
            </div>

            {/* Right column — map */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="lg:col-span-3"
            >
              <div className="aspect-square lg:aspect-auto lg:h-full min-h-[450px] overflow-hidden border border-charcoal/5">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3158.5!2d-122.4125!3d37.6547!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808f79e5a5b3c3c3%3A0x1234567890abcdef!2s301%20Linden%20Ave%2C%20South%20San%20Francisco%2C%20CA%2094080!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "450px" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Andiamo in Banca location"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <ContactForm />

      {/* Hours — dark section */}
      <section className="section-dark">
        <div className="max-w-3xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-14"
          >
            <div className="ornament-line mx-auto mb-8" />
            <p className="font-accent tracking-[0.3em] text-xs uppercase text-gold-light/60 mb-5">
              When to Visit
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-cream">Hours</h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="max-w-lg mx-auto"
          >
            <div className="space-y-0">
              {[
                { day: "Monday", hours: "Closed" },
                { day: "Tuesday", hours: "11:00 AM \u2013 2:00 PM, 4:00 PM \u2013 9:00 PM" },
                { day: "Wednesday", hours: "11:00 AM \u2013 2:00 PM, 4:00 PM \u2013 9:00 PM" },
                { day: "Thursday", hours: "11:00 AM \u2013 2:00 PM, 4:00 PM \u2013 9:00 PM" },
                { day: "Friday", hours: "11:00 AM \u2013 2:00 PM, 4:00 PM \u2013 9:00 PM" },
                { day: "Saturday", hours: "4:00 PM \u2013 9:00 PM" },
                { day: "Sunday", hours: "4:00 PM \u2013 9:00 PM" },
              ].map((item) => (
                <div key={item.day} className="flex justify-between items-center py-4 border-b border-cream/8">
                  <span className="font-accent text-cream/60 text-sm tracking-wide">{item.day}</span>
                  <span className={`font-accent text-sm ${item.hours === "Closed" ? "text-cream/45 italic" : "text-cream/45"}`}>
                    {item.hours}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-accent text-cream/45 text-xs mt-8 text-center italic leading-relaxed">
              Happy Hour: Tuesday \u2013 Friday, 4:00 PM \u2013 5:00 PM. Holiday hours may vary.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              <Link href="/menu" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors duration-300">
                View Our Menu
              </Link>
              <Link href="/the-vault" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors duration-300">
                Private Dining
              </Link>
              <Link href="/banquet-catering" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors duration-300">
                Banquet & Catering
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
