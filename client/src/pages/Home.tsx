import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Star, ArrowRight, ChevronDown, ShoppingBag, MapPin } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

const reveal = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// The numbers that actually say something about this place.
const HERITAGE = [
  { figure: "1989", label: "Cooking for the Peninsula since" },
  { figure: "Three", label: "Family restaurants, two generations" },
  { figure: "1,500+", label: "Thanksgiving meals served free, every year" },
  { figure: "1920", label: "The year our bank was built" },
];

const REVIEWS = [
  {
    text: "The freshly made pizza had a light, fluffy crust, big enough for three. My pappardelle with prawns was delicious — you can really taste the freshness of the pasta and the ingredients.",
    source: "Yelp",
    rating: 5,
  },
  {
    text: "The octopus was tender with a nice chew, and the complimentary bread is actually delish — great for sopping up sauces. They gave my mom a complimentary dessert for her birthday. Mom-and-pop fine dining at its best.",
    source: "Yelp",
    rating: 5,
  },
  {
    text: "We hosted a corporate dinner in The Vault and it was perfect. Attentive staff, exceptional food, and clients who were genuinely impressed. The historic bank setting is unlike anything else on the Peninsula.",
    source: "Yelp",
    rating: 5,
  },
];

export default function Home() {
  usePageMeta("/");

  return (
    <PageLayout>
      {/* ========== HERO ========== */}
      <section
        className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${IMAGES.exterior})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="w-full h-full object-cover" poster={IMAGES.exterior}>
            <source src={IMAGES.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/60" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="eyebrow !text-white/55 mb-6">Handmade Italian &middot; South San Francisco</p>
            <h1 className="font-display text-[5rem] leading-[0.82] md:text-[8rem] lg:text-[10rem] text-white tracking-[0.01em]">
              Andiamo
            </h1>
            <p className="font-accent italic text-2xl md:text-4xl text-white/65 mt-2 tracking-[0.18em]">
              in Banca
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-accent text-white/80 text-lg md:text-2xl max-w-2xl mx-auto mt-9 mb-11 leading-relaxed"
          >
            A restored 1920s bank. Handmade pasta. A steel vault you can dine in.
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
              className="inline-flex items-center px-12 py-4 bg-white text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold hover:text-white transition-all duration-500"
            >
              Reserve a Table
            </a>
            <a
              href={LINKS.onlineOrdering}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-12 py-4 border border-white/35 text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-white/10 transition-all duration-500"
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
            className="mt-12 inline-flex items-center justify-center gap-1 hover:opacity-80 transition-opacity"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} className={i < 4 ? "text-gold-light fill-gold-light" : "text-white/20 fill-white/20"} />
            ))}
            <span className="text-white/55 text-xs ml-2 font-body tracking-wider">4.2 on Yelp &middot; 348 reviews</span>
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

      {/* ========== I — THE NAME ========== */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-16 items-start">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="lg:col-span-7"
            >
              <span className="chapter mb-8">I &mdash; In Banca</span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal leading-[1.08] mt-7">
                <span className="italic text-gradient-gold">Andiamo in Banca</span> &mdash;
                <br />
                Italian for &ldquo;let&rsquo;s go to the bank.&rdquo;
              </h2>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-5 lg:pt-4"
            >
              <p className="font-accent text-charcoal/75 leading-[1.85] text-lg mb-6">
                The bank itself closed long ago. These days, &ldquo;let&rsquo;s go to the bank&rdquo;
                means something better &mdash; a landmark 1920s building on Linden Avenue, marble
                and columns and a steel vault still intact, filled with the food a Bay Area
                family has cooked since 1989.
              </p>
              <p className="font-accent text-charcoal/75 leading-[1.85] text-lg mb-8">
                Three restaurants. Two generations. One idea passed from father to son:
                treat every guest like family, and pour them something extraordinary.
              </p>
              <Link
                href="/our-story"
                className="link-line inline-flex items-center gap-3 text-gold font-body text-[12px] tracking-[0.2em] uppercase"
              >
                Read our story
                <ArrowRight size={14} />
              </Link>
              <p className="text-charcoal/45 text-sm mt-10 flex items-center gap-2 font-accent tracking-wide">
                <MapPin size={14} className="text-gold" />
                301 Linden Avenue, South San Francisco
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== HERITAGE STRIP ========== */}
      <section className="section-dark grain">
        <div className="container relative z-[2] py-20 md:py-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {HERITAGE.map((stat, i) => (
              <motion.div
                key={stat.figure}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center lg:text-left lg:border-l lg:border-cream/12 lg:pl-7"
              >
                <p className="font-display text-4xl md:text-5xl text-gold-light mb-3">{stat.figure}</p>
                <p className="font-accent text-cream/55 text-sm leading-snug tracking-wide">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== THE ROOM — main dining room ========== */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={0}
              className="order-2 lg:order-1"
            >
              <span className="chapter mb-7">The Room</span>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-[1.08] mt-7 mb-7">
                Twenty-foot ceilings,
                <br />
                <span className="italic text-gradient-gold">marble columns,</span> dinner.
              </h2>
              <p className="font-accent text-charcoal/75 leading-[1.85] text-lg mb-8">
                The grand columns and soaring ceilings of the old bank were preserved, not
                papered over. You dine beneath them &mdash; in a room that still feels like it
                holds something valuable, because it once did.
              </p>
              <Link
                href="/gallery"
                className="link-line inline-flex items-center gap-3 text-gold font-body text-[12px] tracking-[0.2em] uppercase"
              >
                See the room
                <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="order-1 lg:order-2 aspect-[3/4] overflow-hidden"
            >
              <img
                src={IMAGES.diningRoom}
                alt="The main dining room at Andiamo in Banca — restored 1920s bank with marble columns and soaring ceilings"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== II — THE VAULT ========== */}
      <section className="relative overflow-hidden section-dark grain">
        <div className="relative z-[2] grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">
          <div className="relative h-[450px] lg:h-auto overflow-hidden">
            <motion.img
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              src={IMAGES.vault}
              alt="The Vault private dining room at Andiamo in Banca"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="flex items-center px-8 lg:px-20 py-16 lg:py-0">
            <div className="max-w-lg">
              <motion.span
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
                className="chapter chapter-light mb-7"
              >
                II &mdash; Private Dining
              </motion.span>
              <motion.h2
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={1}
                className="font-display text-4xl md:text-6xl text-cream mb-6 mt-2"
              >
                The Vault
              </motion.h2>
              <motion.p
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={2}
                className="text-cream/65 leading-[1.85] mb-8 font-accent text-lg"
              >
                Where the bank once kept its safe-deposit boxes, we now seat your most
                important dinners &mdash; the original steel door swung open behind you.
                It is, as far as we know, the only dining room of its kind on the Peninsula.
              </motion.p>
              <motion.ul
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={3}
                className="space-y-3 mb-10 text-sm text-cream/55 font-accent tracking-wide"
              >
                {["Seats 12 to 20 guests", "Custom prix-fixe menus & wine pairings", "Built for corporate dinners and celebrations"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-4 h-px bg-gold" />
                    {item}
                  </li>
                ))}
              </motion.ul>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={4}
              >
                <Link
                  href="/the-vault"
                  className="link-line inline-flex items-center gap-3 font-body text-[12px] tracking-[0.2em] uppercase text-gold-light"
                >
                  Step inside The Vault
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== III — THE TABLE ========== */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <span className="chapter mb-6">III &mdash; The Table</span>
              <h2 className="font-display text-4xl md:text-5xl text-charcoal mt-5">
                Made by hand, every day
              </h2>
            </div>
            <Link
              href="/menu"
              className="link-line inline-flex items-center gap-3 text-gold font-body text-[12px] tracking-[0.2em] uppercase shrink-0 md:mb-2"
            >
              View the full menu
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { img: IMAGES.alfredo, title: "Fettuccine Alfredo", subtitle: "Ribbons of fresh pasta, Parmesan cream" },
              { img: IMAGES.mushroomAgnolotti, title: "Wild Mushroom Agnolotti", subtitle: "Hand-folded, black truffle cream" },
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
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="eyebrow !text-white/55 mb-1">{item.subtitle}</p>
                  <h3 className="font-display text-2xl md:text-3xl text-white">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ========== WINE SPECTATOR — AWARD OF EXCELLENCE ========== */}
      <section className="section-cream py-20 md:py-28 overflow-hidden">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.a
              href={LINKS.wineSpectatorAwards}
              target="_blank"
              rel="noopener noreferrer"
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex justify-center md:justify-end group"
              aria-label="Wine Spectator Award of Excellence 2026 — learn more"
            >
              <img
                src={IMAGES.wineSpectatorAward}
                alt="Wine Spectator Award of Excellence 2026"
                width={210}
                height={388}
                className="w-[175px] md:w-[210px] h-auto shadow-[0_25px_60px_-20px_rgba(60,40,10,0.4)] transition-transform duration-700 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </motion.a>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="text-center md:text-left"
            >
              <span className="chapter mb-6">Recognition</span>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal leading-tight mb-6 mt-2">
                Wine Spectator
                <br />
                <span className="text-gradient-gold">Award of Excellence</span>
              </h2>
              <p className="font-accent text-charcoal/75 text-lg leading-relaxed mb-6">
                In 2026 our cellar earned Wine Spectator&rsquo;s Award of Excellence &mdash;
                recognition for a list of quality producers chosen to pair, in price and style,
                with every plate we send out. From Brunello, Barolo, and Super Tuscans to
                California cult cabernets and reserve Champagne.
              </p>
              <p className="font-accent text-charcoal/70 text-lg italic leading-relaxed">
                &ldquo;Whoever wrote the rule that a little caf&eacute; can&rsquo;t have the best
                wines in the world?&rdquo;
              </p>
              <p className="eyebrow !text-gold/60 mt-3">&mdash; Will Akkaya</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== HAPPY HOUR ========== */}
      <section className="section-burgundy py-16">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-center gap-x-10 gap-y-3 text-center md:text-left">
            <h2 className="font-display text-3xl md:text-4xl text-white">Happy Hour</h2>
            <span className="hidden md:block w-px h-10 bg-white/25" />
            <div>
              <p className="eyebrow !text-white/65 mb-1">Tuesday &ndash; Friday &middot; 4:00 &ndash; 5:00 PM</p>
              <p className="text-white/70 font-accent tracking-wide">
                Specially priced wines, cocktails, and antipasti at the bar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== REVIEWS ========== */}
      <section className="section-padding bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <div className="divider-diamond mb-6">
              <i />
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mb-4">Word of mouth</h2>
            <a
              href={LINKS.yelp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground text-sm hover:text-gold transition-colors"
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} className={i < 4 ? "text-gold fill-gold" : "text-gold/20 fill-gold/20"} />
              ))}
              <span className="ml-2 font-accent tracking-wider">4.2 &middot; 348 reviews on Yelp</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-charcoal/8 max-w-5xl mx-auto border border-charcoal/8">
            {REVIEWS.map((review, i) => (
              <motion.a
                key={i}
                href={LINKS.yelp}
                target="_blank"
                rel="noopener noreferrer"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="group block p-9 bg-background hover:bg-card transition-colors duration-500"
              >
                <span className="font-display text-5xl text-gold/25 leading-none group-hover:text-gold/40 transition-colors">
                  &ldquo;
                </span>
                <p className="text-charcoal/75 text-base leading-[1.8] mt-2 mb-7 font-accent italic tracking-wide">
                  {review.text}
                </p>
                <div className="flex items-center gap-2">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={12} className="text-gold fill-gold" />
                  ))}
                  <span className="text-charcoal/40 text-xs ml-1 tracking-wider uppercase">via {review.source}</span>
                </div>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-16 pt-12 border-t border-charcoal/8">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="link-line inline-flex items-center gap-3 text-charcoal/60 hover:text-gold font-accent text-sm tracking-[0.2em] uppercase transition-colors duration-500"
            >
              Follow @andiamoinbanca
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
