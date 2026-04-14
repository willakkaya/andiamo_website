import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X } from "lucide-react";

export default function StickyEventCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after scrolling past the hero (400px)
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
        >
          <div className="bg-charcoal/95 backdrop-blur-sm border-t border-gold/20 px-4 py-3 flex items-center gap-3">
            <a
              href="#quote-calculator"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("quote-calculator")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gold text-charcoal font-body text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-300"
            >
              <Calendar size={14} />
              Get Instant Quote
            </a>
            <button
              onClick={() => setDismissed(true)}
              className="text-cream/40 hover:text-cream/70 transition-colors p-1"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
