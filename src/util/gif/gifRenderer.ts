import { CanvasCommandProcessor } from "@/util/gif/canvasCommandProcessor";
import { GifEncoder } from "@/util/gif/gifEncoder";

self.onmessage = message => {
  const { data } = message;
  if(!Array.isArray(data.commands)) throw new Error("Invalid command array data");
  if(typeof data.duration !== "number") throw new Error("Invalid duration data");

  const commands: number[][] = message.data;
  const offscreenCanvas = new OffscreenCanvas(800, 600);
  const context = offscreenCanvas.getContext("2d");
  if(!context) throw new Error("Failed to get 2d context");
  const processor = new CanvasCommandProcessor(context);

  const frameDelay = 50;
  const duration: number = data.duration;
  const frameCount = Math.ceil(duration / frameDelay);
  const commandResolution = commands.length / frameCount;

  const gif = createGif(processor, commands, commandResolution, frameDelay);
  self.postMessage(gif);
};

function createGif(processor: CanvasCommandProcessor, commands: number[][], commandResolution: number, frameDelay: number){
  const gifEncoder = new GifEncoder();

  for(let i = 0; i < commands.length; i++){
    processor.processDrawCommand(commands[i]);
    if(i % commandResolution === 0) {
      gifEncoder.addFrame(processor.exportImage(), frameDelay);
    }
  }

  gifEncoder.addFrame(processor.exportImage(), 2000);
  return gifEncoder.finalize();
}


