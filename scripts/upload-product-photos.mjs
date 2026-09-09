/**
 * Create public product-photos bucket and upload catalog JPGs.
 * Does not print secrets.
 */
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const require = createRequire(import.meta.url);

function loadEnvLocal() {
  const raw = readFileSync(resolve(root, ".env.local"), "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq < 0) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(url, key);

const BUCKET = "product-photos";
const photoDir = resolve(root, "public/products/photos");

const required = [
  "product-panda-1.jpg",
  "product-koala-1.jpg",
  "product-red-panda-1.jpg",
  "product-sloth-1.jpg",
];

const allProductJpgs = readdirSync(photoDir).filter(
  (f) => f.startsWith("product-") && f.endsWith(".jpg"),
);
const files = [...new Set([...required, ...allProductJpgs])];

async function ensureBucket() {
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  if (listErr) throw listErr;
  const exists = (buckets || []).some((b) => b.name === BUCKET);
  if (exists) {
    console.log(JSON.stringify({ bucket: BUCKET, created: false, existed: true }));
    // ensure public
    const { error: updErr } = await supabase.storage.updateBucket(BUCKET, {
      public: true,
    });
    if (updErr) console.log(JSON.stringify({ updateBucketWarning: updErr.message }));
    return;
  }
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024,
    allowedMimeTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  });
  if (error) throw error;
  console.log(JSON.stringify({ bucket: BUCKET, created: true }));
}

async function uploadAll() {
  const results = [];
  for (const file of files) {
    const buf = readFileSync(resolve(photoDir, file));
    const { error } = await supabase.storage.from(BUCKET).upload(file, buf, {
      contentType: "image/jpeg",
      upsert: true,
      cacheControl: "31536000",
    });
    if (error) {
      results.push({ file, ok: false, error: error.message });
    } else {
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(file);
      results.push({ file, ok: true, publicUrl: data.publicUrl });
    }
  }
  return results;
}

await ensureBucket();
const uploads = await uploadAll();
console.log(JSON.stringify({ uploaded: uploads.length, results: uploads }, null, 2));

const sample = `${url}/storage/v1/object/public/${BUCKET}/product-panda-1.jpg`;
const res = await fetch(sample, { method: "GET" });
console.log(JSON.stringify({ verifyUrl: sample, status: res.status }));
