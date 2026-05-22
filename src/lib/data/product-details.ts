import { deriveProductSlug } from "@/lib/utils/product-slug";

export type ProductColorVariant = {
  id: string;
  label: string;
  swatchClassName: string;
  images: string[];
};

export type ProductDetail = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  gender: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  colors: ProductColorVariant[];
  sizes: string[];
  fitNote: string;
  highlights: string[];
  details: string[];
  shipping: string[];
  reviewsNote: string;
};

type ProductSeed = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  gender: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  fitNote: string;
  colors: Array<{
    label: string;
    swatchClassName: string;
  }>;
  details: string[];
};

const footwearSizes = ["6", "7", "8", "9", "10", "11", "12"];
const apparelSizes = ["XS", "S", "M", "L", "XL", "2XL"];
const accessorySizes = ["One Size"];
const socksSizes = ["S", "M", "L", "XL"];
const slideSizes = ["5", "6", "7", "8", "9", "10", "11"];

function buildImagePath(id: string) {
  return `/static/uploads/products/${id}/01-${id}.png`;
}

function buildGallery(id: string) {
  const image = buildImagePath(id);
  return [image, image, image];
}

function buildSizes(category: string, id: string) {
  if (category === "Footwear") {
    return id.includes("kawa") ? slideSizes : footwearSizes;
  }

  if (category === "Accessories") {
    return id.includes("socks") ? socksSizes : accessorySizes;
  }

  return apparelSizes;
}

const productSeeds: ProductSeed[] = [
  {
    id: "nike-air-force-1-07",
    name: "Nike Air Force 1 '07",
    subtitle: "Men's Shoes",
    category: "Footwear",
    gender: "Men",
    price: 150,
    compareAtPrice: 180,
    description:
      "Clean court energy, premium texture, and everyday cushioning in a staple silhouette built to stay in rotation.",
    fitNote: "Runs true to size with a structured, supportive feel through the midfoot.",
    colors: [
      { label: "Triple White", swatchClassName: "bg-neutral-100" },
      { label: "Black Gum", swatchClassName: "bg-neutral-900" },
      { label: "University Red", swatchClassName: "bg-red-600" },
    ],
    details: [
      "Leather upper with perforated toe box for structure and breathability.",
      "Nike Air unit softens each step without adding bulk.",
      "Rubber outsole keeps the classic pivot-circle traction pattern intact.",
    ],
  },
  {
    id: "nike-air-max-90",
    name: "Nike Air Max 90",
    subtitle: "Women's Shoes",
    category: "Footwear",
    gender: "Women",
    price: 165,
    compareAtPrice: 195,
    description:
      "A heritage runner refreshed with bold paneling, visible Air cushioning, and a more elevated everyday stance.",
    fitNote: "Slightly snug through the forefoot, especially if you prefer thicker socks.",
    colors: [
      { label: "Summit White", swatchClassName: "bg-stone-100" },
      { label: "Photon Dust", swatchClassName: "bg-slate-300" },
      { label: "Crimson Pulse", swatchClassName: "bg-pink-500" },
    ],
    details: [
      "Layered upper mixes leather and textile for depth and durability.",
      "Foam midsole and Max Air window balance comfort with iconic shape.",
      "Waffle outsole keeps the throwback running DNA visible.",
    ],
  },
  {
    id: "nike-air-zoom-pegasus-41",
    name: "Nike Air Zoom Pegasus 41",
    subtitle: "Men's Road Running Shoes",
    category: "Footwear",
    gender: "Men",
    price: 180,
    compareAtPrice: 205,
    description:
      "Responsive daily miles with lightweight upper support and a fast underfoot transition made for repeat wear.",
    fitNote: "Fits true to size with a secure heel and a little more room in the toe than the previous Pegasus.",
    colors: [
      { label: "Blueprint", swatchClassName: "bg-sky-600" },
      { label: "Electric Green", swatchClassName: "bg-lime-500" },
      { label: "Black Anthracite", swatchClassName: "bg-zinc-900" },
    ],
    details: [
      "Dual Air Zoom units create a quick snap-off feel.",
      "Breathable engineered mesh upper supports long efforts without overheating.",
      "ReactX foam keeps the ride softer while preserving energy return.",
    ],
  },
  {
    id: "nike-dunk-low-retro",
    name: "Nike Dunk Low Retro",
    subtitle: "Men's Shoes",
    category: "Footwear",
    gender: "Men",
    price: 140,
    compareAtPrice: 165,
    description:
      "An easy-to-style low-top with crisp panel contrast and a classic basketball profile that still feels current.",
    fitNote: "Structured at first wear, then softens nicely after a few outings.",
    colors: [
      { label: "Panda", swatchClassName: "bg-neutral-900" },
      { label: "Court Purple", swatchClassName: "bg-violet-700" },
      { label: "Coconut Milk", swatchClassName: "bg-amber-100" },
    ],
    details: [
      "Low-cut padded collar keeps the feel plush and familiar.",
      "Leather overlays hold shape and age well over time.",
      "Rubber traction pattern stays true to the original hardwood DNA.",
    ],
  },
  {
    id: "jordan-1-low",
    name: "Jordan 1 Low",
    subtitle: "Women's Shoes",
    category: "Footwear",
    gender: "Women",
    price: 160,
    compareAtPrice: 190,
    description:
      "A low-profile Jordan with polished color blocking and enough attitude to move from weekend wear to everyday staple.",
    fitNote: "True to size, with a slightly padded collar that feels secure right away.",
    colors: [
      { label: "Sail", swatchClassName: "bg-stone-100" },
      { label: "Legend Blue", swatchClassName: "bg-blue-500" },
      { label: "Lucky Green", swatchClassName: "bg-emerald-500" },
    ],
    details: [
      "Encapsulated Air unit provides lightweight everyday comfort.",
      "Leather upper creates a premium, structured finish.",
      "Rubber outsole delivers dependable traction and classic Jordan styling.",
    ],
  },
  {
    id: "nike-vomero-18",
    name: "Nike Vomero 18",
    subtitle: "Women's Road Running Shoes",
    category: "Footwear",
    gender: "Women",
    price: 195,
    compareAtPrice: 220,
    description:
      "Plush, protected cushioning for recovery miles, long easy runs, and anyone who wants maximum comfort on the move.",
    fitNote: "Best for neutral runners who want a premium, roomy cruiser.",
    colors: [
      { label: "Soft Pearl", swatchClassName: "bg-stone-200" },
      { label: "Hyper Violet", swatchClassName: "bg-fuchsia-500" },
      { label: "Black Smoke", swatchClassName: "bg-neutral-800" },
    ],
    details: [
      "Deep stack cushioning helps soften repeated impact.",
      "Plush tongue and collar make it feel premium from the first step.",
      "Durable rubber placement supports long-wear training cycles.",
    ],
  },
  {
    id: "nike-structure-25",
    name: "Nike Structure 25",
    subtitle: "Men's Road Running Shoes",
    category: "Footwear",
    gender: "Men",
    price: 175,
    compareAtPrice: 195,
    description:
      "Stable guidance with a more refined upper, smooth rocker, and daily-trainer comfort that feels dependable mile after mile.",
    fitNote: "Secure through the heel with moderate guidance under the arch.",
    colors: [
      { label: "White Obsidian", swatchClassName: "bg-slate-100" },
      { label: "Volt", swatchClassName: "bg-lime-400" },
      { label: "Black", swatchClassName: "bg-black" },
    ],
    details: [
      "Supportive geometry helps keep transitions smooth and centered.",
      "Midsole cushioning feels balanced rather than overly soft.",
      "Updated upper wraps comfortably without feeling restrictive.",
    ],
  },
  {
    id: "nike-metcon-9",
    name: "Nike Metcon 9",
    subtitle: "Training Shoes",
    category: "Footwear",
    gender: "Men",
    price: 170,
    compareAtPrice: 195,
    description:
      "Built for lifts, circuits, and demanding gym sessions with a locked-in heel and durable forefoot flexibility.",
    fitNote: "Stable and snug; size up if you prefer more room for conditioning work.",
    colors: [
      { label: "Black White", swatchClassName: "bg-zinc-900" },
      { label: "Safety Orange", swatchClassName: "bg-orange-500" },
      { label: "Royal Pulse", swatchClassName: "bg-blue-600" },
    ],
    details: [
      "Expanded Hyperlift plate supports squats, deadlifts, and strong foot positioning.",
      "Rope-wrap sidewalls improve grip and durability for climbing work.",
      "Durable mesh upper keeps airflow moving during hard sessions.",
    ],
  },
  {
    id: "nike-court-vision-low",
    name: "Nike Court Vision Low",
    subtitle: "Women's Shoes",
    category: "Footwear",
    gender: "Women",
    price: 120,
    compareAtPrice: 145,
    description:
      "Retro basketball proportions meet easy neutral styling for a clean low-top you can wear across the week.",
    fitNote: "Comfortable everyday fit with a slightly firmer step-in feel.",
    colors: [
      { label: "White Green", swatchClassName: "bg-emerald-400" },
      { label: "Black White", swatchClassName: "bg-neutral-900" },
      { label: "Barely Rose", swatchClassName: "bg-rose-300" },
    ],
    details: [
      "Classic stitched overlays nod to 80s hoops design.",
      "Padded low-cut collar keeps the shoe easy and approachable.",
      "Rubber cupsole keeps the look durable and grounded.",
    ],
  },
  {
    id: "nike-kawa-slide",
    name: "Nike Kawa Slide",
    subtitle: "Slides",
    category: "Footwear",
    gender: "Kids",
    price: 55,
    compareAtPrice: 65,
    description:
      "Soft post-play comfort with easy slip-on convenience and a flexible footbed for everyday recovery.",
    fitNote: "Relaxed fit designed for quick on and off.",
    colors: [
      { label: "Black", swatchClassName: "bg-black" },
      { label: "Game Royal", swatchClassName: "bg-blue-600" },
      { label: "Bright Crimson", swatchClassName: "bg-red-500" },
    ],
    details: [
      "Soft strap lining feels smooth against the foot.",
      "Foam underfoot keeps the slide lightweight and cushioned.",
      "Flex grooves help the foot move naturally.",
    ],
  },
  {
    id: "nike-sportswear-club-fleece-hoodie",
    name: "Nike Sportswear Club Fleece Hoodie",
    subtitle: "Men's Pullover Hoodie",
    category: "Apparel",
    gender: "Men",
    price: 95,
    compareAtPrice: 110,
    description:
      "A dependable fleece layer with clean proportions, brushed warmth, and a premium finish that works year-round.",
    fitNote: "Relaxed through the body with an easy layer-friendly shape.",
    colors: [
      { label: "Dark Grey Heather", swatchClassName: "bg-neutral-600" },
      { label: "Midnight Navy", swatchClassName: "bg-slate-900" },
      { label: "Coconut Milk", swatchClassName: "bg-stone-100" },
    ],
    details: [
      "Brushed fleece interior feels warm without going bulky.",
      "Ribbed cuffs and hem help the shape stay tidy.",
      "Classic hood and kangaroo pocket keep it practical and familiar.",
    ],
  },
  {
    id: "nike-tech-fleece-joggers",
    name: "Nike Tech Fleece Joggers",
    subtitle: "Men's Joggers",
    category: "Apparel",
    gender: "Men",
    price: 120,
    compareAtPrice: 140,
    description:
      "Streamlined fleece joggers with signature paneling, lighter warmth, and an elevated finish that reads more tailored.",
    fitNote: "Tapered through the leg with a neater ankle opening.",
    colors: [
      { label: "Heather Grey", swatchClassName: "bg-slate-300" },
      { label: "Black", swatchClassName: "bg-neutral-900" },
      { label: "Olive Aura", swatchClassName: "bg-lime-700" },
    ],
    details: [
      "Premium low-bulk fleece holds warmth without the heavy feel.",
      "Zipped pocket storage keeps essentials secure on the move.",
      "Panelled construction gives the silhouette a distinctive Nike look.",
    ],
  },
  {
    id: "nike-pro-dri-fit-tee",
    name: "Nike Pro Dri-FIT Tee",
    subtitle: "Training Top",
    category: "Apparel",
    gender: "Men",
    price: 48,
    compareAtPrice: 60,
    description:
      "Sweat-ready training essential with a close-to-body feel, fast-drying fabric, and clean everyday performance.",
    fitNote: "Athletic fit that sits close without feeling compressive.",
    colors: [
      { label: "Black", swatchClassName: "bg-black" },
      { label: "Cool Grey", swatchClassName: "bg-zinc-400" },
      { label: "Team Red", swatchClassName: "bg-red-700" },
    ],
    details: [
      "Dri-FIT fabric helps sweat dry fast during hard efforts.",
      "Soft stretch knit moves easily through lifting and conditioning.",
      "Flat seams help reduce distraction where it matters most.",
    ],
  },
  {
    id: "nike-club-flow-shorts",
    name: "Nike Club Flow Shorts",
    subtitle: "Men's Shorts",
    category: "Apparel",
    gender: "Men",
    price: 58,
    compareAtPrice: 70,
    description:
      "Easy warm-weather shorts with a laid-back silhouette, lightweight drape, and clean finish for everyday wear.",
    fitNote: "Relaxed leg opening with an easy waistband fit.",
    colors: [
      { label: "Khaki", swatchClassName: "bg-amber-200" },
      { label: "Black", swatchClassName: "bg-black" },
      { label: "Diffused Blue", swatchClassName: "bg-sky-700" },
    ],
    details: [
      "Lightweight woven fabric keeps the feel airy and smooth.",
      "Elastic waistband with drawcord helps dial the fit quickly.",
      "Side pockets keep the styling practical for daily use.",
    ],
  },
  {
    id: "nike-windrunner-jacket",
    name: "Nike Windrunner Jacket",
    subtitle: "Women's Running Jacket",
    category: "Apparel",
    gender: "Women",
    price: 135,
    compareAtPrice: 155,
    description:
      "Light weather protection in an iconic chevron silhouette made to layer over training looks or daily outfits.",
    fitNote: "Sits lightly over a tee or base layer without excess volume.",
    colors: [
      { label: "White Black", swatchClassName: "bg-neutral-100" },
      { label: "Adobe", swatchClassName: "bg-orange-300" },
      { label: "Night Maroon", swatchClassName: "bg-rose-900" },
    ],
    details: [
      "Light woven shell helps block wind on cool runs.",
      "Iconic chevron line keeps the Windrunner identity front and center.",
      "Packable feel makes it easy to stash between sessions.",
    ],
  },
  {
    id: "nike-academy-dri-fit-track-jacket",
    name: "Nike Academy Dri-FIT Track Jacket",
    subtitle: "Kids' Soccer Jacket",
    category: "Apparel",
    gender: "Kids",
    price: 68,
    compareAtPrice: 80,
    description:
      "A clean training layer for match day, school sport, or everyday movement with sweat-friendly comfort built in.",
    fitNote: "Sporty standard fit with room to move through the shoulders.",
    colors: [
      { label: "Obsidian", swatchClassName: "bg-slate-900" },
      { label: "University Blue", swatchClassName: "bg-sky-500" },
      { label: "Bright Crimson", swatchClassName: "bg-red-500" },
    ],
    details: [
      "Dri-FIT knit helps keep younger athletes comfortable through activity.",
      "Full-zip front makes layering simple before and after play.",
      "Slim athletic lines keep the profile sharp and field-ready.",
    ],
  },
  {
    id: "jordan-flight-essentials-tee",
    name: "Jordan Flight Essentials Tee",
    subtitle: "Men's T-Shirt",
    category: "Apparel",
    gender: "Men",
    price: 52,
    compareAtPrice: 62,
    description:
      "Soft heavyweight cotton with a clean Jordan stance, giving a simple tee more presence and polish.",
    fitNote: "Boxier than a standard training tee with more structure through the body.",
    colors: [
      { label: "Off Noir", swatchClassName: "bg-zinc-900" },
      { label: "Sail", swatchClassName: "bg-stone-100" },
      { label: "Legend Sand", swatchClassName: "bg-yellow-100" },
    ],
    details: [
      "Heavyweight cotton gives the shirt a richer drape.",
      "Relaxed cut keeps the styling modern and easy.",
      "Jordan branding stays sharp without feeling overworked.",
    ],
  },
  {
    id: "nike-elemental-backpack",
    name: "Nike Elemental Backpack",
    subtitle: "Backpack",
    category: "Accessories",
    gender: "Kids",
    price: 60,
    compareAtPrice: 72,
    description:
      "Everyday carry with enough room for training gear, tech, and school essentials in a clean Nike package.",
    fitNote: "Adjustable padded straps make it comfortable for all-day carrying.",
    colors: [
      { label: "Black", swatchClassName: "bg-black" },
      { label: "Deep Royal", swatchClassName: "bg-blue-700" },
      { label: "Desert Khaki", swatchClassName: "bg-amber-200" },
    ],
    details: [
      "Spacious main compartment stores the bulk of your day.",
      "Front zip pocket keeps smaller essentials easy to grab.",
      "Padded straps and back panel help with comfortable carry.",
    ],
  },
  {
    id: "nike-heritage86-cap",
    name: "Nike Heritage86 Cap",
    subtitle: "Adjustable Cap",
    category: "Accessories",
    gender: "Women",
    price: 38,
    compareAtPrice: 46,
    description:
      "A casual curved-brim cap with lightweight structure and an easy fit that works with nearly anything.",
    fitNote: "Low-depth profile with a soft adjustable back closure.",
    colors: [
      { label: "Black", swatchClassName: "bg-black" },
      { label: "Stone", swatchClassName: "bg-stone-300" },
      { label: "Washed Pink", swatchClassName: "bg-rose-300" },
    ],
    details: [
      "Soft twill fabric gives the cap an easy broken-in feel.",
      "Embroidered logo keeps the finish classic and understated.",
      "Adjustable strap helps dial in the fit quickly.",
    ],
  },
  {
    id: "nike-everyday-cushioned-socks",
    name: "Nike Everyday Cushioned Socks",
    subtitle: "Training Crew Socks",
    category: "Accessories",
    gender: "Men",
    price: 30,
    compareAtPrice: 36,
    description:
      "Daily socks with the right amount of cushioning and a supportive arch feel for training and repeat wear.",
    fitNote: "Snug supportive fit that stays in place without feeling restrictive.",
    colors: [
      { label: "White", swatchClassName: "bg-neutral-100" },
      { label: "Black", swatchClassName: "bg-black" },
      { label: "Grey Heather", swatchClassName: "bg-zinc-400" },
    ],
    details: [
      "Targeted cushioning helps soften impact underfoot.",
      "Ribbed leg and arch band improve hold through movement.",
      "Everyday crew height works across training and lifestyle footwear.",
    ],
  },
];

export const productDetails = productSeeds.map<ProductDetail>((product, index) => {
  const image = buildImagePath(product.id);
  const gallery = buildGallery(product.id);
  const sizes = buildSizes(product.category, product.id);
  const colors = product.colors.map((color) => {
    return {
      id: `${product.id}-${color.label.toLowerCase().replace(/\s+/g, "-")}`,
      label: color.label,
      swatchClassName: color.swatchClassName,
      images: buildGallery(product.id),
    };
  });

  return {
    id: product.id,
    name: product.name,
    subtitle: product.subtitle,
    description: product.description,
    category: product.category,
    gender: product.gender,
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? null,
    rating: 4.5 + ((index % 4) * 0.1),
    reviewCount: 148 + index * 23,
    image,
    gallery,
    colors,
    sizes,
    fitNote: product.fitNote,
    highlights: [
      `${product.gender} ${product.category.toLowerCase()} essential`,
      `${product.colors.length} curated color options`,
      "Nike-grade finish with premium visual polish",
    ],
    details: product.details,
    shipping: [
      "Free standard delivery on qualifying orders.",
      "Easy 30-day returns on unworn items with tags intact.",
      "Ships in premium protective packaging for a cleaner unboxing experience.",
    ],
    reviewsNote:
      "Review functionality is still UI-only here, but the layout is ready for real ratings and customer feedback.",
  };
});

const productDetailMap = new Map(
  productDetails.map((product) => [product.id, product] as const),
);

export function getProductDetailById(id: string) {
  return productDetailMap.get(id) ?? null;
}

export function getAllProductDetailIds() {
  return productDetails.map((product) => product.id);
}

export function getRelatedProductCards(id: string) {
  const currentIndex = productDetails.findIndex((product) => product.id === id);
  const withoutCurrent = productDetails.filter((product) => product.id !== id);
  const startIndex =
    currentIndex === -1 ? 0 : Math.min(currentIndex, withoutCurrent.length - 4);
  const related = withoutCurrent.slice(Math.max(0, startIndex), Math.max(0, startIndex) + 4);

  return related.map((product) => ({
    slug: deriveProductSlug(product.image, product.id),
    name: product.name,
    description: product.description,
    category: product.category,
    gender: product.gender,
    price: product.price,
    priceMax: product.compareAtPrice ?? undefined,
    image: product.image,
    colors: product.colors.map((color) => color.label),
    sizes: product.sizes,
  }));
}
