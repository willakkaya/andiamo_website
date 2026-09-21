import { useState } from "react";
import { Link } from "wouter";
import { ShoppingBag, Clock } from "lucide-react";
import { LINKS } from "@/lib/images";
import { trackPhoneClick, trackContactSubmit, trackCateringInquiry, trackEzCaterClick } from "@/lib/analytics";
import { submitForm } from "@/lib/formspree";
import { EVENT_MENUS_PATH, SECTION_IDS } from "@/data/eventMenus";
import ViewSwitch from "./ViewSwitch";

/* ── Catering Menu ──
   Half tray serves ~10 · Full tray serves ~20 */
const cateringMenu = [
  {
    category: "Salads",
    subtitle: "Fresh, vibrant, and crafted with seasonal ingredients.",
    items: [
      { name: "Organic Mixed Greens", desc: "Organic mixed greens with shredded vegetables, housemade balsamic vinaigrette", half: "$50", full: "$90" },
      { name: "Arugula Salad", desc: "Organic arugula with red onions, cherry tomatoes, shaved Parmigiano, Champagne vinaigrette", half: "$55", full: "$95" },
      { name: "Caesar Salad", desc: "Crisp romaine lettuce with garlic croutons, shaved Parmigiano-Reggiano, classic Caesar dressing", half: "$60", full: "$110" },
      { name: "Caprese Salad", desc: "Ripe tomatoes, fresh mozzarella, basil with balsamic vinaigrette and extra-virgin olive oil", half: "$55", full: "$95" },
    ],
  },
  {
    category: "Appetizers & Starters",
    subtitle: "Perfect beginnings for your event — vibrant, flavorful, and crafted with care.",
    items: [
      { name: "Bruschetta Classica", desc: "Toasted crostini topped with marinated chopped tomatoes, garlic, basil, and EVOO", half: "$55", full: "$95" },
      { name: "Garlic Bread", desc: "Warm sourdough bread brushed with garlic butter and baked until golden", half: "$45", full: "$75" },
      { name: "Brussels Sprouts con Pancetta", desc: "Oven-roasted Brussels sprouts tossed with crispy pancetta and balsamic reduction", half: "$60", full: "$100" },
      { name: "Seasonal Grilled Vegetables", desc: "Fresh seasonal vegetables grilled over mesquite fire with olive oil and sea salt", half: "$80", full: "$130" },
      { name: "Mini Meatballs Marinara", desc: "Housemade 100% beef meatballs blended with fresh breadcrumbs and herbs in signature marinara", half: "$110", full: "$190" },
    ],
  },
  {
    category: "Pasta",
    subtitle: "Authentic housemade pasta made fresh every day.",
    items: [
      { name: "Rigatoni Alla Salsiccia", desc: "Rigatoni tossed in a spicy roasted bell pepper and tomato sauce with grilled Italian sausage", half: "$140", full: "$185" },
      { name: "Lasagne Bolognese", desc: "Layered pasta sheets with slow-simmered all-beef ragù, ricotta, mozzarella, and Parmigiano-Reggiano", half: "$150", full: "$195" },
      { name: "Penne Alfredo", desc: "Creamy Parmesan Alfredo sauce over penne pasta", half: "$130", full: "$170" },
      { name: "Rigatoni al Funghi e Tartufo", desc: "Rigatoni with wild mushrooms, thyme, garlic, and a touch of truffle cream", half: "$150", full: "$200" },
      { name: "Spinach & Ricotta Ravioli", desc: "Housemade ravioli filled with spinach and ricotta. Choice of Sauce: Marinara or Bolognese", half: "$145", full: "$190" },
      { name: "Vegetarian Lasagna", desc: "Grilled seasonal vegetables layered with ricotta, mozzarella, and housemade marinara", half: "$140", full: "$180" },
      { name: "Chicken Alfredo", desc: "Penne pasta with grilled chicken tenderloins in a rich, creamy Alfredo sauce", half: "$145", full: "$190" },
      { name: "Rigatoni alla Norma", desc: "Sicilian-style rigatoni with roasted eggplant, tomato, basil, and shaved ricotta salata", half: "$130", full: "$170" },
      { name: "Rigatoni alla Vodka", desc: "Rigatoni with shallots, chili flakes, Parmigiano, and a silky cream sauce", half: "$130", full: "$170" },
      { name: "Penne al Pesto Genovese", desc: "Classic basil pesto with Parmigiano, toasted pine nuts, and a touch of cream", half: "$130", full: "$170" },
      { name: "Penne Arrabbiata", desc: "Penne in a bold, spicy marinara with chili and garlic", half: "$120", full: "$160" },
      { name: "Penne Pomodoro", desc: "Simple and bright — tomato, garlic, basil, and olive oil", half: "$115", full: "$150" },
      { name: "Pasta Bolognese", desc: "Slow-cooked beef ragù with aromatic vegetables and herbs. Choice of Penne, Spaghetti, or Gluten-Free Penne", half: "$130", full: "$170" },
    ],
  },
  {
    category: "Entrées",
    subtitle: "Chef-crafted main courses designed for family-style catering and elegant service.",
    items: [
      { name: "Chicken Marsala", desc: "Tender chicken breast sautéed with cremini mushrooms and finished in a rich Marsala wine reduction", half: "$170", full: "$225" },
      { name: "Chicken Parmesan", desc: "Crispy chicken breast topped with marinara, mozzarella, and Parmigiano, baked until golden", half: "$170", full: "$225" },
      { name: "Chicken Piccata", desc: "Pan-seared chicken breast with capers, lemon, and white wine butter sauce", half: "$170", full: "$225" },
      { name: "Grilled Salmon Fillet", desc: "Fresh salmon grilled to perfection and served with a delicate lemon butter sauce", half: "$220", full: "$320" },
      { name: "Beef Brasato al Barolo", desc: "Slow-braised short ribs simmered in Barolo wine, aromatic vegetables, and herbs", half: "$260", full: "$400" },
      { name: "Eggplant Parmesan", desc: "Breaded eggplant layered with marinara and mozzarella, baked until bubbling", half: "$140", full: "$185" },
    ],
  },
];

/* ── Direct catering order form ── */
function CateringOrderForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", headcount: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(false);
    const ok = await submitForm({ ...form, _subject: "Catering Order Inquiry", source: "catering-direct" });
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
      trackContactSubmit("catering-direct");
      trackCateringInquiry(form.headcount || "unspecified");
    } else {
      setError(true);
    }
  };

  const field =
    "w-full bg-white/70 border border-charcoal/15 focus:border-gold/60 outline-none px-4 py-3 font-accent text-charcoal text-base tracking-wide placeholder:text-charcoal/35 transition-colors duration-300";

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="divider-diamond mb-6"><i /></div>
        <h3 className="font-display text-2xl text-charcoal mb-3">Grazie — we're on it.</h3>
        <p className="font-accent text-charcoal/65 tracking-wide max-w-md mx-auto">
          Your catering request is in. We'll get back to you <span className="text-charcoal">within the hour</span> during
          business hours to confirm the details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name *" className={field} />
        <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone *" className={field} />
        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (optional)" className={field} />
        <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} aria-label="Delivery date" className={field} />
      </div>
      <div className="mt-4">
        <input required value={form.headcount} onChange={(e) => setForm({ ...form, headcount: e.target.value })} placeholder="How many people? *" className={field} />
      </div>
      <div className="mt-4">
        <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Anything else? Tray preferences, dietary needs, delivery address…" className={field} />
      </div>
      {error && (
        <p className="font-accent text-sm text-red-700/80 mt-4">
          Something went wrong sending your request — please call us at (650) 745-8811 and we'll take care of you.
        </p>
      )}
      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full sm:w-auto px-12 py-4 bg-gold text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-all duration-500 disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Request Catering"}
      </button>
    </form>
  );
}

/* The catering view of /banquet-catering: trays delivered or picked up.
   Kept apart from the hosted-event menus — different buyer, different order path. */
export default function CateringView() {
  return (
    <div>
      <section className="bg-background pt-28 md:pt-36 pb-10">
        <div className="container">
          <ViewSwitch view="catering" />
          <div className="max-w-3xl mt-10 md:mt-12">
            <p className="eyebrow mb-4">Delivered to your office or venue</p>
            <h1 className="font-display text-4xl md:text-5xl text-charcoal leading-[1.08]">
              Catering trays, delivered or picked up
            </h1>
            <p className="font-accent text-charcoal/70 text-lg leading-relaxed mt-5">
              Bring Andiamo's flavors to your office, home, or event venue.
            </p>
            <p className="font-accent text-charcoal/70 text-base mt-2">
              Half tray serves ~10 &middot; Full tray serves ~20 &middot; House bread and delivery included
            </p>
            <p className="font-accent text-charcoal/70 text-base mt-5">
              Hosting at the restaurant instead?{" "}
              <Link href={EVENT_MENUS_PATH} className="link-line text-charcoal">Event menus &amp; pricing</Link>
            </p>
          </div>
        </div>
      </section>

      <section className="section-cream py-16 md:py-20">
        <div className="container max-w-4xl">
          {cateringMenu.map((cat) => (
            <div key={cat.category} className="mb-16">
              <div className="mb-8">
                <h2 className="font-display text-2xl md:text-3xl text-charcoal">{cat.category}</h2>
                <p className="font-accent text-sm text-charcoal/60 tracking-wider mt-1">{cat.subtitle}</p>
                <div className="w-12 h-px bg-gold/30 mt-4" />
              </div>

              <div className="hidden sm:flex justify-end gap-6 mb-3">
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/60 w-20 text-center">Half Tray</span>
                <span className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/60 w-20 text-center">Full Tray</span>
              </div>

              <div className="space-y-5">
                {cat.items.map((item) => (
                  <div key={item.name} className="group">
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                      <div className="flex items-baseline gap-3 flex-1 min-w-0">
                        <h3 className="font-display text-base text-charcoal group-hover:text-gold transition-colors duration-500 shrink-0">
                          {item.name}
                        </h3>
                        <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
                      </div>
                      <div className="flex gap-6 shrink-0 font-accent text-gold-dark text-sm tracking-wide lining-nums">
                        <span className="sm:w-20 sm:text-center">
                          <span className="sm:hidden text-charcoal/60">Half tray </span>
                          {item.half}
                        </span>
                        <span className="sm:w-20 sm:text-center">
                          <span className="sm:hidden text-charcoal/60">Full tray </span>
                          {item.full}
                        </span>
                      </div>
                    </div>
                    <p className="text-charcoal/60 text-base mt-1 font-accent italic tracking-wide leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Direct order — primary CTA after browsing the menu */}
          <div id={SECTION_IDS.orderCatering} className="mt-16 pt-12 border-t border-charcoal/8">
            <div className="text-center mb-10">
              <div className="divider-diamond mb-6"><i /></div>
              <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-3">Order Catering Direct</h2>
              <p className="font-accent text-charcoal/65 max-w-xl mx-auto tracking-wide">
                Tell us what you need and we'll confirm your order personally &mdash; no middleman, no service fees.
              </p>
              <p className="inline-flex items-center gap-2 font-accent text-gold-dark text-sm tracking-wide mt-4">
                <Clock size={14} />
                We respond within the hour during business hours
              </p>
            </div>

            <CateringOrderForm />

            <div className="text-center mt-10">
              <p className="font-accent text-charcoal/55 text-sm tracking-wide">
                In a hurry? Call{" "}
                <a href="tel:+16507458811" onClick={() => trackPhoneClick("catering-order")} className="text-gold-dark hover:text-gold transition-colors">
                  (650) 745-8811
                </a>{" "}
                and we'll take your order over the phone.
              </p>
              <div className="mt-8">
                <p className="font-accent text-charcoal/60 text-xs tracking-wide mb-3">Prefer instant checkout?</p>
                <a
                  href={LINKS.ezcater}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEzCaterClick("catering-tab")}
                  className="inline-flex items-center gap-2 px-8 py-3 border border-charcoal/25 text-charcoal/70 font-body text-[11px] tracking-[0.2em] uppercase hover:border-charcoal/50 hover:text-charcoal transition-all duration-500"
                >
                  <ShoppingBag size={13} />
                  Order on ezCater
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
