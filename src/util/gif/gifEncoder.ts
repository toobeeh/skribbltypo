import { applyPaletteSync, buildPaletteSync, utils as imageqUtils } from "image-q";
import { GifWriter } from "omggif";

export class GifEncoder {
  private width = 800;
  private height = 600;
  private buffer: Uint8Array;
  private gifWriter: GifWriter;
  private frameCount = 0;

  constructor() {
    this.buffer = new Uint8Array(0);
    this.gifWriter = new GifWriter([], this.width, this.height, { loop: 0 });
  }

  private ensureBufferSize(requiredSize: number): void {
    if (this.buffer.length < requiredSize) {
      const newBuffer = new Uint8Array(requiredSize * 2);
      newBuffer.set(this.buffer);
      this.buffer = newBuffer;
      this.gifWriter = new GifWriter(this.buffer, this.width, this.height, { loop: 0 });
    }
  }

  addFrame(imageData: Uint8ClampedArray, delay: number): void {
    // Convert RGBA to RGB (drop alpha)
    const rgbData = new Uint8Array(this.width * this.height * 3);
    for (let i = 0, j = 0; i < imageData.length; i += 4, j += 3) {
      rgbData[j] = imageData[i];      // Red
      rgbData[j + 1] = imageData[i + 1]; // Green
      rgbData[j + 2] = imageData[i + 2]; // Blue
    }

    // Perform color quantization to get a 256-color palette
    const container = imageqUtils.PointContainer.fromUint8Array(rgbData, this.width, this.height);
    const palette = buildPaletteSync([container], {
      colors: 256,
      colorDistanceFormula: "euclidean",
      paletteQuantization: "neuquant",
    });
    const appliedContainer = applyPaletteSync(container, palette);
    const indexedPixels = [...appliedContainer.toUint8Array()];
    const paletteColors = appliedContainer.getPointArray().map((point) => point.rgba.slice(0, 3)).flat();


    // Ensure buffer size before adding frame
    this.ensureBufferSize(this.gifWriter.end() + this.width * this.height);

    // Add frame to GIF
    this.gifWriter.addFrame(0, 0, this.width, this.height, indexedPixels, {
      delay,
      palette: paletteColors
    });

    this.frameCount++;
  }

  finalize(): Blob {
    if (this.frameCount === 0) throw new Error("No frames added to the GIF.");
    const gifData = this.buffer.subarray(0, this.gifWriter.end());
    return new Blob([gifData], { type: "image/gif" });
  }
}
