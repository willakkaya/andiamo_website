import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, ArrowRight, ChevronDown, ShoppingBag, MapPin } from "lucide-react";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const REVIEWS = [
  {
    text: "Everything was wonderful. The freshly made pizza had a light, fluffy crust and was big enough for three people. My pappardelle pasta with prawns was delicious — you can really taste the freshness of the pasta and ingredients.",
    author: "Yelp Reviewer",
    rating: 5,
    source: "Yelp",
    sourceUrl: LINKS.yelp,
  },
  {
    text: "The octopus was tender with a nice chew. The complimentary bread is actually delish here — great for sopping up sauces. They were very sweet and gave my mom a complimentary ice cream dessert for her birthday. Mom and pop fine dining at its best.",
    author: "Yelp Reviewer",
    rating: 4,
    source: "Yelp",
    sourceUrl: LINKS.yelp,
  },
  {
    text: "We hosted a corporate dinner in The Vault and it was perfect. The staff was attentive, the food was exceptional, and our clients were thoroughly impressed. The historic bank setting is unlike anything else on the Peninsula.",
    author: "Yelp Reviewer",
    rating: 5,
    source: "Yelp",
    sourceUrl: LINKS.yelp,
  },
];

export default function Home() {
  useEffect(() => {
    document.title = "Andiamo in Banca | Italian Dining in SSF";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "South San Francisco's premier Italian restaurant in a restored 1920s bank building. Handmade pasta, curated wines, and The Vault private dining.");
  }, []);

  return (
    <PageLayout>
      {/* ========== HERO WITH VIDEO ========== */}
      <section
        className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${IMAGES.exterior})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={IMAGES.exterior}
          >
            <source src={IMAGES.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-8"
          >
            <p className="font-accent text-sm md:text-base tracking-[0.4em] uppercase text-white/50 mb-4">
              Est. 2018 &middot; South San Francisco
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-[0.03em] leading-[0.9]">
              Andiamo
            </h1>
            <p className="font-accent text-xl md:text-2xl tracking-[0.3em] uppercase text-white/60 mt-3">
              in Banca
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="ornament-line mb-8 !bg-white/30"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-accent text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed tracking-wide"
          >
            Upscale Italian dining in a beautifully restored historic bank building
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={LINKS.opentable}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-12 py-4 bg-white text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-all duration-500"
            >
              Reserve a Table
            </a>
            <a
              href={LINKS.onlineOrdering}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-12 py-4 border border-white/30 text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-500"
            >
              Order Online <ShoppingBag size={13} />
            </a>
          </motion.div>

          <motion.a
            href={LINKS.yelp}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-14 inline-flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < 4 ? "text-gold-light fill-gold-light" : "text-white/20 fill-white/20"} />
            ))}
            <span className="text-white/50 text-xs ml-2 font-body tracking-wider">
              4.2 on Yelp &middot; 348 Reviews
            </span>
          </motion.a>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={20} className="text-white/30 animate-bounce" />
        </motion.div>
      </section>

      {/* ========== INTRO ========== */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="ornament-line mb-8"
            />
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="font-display text-3xl md:text-5xl text-charcoal mb-8 leading-tight"
            >
              Where History Meets
              <br />
              <span className="text-gradient-gold">Culinary Art</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={2}
              className="text-muted-foreground leading-relaxed text-base md:text-lg font-accent tracking-wide"
            >
              Housed in a meticulously restored 1920s bank building on Linden Avenue,
              Andiamo in Banca transforms a piece of South San Francisco's architectural
              heritage into the Peninsula's most distinctive Italian dining destination.
            </motion.p>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={3}
              className="text-charcoal/40 text-sm mt-8 flex items-center justify-center gap-2 font-accent tracking-wide"
            >
              <MapPin size={14} className="text-gold" />
              301 Linden Avenue, South San Francisco, CA 94080
            </motion.p>
          </div>
        </div>
      </section>

      {/* ========== FULL-BLEED IMAGE BREAK ========== */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={IMAGES.exterior}
          alt="Andiamo in Banca exterior — restored 1920s bank building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container">
            <p className="font-accent text-sm tracking-[0.3em] uppercase text-white/50">
              301 Linden Avenue
            </p>
            <p className="font-display text-2xl md:text-3xl text-white mt-1">
              A Restored 1920s Bank Building
            </p>
          </div>
        </div>
      </section>

      {/* ========== THE VAULT TEASER ========== */}
      <section className="relative overflow-hidden section-dark">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
          <div className="relative h-[450px] lg:h-auto">
            <img
              src={IMAGES.vault}
              alt="The Vault private dining room at Andiamo in Banca"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center px-8 lg:px-20 py-16 lg:py-0">
            <div className="max-w-lg">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="ornament-line !mx-0 mb-6"
              />
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                className="font-accent text-sm tracking-[0.3em] uppercase text-gold-light/60 mb-4"
              >
                Private Dining
              </motion.p>
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
                className="font-display text-3xl md:text-5xl text-cream mb-6"
              >
                The Vault
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3}
                className="text-cream/60 leading-relaxed mb-6 font-accent text-lg tracking-wide"
              >
                Once a secure bank vault, now the Peninsula's most exclusive
                private dining room. Host your next corporate dinner, celebration,
                or intimate gathering where history and luxury converge.
              </motion.p>
              <motion.ul
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={4}
                className="space-y-3 mb-10 text-sm text-cream/50"
              >
                {["Seats 12–20 guests", "Custom prix fixe menus", "Perfect for corporate dinners & celebrations"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-1.5 h-px bg-gold" />
                    {item}
                  </li>
                ))}
              </motion.ul>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={5}
              >
                <Link
                  href="/the-vault"
                  className="inline-flex items-center gap-3 font-body text-[12px] tracking-[0.2em] uppercase text-gold-light hover:text-gold transition-colors duration-500"
                >
                  Explore The Vault
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FROM OUR KITCHEN ========== */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="ornament-line mb-6"
            />
            <motion.h2
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="font-display text-3xl md:text-5xl text-charcoal"
            >
              From Our Kitchen
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { img: IMAGES.petraleSole, title: "Petrale Sole", subtitle: "Signature Dish" },
              { img: IMAGES.lambChops, title: "Lamb Chops", subtitle: "From the Grill" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="group relative aspect-[4/3] overflow-hidden"
              >
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="font-accent text-xs tracking-[0.25em] uppercase text-white/50 mb-1">
                    {item.subtitle}
                  </p>
                  <h3 className="font-display text-2xl text-white">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 text-gold font-body text-[12px] tracking-[0.2em] uppercase hover:text-gold-light transition-colors duration-500"
            >
              View Full Menu
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== HAPPY HOUR BANNER ========== */}
      <section className="section-burgundy py-14">
        <div className="container text-center">
          <p className="font-accent text-sm tracking-[0.3em] uppercase text-white/40 mb-2">
            Tuesday – Friday &middot; 4:00 – 5:00 PM
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-white">
            Happy Hour
          </h2>
          <p className="text-white/40 text-sm mt-3 font-accent tracking-wide">
            Specially priced wines, cocktails, and appetizers
          </p>
        </div>
      </section>

      {/* ========== REVIEWS + SOCIAL ========== */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="ornament-line mb-6" />
            <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-3">
              What Our Guests Say
            </h2>
            <a
              href={LINKS.yelp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-gold transition-colors"
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className={i < 4 ? "text-gold fill-gold" : "text-gold/20 fill-gold/20"} />
              ))}
              <span className="ml-2 font-accent tracking-wider">4.2 stars &middot; 348 reviews on Yelp</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {REVIEWS.map((review, i) => (
              <motion.a
                key={i}
                href={review.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="block p-8 bg-card border border-charcoal/5 hover:border-gold/15 transition-all duration-500"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={12} className={j < review.rating ? "text-gold fill-gold" : "text-charcoal/10 fill-charcoal/10"} />
                  ))}
                </div>
                <p className="text-charcoal/70 text-sm leading-relaxed mb-6 font-accent italic tracking-wide">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-charcoal/50 text-xs font-body tracking-wider uppercase">{review.author}</span>
                  <span className="text-charcoal/30 text-xs">{review.source}</span>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Social follow */}
          <div className="text-center mt-16 pt-12 border-t border-charcoal/5">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-charcoal/40 hover:text-gold font-accent text-sm tracking-[0.2em] uppercase transition-colors duration-500"
            >
              Follow @andiamoinbanca on Instagram
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
