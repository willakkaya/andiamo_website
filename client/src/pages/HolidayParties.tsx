import { useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { Check, ArrowRight, Star, Users, Utensils, Wine, Gift } from "lucide-react";
import EmailCapture from "@/components/EmailCapture";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7 },
  }),
};

const PACKAGES = [
  {
    name: "Classic Holiday Dinner",
    price: "$65",
    per: "per person",
    highlights: [
      "Bruschetta & salad course",
      "5 entrée choices including filet mignon",
      "Choice of tiramisu, panna cotta, or cheesecake",
      "Dedicated event coordinator",
    ],
  },
  {
    name: "Elevated Holiday Experience",
    price: "$80",
    per: "per person",
    featured: true,
    highlights: [
      "Burrata & crab cake appetizers",
      "Premium entrées: rack of lamb, halibut, filet",
      "Tiramisu or cheesecake",
      "Optional sommelier wine pairing from $30/pp",
    ],
  },
  {
    name: "Premier Celebration",
    price: "$120",
    per: "per person",
    highlights: [
      "Champagne toast for all guests",
      "Oysters Rockefeller first course",
      "Lobster ravioli + 6 premium entrées",
      "Chocolate lava cake & espresso bar",
    ],
  },
];

export default function HolidayParties() {
  useEffect(() => {
    document.title = "Holiday Party Packages | Andiamo in Banca";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Book your holiday party at Andiamo in Banca. Corporate holiday dinners, team celebrations, and private events in The Vault. South San Francisco."
      );
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[450px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.vault} alt="Holiday party at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pb-16">
          <p className="font-accent tracking-[0.3em] text-xs uppercase text-gold-light/70 mb-5">
            <Gift size={14} className="inline mr-2 -mt-0.5" />
            Now Booking 2026
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-cream mb-5">
            Holiday Parties
          </h1>
          <p className="font-accent text-cream/50 text-lg max-w-lg mx-auto leading-relaxed">
            Give your team or clients the gift of an unforgettable evening
            inside South San Francisco's most iconic restaurant.
          </p>
        </div>
      </section>

      {/* Why Host Here */}
      <section className="section-cream">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-28">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center mb-16"
          >
            <div className="ornament-line mx-auto mb-8" />
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
              Why Companies Choose Andiamo
            </h2>
            <p className="font-accent text-charcoal/60 text-base max-w-2xl mx-auto leading-relaxed">
              Minutes from the biotech corridor, housed in a jaw-dropping restored
              bank building, with food and service that makes your event memorable.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: "12 – 100+ Guests", sub: "The Vault or full buyout" },
              { icon: Utensils, label: "Custom Menus", sub: "Prix fixe or bespoke" },
              { icon: Wine, label: "Award-Winning Wine", sub: "Sommelier-curated pairings" },
              { icon: Star, label: "A/V Ready", sub: "Screen, sound, and mic" },
            ].map((feat, i) => (
              <motion.div
                key={feat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <feat.icon size={24} className="text-gold mx-auto mb-3 stroke-[1.5]" />
                <h3 className="font-display text-base text-charcoal mb-1">{feat.label}</h3>
                <p className="font-accent text-charcoal/50 text-sm">{feat.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="section-dark">
        <div className="max-w-5xl mx-auto px-6 py-24 md:py-28">
          <div className="text-center mb-16">
            <div className="ornament-line mx-auto mb-8 opacity-40" />
            <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Holiday Packages</h2>
            <p className="font-accent text-cream/45 text-base max-w-xl mx-auto">
              Three tiers to match every budget. All include dedicated event coordination and customizable options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/10">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className={`p-8 md:p-10 ${pkg.featured ? "bg-espresso ring-1 ring-gold/30" : "bg-espresso"}`}
              >
                {pkg.featured && (
                  <p className="font-body text-[10px] tracking-[0.25em] uppercase text-gold mb-4">Most Popular</p>
                )}
                <h3 className="font-display text-xl text-cream mb-2">{pkg.name}</h3>
                <div className="mb-6">
                  <span className="font-display text-3xl text-gold">{pkg.price}</span>
                  <span className="font-accent text-cream/40 text-sm ml-2">{pkg.per}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check size={14} className="text-gold shrink-0 mt-0.5 stroke-[1.5]" />
                      <span className="font-accent text-cream/60 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/banquet-catering"
                  className="inline-flex items-center gap-2 font-body text-[11px] tracking-[0.18em] uppercase text-gold hover:text-gold-light transition-colors"
                >
                  View Full Menu <ArrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/banquet-catering#quote-calculator"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-300"
            >
              Get Your Instant Quote
              <ArrowRight size={14} />
            </Link>
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
            "We hosted a corporate dinner in The Vault and it was perfect. The staff was
            attentive, the food was exceptional, and our clients were thoroughly impressed.
            The historic bank setting is unlike anything else on the Peninsula."
          </p>
          <p className="font-body text-[11px] tracking-[0.2em] uppercase text-charcoal/40">
            Corporate Client — Holiday Dinner
          </p>
        </div>
      </section>

      {/* Email Capture */}
      <EmailCapture />

      {/* Final CTA */}
      <section className="section-dark py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
            Dates Fill Up Fast
          </h2>
          <p className="font-accent text-cream/45 text-base mb-8 leading-relaxed">
            Holiday season is our busiest time. Contact us today to reserve your
            preferred date before it's gone.
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
