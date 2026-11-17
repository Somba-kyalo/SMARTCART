export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  imageAlt: string;
  description: string;
  tag?: string;
  colors: string;
};

export const products: Product[] = [
  {
    id: "woven-market-tote",
    name: "Woven Market Tote",
    category: "Home & Living",
    price: 1850,
    oldPrice: 2400,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Natural woven tote bag with leather handles",
    description: "A roomy, everyday carryall with a handwoven finish and sturdy handles. Made for market mornings, errands and everything in between.",
    tag: "A little less",
    colors: "Natural"
  },
  {
    id: "ceramic-pour-over-set",
    name: "Ceramic Pour-over Set",
    category: "Home & Living",
    price: 3200,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Freshly brewed coffee and pour over equipment",
    description: "Slow mornings start here. A beautifully simple ceramic dripper and matching cup for your daily coffee ritual.",
    colors: "Sand"
  },
  {
    id: "weekend-sling",
    name: "Everyday Canvas Sling",
    category: "Bags & Accessories",
    price: 2450,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Compact everyday travel bag in a neutral color",
    description: "Keep your essentials close without carrying the whole day. Adjustable, lightweight and ready for the commute.",
    tag: "Customer favourite",
    colors: "Olive"
  },
  {
    id: "linen-table-runner",
    name: "Soft Linen Table Runner",
    category: "Home & Living",
    price: 1650,
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Calm, natural home interior with warm textiles",
    description: "An easy way to make a table feel considered. Soft washed linen with a relaxed drape and timeless natural tone.",
    colors: "Oat"
  },
  {
    id: "daily-water-bottle",
    name: "Insulated Daily Bottle",
    category: "Everyday Essentials",
    price: 1950,
    oldPrice: 2300,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Reusable stainless steel water bottle",
    description: "A dependable companion for work, travel and the little things between. Double-wall insulation keeps drinks just right.",
    tag: "Save KSh 350",
    colors: "Forest"
  },
  {
    id: "weekender-pouch",
    name: "Travel Weekender Pouch",
    category: "Bags & Accessories",
    price: 1250,
    image: "https://images.unsplash.com/photo-1622560480654-d96214fdc887?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Compact travel organizer pouch",
    description: "A practical little organiser for cables, toiletries or the everyday odds and ends that need a place.",
    colors: "Stone"
  },
  {
    id: "desk-lamp",
    name: "Warm Glow Desk Lamp",
    category: "Home & Living",
    price: 4100,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Minimal desk lamp casting a warm glow",
    description: "A clean silhouette and a softer pool of light for focused evenings, bedside reading or a calmer desk.",
    colors: "Matte black"
  },
  {
    id: "everyday-sunglasses",
    name: "Everyday Acetate Shades",
    category: "Bags & Accessories",
    price: 2850,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=85",
    imageAlt: "Classic sunglasses on a bright neutral background",
    description: "A versatile everyday shape with a lightweight feel. An easy finishing touch for bright days out.",
    colors: "Tortoise"
  }
];

export const categories = ["All finds", "Home & Living", "Bags & Accessories", "Everyday Essentials"];
export const formatKes = (amount: number) => `KSh ${amount.toLocaleString("en-KE")}`;
