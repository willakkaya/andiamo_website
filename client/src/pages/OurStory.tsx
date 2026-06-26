import { usePageMeta } from "@/hooks/usePageMeta";
import PageLayout from "@/components/PageLayout";
import { IMAGES } from "@/lib/images";
import { motion } from "framer-motion";
import { Link } from "wouter";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" },
  }),
};

export default function OurStory() {
  usePageMeta("/our-story");

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
          <p className="eyebrow !text-cream/60 mb-5">
            Three decades &middot; Three restaurants &middot; One family
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream">
            Our Story
          </h1>
          <p className="font-accent italic text-cream/55 text-lg md:text-xl mt-5 max-w-xl mx-auto">
            It starts with a sixteen-year-old who arrived with nothing but a willingness to work.
          </p>
        </div>
      </section>

      {/* Chapter I — Cafe Figaro */}
      <section className="section-cream">
        <div className="container max-w-5xl py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-14 items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="lg:col-span-4"
            >
              <span className="chapter mb-7">I &mdash; The Beginning</span>
              <p className="font-display text-7xl md:text-8xl text-gradient-gold leading-none mt-7">1989</p>
              <h2 className="mt-5">
                <img src={IMAGES.figaroLogo} alt="Cafe Figaro" className="h-16 md:h-20 w-auto" loading="lazy" />
              </h2>
              <p className="font-accent text-charcoal/45 text-sm tracking-wide mt-3">Broadway, Burlingame</p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-8 lg:pt-3"
            >
              <p className="font-accent text-charcoal/75 leading-[1.9] text-lg md:text-xl mb-7">
                John Akkaya left Turkey at sixteen years old with nothing but determination
                and a willingness to work. After years in the hospitality industry learning
                his craft, he opened Cafe Figaro on Broadway in Burlingame in 1989 &mdash; a small
                Italian cafe that would become a beloved neighborhood institution for over
                35 years.
              </p>
              <p className="font-accent text-charcoal/75 leading-[1.9] text-lg md:text-xl">
                From the very first year, John began a tradition that would define the family&rsquo;s
                approach to the business: every Thanksgiving, he opened the doors
                and served free meals to anyone who walked in &mdash; no questions asked. That tradition
                has continued for over three decades, serving more than 1,500 people each year.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder quote */}
      <section className="section-dark grain">
        <div className="container max-w-3xl relative z-[2] py-20 md:py-28 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <div className="divider-diamond mb-10 opacity-70">
              <i />
            </div>
            <p className="font-display text-2xl md:text-4xl text-cream/90 italic leading-relaxed">
              &ldquo;Things you have, you share. And things you don&rsquo;t have, you work for.&rdquo;
            </p>
            <p className="eyebrow !text-gold/80 mt-7">&mdash; John Akkaya, Founder</p>
          </motion.div>
        </div>
      </section>

      {/* Chapter II — Don Giovanni */}
      <section className="section-warm">
        <div className="container max-w-5xl py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-14 items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-8 lg:pt-3 order-2 lg:order-1"
            >
              <p className="font-accent text-charcoal/75 leading-[1.9] text-lg md:text-xl mb-7">
                In 1997, John expanded the family&rsquo;s footprint with Ristorante Don Giovanni
                on Castro Street in Mountain View. Set inside the old California Bakery
                building with its soaring ceilings and warm atmosphere, Don Giovanni quickly
                became a neighborhood favorite for fine Italian dining in the heart of
                Silicon Valley.
              </p>
              <p className="font-accent text-charcoal/75 leading-[1.9] text-lg md:text-xl">
                The Thanksgiving tradition grew with it &mdash; 150 turkeys, a volunteer army
                of family and friends, and full sit-down meals for anyone who showed up.
                It wasn&rsquo;t charity. It was family. That&rsquo;s how the Akkayas have always
                done things.
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="lg:col-span-4 order-1 lg:order-2 lg:text-right"
            >
              <span className="chapter mb-7">II &mdash; Growing</span>
              <p className="font-display text-7xl md:text-8xl text-gradient-gold leading-none mt-7">1997</p>
              <h2 className="mt-5">
                <img src={IMAGES.donGiovanniLogo} alt="Ristorante Don Giovanni" className="h-14 md:h-[4.5rem] w-auto inline-block" loading="lazy" />
              </h2>
              <p className="font-accent text-charcoal/45 text-sm tracking-wide mt-3">Castro Street, Mountain View</p>
            </motion.div>
          </div>
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
              <span className="chapter mb-7">The Second Generation</span>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-8 mt-2">
                Father &amp; Son
              </h2>
              <p className="font-accent text-charcoal/75 leading-[1.9] text-lg mb-6">
                Will Akkaya grew up in the restaurants &mdash; bussing tables, watching his
                father treat every guest like family, and learning that hospitality
                isn&rsquo;t a business, it&rsquo;s a way of life.
              </p>
              <p className="font-accent text-charcoal/75 leading-[1.9] text-lg mb-8">
                Now running the family&rsquo;s restaurants, Will has brought his own passion to
                the table: an award-winning wine program recognized by Wine Spectator
                and Star Wine List, a commitment to sourcing the finest ingredients,
                and the same belief his father instilled &mdash; that a great restaurant
                is built on generosity.
              </p>
              <blockquote className="border-l-2 border-gold/40 pl-5">
                <p className="font-accent text-charcoal/70 text-lg italic leading-relaxed">
                  &ldquo;Whoever wrote the rule that a little cafe can&rsquo;t have the best wines
                  in the world?&rdquo;
                </p>
                <p className="eyebrow !text-gold/60 mt-3">&mdash; Will Akkaya</p>
              </blockquote>
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

      {/* Chapter III — Andiamo in Banca */}
      <section className="section-dark grain">
        <div className="container max-w-5xl relative z-[2] py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-14 items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="lg:col-span-4"
            >
              <span className="chapter chapter-light mb-7">III &mdash; The Next Chapter</span>
              <p className="font-display text-7xl md:text-8xl text-gradient-gold leading-none mt-7">2019</p>
              <h2 className="mt-5">
                <img src={IMAGES.logo} alt="Andiamo in Banca" className="h-14 md:h-16 w-auto brightness-0 invert opacity-90" loading="lazy" />
              </h2>
              <p className="font-accent text-cream/40 text-sm tracking-wide mt-3">301 Linden Avenue, South San Francisco</p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-8 lg:pt-3"
            >
              <p className="font-accent text-cream/65 leading-[1.9] text-lg md:text-xl mb-7">
                In 2019, the Akkaya family opened the doors to their most ambitious project
                yet: Andiamo in Banca, housed in a beautifully restored historic bank building
                in downtown South San Francisco. The name says it all &mdash;
                &ldquo;Andiamo in Banca&rdquo; is Italian for &ldquo;let&rsquo;s go to the bank,&rdquo; which is exactly
                what the place once was.
              </p>
              <p className="font-accent text-cream/65 leading-[1.9] text-lg md:text-xl mb-7">
                The grand columns and soaring ceilings were preserved. The original bank vault
                was transformed into the Peninsula&rsquo;s most exclusive private dining room &mdash; the
                massive vault door still intact, a stunning portal between the building&rsquo;s
                past and its future.
              </p>
              <p className="font-accent text-cream/65 leading-[1.9] text-lg md:text-xl">
                Three restaurants. Over 35 years. One family&rsquo;s unwavering belief that great
                food, great wine, and genuine hospitality can make any night extraordinary.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Simply Delicious */}
      <section className="section-cream">
        <div className="container max-w-3xl py-20 md:py-28 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
          >
            <p className="font-display text-3xl md:text-5xl text-charcoal italic mb-10">
              Simply Delicious.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              <Link href="/menu" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold">
                Explore the menu
              </Link>
              <Link href="/the-vault" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold">
                The Vault
              </Link>
              <Link href="/gallery" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold">
                Gallery
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
