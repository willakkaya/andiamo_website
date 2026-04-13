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
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Discover the story of Andiamo in Banca — upscale Italian dining in a restored 1920s bank building in South San Francisco.");
  }, []);

  return (
    <PageLayout>
      {/* Hero — full-bleed image */}
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
            Est. 2018 &middot; South San Francisco
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream">
            Our Story
          </h1>
        </div>
      </section>

      {/* The Building — cream section */}
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
              The Building
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-10">
              A Historic Bank Building Reborn
            </h2>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg">
              Standing proudly at 301 Linden Avenue in the heart of downtown South San Francisco,
              our building has been a landmark for generations. Originally constructed as a
              bank, its grand columns, soaring ceilings, and ornate architectural details
              spoke to an era of craftsmanship that valued beauty and permanence. For decades,
              it served the community as a financial institution — a place of trust and
              significance in the neighborhood.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Full-bleed dual image break */}
      <section className="section-dark">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={0}
        >
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
        </motion.div>
      </section>

      {/* The Transformation — warm section */}
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
              The Transformation
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-10">
              From Vault to Table
            </h2>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg mb-8">
              When we discovered this space, we saw more than a building — we saw a story
              waiting to be told. The meticulous restoration preserved the original
              architectural elements that make this space extraordinary: the grand facade,
              the soaring interior, and most remarkably, the original bank vault.
            </p>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg">
              That vault — once home to safety deposit boxes and the community's most
              precious possessions — has been transformed into South San Francisco's most
              exclusive private dining room. The massive vault door remains, a stunning
              reminder of the building's heritage and a portal to an unforgettable
              dining experience.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quote — dark espresso section */}
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
              "Simply Delicious."
            </p>
            <p className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold/60 mt-6">
              — John Akkaya, Founder
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Philosophy — cream section */}
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
              The Philosophy
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-10">
              Simply Delicious
            </h2>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg mb-8">
              At Andiamo in Banca, we believe that great Italian cuisine is an act of
              respect — respect for ingredients, for tradition, and for the people who
              gather around the table. Our pasta is made by hand, daily, using techniques
              passed down through generations. Our sauces simmer slowly. Our wine list
              is curated with the same care we bring to every plate.
            </p>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg">
              The name "Andiamo" means "let's go" in Italian — an invitation to experience
              something special. "In Banca" honors the building that houses us. Together,
              they capture our spirit: a forward-looking restaurant deeply rooted in history.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Location — warm section */}
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
              The Location
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-10">
              The Heart of South San Francisco
            </h2>
            <p className="font-accent text-charcoal/70 leading-[1.9] text-base md:text-lg">
              Located at 301 Linden Avenue in downtown South San Francisco, we sit at the
              crossroads of the city's historic core and its booming biotech future.
              Just minutes from Oyster Point and the biotech corridor, Andiamo in Banca
              is where Silicon Valley's innovators come to unwind, celebrate, and connect
              over exceptional food and wine.
            </p>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
