import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { IMAGES } from "@/lib/images";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: "easeOut" },
  }),
};

export default function OurStory() {
  useEffect(() => {
    document.title = "Our Story | Andiamo in Banca";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "From Cafe Figaro in 1989 to Andiamo in Banca — the Akkaya family has been feeding the Bay Area for over 35 years. Discover our story.");
  }, []);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMAGES.exterior}
            alt="Andiamo in Banca historic bank building exterior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="font-accent text-sm tracking-[0.3em] uppercase text-cream/60 mb-5">
            Three Decades &middot; Three Restaurants &middot; One Family
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream">
            Our Story
          </h1>
        </div>
      </section>

      {/* The Beginning — Cafe Figaro */}
      <section className="section-cream">
        <div className="container max-w-3xl py-24 md:py-32">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center"
          >
            <div className="ornament-line mx-auto mb-6" />
            <p className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
              Where It All Began
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-10">
              Cafe Figaro, 1989
            </h2>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg mb-8">
              John Akkaya left Turkey at sixteen years old with nothing but determination
              and a willingness to work. After years in the hospitality industry learning
              his craft, he opened Cafe Figaro on Broadway in Burlingame in 1989 — a small
              Italian cafe that would become a beloved neighborhood institution for over
              35 years.
            </p>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg">
              From the very first year, John began a tradition that would define the family's
              approach to the restaurant business: every Thanksgiving, he opened the doors
              and served free meals to anyone who walked in — no questions asked. That tradition
              has continued for over three decades, serving more than 1,500 people each year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="section-dark">
        <div className="container max-w-3xl py-20 md:py-28">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center"
          >
            <div className="ornament-line mx-auto mb-10 opacity-40" />
            <p className="font-display text-2xl md:text-4xl text-cream/90 italic leading-relaxed">
              "Things you have, you share. And things you don't have, you work for."
            </p>
            <p className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold/60 mt-6">
              — John Akkaya, Founder
            </p>
          </motion.div>
        </div>
      </section>

      {/* Don Giovanni & Growth */}
      <section className="section-warm">
        <div className="container max-w-3xl py-24 md:py-32">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center"
          >
            <div className="ornament-line mx-auto mb-6" />
            <p className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
              Growing the Family
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-10">
              Ristorante Don Giovanni
            </h2>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg mb-8">
              In 1997, John expanded the family's footprint with Ristorante Don Giovanni
              on Castro Street in Mountain View. Set inside the old California Bakery
              building with its soaring ceilings and warm atmosphere, Don Giovanni quickly
              became a neighborhood favorite for fine Italian dining in the heart of
              Silicon Valley.
            </p>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg">
              The Thanksgiving tradition grew with it — 150 turkeys, a volunteer army
              of family and friends, and full sit-down meals for anyone who showed up.
              It wasn't charity. It was family. That's how the Akkayas have always
              done things.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Family Photo + Second Generation */}
      <section className="section-cream">
        <div className="container max-w-5xl py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="aspect-[3/4] overflow-hidden"
            >
              <img
                src="/akkaya-family.jpg"
                alt="Will and John Akkaya"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
            >
              <div className="ornament-line !mx-0 mb-6" />
              <p className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold mb-4">
                Second Generation
              </p>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-8">
                Father & Son
              </h2>
              <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg mb-6">
                Will Akkaya grew up in the restaurants — bussing tables, watching his
                father treat every guest like family, and learning that hospitality
                isn't a business, it's a way of life.
              </p>
              <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg mb-6">
                Now running the family's restaurants, Will has brought his own passion to
                the table: an award-winning wine program recognized by Wine Spectator
                and Star Wine List, a commitment to sourcing the finest ingredients,
                and the same belief his father instilled — that a great restaurant
                is built on generosity.
              </p>
              <p className="font-accent text-charcoal/50 text-sm italic leading-relaxed">
                "Whoever wrote the rule that a little cafe can't have the best wines
                in the world?"
              </p>
              <p className="font-accent text-[11px] tracking-[0.2em] uppercase text-gold/50 mt-2">
                — Will Akkaya
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full-bleed dual image break */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={IMAGES.exterior}
              alt="The restored bank building exterior with columns"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={IMAGES.vault}
              alt="The Vault private dining room"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Andiamo in Banca */}
      <section className="section-dark">
        <div className="container max-w-3xl py-24 md:py-32">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center"
          >
            <div className="ornament-line mx-auto mb-6 opacity-40" />
            <p className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold-light/60 mb-4">
              The Next Chapter
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-cream mb-10">
              Andiamo in Banca
            </h2>
            <p className="font-accent text-cream/60 leading-[1.9] text-base md:text-lg mb-8">
              In 2019, the Akkaya family opened the doors to their most ambitious project
              yet: Andiamo in Banca, housed in a beautifully restored historic bank building
              at 301 Linden Avenue in downtown South San Francisco. The name says it all —
              "Andiamo" means "let's go" in Italian, and "in Banca" honors the building
              that houses us.
            </p>
            <p className="font-accent text-cream/60 leading-[1.9] text-base md:text-lg mb-8">
              The grand columns and soaring ceilings were preserved. The original bank vault
              was transformed into the Peninsula's most exclusive private dining room — the
              massive vault door still intact, a stunning portal between the building's
              past and its future.
            </p>
            <p className="font-accent text-cream/60 leading-[1.9] text-base md:text-lg">
              Three restaurants. Over 35 years. One family's unwavering belief that great
              food, great wine, and genuine hospitality can make any night extraordinary.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Simply Delicious */}
      <section className="section-cream">
        <div className="container max-w-3xl py-20 md:py-28">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="text-center"
          >
            <p className="font-display text-3xl md:text-5xl text-charcoal italic">
              Simply Delicious.
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
