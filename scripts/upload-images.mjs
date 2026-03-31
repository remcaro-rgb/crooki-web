#!/usr/bin/env node
/**
 * Script to upload local product images to Supabase Storage
 * Run AFTER setting up .env.local with your Supabase credentials
 * Usage: node scripts/upload-images.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env
import { config } from "dotenv";
config({ path: join(__dirname, "../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const imageMap = [
  { file: "salted-caramel.jpg", productName: "Caramelo Salado" },
  { file: "pistachio-dream.jpg", productName: "Pistachio Dream" },
  { file: "lotus-biscoff.jpg", productName: "Lotus Biscoff" },
  { file: "milo-bomb.jpg", productName: "Milo Bomb" },
  { file: "red-nutella.jpg", productName: "Red Nutella" },
  { file: "lemon-bliss.jpg", productName: "Lemon Bliss" },
  { file: "red-velvet.jpg", productName: "Red Velvet Cookies and Cream" },
  { file: "oreo-cookies-cream.jpg", productName: "Oreo Cookies and Cream" },
  { file: "chocolate-chips.jpg", productName: "Chocolate Chips" },
  { file: "klim-brigadeiro.jpg", productName: "Klim Brigadeiro" },
];

async function uploadImages() {
  console.log("Starting image upload...\n");

  for (const { file, productName } of imageMap) {
    const imagePath = join(__dirname, "../public/images", file);

    // Find product by name
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id")
      .eq("name_es", productName)
      .single();

    if (productError || !product) {
      console.error(`❌ Product not found: ${productName}`);
      continue;
    }

    // Read file
    let fileBuffer;
    try {
      fileBuffer = readFileSync(imagePath);
    } catch {
      console.error(`❌ Image file not found: ${imagePath}`);
      continue;
    }

    const storagePath = `products/${product.id}/${file}`;
    const contentType = file.endsWith(".jpg") || file.endsWith(".jpeg")
      ? "image/jpeg"
      : "image/png";

    // Upload to storage
    const { data, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error(`❌ Upload failed for ${file}: ${uploadError.message}`);
      continue;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(storagePath);

    // Check if image record already exists
    const { data: existingImg } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", product.id)
      .single();

    if (!existingImg) {
      await supabase.from("product_images").insert({
        product_id: product.id,
        url: publicUrl,
        display_order: 0,
      });
    } else {
      await supabase.from("product_images").update({ url: publicUrl }).eq("product_id", product.id);
    }

    console.log(`✅ ${productName}: ${publicUrl}`);
  }

  console.log("\n✨ Done! All images uploaded.");
}

uploadImages().catch(console.error);
