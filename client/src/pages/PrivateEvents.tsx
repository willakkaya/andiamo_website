import { useEffect } from "react";
import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { trackPhoneClick } from "@/lib/analytics";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

// The clear, plainly-labeled paths — one obvious choice each (no guessing)
const PATHS = [
  { href: "/the-vault", title: "The Vault", desc: "Our private room inside the original 1920s bank vault. Seats 12 to 22." },
  { href: "/private-dining", title: "Corporate dinners", desc: "Client dinners, board meetings, and recruiting — minutes from the biotech corridor." },
  { href: "/holiday-parties", title: "Holiday parties", desc: "Company celebrations from a dozen guests to a full-restaurant buyout." },
  { href: "/rehearsal-dinners", title: "Rehearsal dinners", desc: "Begin the celebration somewhere as memorable as the occasion." },
];

const FAQ = [
  {
    q: "What private dining spaces do you have?",
    a: "The Vault — our restored 1920s bank-vault room — seats 12 to 22. For larger gatherings we open the main dining room or arrange a full-restaurant buyout for 100-plus guests.",
  },
  {
    q: "What are the menus and prices?",
    a: "Hosted events are prix-fixe, from $35 per guest for a working lunch to $120 for our premier dinner, with optional sommelier wine pairings. The full banquet and catering menus are on our menus page.",
  },
  {
    q: "Do you cater off-site?",
    a: "Yes — for drop-off and delivered catering (office lunches, trays, family-style platters for 10 or 20), order online through ezCater. On-site hosted events are arranged directly with our events team.",
  },
  {
    q: "How far in advance should I book?",
    a: "Popular dates — holidays, JPM Healthcare Conference week, and weekends — book weeks to months out. Reach out early and we'll hold your date.",
  },
  {
    q: "How do I book?",
    a: "Send an inquiry from any event page or call (650) 745-8811. Our events team replies within a day with availability and a proposal.",
  },
];

export default function PrivateEvents() {
  usePageMeta("/private-events");

  // FAQ structured data — helps Google rich results and AI assistants cite us
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "private-events-faq-schema";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => { document.getElementById("private-events-faq-schema")?.remove(); };
  }, []);

  return (
    <PageLayout>
      {/* ========== HERO ========== */}
      <section className="relative h-[70vh] min-h-[520px] flex items-end justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.diningRoom} alt="The main dining room at Andiamo in Banca, set for a private event" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
        </div>
        <div className="relative z-10 text-center max-w-3xl mx-auto px-6 pb-16">
          <p className="eyebrow !text-cream/60 mb-5">Private Events</p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-cream leading-[1.05]">
            Host it in a 1920s bank
          </h1>
          <p className="font-accent italic text-cream/70 text-lg md:text-xl max-w-xl mx-auto mt-6 leading-relaxed">
            A private bank vault, a grand dining room, an award-winning cellar &mdash;
            and a team that makes the evening feel effortless.
          </p>
          <a
            href="#paths"
            onClick={(e) => { e.preventDefault(); document.getElementById("paths")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-3 mt-9 px-10 py-4 border border-cream/35 text-cream font-body text-[12px] tracking-[0.2em] uppercase hover:bg-cream hover:text-charcoal transition-all duration-500"
          >
            Find your event <ArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* ========== INTRO ========== */}
      <section className="section-padding bg-background overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 lg:gap-x-16 items-start">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="lg:col-span-5">
              <span className="chapter mb-7">Private Events</span>
              <h2 className="font-display text-3xl md:text-5xl text-charcoal leading-[1.08] mt-7">
                Every kind of evening,
                <br />
                <span className="italic text-gradient-gold">one address.</span>
              </h2>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="lg:col-span-7 lg:pt-3">
              <p className="font-accent text-charcoal/75 leading-[1.85] text-lg mb-6">
                From a quiet board dinner in The Vault to a hundred-guest holiday buyout, we
                host it all in a restored historic bank on Linden Avenue &mdash; five minutes
                from the biotech corridor, ten from SFO.
              </p>
              <p className="font-accent text-charcoal/75 leading-[1.85] text-lg">
                Pick the kind of evening you&rsquo;re planning below. Every path leads to the
                same place: a custom menu, an award-winning cellar, and one person who handles
                the details from first email to last espresso.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== PATHS — the obvious choices ========== */}
      <section id="paths" className="section-padding section-cream">
        <div className="container max-w-5xl">
          <div className="mb-12">
            <span className="chapter mb-6">Choose a path</span>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal mt-5">What are you planning?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-charcoal/10 border border-charcoal/10">
            {PATHS.map((p, i) => (
              <motion.div key={p.href} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                <Link href={p.href} className="group block bg-cream hover:bg-background transition-colors duration-500 p-9 h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-2 group-hover:text-gold transition-colors duration-500">{p.title}</h3>
                      <p className="font-accent text-charcoal/65 text-base leading-relaxed max-w-sm">{p.desc}</p>
                    </div>
                    <ArrowRight size={18} className="text-charcoal/25 group-hover:text-gold group-hover:translate-x-1 transition-all duration-500 shrink-0 mt-2" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EVENT MENUS & PRICING — front and center ========== */}
      <section className="section-padding section-dark grain">
        <div className="container max-w-5xl relative z-[2]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
              <span className="chapter chapter-light mb-6">The food</span>
              <h2 className="font-display text-3xl md:text-5xl text-cream mt-5 mb-6">Event menus &amp; pricing</h2>
              <p className="font-accent text-cream/65 text-lg leading-[1.8] mb-4">
                Hosted events are prix-fixe &mdash; from <span className="text-gold-light">$35</span> per
                guest for a working lunch to <span className="text-gold-light">$120</span> for our premier
                dinner, with optional sommelier wine pairings from $30.
              </p>
              <p className="font-accent text-cream/55 text-base leading-[1.8] mb-9">
                Four prix-fixe tiers, family-style additions, and a full catering menu &mdash;
                all in one place.
              </p>
              <Link
                href="/banquet-catering"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-500"
              >
                View the banquet &amp; catering menus <ArrowRight size={14} />
              </Link>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} className="aspect-[4/3] overflow-hidden">
              <img src={IMAGES.lambChops} alt="A plated banquet course at Andiamo in Banca" className="w-full h-full object-cover" loading="lazy" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== CATERING TO-GO — clearly separate from hosted events ========== */}
      <section className="section-warm py-16 md:py-20">
        <div className="container max-w-4xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-charcoal/10 bg-card p-8 md:p-10">
            <div className="md:max-w-xl">
              <p className="eyebrow mb-2">Not hosting here?</p>
              <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-2">Catering, delivered</h3>
              <p className="font-accent text-charcoal/65 text-base leading-relaxed">
                Office lunches and family-style trays for 10 or 20, brought to you. Order online
                and pay through ezCater &mdash; no event coordinator required.
              </p>
            </div>
            <a
              href={LINKS.ezcater}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-9 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-espresso transition-all duration-500 shrink-0"
            >
              <ShoppingBag size={14} /> Order catering online
            </a>
          </div>
        </div>
      </section>

      {/* ========== FAQ — visible Q&A (UX + GEO) ========== */}
      <section className="section-padding bg-background">
        <div className="container max-w-3xl">
          <div className="text-center mb-14">
            <div className="divider-diamond mb-6"><i /></div>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal">Good to know</h2>
          </div>
          <div className="divide-y divide-charcoal/10">
            {FAQ.map((f, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="py-7">
                <h3 className="font-display text-xl md:text-2xl text-charcoal mb-2">{f.q}</h3>
                <p className="font-accent text-charcoal/70 text-base md:text-lg leading-[1.8]">{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CLOSING ========== */}
      <section className="bg-charcoal py-16">
        <div className="container max-w-3xl text-center">
          <p className="font-accent italic text-cream/70 text-xl md:text-2xl leading-relaxed mb-6">
            Tell us what you&rsquo;re planning. We&rsquo;ll take it from there.
          </p>
          <a
            href="tel:+16507458811"
            onClick={() => trackPhoneClick("private-events")}
            className="inline-block font-display text-3xl md:text-4xl text-gold hover:text-gold-light transition-colors"
          >
            (650) 745-8811
          </a>
          <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
            <Link href="/the-vault" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold-light">Tour The Vault</Link>
            <Link href="/banquet-catering" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold-light">Event menus</Link>
            <Link href="/contact" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold-light">Contact us</Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
