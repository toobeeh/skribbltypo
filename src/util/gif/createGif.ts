import { Color } from "@/util/color";
import type { CanvasCommandProcessor } from "@/util/gif/canvasCommandProcessor";
import { GifEncoder } from "@/util/gif/gifEncoder";

/**
 * Create a gif from skribbl commands
 * @param processor
 * @param commands
 * @param commandResolution
 * @param frameDelay
 * @param frameCount
 * @param onFrameRendered
 */
export function createGif(processor: CanvasCommandProcessor, commands: number[][], commandResolution: number, frameDelay: number, frameCount: number, onFrameRendered?: (currentIndex: number, totalIndex: number) => void){

  const skribblColorCodes = new Set(commands.map(c => c[1]));
  if(skribblColorCodes.size > 256){
    throw new Error("Too many colors in the skribbl commands to render gif");
  }
  const colorSet = new Set(skribblColorCodes.values().map(c => Color.fromSkribblCode(c)));
  const gifEncoder = new GifEncoder(colorSet, frameCount);

  for(let i = 0; i < commands.length; i++){
    processor.processDrawCommand(commands[i]);
    if(i % commandResolution === 0) {
      const image = processor.exportImage();
      gifEncoder.addFrame(image, frameDelay);
      onFrameRendered?.(i, commands.length);
    }
  }

  gifEncoder.addFrame(processor.exportImage(), 2000);
  return gifEncoder.finalize();
}