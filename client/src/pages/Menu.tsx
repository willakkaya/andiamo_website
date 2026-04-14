import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "wouter";

type MenuTab = "lunch" | "dinner" | "pizza" | "wine" | "happyhour";

/* ── LUNCH MENU ── */
const LUNCH = {
  appetizers: {
    title: "Appetizers",
    items: [
      { name: "Calamari Fritti", desc: "Fried calamari with chipotle aioli", price: "14.95" },
      { name: "Brussels Sprouts", desc: "Roasted brussels sprouts with seared pancetta and shaved parmesan", price: "12.95" },
      { name: 'Polpette "Meatballs"', desc: "Homemade all beef Wagyu meatballs with marinara and parmesan", price: "13.95" },
      { name: "Burrata Caprese", desc: "Burrata cheese with sliced Roma tomatoes, olive oil, basil and balsamic", price: "12.95" },
      { name: "Crab Cakes", desc: "Golden crab cakes served with a black truffle aioli", price: "15.95" },
    ],
  },
  salads: {
    title: "Salads",
    items: [
      { name: "Caesar Salad", desc: "Organic romaine lettuce, croutons, parmesan, and house-made Caesar dressing", price: "10.95" },
      { name: "Beet Salad", desc: "Beets, candied walnuts, with burrata cheese, olive oil, balsamic", price: "12.95" },
      { name: "Arugula Salad", desc: "Organic arugula, cherry tomatoes, cucumbers, and shaved pecorino with champagne vinaigrette", price: "11.95" },
    ],
  },
  pasta: {
    title: "Pasta",
    items: [
      { name: "Linguine Vongole", desc: "Linguine pasta with fresh Manila clams in a light garlic white wine sauce", price: "22.95" },
      { name: "Pappardelle Bolognese", desc: "Flat long pasta with our signature all beef meat sauce", price: "20.95" },
      { name: "Mushroom Ravioli", desc: "Pasta stuffed with mushrooms with a black truffle cream reduction", price: "23.95" },
      { name: 'Linguini Frutti di Mare "Cioppino"', desc: "Cioppino pasta with mixed seafood in tomato saffron sauce", price: "26.95" },
      { name: "Gemelli allo Zafferano", desc: "Twisted gemelli pasta with shrimp and zucchini in a light saffron cream", price: "24.95" },
    ],
  },
  panini: {
    title: "Panini",
    items: [
      { name: "Smoked Salmon Panini", desc: "Smoked salmon, cucumber, arugula and a lemon aioli on toasted ciabatta, served with fries or salad", price: "21.95" },
      { name: "Steak Sandwich", desc: "Steak, caramelized onions, mushrooms, and melted gorgonzola on toasted ciabatta, served with fries or salad", price: "25.95" },
      { name: "Grilled Chicken Panini", desc: "Grilled chicken, toasted ciabatta, aioli, lettuce, tomatoes, mozzarella cheese", price: "20.95" },
    ],
  },
  entrees: {
    title: "Entrees",
    items: [
      { name: "Pollo Marsala", desc: "Mary's free range chicken breast with mushrooms in a marsala wine sauce, with mashed potatoes and seasonal vegetables", price: "20.95" },
      { name: "Pollo Parmigiana", desc: "Mary's free range chicken breast coated with breadcrumbs, pan fried with mozzarella cheese and marinara sauce", price: "22.95" },
      { name: "Saltimbocca di Vitello", desc: "Veal scallopini with mozzarella, sage, and prosciutto di Parma in a rich demi-glace sauce", price: "32.95" },
      { name: "Salmon Piccata", desc: "Pan seared salmon filet with a lemon butter caper sauce, with vegetables and mashed potatoes", price: "25.95" },
      { name: "Branzino", desc: "Mediterranean bass with cherry tomato, olives, capers, lemon, white wine, garnished with orzo pasta", price: "27.95" },
      { name: "New York Steak", desc: "10 oz New York steak with a red wine peppercorn reduction, served with vegetables and mashed potatoes", price: "38.95" },
      { name: "Rack of Lamb", desc: "Grilled baby rack of lamb with garlic, rosemary, balsamic reduction, served with seasonal vegetables and mashed potatoes", price: "38.95" },
    ],
  },
};

/* ── DINNER MENU ── */
const DINNER = {
  antipasti: {
    title: "Antipasti",
    items: [
      { name: "Calamari Fritti", desc: "Fresh squid breaded, fried and tossed in a garlic lemon sauce with chipotle aioli", price: "19.95" },
      { name: "Truffle-Finished Crab Cakes", desc: "Golden-crusted crab cakes, black truffle aioli", price: "22.95" },
      { name: "Bruschetta al Pomodoro", desc: "Toasted bread topped with tomato cubes marinated with olive oil, garlic, parmesan, basil (4 per order)", price: "10.95" },
      { name: 'Polpette di Manzo "Meatballs"', desc: "Three house made Snake River Farms wagyu beef meatballs", price: "15.95" },
      { name: "Roasted Peppers & Stracciatella", desc: "Fire-roasted sweet peppers, cherry tomatoes with creamy Stracciatella cheese, aged balsamic and paprika", price: "16.95" },
      { name: "Brussels Sprouts with Pancetta", desc: "Roasted Brussels sprouts with Italian pancetta, balsamic glaze", price: "14.95" },
      { name: "Burrata Caprese", desc: "Burrata cheese topped with olive oil, balsamic glaze and sliced Roma tomatoes. Add prosciutto +$6", price: "16.95" },
      { name: 'Octopus "Pulpo"', desc: "Grilled Spanish octopus salad with arugula, red onions, and cannelloni beans", price: "18.95" },
      { name: "Steamed Mussels", desc: "Fresh mussels in a white wine and garlic broth with fresh tomatoes, herbs, and grilled crostini", price: "20.95" },
    ],
  },
  pasta: {
    title: "Pasta",
    items: [
      { name: "Pappardelle alla Bolognese", desc: "Pasta in our homemade all beef meat sauce", price: "27.95" },
      { name: "Spaghetti Meatballs", desc: "Pasta served in marinara sauce topped with 2 homemade meatballs", price: "28.95" },
      { name: "Gnocchi alla Rosa", desc: "Potato dumplings in a silky tomato-cream (pink) sauce with Parmigiano-Reggiano", price: "26.95" },
      { name: "Bucatini all'Amatriciana", desc: "Fresh bucatini, guanciale, San Marzano tomatoes, Calabrian chili, Pecorino Romano", price: "28.95" },
      { name: "Rigatoni alla Norma", desc: "Bronze-cut rigatoni with roasted Sicilian eggplant, San Marzano tomato sauce, basil, and ricotta", price: "27.95" },
      { name: "Wild Mushroom Agnolotti", desc: "Pasta stuffed with wild mushroom topped with a truffle tartufata cream and roasted cherry tomatoes", price: "30.95" },
      { name: "Rigatoni alla Vodka", desc: "Rigatoni pasta in a mildly spicy tomato red vodka cream sauce", price: "25.95" },
      { name: "Fettuccine Alfredo", desc: "Fettuccine pasta in our classic creamy Alfredo sauce. Add chicken +$6", price: "22.95" },
      { name: "Linguine al Pesto", desc: "Linguini pasta with our house-made pesto sauce (garlic, basil, pine-nuts, olive oil). Add shrimp +$9", price: "24.95" },
      { name: "Tortellini alla Michelangelo", desc: "Pasta stuffed with chicken and veal in a creamy sauce with pancetta and peas", price: "27.95" },
      { name: "Fiocchi & Pear", desc: "Hand-stuffed pasta in a silky Gorgonzola cream with green onions", price: "27.95" },
    ],
  },
  pastaSeafood: {
    title: "Pasta Pesce",
    subtitle: "Seafood Pasta",
    items: [
      { name: "Fettuccine alla Adriatica", desc: "Flat pasta in a creamy garlic, sun dried tomato, and white wine sauce topped with rock shrimp and scallops", price: "29.95" },
      { name: "Linguine con Vongole", desc: "Linguini pasta with fresh Manila clams in a light spicy garlic, white wine sauce", price: "29.95" },
      { name: 'Linguini Frutti di Mare "Cioppino Pasta"', desc: "Linguine pasta with mixed seafood in a tomato saffron sauce", price: "35.95" },
    ],
  },
  entrees: {
    title: "Secondi Piatti",
    subtitle: "Entrees",
    items: [
      { name: 'Bistecca di Manzo "New York Steak"', desc: "12 oz. USDA choice N.Y. steak grilled with our signature peppercorn brandy sauce", price: "42.95" },
      { name: "Cotolette di Agnello Grigliate", desc: "Grilled rack of lamb with garlic, rosemary and balsamic reduction sauce", price: "44.95" },
      { name: "Costoletta di Maiale", desc: "Grilled bone-in pork chop with mushroom cream reduction", price: "30.95" },
      { name: "Pollo Parmigiana", desc: "Chicken breast breaded and topped with marinara sauce and mozzarella cheese, on a bed of linguini marinara", price: "30.95" },
      { name: "Pollo ai Capperi", desc: "Chicken scallopini served with capers, lemon and butter sauce", price: "29.95" },
      { name: "Pollo Marsala", desc: "Chicken scallopini topped with marsala wine sauce", price: "29.95" },
      { name: "Veal Marsala", desc: "Veal scallopini with our signature marsala wine sauce", price: "33.95" },
      { name: "Veal Piccata", desc: "Veal scallopini with our signature lemon butter caper sauce", price: "33.95" },
      { name: "Veal Saltimbocca", desc: "Veal scallopini with prosciutto, sage, melted mozzarella cheese with a demi-glace sauce", price: "34.95" },
      { name: 'Gamberi alla Limone "Shrimp Scampi"', desc: "Sautéed prawns in a lemon-butter sauce with garlic, white wine, red pepper, fresh parsley and lemon zest", price: "32.95" },
      { name: "Salmon Piccata", desc: "Pan seared Atlantic salmon filet with our signature lemon butter caper sauce", price: "35.95" },
    ],
  },
};

/* ── PIZZA ── */
const PIZZA = {
  pizza: {
    title: "Pizza",
    items: [
      { name: "Margherita", desc: "Tomato sauce, fresh mozzarella, and fresh basil", price: "21.95" },
      { name: "Diavola", desc: "Tomato sauce, fresh mozzarella, spicy Italian sausage & mushrooms", price: "22.95" },
      { name: "Pizza Vegetariana", desc: "Tomato sauce, fresh mozzarella, and seasonal vegetables", price: "22.95" },
      { name: "Pizza Bianca con Prosciutto", desc: "Fresh mozzarella, crimini mushrooms, arugula, prosciutto di Parma, shaved Parmigiano Reggiano, truffle oil", price: "24.95" },
      { name: "Pepperoni Pizza", desc: "Pepperoni with mozzarella cheese and tomato sauce", price: "22.95" },
    ],
  },
};

/* ── WINE HIGHLIGHTS ── */
const WINE = {
  byGlass: {
    title: "Wines by the Glass",
    note: "Glass | Carafe",
    items: [
      { name: "Donini, Pinot Grigio, Venezia, Italy", desc: "2023", price: "12 | 40" },
      { name: "Flowers, Chardonnay, Sonoma Coast", desc: "2024", price: "20 | 65" },
      { name: "De Forville, Chardonnay, Piedmont, Italy", desc: "2024 (Unoaked)", price: "12 | 40" },
      { name: "Clos Henri, Sauvignon Blanc, Marlborough, NZ", desc: "2025", price: "14 | 45" },
      { name: "La Cala, Vermentino, Sardegna, Italy", desc: "2022", price: "13 | 45" },
      { name: "House Red (Rapitala, Nero D'Avola, Sicily)", desc: "2023", price: "12 | 45" },
      { name: "The Calling, Cabernet Sauvignon, Paso Robles", desc: "2021", price: "17 | 58" },
      { name: "Routestock, Pinot Noir, Sonoma Coast", desc: "2023", price: "16 | 55" },
      { name: "Tintero, Nebbiolo Langhe, Italy", desc: "2023", price: "15 | 50" },
      { name: "Villa Santa Anna, Chianti, Colli Senesi Riserva", desc: "2022", price: "13 | 45" },
    ],
  },
  sparkling: {
    title: "Sparkling & Champagne",
    items: [
      { name: "Lamberti, Prosecco, N.V. (187ml)", desc: "", price: "12" },
      { name: "Nino Franco, Valdobbiadene, Prosecco", desc: "N.V.", price: "45" },
      { name: "Schramsberg, Blanc de Blanc, North Coast", desc: "N.V.", price: "65" },
      { name: "Louis Roederer, Brut Premier, Reims", desc: "N.V.", price: "70" },
      { name: "Champagne Gosset, Brut, France", desc: "N.V.", price: "105" },
      { name: "Krug, Grand Cuvée, 171ème, Brut", desc: "N.V.", price: "375" },
    ],
  },
  italianRed: {
    title: "Italian Red Highlights",
    items: [
      { name: "Basilica Cafaggio, Chianti Classico", desc: "2022", price: "45" },
      { name: "Isole e Olena, Chianti Classico", desc: "2020", price: "70" },
      { name: "La Fiorita, Brunello di Montalcino", desc: "2018", price: "125" },
      { name: "Antinori, Tignanello, Toscana", desc: "2021", price: "215" },
      { name: "Tenuta San Guido, Sassicaia, Bolgheri", desc: "2022", price: "575" },
      { name: "GD Vajra, Albe, Barolo", desc: "2020", price: "90" },
      { name: "Villa Carlotti, Amarone della Valpolicella", desc: "2018", price: "75" },
    ],
  },
  californiaRed: {
    title: "California Red Highlights",
    items: [
      { name: "The Calling, Cabernet Sauvignon, Paso Robles", desc: "2021", price: "58" },
      { name: "Jordan Vineyards, Alexander Valley", desc: "2017", price: "135" },
      { name: "Caymus, Napa Valley", desc: "2019", price: "150" },
      { name: "Silver Oak, Alexander Valley", desc: "2018", price: "150" },
      { name: "Opus One, Napa Valley", desc: "2022", price: "750" },
      { name: "Routestock, Pinot Noir, Sonoma Coast", desc: "2022", price: "55" },
    ],
  },
  beer: {
    title: "Beer",
    items: [
      { name: "Peroni", desc: "", price: "9" },
      { name: "Lagunitas IPA", desc: "", price: "9" },
      { name: "Blue Moon", desc: "", price: "9" },
      { name: "Moretti", desc: "", price: "9" },
      { name: "Clausthauser (Non Alcoholic)", desc: "", price: "9" },
    ],
  },
};

/* ── HAPPY HOUR ── */
const HAPPY_HOUR = {
  info: {
    title: "Happy Hour",
    items: [
      { name: "Tuesday – Friday, 4:00 PM – 5:00 PM", desc: "Join us for specially priced wines, cocktails, and appetizers at the bar", price: "" },
    ],
  },
};

const TABS: { key: MenuTab; label: string }[] = [
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
  { key: "pizza", label: "Pizza" },
  { key: "wine", label: "Wine & Beer" },
  { key: "happyhour", label: "Happy Hour" },
];

function MenuSection({ title, subtitle, note, items }: { title: string; subtitle?: string; note?: string; items: { name: string; desc: string; price: string }[] }) {
  return (
    <div className="mb-16">
      <div className="mb-8">
        <h3 className="font-display text-2xl md:text-3xl text-charcoal">{title}</h3>
        {subtitle && <p className="font-accent text-base md:text-lg text-muted-foreground tracking-wider mt-1">{subtitle}</p>}
        {note && <p className="font-accent text-sm md:text-base text-gold tracking-wider mt-2">{note}</p>}
        <div className="w-12 h-px bg-gold/30 mt-4" />
      </div>
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.name} className="group">
            <div className="flex items-baseline justify-between gap-3">
              <h4 className="font-display text-lg md:text-xl text-charcoal group-hover:text-gold transition-colors duration-500">
                {item.name}
              </h4>
              <div className="flex-1 border-b border-dotted border-charcoal/20 mb-1.5 min-w-[20px]" />
              {item.price && (
                <span className="font-accent text-gold text-base md:text-lg tracking-wide shrink-0">{item.price}</span>
              )}
            </div>
            {item.desc && (
              <p className="text-muted-foreground text-base md:text-lg mt-1.5 font-accent italic tracking-wide leading-relaxed">{item.desc}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Menu() {
  useEffect(() => {
    document.title = "Menu | Andiamo in Banca";
    document.querySelector('meta[name="description"]')?.setAttribute("content", "Explore our menu of handmade pasta, fresh seafood, and Italian classics. Andiamo in Banca — South San Francisco.");
  }, []);

  const [active, setActive] = useState<MenuTab>("dinner");

  const getMenuSections = () => {
    switch (active) {
      case "lunch":
        return Object.values(LUNCH).map(s => ({ ...s, subtitle: undefined, note: undefined }));
      case "dinner":
        return Object.values(DINNER).map(s => ({ ...s, note: undefined }));
      case "pizza":
        return Object.values(PIZZA).map(s => ({ ...s, subtitle: undefined, note: undefined }));
      case "wine":
        return Object.values(WINE).map(s => ({ ...s, subtitle: undefined }));
      case "happyhour":
        return Object.values(HAPPY_HOUR).map(s => ({ ...s, subtitle: undefined, note: undefined }));
    }
  };

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.petraleSole} alt="Signature dish at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
        </div>
        <div className="relative z-10 text-center">
          <div className="ornament-line !bg-white/20 mb-6" />
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide">Our Menu</h1>
          <p className="font-accent text-sm tracking-[0.3em] uppercase text-white/50 mt-4">
            Simply Delicious
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="section-padding bg-background">
        <div className="container max-w-4xl">
          {/* Tab Navigation — understated, elegant */}
          <div className="flex flex-wrap justify-center gap-1 mb-16 border-b border-charcoal/8 pb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-6 py-2.5 font-accent text-base md:text-lg tracking-[0.15em] transition-all duration-500 ${
                  active === tab.key
                    ? "text-gold border-b-2 border-gold"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {getMenuSections().map((section) => (
              <MenuSection
                key={section.title}
                title={section.title}
                subtitle={"subtitle" in section ? (section as any).subtitle : undefined}
                note={"note" in section ? (section as any).note : undefined}
                items={section.items}
              />
            ))}
          </motion.div>

          {/* Online Ordering CTA */}
          <div className="mt-4 text-center border-t border-charcoal/8 pt-12">
            <a
              href={LINKS.onlineOrdering}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-12 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-espresso transition-all duration-500"
            >
              Order Online <ShoppingBag size={13} />
            </a>
          </div>

          {/* Note */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground text-base md:text-lg italic font-accent tracking-wide">
              Menu items and prices are subject to change. Please inform your server of any allergies or dietary restrictions.
            </p>
            <p className="text-muted-foreground text-sm md:text-base mt-3 font-accent tracking-wide">
              Vegan & gluten free lentil pasta available as a substitution for all pasta dishes.
              A 20% gratuity will be added for parties of 6 or more.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <Link href="/banquet-catering" className="font-accent text-gold/80 hover:text-gold text-base md:text-lg tracking-wide transition-colors duration-300">
                Banquet & Catering Menus
              </Link>
              <Link href="/the-vault" className="font-accent text-gold/80 hover:text-gold text-base md:text-lg tracking-wide transition-colors duration-300">
                Private Dining
              </Link>
              <Link href="/contact" className="font-accent text-gold/80 hover:text-gold text-base md:text-lg tracking-wide transition-colors duration-300">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
