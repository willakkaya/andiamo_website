import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Check } from "lucide-react";
import { submitForm } from "@/lib/formspree";
import { toast } from "sonner";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await submitForm({
      name,
      email,
      _subject: "Event Planning Guide Request",
      source: "email-capture",
    });
    if (ok) {
      setSubmitted(true);
      toast.success("We'll send your guide shortly!");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <section className="section-warm">
      <div className="max-w-2xl mx-auto px-6 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 border border-gold/20 mb-6">
            <Mail size={20} className="text-gold" />
          </div>
          <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-3">
            Planning a Private Event?
          </h3>
          <p className="font-accent text-charcoal/60 text-base leading-relaxed max-w-lg mx-auto mb-8">
            Get our complimentary Event Planning Guide with sample menus, pricing,
            floor plans, and tips for hosting the perfect event at Andiamo in Banca.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-gold">
              <Check size={18} />
              <span className="font-accent text-sm tracking-wide">Check your inbox — we'll send it shortly!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="First name"
                  className="flex-1 bg-transparent border border-charcoal/15 px-4 py-3 text-charcoal font-accent text-sm placeholder:text-charcoal/30 focus:border-gold/40 focus:outline-none transition-all"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 bg-transparent border border-charcoal/15 px-4 py-3 text-charcoal font-accent text-sm placeholder:text-charcoal/30 focus:border-gold/40 focus:outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3 bg-charcoal text-cream font-body text-[11px] tracking-[0.2em] uppercase hover:bg-espresso transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
              >
                {submitting ? "Sending..." : "Send Me the Guide"}
                <ArrowRight size={13} />
              </button>
              <p className="font-accent text-charcoal/35 text-[10px] mt-3">
                No spam. Just one helpful email with your guide.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
