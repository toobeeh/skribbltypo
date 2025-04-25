/**
 * Load an image with cross-origin safety, to prevent firefox issues with marking canvas context unsafe when putting image data
 * @param src
 */
export async function crossImage(src: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  await new Promise(resolve => img.onload = resolve);
  return img;
}