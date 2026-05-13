import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products } from "./schema";
import dotenv from "dotenv";

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const nikeProducts = [
  {
    name: "Nike Air Max 90",
    description:
      "The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle outsole, stitched overlays and classic TPU accents.",
    price: 130.0,
    imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402d-9efb-be84af0e5e4c/AIR+MAX+90.png",
    category: "Shoes",
  },
  {
    name: "Nike Air Force 1 '07",
    description:
      "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best.",
    price: 115.0,
    imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402d-9efb-be84af0e5e4c/AIR+FORCE+1+07.png",
    category: "Shoes",
  },
  {
    name: "Nike Dunk Low Retro",
    description:
      "Created for the hardwood but taken to the streets, the Nike Dunk Low Retro returns with crisp overlays and original team colours.",
    price: 115.0,
    imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402d-9efb-be84af0e5e4c/NIKE+DUNK+LOW+RETRO.png",
    category: "Shoes",
  },
  {
    name: "Nike Sportswear Tech Fleece Joggers",
    description:
      "Slim-fitting Tech Fleece joggers engineered for lightweight warmth without extra bulk. Tapered legs give a streamlined look.",
    price: 110.0,
    imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402d-9efb-be84af0e5e4c/TECH+FLEECE+JOGGERS.png",
    category: "Clothing",
  },
  {
    name: "Nike Sportswear Club Fleece Hoodie",
    description:
      "The Nike Sportswear Club Fleece Hoodie combines classic style with the soft comfort of fleece for an elevated everyday look.",
    price: 65.0,
    imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402d-9efb-be84af0e5e4c/CLUB+FLEECE+HOODIE.png",
    category: "Clothing",
  },
  {
    name: "Nike Air Zoom Pegasus 41",
    description:
      "A responsive satisfying satisfying ride for your everyday run. Reactive ZoomX foam delivers energy return step after step.",
    price: 140.0,
    imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402d-9efb-be84af0e5e4c/AIR+ZOOM+PEGASUS+41.png",
    category: "Shoes",
  },
  {
    name: "Nike Pro Dri-FIT T-Shirt",
    description:
      "Stay cool and dry during intense workouts with the Nike Pro Dri-FIT T-Shirt featuring sweat-wicking technology and a breathable mesh back.",
    price: 35.0,
    imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402d-9efb-be84af0e5e4c/PRO+DRI-FIT+TEE.png",
    category: "Clothing",
  },
  {
    name: "Nike Heritage86 Cap",
    description:
      "A classic six-panel silhouette with an adjustable back closure for a custom fit. The iconic Swoosh is embroidered on the front.",
    price: 28.0,
    imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/350e7f3a-979a-402d-9efb-be84af0e5e4c/HERITAGE86+CAP.png",
    category: "Accessories",
  },
];

async function seed() {
  console.log("🌱 Seeding products...");
  await db.insert(products).values(nikeProducts);
  console.log(`✅ Seeded ${nikeProducts.length} Nike products`);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
