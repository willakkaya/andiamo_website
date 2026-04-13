import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { ShoppingBag, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

type TabKey = "banquet" | "catering";

/* ── Banquet Menus ── */
const banquetMenus = [
  {
    title: "Hors d'Oeuvres",
    subtitle: "For events serving appetizers only. Prices vary based on guest count — contact us for a quote.",
    items: [
      { name: "Bruschetta al Pomodoro", desc: "Toasted slices of bread topped with tomato cubes marinated with olive oil, garlic and basil" },
      { name: "Italian Meatballs", desc: "Delicious Italian meatballs served with a dipping sauce" },
      { name: "Shrimp Cocktail", desc: "Fresh shrimp with cocktail sauce" },
      { name: "Calamari Fritti", desc: "Fresh squid fried and tossed in a garlic lemon sauce served with cocktail sauce" },
      { name: "Grilled Chicken Skewer", desc: "Marinated chicken breast grilled over charcoal grill" },
      { name: "Garlic Bread", desc: "Warm, toasty bread with garlic butter baked in" },
    ],
  },
  {
    title: "$35 Per Person",
    subtitle: "Lunch Only",
    sections: [
      {
        heading: "Salad — Choice of One Per Guest",
        items: [
          { name: "Mixed Green Salad", desc: "Organic spring mixed, shaved carrots, and shaved Parmigiano Regiano in balsamic vinaigrette" },
        ],
      },
      {
        heading: "Entrée — Choice of One",
        items: [
          { name: "Rigatoni alla Carcerata", desc: "Tube shape pasta with mild Italian sausage, red bell peppers and peas in a creamy tomato sauce" },
          { name: "Fish of the Day", desc: "Served with starch and seasonal vegetables" },
          { name: "Orecchiette alle Verdure", desc: "Orecchiette pasta with a light marinara sauce and seasonal vegetables" },
          { name: "Chicken Marsala", desc: "Chicken breast in Marsala wine and mushrooms, served with starch and seasonal vegetables" },
          { name: "Rigatoni alle Verdure", desc: "Orecchiette pasta tossed with seasonal vegetables in house made tomato sauce" },
          { name: "Spaghetti with Meatballs", desc: "Spaghetti pasta with marinara and homemade meatballs" },
          { name: "Salmon Piccata", desc: "Pan-seared salmon filet with capers and lemon butter white wine sauce, served with starch and seasonal vegetables" },
          { name: "Pollo Parmigiana", desc: "Breaded free range chicken breast topped with marinara sauce and fresh mozzarella cheese" },
          { name: "Pork Chop", desc: "Pork chop served with mashed potato and seasonal vegetables" },
        ],
      },
      {
        heading: "Dessert — Choice of One Per Guest",
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

export default function BanquetCatering() {
  useEffect(() => {
    document.title = "Banquet & Catering | Andiamo in Banca";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Banquet menus and catering packages for your next event. Andiamo in Banca, South San Francisco.");
  }, []);

  const [activeTab, setActiveTab] = useState<TabKey>("banquet");

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.vault} alt="Private dining at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        </div>
        <div className="relative z-10 text-center">
          <div className="ornament-line !bg-white/20 mb-6" />
          <h1 className="font-display text-4xl md:text-6xl text-white tracking-wide">
            Banquet & Catering
          </h1>
          <p className="font-accent text-sm tracking-[0.3em] uppercase text-white/50 mt-4">
            Private Events & Catering
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
            <p className="font-accent text-charcoal/65 text-lg leading-relaxed max-w-2xl mx-auto tracking-wide mb-8">
              From intimate private dinners in The Vault to large-scale catered events,
              we bring Andiamo's flavors to your celebration.
            </p>
            <a
              href={LINKS.ezcater}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-espresso transition-all duration-500"
            >
              <ShoppingBag size={14} />
              Order Catering Online
            </a>
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
                <div className="ornament-line mb-6" />
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
                          <p className="text-charcoal/60 text-sm mt-1 font-accent italic tracking-wide leading-relaxed">
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
                                <p className="text-charcoal/60 text-sm mt-1 font-accent italic tracking-wide leading-relaxed">
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
                  <div className="ornament-line mb-6" />
                  <h3 className="font-display text-2xl md:text-3xl text-charcoal">Event Enhancements</h3>
                  <p className="font-accent text-sm text-charcoal/40 tracking-wider mt-2">
                    Elevate any banquet menu with these add-ons
                  </p>
                  <div className="w-12 h-px bg-gold/30 mx-auto mt-4" />
                </div>
                <div className="max-w-2xl mx-auto border border-gold/15 p-8 md:p-10">
                  <div className="space-y-6">
                    {eventEnhancements.map((item, i) => (
                      <div key={i}>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-display text-base text-charcoal">{item.name}</span>
                          <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
                          <span className="font-accent text-gold text-sm tracking-wide shrink-0">{item.price}</span>
                        </div>
                        <p className="text-charcoal/60 text-sm mt-1 font-accent italic tracking-wide leading-relaxed">
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
                <div className="ornament-line mb-6" />
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
                        <p className="text-charcoal/60 text-sm mt-1 font-accent italic tracking-wide leading-relaxed">
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

              {/* ezCater CTA — right after browsing the menu */}
              <div className="text-center mt-16 pt-12 border-t border-charcoal/8">
                <p className="font-accent text-charcoal/65 text-sm tracking-wide mb-6">
                  Ready to order? Place your catering order online.
                </p>
                <a
                  href={LINKS.ezcater}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-espresso transition-all duration-500"
                >
                  <ShoppingBag size={14} />
                  Order on ezCater
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark py-20">
        <motion.div
          className="container max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
        >
          <div className="ornament-line !bg-white/20 mb-8" />
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Ready to Plan Your Event?</h2>
          <p className="font-accent text-white/45 tracking-wide leading-relaxed mb-10">
            Whether it's a private dinner in The Vault or catering for your next corporate gathering,
            our team is here to help create an unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={LINKS.ezcater}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-charcoal font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-all duration-500"
            >
              <ShoppingBag size={14} />
              Order Catering Online
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
            <a href="tel:+16507458811" className="text-gold/80 hover:text-gold transition-colors">
              (650) 745-8811
            </a>
          </p>
        </motion.div>
      </section>
    </PageLayout>
  );
}
