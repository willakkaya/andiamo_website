import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IMAGES, LINKS } from "@/lib/images";
import { trackReservationClick, trackEventMenusClick } from "@/lib/analytics";

// desktop: false keeps a link out of the desktop bar; the mobile overlay shows all of them
const NAV_LINKS: { label: string; href: string; desktop?: boolean }[] = [
  { label: "Menu", href: "/menu" },
  { label: "Our Story", href: "/our-story" },
  { label: "The Vault", href: "/the-vault" },
  { label: "Private Events", href: "/private-events" },
  { label: "Event Menus", href: "/banquet-catering" },
  { label: "Catering", href: "/banquet-catering?tab=catering" },
  { label: "Contact", href: "/contact" },
  { label: "Gallery", href: "/gallery", desktop: false },
];

const DESKTOP_LINKS = NAV_LINKS.filter((link) => link.desktop !== false);

// Pages under the Private Events hub — its nav link stays lit on them
const PRIVATE_EVENTS_PATHS = ["/private-dining", "/holiday-parties", "/rehearsal-dinners"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const search = useSearch();

  // /banquet-catering holds two views behind ?tab=, and two nav links point at it,
  // so a link there is active only when its tab matches the one in the URL.
  const currentTab = new URLSearchParams(search).get("tab") === "catering" ? "catering" : "events";
  const isActive = (href: string) => {
    const [path, query = ""] = href.split("?");
    if (path === "/banquet-catering") {
      const wantedTab = new URLSearchParams(query).get("tab") ?? "events";
      return location === path && wantedTab === currentTab;
    }
    if (path === "/private-events" && PRIVATE_EVENTS_PATHS.includes(location)) return true;
    return location === path;
  };

  // Path-only navigation already closes the overlay (effect below); a tab switch on
  // /banquet-catering changes only the query, so every link closes it on click too.
  const handleLinkClick = (label: string) => {
    setMobileOpen(false);
    if (label === "Event Menus") trackEventMenusClick("nav");
  };

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
        className={`fixed top-0 left-0 right-0 z-50 print:hidden transition-all duration-700 ${
          showSolid
            ? "bg-warm-white/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src={IMAGES.logo}
              alt="Andiamo in Banca"
              className={`h-10 md:h-14 w-auto transition-all duration-700 ${
                showSolid ? "" : "brightness-0 invert"
              }`}
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center lg:gap-6 xl:gap-10">
            {DESKTOP_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleLinkClick(link.label)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`font-body text-[11px] tracking-[0.18em] uppercase whitespace-nowrap transition-colors duration-500 ${
                  isActive(link.href)
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
              onClick={() => trackReservationClick("navbar")}
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
            className="fixed inset-0 z-[60] bg-espresso flex flex-col items-center justify-center overflow-y-auto print:hidden [@media(max-height:700px)]:justify-start [@media(max-height:700px)]:pt-24 [@media(max-height:700px)]:pb-10"
          >
            <nav className="flex flex-col items-center gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => handleLinkClick(link.label)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={`font-display text-2xl tracking-[0.1em] transition-colors duration-300 ${
                      isActive(link.href)
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
                  onClick={() => trackReservationClick("navbar-mobile")}
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
