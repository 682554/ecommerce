import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products } from "./schema";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const nikeProducts = [
  {
    name: "Nike Air Max 90",
    description:
      "The iconic silhouette with legendary style and unmatched comfort.",
    price: 130.0,
    imageUrl: "/products/photos/air-max-90.jpg",
    category: "Shoes",
  },
  {
    name: "Nike Air Force 1 '07",
    description:
      "The basketball original that shaped the game and street culture.",
    price: 115.0,
    imageUrl: "/products/photos/air-force-1.jpg",
    category: "Shoes",
  },
  {
    name: "Nike Dunk Low Retro",
    description:
      "From the hardwood to the streets with timeless design.",
    price: 115.0,
    imageUrl: "/products/photos/dunk-low.jpg",
    category: "Shoes",
  },
  {
    name: "Nike Sportswear Tech Fleece Joggers",
    description:
      "Premium comfort meets modern style with engineered fabric.",
    price: 110.0,
    imageUrl: "/products/photos/tech-fleece-joggers.jpg",
    category: "Clothing",
  },
  {
    name: "Nike Sportswear Club Fleece Hoodie",
    description:
      "Elevated everyday wear with classic Nike comfort and style.",
    price: 65.0,
    imageUrl: "/products/photos/club-fleece-hoodie.jpg",
    category: "Clothing",
  },
  {
    name: "Nike Air Zoom Pegasus 41",
    description:
      "Responsive cushioning for everyday runs and training.",
    price: 140.0,
    imageUrl: "/products/photos/pegasus-41.jpg",
    category: "Shoes",
  },
  {
    name: "Nike Pro Dri-FIT T-Shirt",
    description:
      "Stay cool and dry with advanced moisture-wicking technology.",
    price: 35.0,
    imageUrl: "/products/photos/pro-dri-fit-tee.jpg",
    category: "Clothing",
  },
  {
    name: "Nike Heritage86 Cap",
    description:
      "Classic six-panel design with iconic Swoosh embroidery.",
    price: 28.0,
    imageUrl: "/products/photos/heritage86-cap.jpg",
    category: "Accessories",
  },
];

async function seed() {
  console.log("🌱 Seeding products...");
  await db.delete(products);
  await db.insert(products).values(nikeProducts);
  console.log(`✅ Seeded ${nikeProducts.length} Nike products`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
