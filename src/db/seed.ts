import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { products, productColors } from "./schema";
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

// Color variants keyed by product name
// Each product gets 2-4 color options with distinct images
const colorVariants: Record<string, { colorName: string; colorHex: string; imageUrl: string }[]> = {
  "Nike Air Max 90": [
    { colorName: "White/Black", colorHex: "#FFFFFF", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/wzitsrb4oucx3mza3ucv/AIR+MAX+90.png" },
    { colorName: "Light Bone", colorHex: "#D8D3C8", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/73e30503-47ca-48ee-aab5-3d3c7527e3e1/AIR+MAX+90.png" },
    { colorName: "Infrared", colorHex: "#FF3B30", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/430c726a-d46d-4fa6-a857-b1e1a9590250/AIR+MAX+90.png" },
  ],
  "Nike Air Force 1 '07": [
    { colorName: "White/White", colorHex: "#FFFFFF", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/AIR+FORCE+1+%2707.png" },
    { colorName: "Black/Black", colorHex: "#1A1A1A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3834ea2b-b33e-4ffa-b6da-bb5e7c8f3c93/AIR+FORCE+1+%2707.png" },
    { colorName: "University Red", colorHex: "#E3263A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a0a300da-2e16-4483-ba64-9815cf0598ac/AIR+FORCE+1+%2707.png" },
    { colorName: "University Blue", colorHex: "#5B9BD5", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/00375837-849e-4032-b448-8a9e5750ac77/AIR+FORCE+1+%2707.png" },
  ],
  "Nike Dunk Low Retro": [
    { colorName: "White/Black", colorHex: "#FFFFFF", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3a96a999-811e-4780-8060-13956483bcfa/NIKE+DUNK+LOW+RETRO.png" },
    { colorName: "Grey Fog", colorHex: "#B0B0B0", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/6e0b6ce7-8e5b-4c52-bb6b-8e5918071e5d/NIKE+DUNK+LOW+RETRO.png" },
    { colorName: "Team Green", colorHex: "#0E6B3D", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/f4156e7f-3257-4e7c-87c1-d4f1f3d43c15/NIKE+DUNK+LOW+RETRO.png" },
  ],
  "Nike Sportswear Tech Fleece Joggers": [
    { colorName: "Black", colorHex: "#1A1A1A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/1b451ef3-701d-4f6f-90f7-82d2aab49a5a/SPORTSWEAR+TECH+FLEECE.png" },
    { colorName: "Dark Grey Heather", colorHex: "#4A4A4A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/df5a0345-f970-4505-81a5-4c8098fcce12/SPORTSWEAR+TECH+FLEECE.png" },
  ],
  "Nike Sportswear Club Fleece Hoodie": [
    { colorName: "Black", colorHex: "#1A1A1A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/81f39867-0bdd-4cc0-92c0-d0bcd7466c91/CLUB+FLEECE+PULLOVER+HOODIE.png" },
    { colorName: "Dark Grey Heather", colorHex: "#4A4A4A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4e9d7e6c-a84d-4b8a-98de-e14fec7c7a1e/CLUB+FLEECE+PULLOVER+HOODIE.png" },
    { colorName: "Sail", colorHex: "#F5F0E6", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/2ccb09ef-f2af-4ea4-b9a0-e28cdadd0260/CLUB+FLEECE+PULLOVER+HOODIE.png" },
  ],
  "Nike Air Zoom Pegasus 41": [
    { colorName: "Black/White", colorHex: "#1A1A1A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/5588bcd0-3e93-4963-8f8e-9bceeda48fa6/PEGASUS+41.png" },
    { colorName: "Wolf Grey", colorHex: "#B0B0B0", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/81bc3137-cbc6-49c0-b4d8-1bd1e8fddf6c/PEGASUS+41.png" },
    { colorName: "Volt", colorHex: "#C8FF00", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c57a85c3-d4c9-47e0-b5fa-f0c8e1fd5310/PEGASUS+41.png" },
  ],
  "Nike Pro Dri-FIT T-Shirt": [
    { colorName: "Black", colorHex: "#1A1A1A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/13cb0306-76d5-4bc0-bc07-fa01ec0e5ce4/PRO+DRI-FIT+TEE.png" },
    { colorName: "White", colorHex: "#FFFFFF", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c35a8c13-f847-4d5e-90e6-ee8cda5bb29e/PRO+DRI-FIT+TEE.png" },
  ],
  "Nike Heritage86 Cap": [
    { colorName: "Black", colorHex: "#1A1A1A", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3bca6b07-5bfd-4b51-86f5-0c31aeef6ac9/HERITAGE86+CAP.png" },
    { colorName: "White", colorHex: "#FFFFFF", imageUrl: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d5e6e5a0-b3ec-4b92-a7ef-65dbfc33928d/HERITAGE86+CAP.png" },
  ],
};

async function seed() {
  console.log("Seeding products...");
  await db.delete(productColors);
  await db.delete(products);

  const inserted = await db.insert(products).values(nikeProducts).returning({ id: products.id, name: products.name });
  console.log(`Seeded ${inserted.length} Nike products`);

  console.log("Seeding color variants...");
  let colorCount = 0;
  for (const product of inserted) {
    const variants = colorVariants[product.name];
    if (variants) {
      await db.insert(productColors).values(
        variants.map((v) => ({
          productId: product.id,
          colorName: v.colorName,
          colorHex: v.colorHex,
          imageUrl: v.imageUrl,
        }))
      );
      colorCount += variants.length;
    }
  }
  console.log(`Seeded ${colorCount} color variants`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
