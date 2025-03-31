import { Color } from "@/util/color";
import { GifWriter } from "omggif";

export class GifEncoder {
  private width = 800;
  private height = 600;
  private buffer: Uint8Array;
  private gifWriter: GifWriter;
  private frameCount = 0;
  private colors: Map<string, { color: Color, index: number }>;

  constructor(colorSet: Set<Color>, frameCount: number) {
    this.buffer = new Uint8Array(this.width * this.height * 5 * frameCount);
    this.gifWriter = new GifWriter(this.buffer, this.width, this.height, { loop: 1 });

    const colorToKey = (color: Color) => color.rgbArray.slice(0,3).join(",");

    const white = Color.fromRgb(255, 255, 255);
    this.colors = new Map(
      colorSet.values().map((color, index) => [color.rgbArray.slice(0,3).toString(), { color, index }]),
    );

    if(!this.colors.has(colorToKey(white))){
      this.colors.set(colorToKey(white), { color: white, index: this.colors.size });
    }

    const nextPowerOfTwo = (n: number) => Math.pow(2, Math.ceil(Math.log2(n)));
    const requiredSize = nextPowerOfTwo(this.colors.size);
    if(this.colors.size < requiredSize){
      const fill = new Array(requiredSize - this.colors.size).fill(white);
      fill.forEach((color, index) => {
        this.colors.set(`fill-${index}`, { color, index: this.colors.size });
      });
    }
  }
  
  private get palette(){
    return [...this.colors.values()].map(c => {
      const rgb = c.color.rgbArray;
      return rgb[2] | (rgb[1] << 8) | (rgb[0] << 16);
    });
  }

  private mapToPaletteIndex(color: number[]){
    return this.colors.get(color.toString())?.index ?? 0;
  }

  addFrame(imageData: Uint8ClampedArray, delayMs: number): void {

    const palette = this.palette;
    const indexedPixels = [];
    for(let i = 0; i < imageData.length; i += 4){
      const color = [imageData[i], imageData[i + 1], imageData[i + 2]];
      indexedPixels.push(this.mapToPaletteIndex(color));
    }

    // Add frame to GIF
    this.gifWriter.addFrame(0, 0, this.width, this.height, indexedPixels, {
      delay: delayMs / 10,
      palette: palette,
      disposal: 2
    });

    this.frameCount++;
  }

  finalize(): Blob {
    if (this.frameCount === 0) throw new Error("No frames added to the GIF.");
    const gifData = this.buffer.subarray(0, this.gifWriter.end());
    return new Blob([gifData], { type: "image/gif" });
  }
}
