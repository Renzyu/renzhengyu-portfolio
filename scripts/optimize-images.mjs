import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const imageRoot = path.resolve("public/images");
const outputRoot = path.resolve("public/optimized-images");

async function collectWebpFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "raw") files.push(...await collectWebpFiles(fullPath));
    } else if (entry.name.toLowerCase().endsWith(".webp")) {
      files.push(fullPath);
    }
  }

  return files;
}

const files = await collectWebpFiles(imageRoot);
let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const before = (await fs.stat(file)).size;
  const relativePath = path.relative(imageRoot, file);
  const outputFile = path.join(outputRoot, relativePath);
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  const image = sharp(file, { failOn: "none" });
  const metadata = await image.metadata();

  let pipeline = image.rotate();
  if ((metadata.width ?? 0) > 2560) {
    pipeline = pipeline.resize({ width: 2560, withoutEnlargement: true });
  }

  await pipeline
    .webp({ quality: 80, alphaQuality: 85, effort: 5, smartSubsample: true })
    .toFile(outputFile);

  const after = (await fs.stat(outputFile)).size;
  totalBefore += before;
  totalAfter += after;
  console.log(`${relativePath}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}

console.log(`Optimized ${files.length} images: ${(totalBefore / 1024 / 1024).toFixed(1)}MB -> ${(totalAfter / 1024 / 1024).toFixed(1)}MB`);
