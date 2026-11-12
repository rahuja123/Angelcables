// Downloads the site's source images once and converts them to WebP at two widths.
// Output: public/images/<name>.webp (1000px) and public/images/<name>-480.webp (cards).
// Re-run with `npm run images` whenever a source image changes.
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCES = {
  "armoured-cable": "https://productimages.withfloats.com/actual/68e49c9aed06f3bbb445df55.jpg",
  "armoured-cable-3-core": "https://productimages.withfloats.com/actual/68e49bf05c295f6c8beebf4e.jpg",
  "armoured-cable-4-core": "https://productimages.withfloats.com/actual/68e4995b1a14f21bee4f1cc3.png",
  "copper-armoured-cable": "https://productimages.withfloats.com/actual/68e49a12b575d00c5aa771b6.jpg",
  "flexible-cable": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
  "house-wire": "https://productimages.withfloats.com/actual/68e4a12956522870096e857a.png",
  "cctv-cable": "https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png",
  "submersible-cable": "https://fpimages.withfloats.com/actual/68e60002327a323aaf2eb218.png",
  "factory-floor": "https://fpimages.withfloats.com/actual/68b915ab3266bc661dcc5cf9.jpg",
  "factory-products": "https://fpimages.withfloats.com/actual/68b915aa6419ae333fe058c5.jpg",
  "cable-stock": "https://fpimages.withfloats.com/actual/68e600010404a0aef863739c.jpg",
  // Local originals (paths relative to web/)
  "angel-product-range": "assets/angel-product-range.webp",
  "angel-armoured-4-core-copper": "assets/angel-armoured-4-core-copper.webp",
  "angel-flexible-2-core": "assets/angel-flexible-2-core.webp",
  "angel-bare-copper-wire": "assets/angel-bare-copper-wire.webp",
  "angel-submersible-flat-3-core": "assets/angel-submersible-flat-3-core.webp",
  "angel-cat6-cable": "assets/angel-cat6-cable.webp",
  "angel-cat6-cable-alt": "assets/angel-cat6-cable-alt.webp",
  "angel-telephone-cable": "assets/angel-telephone-cable.webp",
  "angel-telephone-cable-alt": "assets/angel-telephone-cable-alt.webp",
  "angel-house-wire-blue": "assets/angel-house-wire-blue.webp",
  "angel-house-wire-black": "assets/angel-house-wire-black.webp",
  "angel-house-wire-yellow": "assets/angel-house-wire-yellow.webp",
  "angel-cctv-combo-cable": "assets/angel-cctv-combo-cable.webp",
};

const OUT_DIR = path.join(process.cwd(), "public", "images");
await mkdir(OUT_DIR, { recursive: true });

const manifest = {};
for (const [name, url] of Object.entries(SOURCES)) {
  let input;
  if (/^https?:\/\//.test(url)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status} for ${url}`);
    input = Buffer.from(await res.arrayBuffer());
  } else {
    input = await readFile(path.join(process.cwd(), url));
  }
  const meta = await sharp(input).metadata();

  for (const [suffix, width] of [["", 1000], ["-480", 480]]) {
    const out = path.join(OUT_DIR, `${name}${suffix}.webp`);
    const info = await sharp(input)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 72, effort: 6, smartSubsample: true })
      .toFile(out);
    if (suffix === "") manifest[name] = { width: info.width, height: info.height };
  }
  console.log(`${name}: ${meta.format} ${meta.width}x${meta.height} ${(input.length / 1024).toFixed(0)}KB -> webp`);
}

await writeFile(
  path.join(process.cwd(), "src", "data", "image-sizes.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);
console.log("Wrote src/data/image-sizes.json");
