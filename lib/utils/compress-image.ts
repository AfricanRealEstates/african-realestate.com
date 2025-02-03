import sharp from "sharp";

async function compressImage(file: File): Promise<Buffer> {
  const buffer = await file.arrayBuffer();
  const sharpImage = sharp(buffer);
  const metadata = await sharpImage.metadata();

  // Resize if the image is larger than 2000x2000
  if (metadata.width && metadata.width > 2000) {
    sharpImage.resize(2000);
  }

  return sharpImage
    .webp({ quality: 80 }) // Convert to WebP format with 80% quality
    .toBuffer();
}
export { compressImage };
