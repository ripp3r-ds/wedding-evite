/**
 * Re-encodes the couple portraits from PNG to WebP, and makes one JPEG for the
 * social link preview.
 *
 * The photographs were committed as lossless PNGs at roughly 1.7 MB each, which
 * is about 1.6 bytes per pixel: fine for line art, very wasteful for a
 * photograph. Over a phone connection the four of them were the bulk of the
 * page weight.
 *
 * Pixel dimensions are left alone. The crops in WeddingPortrait are tuned
 * against the 848x1264 source (see AGENTS.md), and the ovals scale the photo up
 * via the zoom prop, so throwing resolution away would soften the faces.
 *
 * Run with: node scripts/optimize-images.mjs
 */
import { readdir, stat, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const COUPLE_DIR = path.join(process.cwd(), "public", "images", "couple");

// WhatsApp and friends are unreliable with WebP in link previews, so the
// social image stays a JPEG even though the site itself uses WebP.
const OG_SOURCE = "opening";
const OG_OUTPUT = "opening-og.jpg";

async function kb(file) {
  return Math.round((await stat(file)).size / 1024);
}

async function main() {
  const entries = await readdir(COUPLE_DIR);
  const pngs = entries.filter((name) => name.endsWith(".png"));

  if (pngs.length === 0) {
    console.log("No PNGs left to convert.");
    return;
  }

  let before = 0;
  let after = 0;

  for (const name of pngs) {
    const source = path.join(COUPLE_DIR, name);
    const target = path.join(COUPLE_DIR, name.replace(/\.png$/, ".webp"));

    const sourceKb = await kb(source);
    before += sourceKb;

    await sharp(source)
      .webp({ quality: 82, effort: 6 })
      .toFile(target);

    const targetKb = await kb(target);
    after += targetKb;

    console.log(`${name}: ${sourceKb} KB -> ${path.basename(target)}: ${targetKb} KB`);

    if (name === `${OG_SOURCE}.png`) {
      const ogTarget = path.join(COUPLE_DIR, OG_OUTPUT);
      await sharp(source).jpeg({ quality: 82, mozjpeg: true }).toFile(ogTarget);
      console.log(`${name}: -> ${OG_OUTPUT}: ${await kb(ogTarget)} KB (link preview)`);
    }
  }

  for (const name of pngs) {
    await unlink(path.join(COUPLE_DIR, name));
  }

  console.log(`\nTotal: ${before} KB -> ${after} KB`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
