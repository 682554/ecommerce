export type ProductGender = "men" | "women" | "kids" | "unisex";
export type ProductColor =
  | "black"
  | "white"
  | "red"
  | "blue"
  | "green"
  | "orange"
  | "gray"
  | "beige";
export type ProductSize =
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "one-size";
export type PriceRangeKey = "under-50" | "50-100" | "100-150" | "150-plus";

export type MockProductVariant = {
  id: string;
  sku: string;
  color: ProductColor;
  size: ProductSize;
  price: number;
  image: string;
  inStock: number;
};

export type MockProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  gender: ProductGender;
  featured: boolean;
  createdAt: string;
  variants: MockProductVariant[];
};

type ProductSeed = Omit<MockProduct, "variants"> & {
  variantTemplate: {
    colors: ProductColor[];
    sizes: ProductSize[];
    basePrice: number;
    images: string[];
  };
};

const productSeeds: ProductSeed[] = [
  {
    id: "p-001",
    slug: "nike-air-max-90",
    name: "Nike Air Max 90",
    description:
      "Visible Air cushioning and heritage paneling for everyday rotation.",
    category: "Lifestyle Shoes",
    gender: "unisex",
    featured: true,
    createdAt: "2026-05-12T10:00:00.000Z",
    variantTemplate: {
      colors: ["white", "red", "gray"],
      sizes: ["8", "9", "10", "11", "12"],
      basePrice: 130,
      images: [
        "/static/uploads/products/nike-air-max-90/01-nike-air-max-90.jpg",
        "/static/uploads/products/nike-air-max-90/02-nike-air-max-90.jpg",
      ],
    },
  },
  {
    id: "p-002",
    slug: "nike-air-force-1-07",
    name: "Nike Air Force 1 '07",
    description:
      "Clean leather build with streetwear weight and classic court DNA.",
    category: "Lifestyle Shoes",
    gender: "men",
    featured: true,
    createdAt: "2026-05-10T10:00:00.000Z",
    variantTemplate: {
      colors: ["white", "black"],
      sizes: ["8", "9", "10", "11", "12"],
      basePrice: 115,
      images: [
        "/static/uploads/products/nike-air-force-1-07/01-nike-air-force-1-07.jpg",
        "/static/uploads/products/nike-air-force-1-07/02-nike-air-force-1-07.jpg",
      ],
    },
  },
  {
    id: "p-003",
    slug: "nike-dunk-low-retro",
    name: "Nike Dunk Low Retro",
    description:
      "Low-cut icon with color-block energy and easy all-day wearability.",
    category: "Lifestyle Shoes",
    gender: "men",
    featured: true,
    createdAt: "2026-05-08T10:00:00.000Z",
    variantTemplate: {
      colors: ["red", "blue", "black"],
      sizes: ["8", "9", "10", "11", "12"],
      basePrice: 115,
      images: [
        "/static/uploads/products/nike-dunk-low-retro/01-nike-dunk-low-retro.jpg",
        "/static/uploads/products/nike-dunk-low-retro/02-nike-dunk-low-retro.jpg",
      ],
    },
  },
  {
    id: "p-004",
    slug: "nike-air-zoom-pegasus-41",
    name: "Nike Air Zoom Pegasus 41",
    description:
      "Responsive road runner tuned for daily mileage and fast training days.",
    category: "Running Shoes",
    gender: "men",
    featured: true,
    createdAt: "2026-05-18T10:00:00.000Z",
    variantTemplate: {
      colors: ["green", "black", "blue"],
      sizes: ["8", "9", "10", "11", "12"],
      basePrice: 140,
      images: [
        "/static/uploads/products/nike-air-zoom-pegasus-41/01-nike-air-zoom-pegasus-41.jpg",
        "/static/uploads/products/nike-air-zoom-pegasus-41/02-nike-air-zoom-pegasus-41.jpg",
      ],
    },
  },
  {
    id: "p-005",
    slug: "nike-vomero-18",
    name: "Nike Vomero 18",
    description:
      "Soft, plush running platform made for recovery miles and comfort-first runs.",
    category: "Running Shoes",
    gender: "women",
    featured: false,
    createdAt: "2026-05-16T10:00:00.000Z",
    variantTemplate: {
      colors: ["beige", "orange"],
      sizes: ["7", "8", "9", "10", "11"],
      basePrice: 160,
      images: [
        "/static/uploads/products/nike-vomero-18/01-nike-vomero-18.jpg",
        "/static/uploads/products/nike-vomero-18/02-nike-vomero-18.jpg",
      ],
    },
  },
  {
    id: "p-006",
    slug: "nike-structure-25",
    name: "Nike Structure 25",
    description:
      "Supportive running silhouette with a stable ride for longer sessions.",
    category: "Running Shoes",
    gender: "men",
    featured: false,
    createdAt: "2026-05-04T10:00:00.000Z",
    variantTemplate: {
      colors: ["white", "blue"],
      sizes: ["8", "9", "10", "11", "12"],
      basePrice: 145,
      images: [
        "/static/uploads/products/nike-structure-25/01-nike-structure-25.jpg",
      ],
    },
  },
  {
    id: "p-007",
    slug: "nike-metcon-9",
    name: "Nike Metcon 9",
    description:
      "Flat, stable trainer for lifting, circuits, and high-output sessions.",
    category: "Training Shoes",
    gender: "unisex",
    featured: false,
    createdAt: "2026-04-29T10:00:00.000Z",
    variantTemplate: {
      colors: ["black", "orange"],
      sizes: ["8", "9", "10", "11", "12"],
      basePrice: 150,
      images: [
        "/static/uploads/products/nike-metcon-9/01-nike-metcon-9.jpg",
        "/static/uploads/products/nike-metcon-9/02-nike-metcon-9.jpg",
      ],
    },
  },
  {
    id: "p-008",
    slug: "jordan-1-low",
    name: "Jordan 1 Low",
    description:
      "Low-profile Jordan classic with premium leather and unmistakable attitude.",
    category: "Basketball Shoes",
    gender: "kids",
    featured: false,
    createdAt: "2026-04-21T10:00:00.000Z",
    variantTemplate: {
      colors: ["black", "red", "white"],
      sizes: ["7", "8", "9", "10"],
      basePrice: 125,
      images: [
        "/static/uploads/products/jordan-1-low/01-jordan-1-low.jpg",
        "/static/uploads/products/jordan-1-low/02-jordan-1-low.jpg",
      ],
    },
  },
  {
    id: "p-009",
    slug: "nike-sportswear-club-fleece-hoodie",
    name: "Nike Sportswear Club Fleece Hoodie",
    description:
      "Brushed fleece comfort with a relaxed fit for off-duty layers.",
    category: "Hoodies",
    gender: "unisex",
    featured: true,
    createdAt: "2026-05-14T10:00:00.000Z",
    variantTemplate: {
      colors: ["gray", "black", "beige"],
      sizes: ["s", "m", "l", "xl"],
      basePrice: 65,
      images: [
        "/static/uploads/products/nike-sportswear-club-fleece-hoodie/01-nike-sportswear-club-fleece-hoodie.jpg",
        "/static/uploads/products/nike-sportswear-club-fleece-hoodie/02-nike-sportswear-club-fleece-hoodie.jpg",
      ],
    },
  },
  {
    id: "p-010",
    slug: "nike-tech-fleece-joggers",
    name: "Nike Tech Fleece Joggers",
    description:
      "Tapered Tech Fleece silhouette with sleek lines and lightweight warmth.",
    category: "Joggers",
    gender: "men",
    featured: false,
    createdAt: "2026-05-02T10:00:00.000Z",
    variantTemplate: {
      colors: ["gray", "black"],
      sizes: ["s", "m", "l", "xl"],
      basePrice: 110,
      images: [
        "/static/uploads/products/nike-tech-fleece-joggers/01-nike-tech-fleece-joggers.jpg",
        "/static/uploads/products/nike-tech-fleece-joggers/02-nike-tech-fleece-joggers.jpg",
      ],
    },
  },
  {
    id: "p-011",
    slug: "nike-pro-dri-fit-tee",
    name: "Nike Pro Dri-FIT T-Shirt",
    description:
      "Sweat-wicking base-layer essential with a close training fit.",
    category: "T-Shirts",
    gender: "men",
    featured: false,
    createdAt: "2026-05-06T10:00:00.000Z",
    variantTemplate: {
      colors: ["black", "white", "blue"],
      sizes: ["s", "m", "l", "xl"],
      basePrice: 35,
      images: [
        "/static/uploads/products/nike-pro-dri-fit-tee/01-nike-pro-dri-fit-tee.jpg",
        "/static/uploads/products/nike-pro-dri-fit-tee/02-nike-pro-dri-fit-tee.jpg",
      ],
    },
  },
  {
    id: "p-012",
    slug: "nike-club-flow-shorts",
    name: "Nike Club Flow Shorts",
    description:
      "Easy woven shorts for heat, movement, and casual everyday pace.",
    category: "Shorts",
    gender: "men",
    featured: false,
    createdAt: "2026-05-11T10:00:00.000Z",
    variantTemplate: {
      colors: ["black", "orange", "beige"],
      sizes: ["s", "m", "l", "xl"],
      basePrice: 50,
      images: [
        "/static/uploads/products/nike-club-flow-shorts/01-nike-club-flow-shorts.jpg",
        "/static/uploads/products/nike-club-flow-shorts/02-nike-club-flow-shorts.jpg",
      ],
    },
  },
  {
    id: "p-013",
    slug: "nike-windrunner-jacket",
    name: "Nike Windrunner Jacket",
    description:
      "Light outer shell inspired by Nike’s iconic chevron heritage.",
    category: "Jackets",
    gender: "women",
    featured: false,
    createdAt: "2026-05-15T10:00:00.000Z",
    variantTemplate: {
      colors: ["black", "blue"],
      sizes: ["s", "m", "l", "xl"],
      basePrice: 120,
      images: [
        "/static/uploads/products/nike-windrunner-jacket/01-nike-windrunner-jacket.jpg",
        "/static/uploads/products/nike-windrunner-jacket/02-nike-windrunner-jacket.jpg",
      ],
    },
  },
  {
    id: "p-014",
    slug: "nike-heritage86-cap",
    name: "Nike Heritage86 Cap",
    description:
      "Curved-brim essential with soft structure and classic everyday branding.",
    category: "Headwear",
    gender: "unisex",
    featured: false,
    createdAt: "2026-04-28T10:00:00.000Z",
    variantTemplate: {
      colors: ["black", "beige", "orange"],
      sizes: ["one-size"],
      basePrice: 28,
      images: [
        "/static/uploads/products/nike-heritage86-cap/01-nike-heritage86-cap.jpg",
      ],
    },
  },
  {
    id: "p-015",
    slug: "nike-everyday-cushioned-socks",
    name: "Nike Everyday Cushioned Crew Socks",
    description:
      "Training-friendly crew socks with extra comfort through the footbed.",
    category: "Socks",
    gender: "unisex",
    featured: false,
    createdAt: "2026-05-03T10:00:00.000Z",
    variantTemplate: {
      colors: ["white", "black"],
      sizes: ["s", "m", "l"],
      basePrice: 22,
      images: [
        "/static/uploads/products/nike-everyday-cushioned-socks/01-nike-everyday-cushioned-socks.jpg",
        "/static/uploads/products/nike-everyday-cushioned-socks/02-nike-everyday-cushioned-socks.jpg",
      ],
    },
  },
];

export const genderOptions: Array<{ value: ProductGender; label: string }> = [
  { value: "men", label: "Men" },
  { value: "women", label: "Women" },
  { value: "kids", label: "Kids" },
  { value: "unisex", label: "Unisex" },
];

export const sizeOptions: Array<{ value: ProductSize; label: string }> = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
  { value: "11", label: "11" },
  { value: "12", label: "12" },
  { value: "one-size", label: "One Size" },
];

export const colorOptions: Array<{
  value: ProductColor;
  label: string;
  swatch: string;
}> = [
  { value: "black", label: "Black", swatch: "#171717" },
  { value: "white", label: "White", swatch: "#f5f5f5" },
  { value: "red", label: "Red", swatch: "#c1121f" },
  { value: "blue", label: "Blue", swatch: "#1d4ed8" },
  { value: "green", label: "Green", swatch: "#65a30d" },
  { value: "orange", label: "Orange", swatch: "#f97316" },
  { value: "gray", label: "Gray", swatch: "#6b7280" },
  { value: "beige", label: "Beige", swatch: "#d6d3d1" },
];

export const priceRangeOptions: Array<{
  value: PriceRangeKey;
  label: string;
  min: number;
  max: number | null;
}> = [
  { value: "under-50", label: "Under $50", min: 0, max: 49.99 },
  { value: "50-100", label: "$50 - $100", min: 50, max: 100 },
  { value: "100-150", label: "$100 - $150", min: 100, max: 150 },
  { value: "150-plus", label: "$150 & Above", min: 150, max: null },
];

function buildVariants(
  productId: string,
  slug: string,
  template: ProductSeed["variantTemplate"],
): MockProductVariant[] {
  return template.colors.flatMap((color, colorIndex) =>
    template.sizes.map((size, sizeIndex) => ({
      id: `${productId}-${color}-${size}`,
      sku: `${slug.toUpperCase()}-${color.toUpperCase()}-${size.toUpperCase()}`,
      color,
      size,
      price: template.basePrice + colorIndex * 4 + sizeIndex,
      image: template.images[colorIndex % template.images.length],
      inStock: 4 + ((colorIndex + sizeIndex) % 9),
    })),
  );
}

export const mockProducts: MockProduct[] = productSeeds.map((product) => ({
  id: product.id,
  slug: product.slug,
  name: product.name,
  description: product.description,
  category: product.category,
  gender: product.gender,
  featured: product.featured,
  createdAt: product.createdAt,
  variants: buildVariants(product.id, product.slug, product.variantTemplate),
}));
