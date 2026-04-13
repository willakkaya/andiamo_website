import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES, LINKS } from "@/lib/images";

const NAV_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/our-story" },
  { label: "The Vault", href: "/the-vault" },
  { label: "Banquet & Catering", href: "/banquet-catering" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  // On the home page, navbar starts transparent over the hero video
  const isHome = location === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const showSolid = scrolled || !isHome;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          showSolid
            ? "bg-warm-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex flex-col leading-none">
              <span
                className={`font-display text-[22px] md:text-[28px] tracking-[0.04em] transition-colors duration-700 ${
                  showSolid ? "text-charcoal" : "text-white"
                }`}
              >
                Andiamo
              </span>
              <span
                className={`font-accent text-[9px] md:text-[10px] tracking-[0.25em] uppercase transition-colors duration-700 ${
                  showSolid ? "text-charcoal/40" : "text-white/50"
                }`}
              >
                in Banca
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body text-[11px] tracking-[0.18em] uppercase transition-colors duration-500 ${
                  location === link.href
                    ? showSolid ? "text-gold" : "text-gold-light"
                    : showSolid
                      ? "text-charcoal/60 hover:text-charcoal"
                      : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href={LINKS.opentable}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:inline-flex items-center px-7 py-2.5 font-body text-[11px] tracking-[0.18em] uppercase font-semibold transition-all duration-500 ${
                showSolid
                  ? "bg-charcoal text-white hover:bg-espresso"
                  : "border border-white/30 text-white hover:bg-white/10"
              }`}
            >
              Reserve
            </a>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden transition-colors p-2 ${
                showSolid ? "text-charcoal hover:text-gold" : "text-white hover:text-gold-light"
              }`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu — full screen, warm dark overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-charcoal/98 flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-7">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className={`font-display text-2xl tracking-[0.1em] transition-colors duration-300 ${
                      location === link.href
                        ? "text-gold-light"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.4 }}
                className="mt-4"
              >
                <div className="ornament-line !bg-white/15 mb-8" />
                <a
                  href={LINKS.opentable}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-10 py-3.5 border border-white/20 text-white font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-white/10 transition-all duration-500"
                >
                  Reserve a Table
                </a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
