// Rebuild the app icons with the same heart symbol as the interface.
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
const destination = new URL("../public/icons/", import.meta.url);
await mkdir(destination, { recursive: true });
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#003f2e"/><g transform="translate(128 128) scale(10.6667)"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" fill="none" stroke="#e8fff3" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
for (const [name, size] of [
  ["icon-192.png", 192],
  ["icon-512.png", 512],
  ["icon-maskable-512.png", 512],
  ["apple-touch-icon.png", 180],
]) {
  await writeFile(
    new URL(name, destination),
    await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer(),
  );
}
