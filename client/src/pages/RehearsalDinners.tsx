import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { Check, ArrowRight, Star, Heart } from "lucide-react";
import EmailCapture from "@/components/EmailCapture";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7 },
  }),
};

export default function RehearsalDinners() {
  useEffect(() => {
    document.title = "Rehearsal Dinners | Andiamo in Banca";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Host your rehearsal dinner at Andiamo in Banca. Private dining in The Vault, custom menus, and an unforgettable setting. South San Francisco."
      );
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[450px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.vault} alt="Rehearsal dinner at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pb-16">
          <p className="font-accent tracking-[0.3em] text-xs uppercase text-gold-light/70 mb-5">
            <Heart size={14} className="inline mr-2 -mt-0.5" />
            Private Dining
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-cream mb-5">
            Rehearsal Dinners
          </h1>
          <p className="font-accent text-cream/50 text-lg max-w-lg mx-auto leading-relaxed">
            Begin your celebration in a setting as special as the occasion — inside
            a restored bank vault with the warmth of Italian hospitality.
          </p>
        </div>
      </section>

      {/* Why The Vault */}
      <section className="section-cream">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
            >
              <div className="ornament-line !mx-0 mb-6" />
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
                The Perfect Prelude
              </h2>
              <p className="font-accent text-charcoal/65 text-base leading-[1.8] mb-6">
                The Vault at Andiamo in Banca is the Peninsula's most intimate private
                dining room. Step through the original bank vault door into a space where
                rich red walls, candlelight, and white tablecloths create an atmosphere
                of effortless elegance.
              </p>
              <p className="font-accent text-charcoal/65 text-base leading-[1.8] mb-8">
                Seating 12 to 20 guests, it's perfectly sized for rehearsal dinners where
                every guest feels like family.
              </p>
              <ul className="space-y-3">
                {[
                  "Exclusive private dining room",
                  "Custom multi-course menus with dietary accommodations",
                  "Award-winning wine pairings by our sommelier",
                  "Dedicated event coordinator from booking to night-of",
                  "A/V for toasts, slideshows, and speeches",
                  "Complimentary champagne toast with $120 menu",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check size={14} className="text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                    <span className="font-accent text-charcoal/60 text-base">{item}</span>
                  </li>
                ))}
              </ul>
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
                alt="The Vault private dining room"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Overview */}
      <section className="section-dark">
        <div className="max-w-4xl mx-auto px-6 py-24 md:py-28">
          <div className="text-center mb-16">
            <div className="ornament-line mx-auto mb-8 opacity-40" />
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
              Rehearsal Dinner Menus
            </h2>
            <p className="font-accent text-cream/45 text-base max-w-xl mx-auto">
              Choose from our curated prix fixe menus or work with our chef
              to create something completely custom for your evening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/10 mb-12">
            {[
              { price: "$65", label: "Dinner", desc: "Multi-course prix fixe with 5 entrée choices and dessert trio" },
              { price: "$80", label: "Elevated", desc: "Appetizer course, premium proteins, sommelier wine pairing available", featured: true },
              { price: "$120", label: "Premier", desc: "Champagne toast, oysters, lobster ravioli, and our finest entrées" },
            ].map((tier, i) => (
              <motion.div
                key={tier.price}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className={`p-8 md:p-10 text-center ${tier.featured ? "bg-espresso ring-1 ring-gold/30" : "bg-espresso"}`}
              >
                {tier.featured && (
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-gold mb-3">Most Popular</p>
                )}
                <span className="font-display text-3xl text-gold">{tier.price}</span>
                <span className="font-accent text-cream/40 text-sm block mt-1">{tier.label}</span>
                <p className="font-accent text-cream/50 text-sm mt-4 leading-relaxed">{tier.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/banquet-catering#quote-calculator"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-300"
            >
              Build Your Quote
              <ArrowRight size={14} />
            </Link>
            <p className="font-accent text-cream/30 text-xs mt-4">
              See your estimated total before reaching out
            </p>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="section-cream">
        <div className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center">
          <div className="ornament-line mx-auto mb-8" />
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-gold fill-gold" />
            ))}
          </div>
          <p className="font-accent text-charcoal/70 text-lg md:text-xl leading-relaxed italic mb-6 max-w-2xl mx-auto">
            "The Vault was the perfect setting for our rehearsal dinner. Our families felt like
            they were dining somewhere truly special. The food was incredible and the staff
            made everything seamless."
          </p>
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40">
            Rehearsal Dinner Host
          </p>
        </div>
      </section>

      {/* Email Capture */}
      <EmailCapture />

      {/* Final CTA */}
      <section className="section-dark py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
            Let's Plan Your Evening
          </h2>
          <p className="font-accent text-cream/45 text-base mb-8 leading-relaxed">
            Popular dates book months in advance. Reach out today and our
            events team will help you create the perfect rehearsal dinner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+16507458811"
              className="inline-flex items-center justify-center px-10 py-4 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-300"
            >
              Call (650) 745-8811
            </a>
            <Link
              href="/the-vault"
              className="inline-flex items-center justify-center px-10 py-4 border border-cream/20 text-cream font-body text-[12px] tracking-[0.2em] uppercase hover:bg-cream/5 transition-all duration-300"
            >
              Explore The Vault
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
