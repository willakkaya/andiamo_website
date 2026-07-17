import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { ShoppingBag, ArrowRight, Star, Clock } from "lucide-react";
import EventQuoteCalculator from "@/components/EventQuoteCalculator";
import StickyEventCTA from "@/components/StickyEventCTA";
import EmailCapture from "@/components/EmailCapture";
import { trackPhoneClick, trackContactSubmit, trackCateringInquiry, trackEzCaterClick } from "@/lib/analytics";
import { submitForm } from "@/lib/formspree";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

type TabKey = "banquet" | "catering";

/* ── Banquet Menus ── */
const banquetMenus = [
  {
    title: "$35 Per Person",
    subtitle: "Lunch Only",
    sections: [
      {
        heading: "Salad — All Guests",
        items: [
          { name: "Verde Mista", desc: "Organic spring greens and shaved heirloom carrots, tossed in a house-made balsamic vinaigrette" },
        ],
      },
      {
        heading: "Main Course — Choice of One Per Guest",
        items: [
          { name: "Spaghetti & Meatballs", desc: "Spaghetti pasta with marinara and homemade meatballs" },
          { name: "Salmon Piccata", desc: "Salmon filet with capers and lemon butter white wine sauce" },
          { name: "Rigatoni alle Verdure", desc: "Rigatoni pasta with a light marinara sauce and seasonal vegetables" },
          { name: "Chicken Parmesan", desc: "Breaded free-range chicken breast topped with marinara sauce and fresh mozzarella cheese" },
          { name: "Pork Chop", desc: "Grilled bone-in pork chop with a mushroom cream reduction" },
        ],
      },
      {
        heading: "Dessert — All Guests",
        items: [
          { name: "Chocolate Mousse", desc: "Velvety rich mousse served with fresh berries" },
        ],
      },
    ],
  },
  {
    title: "$65 Per Person",
    subtitle: "Dinner",
    sections: [
      {
        heading: "First Course — All Guests",
        items: [
          { name: "Tomato Bruschetta", desc: "Crostinis with fresh chopped tomato, basil and olive oil" },
        ],
      },
      {
        heading: "Salad — Choice of One Per Guest",
        items: [
          { name: "Verde Mista", desc: "Organic spring mixed, shaved carrots, and shaved Parmigiano Regiano" },
          { name: "Caesar Salad", desc: "Organic romaine lettuce, house made Caesar dressing, croutons and shaved Parmigiano Regiano" },
        ],
      },
      {
        heading: "Main Course — Choice of One Per Guest",
        items: [
          { name: "Rigatoni alle Verdure", desc: "Orecchiette pasta tossed with seasonal vegetables in house made marinara sauce" },
          { name: "Spaghetti with Meatballs", desc: "Spaghetti pasta with marinara and homemade meatballs" },
          { name: "Salmon Piccata", desc: "Pan-seared salmon filet with capers and lemon butter white wine sauce" },
          { name: "Filet Mignon Bordelaise", desc: "Grilled 7 oz filet mignon with a red wine bordelaise, served with starch and seasonal vegetables" },
          { name: "Chicken Marsala", desc: "Free range chicken breast in Marsala wine sauce with mushrooms, served with starch and seasonal vegetables" },
        ],
      },
      {
        heading: "Dessert — Choice of One Per Guest",
        items: [
          { name: "Tiramisu", desc: "Espresso-soaked ladyfingers, silky mascarpone cream, and a dusting of cocoa" },
          { name: "Vanilla Bean Panna Cotta", desc: "Velvety smooth panna cotta infused with Madagascar vanilla bean, topped with macerated berries and a balsamic glaze" },
          { name: "Lemon Blueberry Cheesecake", desc: "Rich and creamy lemon-infused cheesecake with a graham cracker crust, finished with a fresh blueberry compote and lemon zest" },
        ],
      },
    ],
    extras: [
      { label: "Standard Wine Pairing", price: "$30 / person", note: "Curated by our Sommelier" },
      { label: "Rare Wine Pairing", price: "$75 / person", note: "Curated by our Sommelier" },
      { label: "Legendary Wine Pairing", price: "$150 / person", note: "Curated by our Sommelier" },
    ],
  },
  {
    title: "$80 Per Person",
    subtitle: "Dinner",
    sections: [
      {
        heading: "Salad — Choice of One Per Guest",
        items: [
          { name: "Verde Mista", desc: "Organic spring mixed, shaved carrots, in a balsamic vinaigrette" },
          { name: "Caesar Salad", desc: "Organic romaine lettuce, house made Caesar dressing, croutons and shaved Parmigiano Regiano" },
        ],
      },
      {
        heading: "Appetizer — Served Family Style",
        items: [
          { name: "Burrata & Roasted Peppers", desc: "Creamy burrata with fire-roasted bell peppers, fresh basil, and aged balsamic" },
          { name: "Crab Cakes", desc: "Golden, pan-seared lump crab cakes with a crispy exterior and tender center, served with lemon-caper aioli and microgreens" },
        ],
      },
      {
        heading: "Entrée — Choice of One Per Guest",
        items: [
          { name: "Filet Mignon with Red Wine Demi-Glace", desc: "Prime center-cut filet mignon, seared to perfection, served with truffle mashed potatoes and seasonal vegetables" },
          { name: "Halibut Piccata", desc: "Delicate, pan-seared halibut with lemon-caper white wine sauce, saffron-infused risotto and sautéed broccolini" },
          { name: "Chicken Saltimbocca", desc: "Free-range chicken breast layered with prosciutto and sage in a white wine butter sauce, with roasted garlic mashed potatoes and baby zucchini" },
          { name: "Roasted Rack of Lamb with Rosemary Jus", desc: "Herb-crusted New Zealand rack of lamb, roasted to perfection and drizzled with a rosemary-infused jus" },
          { name: "Wild Mushroom & Truffle Risotto", desc: "Creamy aged Carnaroli rice infused with black truffle and slow-roasted wild mushrooms, finished with Parmigiano-Reggiano and white truffle oil (Vegetarian)" },
        ],
      },
      {
        heading: "Dessert — Choice of One Per Guest",
        items: [
          { name: "Tiramisu", desc: "Espresso-soaked ladyfingers, silky mascarpone cream, and a dusting of cocoa" },
          { name: "Lemon Blueberry Cheesecake", desc: "Rich and creamy lemon-infused cheesecake with a graham cracker crust, finished with a fresh blueberry compote and lemon zest" },
        ],
      },
    ],
    extras: [
      { label: "Standard Wine Pairing", price: "$30 / person", note: "Curated by our Sommelier" },
      { label: "Rare Wine Pairing", price: "$75 / person", note: "Curated by our Sommelier" },
      { label: "Legendary Wine Pairing", price: "$150 / person", note: "Curated by our Sommelier" },
    ],
  },
  {
    title: "$120 Per Person",
    subtitle: "Premier Dinner — Our Most Elevated Experience",
    sections: [
      {
        heading: "Welcome — All Guests",
        items: [
          { name: "Champagne Toast", desc: "A glass of premium sparkling wine to welcome your guests and set the tone for an unforgettable evening" },
        ],
      },
      {
        heading: "First Course — All Guests",
        items: [
          { name: "Oysters Rockefeller", desc: "Half-dozen baked oysters per guest with spinach, Pernod, Parmigiano, and herb breadcrumbs — a classic showstopper" },
          { name: "Winter Citrus & Fennel Salad", desc: "Shaved fennel, cara cara orange, arugula, champagne vinaigrette (Vegan, Gluten-Free)" },
        ],
      },
      {
        heading: "Second Course — Choice of One",
        items: [
          { name: "Lobster Ravioli", desc: "Housemade ravioli filled with Maine lobster and mascarpone in a saffron cream sauce with fresh tarragon" },
          { name: "Wild Mushroom & Truffle Risotto", desc: "Creamy aged Carnaroli rice with black truffle and slow-roasted wild mushrooms, Parmigiano-Reggiano and white truffle oil (Vegetarian, Gluten-Free)" },
        ],
      },
      {
        heading: "Main Course — Choice of One Per Guest",
        items: [
          { name: "Pan-Roasted Chilean Sea Bass", desc: "Lemon-caper beurre blanc, fingerling potatoes, market vegetables (Gluten-Free, Pescatarian)" },
          { name: "Herb-Crusted California Rack of Lamb", desc: "Garlic, rosemary, aged balsamic — truffle mashed potatoes and seasonal vegetables (Gluten-Free)" },
          { name: "Grilled Prime Filet Mignon", desc: "10 oz center-cut filet, red wine demi-glace, choice of blue cheese butter or herb-garlic olive oil (Gluten-Free)" },
          { name: "Gamberi al Limone", desc: "Tiger prawns sautéed with garlic, white wine, basil, and citrus — served with roasted potatoes and vegetables (Gluten-Free, Pescatarian)" },
          { name: "Osso Buco alla Milanese", desc: "Slow-braised veal shank with saffron risotto and gremolata — a timeless Italian classic" },
          { name: "Roasted Cauliflower Steak", desc: "Smoked tomato-caper vinaigrette, pine nuts, herbs (Vegan, Gluten-Free)" },
        ],
      },
      {
        heading: "Dessert — Choice of One Per Guest",
        items: [
          { name: "Classic Tiramisu", desc: "Espresso-soaked ladyfingers, silky mascarpone cream, and a dusting of Valrhona cocoa" },
          { name: "Affogato al Caffè", desc: "Vanilla gelato, hot espresso, amaretti biscotti" },
          { name: "Chocolate Lava Cake", desc: "Warm Valrhona chocolate fondant with a molten center, served with vanilla gelato and fresh berries" },
        ],
      },
    ],
    extras: [
      { label: "Standard Wine Pairing", price: "$30 / person", note: "Curated by our Sommelier" },
      { label: "Rare Wine Pairing", price: "$75 / person", note: "Curated by our Sommelier" },
      { label: "Legendary Wine Pairing", price: "$150 / person", note: "Curated by our Sommelier" },
    ],
  },
];

/* ── Event Enhancements ── */
const eventEnhancements = [
  { name: "Champagne Toast", price: "$12 / person", desc: "A glass of premium sparkling wine to welcome your guests", note: "Included in $120 menu" },
  { name: "Oysters Rockefeller", price: "$18 / person", desc: "Half-dozen baked oysters per guest with spinach, Pernod, and Parmigiano", note: "Included in $120 menu" },
  { name: "Antipasto & Cheese Display", price: "$15 / person", desc: "Imported cheeses, cured meats, marinated olives, and fresh focaccia" },
  { name: "Limoncello Toast", price: "$6 / person", desc: "House limoncello digestivo — a classic Italian after-dinner tradition" },
  { name: "Espresso & Cappuccino Bar", price: "$8 / person", desc: "Full after-dinner coffee service with espresso, cappuccino, and biscotti" },
  { name: "Soft Drinks & Beverages", price: "$5 / person", desc: "Assorted sodas, sparkling water, iced tea, and fresh lemonade" },
];

const horsDoeuves = [
  { name: "Bruschetta al Pomodoro", desc: "Toasted slices of bread topped with tomato cubes marinated with olive oil, garlic and basil", price: "$4 / person" },
  { name: "Italian Meatballs", desc: "Delicious Italian meatballs served with a dipping sauce", price: "$5 / person" },
  { name: "Shrimp Cocktail", desc: "Fresh shrimp with cocktail sauce", price: "$7 / person" },
  { name: "Calamari Fritti", desc: "Fresh squid fried and tossed in a garlic lemon sauce served with cocktail sauce", price: "$6 / person" },
  { name: "Grilled Chicken Skewer", desc: "Marinated chicken breast grilled over charcoal grill", price: "$5 / person" },
  { name: "Garlic Bread", desc: "Warm, toasty bread with garlic butter baked in", price: "$3 / person" },
];

/* ── Catering Menu ── */
const cateringMenu = [
  {
    category: "Salads",
    subtitle: "Fresh, vibrant, and crafted with seasonal ingredients.",
    items: [
      { name: "Organic Mixed Greens", desc: "Organic mixed greens with shredded vegetables, housemade balsamic vinaigrette", s10: "$50", s20: "$90" },
      { name: "Arugula Salad", desc: "Organic arugula with red onions, cherry tomatoes, shaved Parmigiano, Champagne vinaigrette", s10: "$55", s20: "$95" },
      { name: "Caesar Salad", desc: "Crisp romaine lettuce with garlic croutons, shaved Parmigiano-Reggiano, classic Caesar dressing", s10: "$60", s20: "$100" },
      { name: "Caprese Salad", desc: "Ripe tomatoes, fresh mozzarella, basil with balsamic vinaigrette and extra-virgin olive oil", s10: "$55", s20: "$95" },
    ],
  },
  {
    category: "Appetizers & Starters",
    subtitle: "Perfect beginnings for your event — vibrant, flavorful, and crafted with care.",
    items: [
      { name: "Bruschetta Classica", desc: "Toasted crostini topped with marinated chopped tomatoes, garlic, basil, and EVOO", s10: "$55", s20: "$95" },
      { name: "Garlic Bread", desc: "Warm sourdough bread brushed with garlic butter and baked until golden", s10: "$45", s20: "$75" },
      { name: "Brussels Sprouts con Pancetta", desc: "Oven-roasted Brussels sprouts tossed with crispy pancetta and balsamic reduction", s10: "$60", s20: "$100" },
      { name: "Seasonal Grilled Vegetables", desc: "Fresh seasonal vegetables grilled over mesquite fire with olive oil and sea salt", s10: "$80", s20: "$115" },
      { name: "Mini Meatballs Marinara", desc: "Housemade 100% beef meatballs blended with fresh breadcrumbs and herbs in signature marinara", s10: "$110", s20: "$190" },
    ],
  },
  {
    category: "Pasta",
    subtitle: "Authentic housemade pasta made fresh every day.",
    items: [
      { name: "Rigatoni Alla Salsiccia", desc: "Rigatoni tossed in a spicy roasted bell pepper and tomato sauce with grilled Italian sausage" },
      { name: "Lasagne Bolognese", desc: "Layered pasta sheets with slow-simmered all-beef ragù, ricotta, mozzarella, and Parmigiano-Reggiano" },
      { name: "Penne Alfredo", desc: "Creamy Parmesan Alfredo sauce over penne pasta" },
      { name: "Rigatoni al Funghi e Tartufo", desc: "Rigatoni with wild mushrooms, thyme, garlic, and a touch of truffle cream" },
      { name: "Spinach & Ricotta Ravioli", desc: "Housemade ravioli filled with spinach and ricotta. Choice of Sauce: Marinara or Bolognese" },
      { name: "Vegetarian Lasagna", desc: "Grilled seasonal vegetables layered with ricotta, mozzarella, and housemade marinara" },
      { name: "Chicken Alfredo", desc: "Penne pasta with grilled chicken tenderloins in a rich, creamy Alfredo sauce" },
      { name: "Rigatoni alla Norma", desc: "Sicilian-style rigatoni with roasted eggplant, tomato, basil, and shaved ricotta salata" },
      { name: "Rigatoni alla Vodka", desc: "Rigatoni with shallots, chili flakes, Parmigiano, and a silky cream sauce" },
      { name: "Penne al Pesto Genovese", desc: "Classic basil pesto with Parmigiano, toasted pine nuts, and a touch of cream" },
      { name: "Penne Arrabbiata", desc: "Penne in a bold, spicy marinara with chili and garlic" },
      { name: "Penne Pomodoro", desc: "Simple and bright — tomato, garlic, basil, and olive oil" },
      { name: "Pasta Bolognese", desc: "Slow-cooked beef ragù with aromatic vegetables and herbs. Choice of Penne, Spaghetti, or Gluten-Free Penne" },
    ],
  },
  {
    category: "Entrées",
    subtitle: "Chef-crafted main courses designed for family-style catering and elegant service.",
    items: [
      { name: "Chicken Marsala", desc: "Tender chicken breast sautéed with cremini mushrooms and finished in a rich Marsala wine reduction" },
      { name: "Chicken Parmesan", desc: "Crispy chicken breast topped with marinara, mozzarella, and Parmigiano, baked until golden" },
      { name: "Chicken Piccata", desc: "Pan-seared chicken breast with capers, lemon, and white wine butter sauce" },
      { name: "Grilled Salmon Fillet", desc: "Fresh salmon grilled to perfection and served with a delicate lemon butter sauce" },
      { name: "Beef Brasato al Barolo", desc: "Slow-braised short ribs simmered in Barolo wine, aromatic vegetables, and herbs" },
      { name: "Eggplant Parmesan", desc: "Breaded eggplant layered with marinara and mozzarella, baked until bubbling" },
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

export default function BanquetCatering() {
  usePageMeta("/banquet-catering");

  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window !== "undefined") {
      const tab = new URLSearchParams(window.location.search).get("tab");
      if (tab === "catering") return "catering";
    }
    return "banquet";
  });

  // Keep the tab in sync when the URL changes while already on this page
  // (e.g. clicking "Catering" in the nav from the banquet tab)
  const search = useSearch();
  useEffect(() => {
    const tab = new URLSearchParams(search).get("tab");
    if (tab === "catering" || tab === "banquet") setActiveTab(tab);
  }, [search]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.vault} alt="Private dining at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 text-center px-6">
          <p className="eyebrow !text-white/55 mb-4">From a dinner in The Vault to a buyout for 100</p>
          <h1 className="font-display text-4xl md:text-6xl text-white tracking-wide">
            Banquet &amp; Catering
          </h1>
          <p className="font-accent italic text-white/60 text-lg md:text-xl mt-3">
            Your event, our table.
          </p>
        </div>
      </section>

      {/* Tab Switcher + Menu Content */}
      <section className="section-padding section-cream">
        <div className="container max-w-4xl">
          {/* Intro */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mb-14"
          >
            <p className="font-accent text-charcoal/70 text-lg leading-relaxed max-w-2xl mx-auto tracking-wide">
              Two ways to bring Andiamo to your event: a <span className="text-charcoal">hosted banquet</span> in
              The Vault or the dining room &mdash; prix-fixe and served, with a coordinator &mdash; or
              <span className="text-charcoal"> catering to-go</span>, delivered to your office or venue.
              Pick a menu below.
            </p>
            <p className="font-accent text-charcoal/50 text-sm mt-5">
              Planning a hosted event?{" "}
              <a href="/private-events" className="text-gold hover:text-gold-light transition-colors">Start with Private Events</a>.
            </p>
          </motion.div>

          {/* Tab Navigation — matches Menu page style */}
          <div className="flex flex-wrap justify-center gap-1 mb-16 border-b border-charcoal/8 pb-6">
            {(["banquet", "catering"] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-2.5 font-accent text-sm tracking-[0.15em] transition-all duration-500 ${
                  activeTab === tab
                    ? "text-gold border-b-2 border-gold"
                    : "text-charcoal/55 hover:text-charcoal/80"
                }`}
              >
                {tab === "banquet" ? "Banquet Menu" : "Catering Menu"}
              </button>
            ))}
          </div>

          {/* ── BANQUET TAB ── */}
          {activeTab === "banquet" && (
            <motion.div
              key="banquet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-14">
                <div className="divider-diamond mb-6"><i /></div>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-3">Banquet Dining</h2>
                <p className="font-accent text-charcoal/65 max-w-2xl mx-auto tracking-wide">
                  Perfect for private events in The Vault or our main dining room. Choose from our curated prix fixe options.
                </p>
              </div>

              {banquetMenus.map((menu, mi) => (
                <div key={mi} className="mb-16">
                  <div className="text-center mb-8">
                    <h3 className="font-display text-2xl md:text-3xl text-charcoal">{menu.title}</h3>
                    {menu.subtitle && (
                      <p className="font-accent text-sm text-gold/80 tracking-[0.15em] uppercase mt-2">{menu.subtitle}</p>
                    )}
                    <div className="w-12 h-px bg-gold/30 mx-auto mt-4" />
                  </div>

                  {/* Simple items (hors d'oeuvres) — dotted line pattern */}
                  {menu.items && (
                    <div className="max-w-2xl mx-auto space-y-5">
                      {menu.items.map((item, i) => (
                        <div key={i} className="group">
                          <div className="flex items-baseline gap-3">
                            <h4 className="font-display text-base text-charcoal group-hover:text-gold transition-colors duration-500">
                              {item.name}
                            </h4>
                            <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
                          </div>
                          <p className="text-charcoal/60 text-base mt-1 font-accent italic tracking-wide leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Sectioned items ($35/$65 menus) */}
                  {menu.sections && (
                    <div className="max-w-2xl mx-auto space-y-12">
                      {menu.sections.map((section, si) => (
                        <div key={si}>
                          <p className="font-accent text-xs tracking-[0.25em] uppercase text-gold/80 mb-5 border-b border-gold/15 pb-2">
                            {section.heading}
                          </p>
                          <div className="space-y-5">
                            {section.items.map((item, ii) => (
                              <div key={ii} className="group">
                                <div className="flex items-baseline gap-3">
                                  <h4 className="font-display text-base text-charcoal group-hover:text-gold transition-colors duration-500">
                                    {item.name}
                                  </h4>
                                  <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
                                </div>
                                <p className="text-charcoal/60 text-base mt-1 font-accent italic tracking-wide leading-relaxed">
                                  {item.desc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Wine pairing extras */}
                  {menu.extras && (
                    <div className="max-w-2xl mx-auto mt-10 border border-gold/15 p-8">
                      <p className="font-accent text-xs tracking-[0.25em] uppercase text-gold/80 mb-6">
                        Optional Wine Pairing — Curated by Our Sommelier
                      </p>
                      <div className="space-y-4">
                        {menu.extras.map((extra, ei) => (
                          <div key={ei} className="flex items-baseline justify-between gap-3">
                            <span className="font-display text-base text-charcoal">{extra.label}</span>
                            <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
                            <span className="font-accent text-gold text-sm tracking-wide shrink-0">{extra.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {mi < banquetMenus.length - 1 && (
                    <div className="divider-gold my-14" />
                  )}
                </div>
              ))}

              {/* Event Enhancements */}
              <div className="mt-20">
                <div className="text-center mb-10">
                  <div className="divider-diamond mb-6"><i /></div>
                  <h3 className="font-display text-2xl md:text-3xl text-charcoal">Event Enhancements</h3>
                  <p className="font-accent text-sm text-charcoal/40 tracking-wider mt-2">
                    Elevate any banquet menu with these add-ons
                  </p>
                  <div className="w-12 h-px bg-gold/30 mx-auto mt-4" />
                </div>

                {/* Hors d'Oeuvres */}
                <div className="max-w-2xl mx-auto mb-12">
                  <p className="font-accent text-xs tracking-[0.25em] uppercase text-gold/80 mb-5 border-b border-gold/15 pb-2">
                    Hors d'Oeuvres — Priced Per Guest Count
                  </p>
                  <p className="text-charcoal/55 text-sm mb-6 font-accent italic tracking-wide">
                    Perfect for cocktail hours and reception-style events. Add any combination to your banquet package.
                  </p>
                  <div className="space-y-4">
                    {horsDoeuves.map((item, i) => (
                      <div key={i} className="group">
                        <div className="flex items-baseline justify-between gap-3">
                          <h4 className="font-display text-base text-charcoal group-hover:text-gold transition-colors duration-500">
                            {item.name}
                          </h4>
                          <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
                          <span className="font-accent text-gold text-sm tracking-wide shrink-0">{item.price}</span>
                        </div>
                        <p className="text-charcoal/60 text-base mt-1 font-accent italic tracking-wide leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Enhancement Add-Ons */}
                <div className="max-w-2xl mx-auto border border-gold/15 p-8 md:p-10">
                  <p className="font-accent text-xs tracking-[0.25em] uppercase text-gold/80 mb-6">
                    Add-Ons
                  </p>
                  <div className="space-y-6">
                    {eventEnhancements.map((item, i) => (
                      <div key={i}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-display text-base text-charcoal">{item.name}</span>
                          <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
                          <span className="font-accent text-gold text-sm tracking-wide shrink-0">{item.price}</span>
                        </div>
                        <p className="text-charcoal/60 text-base mt-1 font-accent italic tracking-wide leading-relaxed">
                          {item.desc}
                        </p>
                        {item.note && (
                          <p className="text-gold/70 text-xs mt-1 font-accent tracking-wide">
                            {item.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CATERING TAB ── */}
          {activeTab === "catering" && (
            <motion.div
              key="catering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-14">
                <div className="divider-diamond mb-6"><i /></div>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-3">Catering Menu</h2>
                <p className="font-accent text-charcoal/65 max-w-2xl mx-auto tracking-wide">
                  Bring Andiamo's flavors to your office, home, or event venue. Family-style trays available for 10 or 20 guests.
                </p>
              </div>

              {cateringMenu.map((cat, ci) => (
                <div key={ci} className="mb-16">
                  <div className="mb-8">
                    <h3 className="font-display text-2xl md:text-3xl text-charcoal">{cat.category}</h3>
                    <p className="font-accent text-sm text-charcoal/40 tracking-wider mt-1">{cat.subtitle}</p>
                    <div className="w-12 h-px bg-gold/30 mt-4" />
                  </div>

                  {/* Price column headers for items that have them */}
                  {cat.items[0] && "s10" in cat.items[0] && (
                    <div className="hidden sm:flex justify-end gap-6 mb-3">
                      <span className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/30 w-20 text-center">Serves 10</span>
                      <span className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/30 w-20 text-center">Serves 20</span>
                    </div>
                  )}

                  <div className="space-y-5">
                    {cat.items.map((item, ii) => (
                      <div key={ii} className="group">
                        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                          <div className="flex items-baseline gap-3 flex-1 min-w-0">
                            <h4 className="font-display text-base text-charcoal group-hover:text-gold transition-colors duration-500 shrink-0">
                              {item.name}
                            </h4>
                            <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
                          </div>
                          {"s10" in item && (
                            <div className="flex gap-6 shrink-0">
                              <span className="font-accent text-gold text-sm tracking-wide w-20 text-center">{(item as any).s10}</span>
                              <span className="font-accent text-gold text-sm tracking-wide w-20 text-center">{(item as any).s20}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-charcoal/60 text-base mt-1 font-accent italic tracking-wide leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Note for items without prices */}
                  {cat.items[0] && !("s10" in cat.items[0]) && (
                    <p className="text-center font-accent text-gold/70 text-sm mt-8 italic tracking-wide">
                      Pricing varies based on guest count and selections. Contact us for a custom quote.
                    </p>
                  )}
                </div>
              ))}

              {/* Direct order — primary CTA after browsing the menu */}
              <div id="order-catering" className="mt-16 pt-12 border-t border-charcoal/8">
                <div className="text-center mb-10">
                  <div className="divider-diamond mb-6"><i /></div>
                  <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-3">Order Catering Direct</h3>
                  <p className="font-accent text-charcoal/65 max-w-xl mx-auto tracking-wide">
                    Tell us what you need and we'll confirm your order personally &mdash; no middleman, no service fees.
                  </p>
                  <p className="inline-flex items-center gap-2 font-accent text-gold text-sm tracking-wide mt-4">
                    <Clock size={14} />
                    We respond within the hour during business hours
                  </p>
                </div>

                <CateringOrderForm />

                <div className="text-center mt-10">
                  <p className="font-accent text-charcoal/55 text-sm tracking-wide">
                    In a hurry? Call{" "}
                    <a href="tel:+16507458811" onClick={() => trackPhoneClick("catering-order")} className="text-gold hover:text-gold-light transition-colors">
                      (650) 745-8811
                    </a>{" "}
                    and we'll take your order over the phone.
                  </p>
                  <p className="font-accent text-charcoal/40 text-xs tracking-wide mt-4">
                    Prefer to order through ezCater?{" "}
                    <a
                      href={LINKS.ezcater}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEzCaterClick("catering-tab")}
                      className="text-charcoal/60 underline underline-offset-2 hover:text-charcoal transition-colors"
                    >
                      Order there instead
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Quote Calculator */}
      <EventQuoteCalculator />

      {/* Event Testimonials */}
      <section className="section-cream">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-24">
          <div className="text-center mb-12">
            <div className="divider-diamond mb-6"><i /></div>
            <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-3">What event hosts say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                text: "We hosted a corporate dinner in The Vault and it was perfect. The staff was attentive, the food was exceptional, and our clients were thoroughly impressed. The historic bank setting is unlike anything else on the Peninsula.",
                author: "Corporate Client",
                type: "Holiday Dinner in The Vault",
                rating: 5,
              },
              {
                text: "Andiamo handled our company's holiday party for 60 people flawlessly. The prix fixe menu was outstanding — every course was a hit. Our team is still talking about it months later.",
                author: "Event Planner",
                type: "Corporate Holiday Party",
                rating: 5,
              },
            ].map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="p-8 bg-white/50 border border-charcoal/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13} className={j < review.rating ? "text-gold fill-gold" : "text-charcoal/10"} />
                  ))}
                </div>
                <p className="font-accent text-charcoal/70 text-base leading-relaxed italic mb-5">
                  "{review.text}"
                </p>
                <div>
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-charcoal/50">{review.author}</span>
                  <span className="font-accent text-charcoal/30 text-xs block mt-0.5">{review.type}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Type Landing Pages */}
      <section className="section-warm">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center mb-10">
            <h3 className="font-display text-2xl text-charcoal mb-2">Planning a Specific Event?</h3>
            <p className="font-accent text-charcoal/50 text-sm">Explore our dedicated event pages with tailored packages and details.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <Link
              href="/holiday-parties"
              className="flex items-center justify-between p-5 border border-charcoal/10 hover:border-gold/30 bg-white/50 transition-all duration-300 group"
            >
              <div>
                <span className="font-display text-lg text-charcoal group-hover:text-gold transition-colors">Holiday Parties</span>
                <span className="font-accent text-charcoal/40 text-xs block mt-0.5">Corporate & team celebrations</span>
              </div>
              <ArrowRight size={16} className="text-charcoal/20 group-hover:text-gold transition-colors" />
            </Link>
            <Link
              href="/rehearsal-dinners"
              className="flex items-center justify-between p-5 border border-charcoal/10 hover:border-gold/30 bg-white/50 transition-all duration-300 group"
            >
              <div>
                <span className="font-display text-lg text-charcoal group-hover:text-gold transition-colors">Rehearsal Dinners</span>
                <span className="font-accent text-charcoal/40 text-xs block mt-0.5">Private dining in The Vault</span>
              </div>
              <ArrowRight size={16} className="text-charcoal/20 group-hover:text-gold transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* Email Capture */}
      <EmailCapture />

      {/* Sticky Mobile CTA */}
      <StickyEventCTA />

      {/* CTA */}
      <section className="section-dark py-20">
        <motion.div
          className="container max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="divider-diamond mb-8"><i /></div>
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Ready to plan your event?</h2>
          <p className="font-accent text-white/45 tracking-wide leading-relaxed mb-10">
            Whether it's a private dinner in The Vault or catering for your next corporate gathering,
            our team is here to help create an unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/banquet-catering?tab=catering#order-catering"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-all duration-500"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("order-catering");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else window.location.href = "/banquet-catering?tab=catering#order-catering";
              }}
            >
              <ShoppingBag size={14} />
              Order Catering Direct
            </a>
            <a
              href="/the-vault"
              className="inline-flex items-center justify-center px-10 py-4 border border-white/20 text-white font-body text-[12px] tracking-[0.2em] uppercase hover:bg-white/5 transition-all duration-500"
            >
              Inquire About The Vault
            </a>
          </div>
          <p className="text-white/30 text-sm mt-5 font-accent tracking-wide">
            Or call us at{" "}
            <a href="tel:+16507458811" onClick={() => trackPhoneClick("banquet-catering")} className="text-gold/80 hover:text-gold transition-colors">
              (650) 745-8811
            </a>
          </p>
        </motion.div>
      </section>
    </PageLayout>
  );
}
