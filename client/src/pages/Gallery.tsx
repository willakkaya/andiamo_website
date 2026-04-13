import PageLayout from "@/components/PageLayout";
import { IMAGES } from "@/lib/images";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

type Category = "All" | "The Building" | "Private Dining" | "Cuisine";

const GALLERY_ITEMS: { src: string; alt: string; category: Exclude<Category, "All"> }[] = [
  { src: IMAGES.exterior, alt: "Andiamo in Banca — historic bank building exterior with grand columns", category: "The Building" },
  { src: IMAGES.vault, alt: "The Vault — private dining room with rich red walls and white tablecloths", category: "Private Dining" },
  { src: IMAGES.petraleSole, alt: "Petrale Sole — signature dish with micro greens", category: "Cuisine" },
  { src: IMAGES.lambChops, alt: "Grilled lamb chops with rosemary and balsamic reduction", category: "Cuisine" },
  { src: IMAGES.happyHour, alt: "Happy Hour — Tuesday through Friday, 4:00 PM to 5:00 PM", category: "The Building" },
];

const CATEGORIES: Category[] = ["All", "The Building", "Private Dining", "Cuisine"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: "easeOut" },
  }),
};

export default function Gallery() {
  useEffect(() => {
    document.title = "Gallery | Andiamo in Banca";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Photos of our dining room, dishes, and historic bank building. Andiamo in Banca — South San Francisco.");
  }, []);

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = activeCategory === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };
  const goPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={IMAGES.exterior}
            alt="Andiamo in Banca gallery"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="font-accent text-sm tracking-[0.3em] uppercase text-cream/60 mb-5">
            A Visual Tour
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream">
            Gallery
          </h1>
        </div>
      </section>

      {/* Gallery Content — dark warm background */}
      <section className="section-dark">
        <div className="container py-20 md:py-28">
          {/* Ornament + heading */}
          <div className="text-center mb-16">
            <div className="ornament-line mx-auto mb-6 opacity-40" />
            <p className="font-accent text-[11px] tracking-[0.3em] uppercase text-gold/80 mb-2">
              Browse by Category
            </p>
          </div>

          {/* Category Filter — understated uppercase buttons, no rounded corners */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 font-body text-[12px] tracking-[0.2em] uppercase transition-all duration-300 rounded-none ${
                  activeCategory === cat
                    ? "bg-gold text-charcoal"
                    : "text-cream/60 hover:text-cream/80 border border-cream/10 hover:border-cream/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.src}
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                  custom={i}
                  className="group relative aspect-[4/3] overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  {/* Refined hover overlay — no bouncy transforms */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                    <div className="p-5 pb-6">
                      <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold/80">
                        {item.category}
                      </p>
                      <p className="font-accent text-cream/90 text-sm mt-1.5 leading-snug">
                        {item.alt}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Description + Internal Links */}
          <div className="text-center mt-20 max-w-2xl mx-auto">
            <div className="ornament-line mx-auto mb-6 opacity-30" />
            <p className="font-accent text-cream/65 text-sm leading-relaxed mb-6">
              Andiamo in Banca occupies a beautifully restored 1920s bank building at the heart of South San Francisco.
              From the grand marble columns and original vault door to the intimate private dining room, every detail
              tells a story of Italian craftsmanship and hospitality.
            </p>
            <p className="font-accent text-cream/65 text-sm leading-relaxed mb-8">
              Our kitchen produces handmade pasta daily, sources the finest seasonal ingredients, and presents
              each dish with the care it deserves. Whether it's a weeknight dinner or a private celebration in
              The Vault, the experience is always simply delicious.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <Link href="/menu" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors duration-300">
                Explore Our Menu
              </Link>
              <Link href="/the-vault" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors duration-300">
                Private Dining
              </Link>
              <Link href="/contact" className="font-accent text-gold/70 hover:text-gold text-sm tracking-wide transition-colors duration-300">
                Visit Us
              </Link>
            </div>
            <p className="font-accent text-cream/60 text-sm italic">
              Follow us on{" "}
              <a
                href="https://www.instagram.com/andiamoinbanca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 hover:text-gold transition-colors duration-300"
              >
                @andiamoinbanca
              </a>{" "}
              for more photos and updates.
            </p>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-cream/65 hover:text-cream transition-colors duration-300 z-10"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 text-cream/20 hover:text-cream transition-colors duration-300 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={36} />
            </button>
            <motion.img
              key={filtered[lightboxIndex].src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].alt}
              className="max-w-[90vw] max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 text-cream/20 hover:text-cream transition-colors duration-300 z-10"
              aria-label="Next image"
            >
              <ChevronRight size={36} />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-gold/70">
                {filtered[lightboxIndex].category}
              </p>
              <p className="font-accent text-cream/65 text-xs mt-1">
                {lightboxIndex + 1} / {filtered.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
