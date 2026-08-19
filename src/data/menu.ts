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
 *
 * The printed menu PDF lives at /public/MENU-FIN.pdf and is linked from the
 * menu section ("Download Menu"). Replace that file when the menu changes.
 */

export type MenuItem = {
  name: string;
  price: number | null;
  description?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  note?: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "crepes",
    title: "Crêpes",
    // TODO(client): the printed menu does not list the crêpe selection.
    // Fill in the full list and prices here when ready.
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
    items: [
      {
        name: "Ham & Cheese Waffle",
        price: 15,
        description: "Sweet potato waffle, forest ham or turkey ham, mixed Swiss cheese, thyme, garlic cream",
      },
      {
        name: "Avocado Toast",
        price: 16,
        description: "Fresh toasted bread, avocado, sun-dried tomatoes, ricotta, basil, honey, balsamic glaze",
      },
    ],
  },
  {
    id: "croissants",
    title: "Toasted Croissants",
    items: [
      {
        name: "Ham & Cheese",
        price: 16,
        description: "Forest ham or turkey ham, mixed Swiss cheese, thyme, garlic cream",
      },
      { name: "Strawberry Jelly", price: 12 },
      { name: "Banana Nutella", price: 12 },
    ],
  },
  {
    id: "salads",
    title: "Fresh Salads",
    items: [
      {
        name: "Niçoise",
        price: 16,
        description: "Lettuce, green beans, olives, cherry tomatoes, fresh tuna",
      },
      {
        name: "Tomato Burrata",
        price: 17,
        description: "Carpaccio of mixed tomatoes, fresh burrata, basil, strawberry glaze and balsamic",
      },
      {
        name: "Buddha Bowl",
        price: 17,
        description: "Brown rice, sweet potatoes, carrot, cherry tomatoes, cucumber, crispy onion",
      },
      {
        name: "Veggie Salad",
        price: 10,
        description: "Cucumber tagliatelle, cream and lime",
      },
    ],
  },
  {
    id: "pastry",
    title: "Pastry by Chef George Berger, MOF",
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
export const featuredCategoryIds = ["crepes", "waffles", "salads", "gourmet-coffee"];
