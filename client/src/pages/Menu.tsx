import PageLayout from "@/components/PageLayout";
import { IMAGES, LINKS } from "@/lib/images";
import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "wouter";

type MenuTab = "dinner" | "lunch" | "catering" | "wine" | "happyhour";
type Tag = "GF" | "V";
type Item = { name: string; desc: string; price: string; tags?: Tag[]; signature?: boolean };
type Section = { title: string; subtitle?: string; note?: string; items: Item[] };

/* ── DINNER MENU (current — updated 2026) ── */
const DINNER: Record<string, Section> = {
  antipasti: {
    title: "Antipasti",
    subtitle: "Starters",
    items: [
      { name: "Calamari Fritti", desc: "Fresh squid, garlic, lemon, chipotle aioli", price: "20" },
      { name: "Sautéed Prawns", desc: "Lemon butter, garlic, white wine", price: "25", tags: ["GF"] },
      { name: "Bruschetta al Pomodoro", desc: "Tomato, garlic, parmesan, basil, olive oil", price: "11", tags: ["V"] },
      { name: "Polpette di Manzo", desc: "Snake River Farms wagyu meatballs", price: "16" },
      { name: "Burrata Caprese", desc: "Burrata, Roma tomato, olive oil, aged balsamico", price: "17", tags: ["GF", "V"] },
      { name: "Brussels Sprouts & Pancetta", desc: "Roasted, pancetta, balsamic glaze", price: "15", tags: ["GF"] },
      { name: "Octopus “Pulpo”", desc: "Grilled Spanish octopus, arugula, red onion, cannellini", price: "19", tags: ["GF"] },
      { name: "Steamed Mussels", desc: "White wine garlic broth, tomato, herbs, crostini", price: "21" },
    ],
  },
  insalate: {
    title: "Insalate",
    subtitle: "Salads",
    note: "Add — chicken 6 · prawns 9 · salmon 16",
    items: [
      { name: "Cesare", desc: "Romaine, parmigiano, house caesar", price: "12 / 17" },
      { name: "Watermelon Salad", desc: "Watermelon, feta, candied walnut, lemon-mint vinaigrette", price: "15", tags: ["GF", "V"] },
      { name: "Rucola", desc: "Arugula, cherry tomato, pecorino, champagne vinaigrette", price: "14", tags: ["GF", "V"] },
    ],
  },
  pizza: {
    title: "Pizza",
    items: [
      { name: "Margherita", desc: "Tomato, fresh mozzarella, basil", price: "22", tags: ["V"] },
      { name: "Diavola", desc: "Tomato, mozzarella, spicy Italian sausage, mushroom", price: "23" },
      { name: "Vegetariana", desc: "Tomato, mozzarella, seasonal vegetables", price: "23", tags: ["V"] },
      { name: "Bianca con Prosciutto", desc: "Mozzarella, crimini, arugula, prosciutto, parmigiano, truffle oil", price: "25" },
      { name: "Pepperoni", desc: "Pepperoni, mozzarella, tomato", price: "23", signature: true },
      { name: "Pinsa Mele e Brie", desc: "Caramelized apple, onion, brie, arugula, honey, truffle oil", price: "17", tags: ["V"] },
    ],
  },
  pasta: {
    title: "Pasta",
    items: [
      { name: "Rigatoni alla Norma", desc: "Roasted eggplant, San Marzano, basil, ricotta", price: "28", tags: ["V"], signature: true },
      { name: "Pappardelle alla Bolognese", desc: "Homemade all-beef meat sauce", price: "28" },
      { name: "Spaghetti & Meatballs", desc: "Marinara, two wagyu meatballs", price: "29" },
      { name: "Gnocchi alla Gorgonzola", desc: "Potato dumplings, gorgonzola cream", price: "27", tags: ["V"] },
      { name: "Bucatini alla Calabrese", desc: "Calabrese sausage, San Marzano, Calabrian chili, pecorino", price: "29" },
      { name: "Rigatoni alla Vodka", desc: "Spicy tomato vodka cream", price: "26", tags: ["V"] },
      { name: "Fettuccine Alfredo", desc: "Classic creamy alfredo", price: "23", tags: ["V"] },
      { name: "Linguine al Pesto", desc: "Basil pesto, pine nuts, garlic, olive oil", price: "25", tags: ["V"] },
      { name: "Tortellini alla Michelangelo", desc: "Chicken & veal, cream, pancetta, peas", price: "28" },
      { name: "Wild Mushroom Agnolotti", desc: "Truffle tartufata cream, roasted cherry tomato", price: "31", tags: ["V"] },
      { name: "Pappardelle al Filetto", desc: "Filet mignon, cherry tomato, mushroom, marsala", price: "33" },
    ],
  },
  pastaPesce: {
    title: "Pasta Pesce",
    subtitle: "Seafood Pasta",
    items: [
      { name: "Lobster Ravioli", desc: "Lemon butter cream, tiger prawns", price: "35", signature: true },
      { name: "Fettuccine alla Adriatica", desc: "Garlic, sun-dried tomato, white wine cream, rock shrimp, scallop", price: "30" },
      { name: "Linguine con Vongole", desc: "Manila clams, garlic, white wine, chili", price: "30" },
      { name: "Linguine Frutti di Mare", desc: "Mixed seafood, tomato saffron", price: "36" },
    ],
  },
  pollo: {
    title: "Pollo",
    subtitle: "Chicken",
    items: [
      { name: "Pollo Parmigiana", desc: "Breaded chicken, marinara, mozzarella, linguini", price: "31" },
      { name: "Pollo Piccata", desc: "Chicken scallopini, caper, lemon, butter", price: "30" },
      { name: "Pollo Marsala", desc: "Chicken scallopini, marsala", price: "30" },
    ],
  },
  vitello: {
    title: "Vitello",
    subtitle: "Veal",
    items: [
      { name: "Veal Marsala", desc: "Veal scallopini, marsala", price: "34" },
      { name: "Veal Piccata", desc: "Veal scallopini, lemon butter caper", price: "34" },
      { name: "Veal Saltimbocca", desc: "Prosciutto, sage, mozzarella, demi-glace", price: "35" },
    ],
  },
  pesce: {
    title: "Pesce",
    subtitle: "Seafood",
    items: [
      { name: "Branzino", desc: "Cherry tomato, olives, capers, lemon, white wine, orzo", price: "38", tags: ["GF"], signature: true },
      { name: "Frutti di Mare “Cioppino”", desc: "Clams, mussels, shrimp & fish, tomato-saffron broth, crostini", price: "36", tags: ["GF"] },
      { name: "Salmon Piccata", desc: "Pan-seared salmon, lemon butter caper", price: "36", tags: ["GF"] },
    ],
  },
  griglia: {
    title: "Griglia",
    subtitle: "Grill",
    items: [
      { name: "Rack of Lamb", desc: "Garlic, rosemary, balsamic reduction", price: "45", tags: ["GF"], signature: true },
      { name: "New York Steak", desc: "12oz USDA choice, peppercorn brandy", price: "43", tags: ["GF"] },
      { name: "Skirt Steak", desc: "Chimichurri, onion rings, vegetables, mashed potato", price: "43", tags: ["GF"] },
    ],
  },
};

/* ── LUNCH MENU ── */
const LUNCH: Record<string, Section> = {
  appetizers: {
    title: "Appetizers",
    items: [
      { name: "Calamari Fritti", desc: "Fried calamari with chipotle aioli", price: "14.95" },
      { name: "Brussels Sprouts", desc: "Roasted brussels sprouts with seared pancetta and shaved parmesan", price: "12.95" },
      { name: "Polpette “Meatballs”", desc: "Homemade all beef Wagyu meatballs with marinara and parmesan", price: "13.95" },
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
      { name: "Linguini Frutti di Mare “Cioppino”", desc: "Cioppino pasta with mixed seafood in tomato saffron sauce", price: "26.95" },
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

/* ── WINE HIGHLIGHTS ── */
const WINE: Record<string, Section> = {
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
const HAPPY_HOUR: Record<string, Section> = {
  info: {
    title: "Happy Hour",
    subtitle: "Tuesday – Friday · 4:00 – 5:00 PM",
    items: [
      { name: "At the bar", desc: "Specially priced wines, cocktails, and antipasti — a quiet hour before the evening begins.", price: "" },
    ],
  },
};

/* ── CATERING — family-style trays, delivered (order via ezCater) ── */
const CATERING: Record<string, Section> = {
  salads: {
    title: "Salads",
    note: "Serves 10 / Serves 20",
    items: [
      { name: "Organic Mixed Greens", desc: "Shredded vegetables, housemade balsamic vinaigrette", price: "50 / 90" },
      { name: "Arugula", desc: "Red onion, cherry tomato, shaved Parmigiano, champagne vinaigrette", price: "55 / 95" },
      { name: "Caesar", desc: "Romaine, garlic croutons, Parmigiano-Reggiano, classic caesar", price: "60 / 100" },
      { name: "Caprese", desc: "Ripe tomato, fresh mozzarella, basil, balsamic, extra-virgin olive oil", price: "55 / 95" },
    ],
  },
  appetizers: {
    title: "Appetizers",
    note: "Serves 10 / Serves 20",
    items: [
      { name: "Bruschetta Classica", desc: "Crostini, marinated tomato, garlic, basil, olive oil", price: "55 / 95" },
      { name: "Garlic Bread", desc: "Warm sourdough, garlic butter, baked golden", price: "45 / 75" },
      { name: "Brussels Sprouts con Pancetta", desc: "Oven-roasted, crispy pancetta, balsamic reduction", price: "60 / 100" },
      { name: "Seasonal Grilled Vegetables", desc: "Mesquite-grilled, olive oil, sea salt", price: "80 / 115" },
      { name: "Mini Meatballs Marinara", desc: "Housemade beef meatballs, signature marinara", price: "110 / 190" },
    ],
  },
  pasta: {
    title: "Pasta",
    subtitle: "Housemade, fresh daily",
    note: "Priced by guest count — request a quote",
    items: [
      { name: "Lasagne Bolognese", desc: "All-beef ragù, ricotta, mozzarella, Parmigiano-Reggiano", price: "" },
      { name: "Rigatoni alla Salsiccia", desc: "Roasted bell pepper, tomato, grilled Italian sausage", price: "" },
      { name: "Rigatoni al Funghi e Tartufo", desc: "Wild mushroom, thyme, garlic, truffle cream", price: "" },
      { name: "Rigatoni alla Vodka", desc: "Shallot, chili, Parmigiano, silky cream", price: "" },
      { name: "Rigatoni alla Norma", desc: "Roasted eggplant, tomato, basil, ricotta salata", price: "" },
      { name: "Penne Alfredo", desc: "Creamy Parmesan alfredo", price: "" },
      { name: "Penne al Pesto Genovese", desc: "Basil pesto, Parmigiano, pine nuts", price: "" },
      { name: "Penne Arrabbiata", desc: "Bold, spicy marinara, chili, garlic", price: "" },
      { name: "Penne Pomodoro", desc: "Tomato, garlic, basil, olive oil", price: "" },
      { name: "Spinach & Ricotta Ravioli", desc: "Choice of marinara or bolognese", price: "" },
      { name: "Chicken Alfredo", desc: "Penne, grilled chicken, rich alfredo", price: "" },
      { name: "Vegetarian Lasagna", desc: "Grilled vegetables, ricotta, mozzarella, marinara", price: "" },
      { name: "Pasta Bolognese", desc: "Slow-cooked beef ragù — penne, spaghetti, or GF penne", price: "" },
    ],
  },
  entrees: {
    title: "Entrées",
    subtitle: "Chef-crafted mains",
    note: "Priced by guest count — request a quote",
    items: [
      { name: "Chicken Marsala", desc: "Cremini mushrooms, rich marsala reduction", price: "" },
      { name: "Chicken Parmesan", desc: "Crispy chicken, marinara, mozzarella, Parmigiano", price: "" },
      { name: "Chicken Piccata", desc: "Caper, lemon, white wine butter", price: "" },
      { name: "Grilled Salmon Fillet", desc: "Delicate lemon butter sauce", price: "" },
      { name: "Beef Brasato al Barolo", desc: "Short ribs braised in Barolo, aromatics, herbs", price: "" },
      { name: "Eggplant Parmesan", desc: "Breaded eggplant, marinara, mozzarella, baked", price: "" },
    ],
  },
};

const MENUS: Record<MenuTab, Record<string, Section>> = {
  dinner: DINNER,
  lunch: LUNCH,
  catering: CATERING,
  wine: WINE,
  happyhour: HAPPY_HOUR,
};

const TABS: { key: MenuTab; label: string }[] = [
  { key: "dinner", label: "Dinner" },
  { key: "lunch", label: "Lunch" },
  { key: "catering", label: "Catering" },
  { key: "wine", label: "Wine & Beer" },
  { key: "happyhour", label: "Happy Hour" },
];

function MenuItem({ item }: { item: Item }) {
  return (
    <div className="break-inside-avoid mb-5">
      <div className="flex items-baseline justify-between gap-4">
        <h4 className="font-display text-lg md:text-xl text-charcoal leading-snug">
          {item.signature && <span className="text-gold/70 mr-1.5" aria-hidden>&#10022;</span>}
          {item.name}
          {item.tags && item.tags.length > 0 && (
            <span className="ml-2 font-body text-[10px] tracking-[0.15em] text-gold/60 uppercase align-[0.15em]">
              {item.tags.join(" · ")}
            </span>
          )}
        </h4>
        {item.price && (
          <span className="font-accent text-gold text-base md:text-lg tracking-wide shrink-0">{item.price}</span>
        )}
      </div>
      {item.desc && (
        <p className="text-muted-foreground text-sm md:text-base mt-1 font-accent italic tracking-wide leading-snug pr-6">
          {item.desc}
        </p>
      )}
    </div>
  );
}

function MenuSection({ section }: { section: Section }) {
  return (
    <div className="break-inside-avoid mb-12">
      <div className="mb-6">
        <h3 className="font-display text-2xl md:text-3xl text-charcoal">{section.title}</h3>
        {section.subtitle && (
          <p className="font-accent italic text-gold/70 text-sm md:text-base tracking-wide mt-0.5">{section.subtitle}</p>
        )}
        <div className="w-10 h-px bg-gold/30 mt-3" />
        {section.note && (
          <p className="font-accent text-charcoal/45 text-xs md:text-sm tracking-wide mt-3">{section.note}</p>
        )}
      </div>
      <div>
        {section.items.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Menu() {
  usePageMeta("/menu");

  const [active, setActive] = useState<MenuTab>("dinner");
  const sections = Object.values(MENUS[active]);

  return (
    <PageLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMAGES.lambChops} alt="Grilled rack of lamb at Andiamo in Banca" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/55" />
        </div>
        <div className="relative z-10 text-center">
          <p className="eyebrow !text-white/55 mb-4">Handmade pasta &middot; Wood grill &middot; Award-winning cellar</p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-wide">The Menu</h1>
          <p className="font-accent italic text-white/60 text-lg md:text-xl mt-3">Simply delicious.</p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="section-padding bg-background">
        <div className="container max-w-5xl">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 mb-16 border-b border-charcoal/8 pb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`px-6 py-2.5 font-accent text-base md:text-lg tracking-[0.15em] transition-all duration-500 ${
                  active === tab.key ? "text-gold border-b-2 border-gold" : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Catering intro */}
          {active === "catering" && (
            <div className="max-w-2xl mx-auto text-center -mt-4 mb-14">
              <p className="font-accent text-charcoal/70 text-base md:text-lg leading-relaxed">
                Family-style trays for office lunches, meetings, and gatherings &mdash; delivered.
                Browse below, then order online through ezCater &mdash; or ask us about a custom spread.
              </p>
            </div>
          )}

          {/* Wine tab — Wine Spectator Award of Excellence badge */}
          {active === "wine" && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-3xl mx-auto -mt-4 mb-14 text-center sm:text-left">
              <a
                href={LINKS.wineSpectatorAwards}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 group"
                aria-label="Wine Spectator Award of Excellence 2026"
              >
                <img
                  src={IMAGES.wineSpectatorAward}
                  alt="Wine Spectator Award of Excellence 2026"
                  width={66}
                  height={122}
                  className="w-[62px] h-auto opacity-95 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </a>
              <p className="font-accent text-charcoal/70 text-base md:text-lg leading-relaxed">
                Our cellar earned the <span className="text-charcoal">2026 Wine Spectator Award of Excellence</span> &mdash;
                Italian classics, California cult bottles, and reserve Champagne, chosen to pair with every plate.
              </p>
            </div>
          )}

          {/* Lunch tab — three-course lunch special */}
          {active === "lunch" && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 max-w-3xl mx-auto -mt-4 mb-14 text-center sm:text-left">
              <img
                src={IMAGES.lunchSpecial}
                alt="Three-course lunch special, 25.95 per person, Tuesday through Friday 11am to 2pm at Andiamo in Banca"
                width={1200}
                height={900}
                className="w-full max-w-[340px] h-auto border border-charcoal/10 shrink-0"
                loading="lazy"
              />
              <div>
                <h3 className="font-display text-2xl md:text-3xl text-charcoal">Three-Course Lunch Special</h3>
                <p className="font-accent text-gold text-base md:text-lg tracking-wide mt-1">
                  25.95 per person &nbsp;&middot;&nbsp; Tuesday&ndash;Friday, 11am&ndash;2pm
                </p>
                <p className="font-accent text-charcoal/70 text-base md:text-lg leading-relaxed mt-3">
                  Soup or salad, a choice of six mains, and dolce &mdash; add a glass of house wine
                  or an Aperol Spritz for 8. Parties of up to four.
                </p>
              </div>
            </div>
          )}

          {/* Menu Items — two-column on desktop, like the printed menu */}
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:columns-2 md:gap-x-14 lg:gap-x-20 [column-rule:1px_solid_oklch(0.20_0.01_50_/_8%)]"
          >
            {sections.map((section) => (
              <MenuSection key={section.title} section={section} />
            ))}
          </motion.div>

          {/* Legend — dinner & lunch */}
          {(active === "dinner" || active === "lunch") && (
            <div className="mt-6 border-t border-charcoal/8 pt-8 text-center">
              <p className="font-accent text-charcoal/55 text-sm md:text-base tracking-wide">
                <span className="text-gold/70">&#10022;</span> signature &nbsp;·&nbsp;
                <span className="text-gold/70 font-medium">GF</span> gluten-free &nbsp;·&nbsp;
                <span className="text-gold/70 font-medium">V</span> vegetarian
              </p>
              <p className="font-accent text-charcoal/45 text-xs md:text-sm mt-2 tracking-wide">
                Gluten-free &amp; vegan lentil pasta available for any pasta dish. Please inform your server of any allergies or intolerances.
              </p>
            </div>
          )}

          {/* Order CTA — tab-aware: takeout (Slice) for food, ezCater for catering */}
          {(active === "dinner" || active === "lunch") && (
            <div className="mt-12 text-center">
              <a
                href={LINKS.onlineOrdering}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-12 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-espresso transition-all duration-500"
              >
                Order Online <ShoppingBag size={13} />
              </a>
            </div>
          )}
          {active === "catering" && (
            <div className="mt-12 text-center">
              <a
                href={LINKS.ezcater}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-12 py-4 bg-charcoal text-white font-body text-[12px] tracking-[0.2em] uppercase font-semibold hover:bg-espresso transition-all duration-500"
              >
                Order Catering Online <ShoppingBag size={13} />
              </a>
              <p className="font-accent text-charcoal/50 text-sm mt-5 tracking-wide">
                Delivered through ezCater. Planning a hosted event?{" "}
                <Link href="/private-events" className="text-gold hover:text-gold-light transition-colors">See Private Events</Link>.
              </p>
            </div>
          )}

          {/* Family line + links */}
          <div className="mt-14 text-center">
            <p className="font-accent italic text-charcoal/40 text-sm tracking-wide">
              Andiamo in Banca, South San Francisco &nbsp;·&nbsp; Caf&eacute; Figaro, Burlingame &nbsp;·&nbsp; Don Giovanni&rsquo;s, Mountain View
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-8">
              <Link href="/private-events" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold">
                Private events &amp; banquets
              </Link>
              <Link href="/the-vault" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold">
                Private dining
              </Link>
              <Link href="/contact" className="link-line font-body text-[12px] tracking-[0.2em] uppercase text-gold">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
