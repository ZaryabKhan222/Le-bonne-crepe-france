/**
 * THE single source of truth for the menu.
 *
 * To update prices or items, edit this file only. Every change here is
 * reflected on the site automatically, no design work needed.
 *
 * - `price` is a number in USD. Use `null` for items whose price is not
 *   set yet: the site will show "ask" instead of a price.
 * - `description` is optional.
 * - `note` on a category renders as a small line under the category title.
 * - `hidden: true` (on a category or an item) keeps it in this file but
 *   takes it off the site. Remove the flag to bring it back.
 *
 * The printed food menu image (/public/assets/menu/food-menu.webp, built
 * from /resource/food-menu.jpeg) is shown at the top of the menu section.
 * The QR codes on the tables open /#menu, so keep that section id.
 * The drinks menu PDF lives at /public/MENU-FIN.pdf and is linked from the
 * menu section ("Download Menu"). Replace that file when the menu changes.
 */

export type MenuItem = {
  name: string;
  price: number | null;
  description?: string;
  hidden?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  note?: string;
  hidden?: boolean;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "breakfast",
    title: "Combo Breakfast",
    note: "A perfect start to your day.",
    items: [
      {
        name: "Parisian",
        price: 22,
        description: "Coffee or tea, cold press juice, ½ baguette, handcrafted Suzette butter, homemade strawberry jelly",
      },
      {
        name: "Provincial",
        price: 19,
        description: "Coffee or tea, cold press juice, toasted bread or bagel, ham, handcrafted butter and jam",
      },
      {
        name: "Champion",
        price: 19,
        description: "Protein coffee or protein smoothie, toasted bagel, ham, handcrafted butter, artisanal honey and a cup of fresh fruit",
      },
    ],
  },
  {
    id: "crepes",
    title: "Crêpes",
    // Not on the current printed menu (Oct 2026). Kept here in case it returns.
    hidden: true,
    note: "Made to order on the cast iron griddle. Ask at the cart for today's full selection.",
    items: [
      {
        name: "La Complète, Ham & Swiss",
        price: null,
        description: "Forest ham or turkey ham, melted Swiss cheese, folded in a fresh crêpe",
      },
      {
        name: "Strawberry Jelly Crêpe",
        price: null,
        description: "Organic strawberry jelly, whipped cream",
      },
      {
        name: "Banana Nutella Crêpe",
        price: null,
        description: "Caramelized banana, Nutella, a touch of sea salt",
      },
      {
        name: "Butter & Sugar Crêpe",
        price: null,
        description: "The French classic, pure and simple",
      },
    ],
  },
  {
    id: "waffles",
    title: "Waffles & Toast",
    note: "Sweet or savory, always delicious.",
    items: [
      {
        name: "Ham & Cheese Waffle",
        price: 14,
        description: "Sweet potato waffle, forest ham or turkey ham, mixed Swiss cheese, thyme, garlic cream",
      },
      {
        name: "Sweet Waffle",
        price: 12,
        description: "Your choice of jam, pistachio, Nutella or dulce de leche, topped with handcrafted whipped cream",
      },
      {
        name: "Avocado Toast",
        price: 16,
        hidden: true,
        description: "Fresh toasted bread, avocado, sun-dried tomatoes, ricotta, basil, honey, balsamic glaze",
      },
    ],
  },
  {
    id: "croissants",
    title: "Toasted Croissants",
    note: "Flaky, warm, irresistible.",
    items: [
      {
        name: "Ham & Cheese",
        price: 14,
        description: "Forest ham or turkey ham, mixed Swiss cheese",
      },
      { name: "Strawberry Jelly", price: 10 },
      { name: "Banana Nutella", price: 10 },
    ],
  },
  {
    id: "sandwiches",
    title: "Sandwich & Bagel",
    items: [
      {
        name: "Bagel",
        price: 16,
        description: "Homemade salmon gravlax, garlic cream, cream cheese, chive, caramelized onion, balsamic glaze and cucumber",
      },
      {
        name: "Croque Monsieur",
        price: 14,
        description: "Butter-toasted bread, creamy béchamel, forest ham or turkey ham and Swiss cheese. Served with a fresh mixed salad",
      },
    ],
  },
  {
    id: "salads",
    title: "Fresh Salads",
    note: "Crisp, colorful, nourishing.",
    items: [
      {
        name: "Niçoise by Chef Rom",
        price: 16,
        description: "Lettuce, green beans, olives, cherry tomatoes, tuna",
      },
      {
        name: "Tomato Burrata",
        price: 18,
        description: "Carpaccio of mixed tomatoes, fresh burrata, basil, balsamic glaze",
      },
      {
        name: "Tagliatelle Veggies",
        price: 15,
        description: "Cucumber, carrot, beet, feta cheese, apple, pistachio, cream vinaigrette",
      },
      {
        name: "Fresh Fruit Salad Mix",
        price: 8,
        description: "By the inspiration of the chef",
      },
      {
        name: "Buddha Bowl",
        price: 17,
        hidden: true,
        description: "Brown rice, sweet potatoes, carrot, cherry tomatoes, cucumber, crispy onion",
      },
      {
        name: "Veggie Salad",
        price: 10,
        hidden: true,
        description: "Cucumber tagliatelle, cream and lime",
      },
    ],
  },
  {
    id: "cheese",
    title: "Plateau de Fromage",
    note: "A selection of French cheeses.",
    items: [
      {
        name: "Sélection du Chef",
        price: 16,
        description: "A chef-curated selection of three cheeses, served with jam and a fresh mixed salad",
      },
      {
        name: "Épicurien",
        price: 18,
        description: "A gourmet cheese selection featuring truffled Brie, fresh seasonal fruits, nuts and a fresh mixed salad",
      },
    ],
  },
  {
    id: "desserts",
    title: "Gourmet Desserts",
    note: "Sweet moments, French style.",
    items: [
      { name: "Chocolate Mousse", price: 8, description: "Handcrafted chocolate mousse" },
      { name: "Crème Brûlée", price: 8, description: "Handcrafted pastry cream" },
      {
        name: "Caramel Flan",
        price: 8,
        description: "Classic caramel flan topped with pistachio whipped cream",
      },
      {
        name: "The Patriot Milky Rice",
        price: 8,
        description: "Red berries jelly at the bottom, vanilla milky rice and spirulina whipped cream",
      },
      {
        name: "Apple Crumble",
        price: 8,
        description: "Apple compote topped with a vanilla biscuit crumble and a touch of caramel",
      },
    ],
  },
  {
    id: "pastry",
    title: "Pastry by Chef George Berger, MOF",
    // Not on the current printed menu (Oct 2026). Kept here in case it returns.
    hidden: true,
    note: "Crafted by a Meilleur Ouvrier de France, one of French pastry's highest honors.",
    items: [
      { name: "Strawberry Tartlet", price: 9, description: "Pastry cream and organic strawberry" },
      { name: "Raspberry Tartlet", price: 9, description: "Pastry cream and organic raspberry" },
      { name: "Apple Tartlet", price: 9 },
      { name: "Macaron", price: 14 },
      { name: "Canelé de Bordeaux", price: 5 },
      { name: "Croissant", price: 6 },
    ],
  },
  {
    id: "coffee",
    title: "Hot Coffee & Matcha",
    items: [
      { name: "Espresso", price: 4 },
      { name: "Matcha Latte", price: 6 },
      { name: "Macchiato", price: 6 },
      { name: "Tea", price: 4 },
    ],
  },
  {
    id: "gourmet-coffee",
    title: "Gourmet Coffee Creations",
    note: "Milk options: whole, 2%, almond or oat.",
    items: [
      { name: "Arequipe Macchiato", price: 14 },
      { name: "Lavender Latte", price: 14 },
      { name: "Ube Latte", price: 14 },
      { name: "Lavender Matcha", price: 14 },
      { name: "Strawberry Matcha", price: 14 },
      { name: "Blueberry Matcha", price: 14 },
      { name: "Blue Spirulina Latte", price: 14 },
    ],
  },
  {
    id: "cold-press",
    title: "Cold Press Juice",
    items: [
      {
        name: "Detox Lemonade",
        price: 10,
        description: "Old fashioned lemonade, spinach, BCAA, vitamin C, honey",
      },
      {
        name: "Bloody Booster",
        price: 10,
        description: "Key lime lemonade, beet, carrot, BCAA, vitamins, honey, sea salt",
      },
    ],
  },
  {
    id: "protein-shakes",
    title: "Protein Blend Shakes",
    items: [
      {
        name: "Banana Roast",
        price: 15,
        description: "Banana, vanilla protein, honey, coffee",
      },
      {
        name: "Green Machine",
        price: 15,
        description: "Apple, spinach, cucumber, protein, agave",
      },
      {
        name: "Sunset Isla Morada",
        price: 15,
        description: "Carrot, turmeric, grapefruit, key lime juice, protein, agave",
      },
    ],
  },
  {
    id: "juices",
    title: "Juices",
    items: [
      { name: "Pascal Gourmet Detox, Carrot Power", price: 10 },
      { name: "Pascal Gourmet Detox, Pineapple Shell", price: 10 },
      { name: "Little Rick CBD", price: 10, description: "Black cherry or pineapple" },
    ],
  },
  {
    id: "classics",
    title: "Classics & Mocktails",
    items: [
      {
        name: "Virgin Mojito",
        price: 10,
        description: "Coconut, strawberry or regular",
      },
      {
        name: "Virgin Lagoon",
        price: 10,
        description: "Key lime lemonade, blueberry syrup",
      },
      {
        name: "K Kosa",
        price: 14,
        description: "Manzana juice, jasmine, ginger ale",
      },
      {
        name: "Le Grand Jean",
        price: 14,
        description: "Soda water, spinach juice, manzana",
      },
    ],
  },
  {
    id: "water-soda",
    title: "Water & Soda",
    items: [
      { name: "Water Bottle", price: 4 },
      { name: "Perrier", price: 6 },
      { name: "Coke / Diet Coke", price: 4 },
      { name: "Sprite", price: 4 },
    ],
  },
];

/** Categories shown in the compact featured view before "View full menu". */
export const featuredCategoryIds = ["breakfast", "waffles", "salads", "gourmet-coffee"];
