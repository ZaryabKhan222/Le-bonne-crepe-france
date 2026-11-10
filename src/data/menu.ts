// ============================================================
// La Bonne Crêpe de France, Menu Data
// ------------------------------------------------------------
// Single source of truth for the menu. To update prices or
// items later, edit this file only. No redesign needed.
//
// Two datasets with the same shape, both rendered in the one
// scrollable Menu section: `foodMenu` first, then `drinkMenu`.
//
// Food board (Oct 2026): "French flavors, fresh ingredients, better days"
// Drink board (Sep 2026): "Great drinks, better days"
// Milk note (drinks):  Choice of almond, oat, or regular milk. No extra charge.
//
// `hidden: true` on a category or an item keeps it in this file but takes
// it off the site. Remove the flag to bring it back.
//
// The table QR codes open /#menu, so keep that section id.
// ============================================================

export type MenuItem = {
  name: string;
  description?: string;
  price: string; // keep as string so "$3" / "MP" / "Seasonal" all work
  hidden?: boolean;
};

export type MenuCategory = {
  id: string;
  title: string;
  subtitle?: string;
  hidden?: boolean;
  items: MenuItem[];
};

export const milkNote = "Choice of almond, oat, or regular milk. No extra charge.";

export const foodMenu: MenuCategory[] = [
  {
    id: "waffles-toast",
    title: "Waffles Toast",
    subtitle: "Sweet or savory, always delicious",
    items: [
      {
        name: "Ham & Cheese",
        description:
          "Sweet potatoes waffle, forest ham or turkey ham, mix swiss cheese, thyme, garlic cream.",
        price: "$14",
      },
      {
        name: "Sweet Waffle",
        description:
          "Your choice of jam, pistachio, Nutella or dulce de leche, topped with handcrafted whipped cream.",
        price: "$12",
      },
    ],
  },
  {
    id: "croissant-toasted",
    title: "Croissant Toasted",
    subtitle: "Flaky, warm, irresistible",
    items: [
      {
        name: "Ham & Cheese",
        description: "Forest ham or turkey ham, mix swiss cheese.",
        price: "$14",
      },
      { name: "Strawberry Jelly", price: "$10" },
      { name: "Banana Nutella", price: "$10" },
    ],
  },
  {
    id: "sandwich-bagel",
    title: "Sandwich & Bagel",
    subtitle: "Fresh ingredients and authentic taste",
    items: [
      {
        name: "Bagel",
        description:
          "Salmon gravlax homemade, garlic cream, cream cheese, chive, caramelized onion, balsamic glaze and cucumber.",
        price: "$16",
      },
      {
        name: "Croque Monsieur",
        description:
          "Butter-toasted bread, creamy béchamel sauce, forest ham or turkey ham and Swiss cheese. Served with a fresh mixed salad.",
        price: "$14",
      },
    ],
  },
  {
    id: "plateau-fromage",
    title: "Plateau de Fromage",
    subtitle: "A selection of French cheeses",
    items: [
      {
        name: "Sélection du Chef",
        description: "A chef-curated selection of three cheeses, served with jam and a fresh mixed salad.",
        price: "$16",
      },
      {
        name: "Épicurien",
        description:
          "A gourmet cheese selection featuring truffled Brie, fresh seasonal fruits, nuts and a fresh mixed salad.",
        price: "$18",
      },
    ],
  },
  {
    id: "pastry-george-berger",
    title: "Pastry by Chef George Berger",
    subtitle: "Artisan pastries, French tradition",
    // Not on the October food board. Kept here in case it returns.
    hidden: true,
    items: [
      { name: "Strawberry Tartlet", price: "$10" },
      { name: "Raspberry Tartlet", price: "$10" },
      { name: "Apple Tartlet", price: "$10" },
    ],
  },
  {
    id: "gourmet-dessert",
    title: "Gourmet Dessert",
    subtitle: "Sweet moments, French style",
    items: [
      { name: "Chocolate Mousse", description: "Handcrafted chocolate mousse.", price: "$8" },
      { name: "Crème Brûlée", description: "Handcrafted pastry cream.", price: "$8" },
      {
        name: "Caramel Flan",
        description: "Classic caramel flan topped with pistachio whipped cream.",
        price: "$8",
      },
      {
        name: "The Patriot Milky Rice",
        description: "Red berries jelly at the bottom, vanilla milky rice and spirulina whipped cream.",
        price: "$8",
      },
      {
        name: "Apple Crumble",
        description: "Apple compote topped with a vanilla biscuit crumble and a touch of caramel.",
        price: "$8",
      },
    ],
  },
  {
    id: "combo-breakfast",
    title: "Combo Breakfast",
    subtitle: "A perfect start to your day",
    items: [
      {
        name: "Parisian",
        description:
          "Coffee or tea, cold press juice, half baguette, handcrafted butter suzette, homemade strawberry jelly.",
        price: "$22",
      },
      {
        name: "Provincial",
        description: "Coffee or tea, cold press juice, toasted bread or bagel, ham, handcrafted butter and jam.",
        price: "$19",
      },
      {
        name: "Champion",
        description:
          "Protein coffee or protein smoothie, toasted bagel, ham, handcrafted butter, artisanal honey and a cup of fresh fruit.",
        price: "$19",
      },
    ],
  },
  {
    id: "fresh-salads",
    title: "Fresh Salads",
    subtitle: "Crisp, colorful, nourishing",
    items: [
      // Price confirmed by the owner at $18 in September; the printed boards
      // (September and October) still show $16.
      {
        name: "Niçoise by Chef Rom",
        description: "Lettuce, green beans, olives, cherry tomatoes, tuna.",
        price: "$18",
      },
      {
        name: "Tomato Burrata",
        description: "Mix carpaccio tomatoes, fresh burrata, basil, glaze and balsamic.",
        price: "$18",
      },
      {
        name: "Tagliatella Veggies",
        description:
          "Cucumber, carrot, beet, feta cheese, apple, pistachio beans, cream vinegar sauce.",
        price: "$15",
      },
      { name: "Fresh Salad Fruit Mix", description: "By the inspiration of the chef.", price: "$8" },
    ],
  },
  {
    id: "cold-soup-signature",
    title: "Cold Soup Signature",
    subtitle: "Chilled, bright, refreshing",
    // Not on the October food board. Kept here in case it returns.
    hidden: true,
    items: [
      {
        name: "Fresh Provencal Gaspacho",
        description:
          "Watermelon, tomato, pepper, strawberry, feta cheese, spinach oil, bacon, mint.",
        price: "$12",
      },
      {
        name: "Venise Verte",
        description: "Cucumber, spinach, mint, feta cheese, spinach oil, roll ham and truffle.",
        price: "$12",
      },
    ],
  },
];

export const drinkMenu: MenuCategory[] = [
  {
    id: "hot-coffee-matcha",
    title: "Hot Coffee & Matcha",
    subtitle: "Rich flavors, expertly crafted",
    items: [
      { name: "Espresso", description: "Bold and aromatic. A timeless classic.", price: "$3" },
      { name: "Matcha Latte", description: "Velvety green tea, naturally energizing.", price: "$8" },
      { name: "Macchiato", description: "Espresso with a touch of steamed milk.", price: "$7" },
      { name: "Tea Selection", description: "A variety of premium teas.", price: "$3" },
    ],
  },
  {
    id: "iced-gourmet-coffee",
    title: "Iced Gourmet Coffee",
    subtitle: "Refreshingly delicious",
    items: [
      { name: "Arequipe Macchiato", description: "Smooth coffee with a hint of caramel.", price: "$14" },
      { name: "Lavender Latte", description: "Floral and refreshing.", price: "$12" },
      { name: "Ube Latte", description: "Unique, creamy and naturally vibrant.", price: "$12" },
      { name: "Lavender Matcha", description: "A calming twist on a classic.", price: "$12" },
      { name: "Strawberry Matcha", description: "Fruity, fresh and energizing.", price: "$12" },
      { name: "Pistachio Latte", description: "Rich, nutty and irresistibly smooth.", price: "$12" },
      { name: "Blue Spirulina Latte", description: "A colorful boost, full of goodness.", price: "$12" },
      { name: "French Vanilla Latte", description: "Creamy, sweet and always a favorite.", price: "$10" },
    ],
  },
  {
    id: "cold-press-juice",
    title: "Cold Press Juice",
    subtitle: "Natural nutrition, real energy",
    items: [
      { name: "Detox Lemonade", description: "Old fashion lemonade, pineapple, lemon and ginger.", price: "$10" },
      { name: "Green Day", description: "Apple, spinach, celery and ginger.", price: "$10" },
      { name: "Bloody Booster", description: "Beet, lime, lemon, ginger and carrots.", price: "$10" },
    ],
  },
  {
    id: "milk-shake",
    title: "Milk Shake",
    subtitle: "Creamy. Indulgent. Irresistible.",
    items: [
      { name: "Chocolate", description: "Rich chocolate, blended to perfection.", price: "$12" },
      { name: "Strawberry", description: "Real strawberries, real goodness.", price: "$12" },
      { name: "Vanilla", description: "Classic flavor, always a treat.", price: "$12" },
    ],
  },
  {
    id: "protein-shake",
    title: "Protein Shake",
    subtitle: "Fuel your day",
    items: [
      { name: "Banana Roast", description: "Banana, vanilla protein, honey and coffee.", price: "$15" },
      { name: "Green Machine", description: "Apple, spinach, celery, protein, flaxseed and agave.", price: "$15" },
      { name: "Sunset Isla Morada", description: "Carrot, turmeric, pineapple, lime juice, protein and agave.", price: "$15" },
    ],
  },
  {
    id: "classic-mocktails",
    title: "Classic Mocktails",
    subtitle: "Refreshingly sophisticated",
    items: [
      { name: "Virgin Mojito", description: "Coconut, strawberry and regular sugar.", price: "$10" },
      { name: "Virgin Lagoon", description: "Key lime, lemonade, blue curaçao syrup.", price: "$10" },
      { name: "Virgin Piña Colada", description: "Pineapple juice, coconut cream.", price: "$10" },
    ],
  },
  {
    id: "mocktail-creations",
    title: "Mocktail Creations",
    subtitle: "Bold flavors. Zero alcohol.",
    items: [
      { name: "K on the Beach", description: "Mandarin juice, guava and cranberry.", price: "$10" },
      { name: "The Gran Jean", description: "Blackberry, almond, lime and soda.", price: "$10" },
      { name: "The Great Bassam", description: "Pineapple, jasmine, sarsaparilla and bitters.", price: "$10" },
    ],
  },
  {
    id: "water-soda",
    title: "Water & Soda",
    subtitle: "Stay refreshed",
    items: [
      { name: "Water Bottle", price: "$4" },
      { name: "Sparkling Water", price: "$6" },
      { name: "Coke / Diet Coke", price: "$4" },
      { name: "Sprite", price: "$4" },
    ],
  },
];

/** What the site shows: hidden categories and items stay in the data above. */
function visible(categories: MenuCategory[]): MenuCategory[] {
  return categories
    .filter((category) => !category.hidden)
    .map((category) => ({ ...category, items: category.items.filter((item) => !item.hidden) }));
}

export const visibleFoodMenu = visible(foodMenu);
export const visibleDrinkMenu = visible(drinkMenu);
