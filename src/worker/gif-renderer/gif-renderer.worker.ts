import { CanvasCommandProcessor } from "@/util/gif/canvasCommandProcessor";
import { createGif } from "@/util/gif/createGif";
import { TypedWorker, type TypedWorkerDefinition } from "@/worker/typed-worker";

/**
 * Worker api definition
 */
export interface IGifRendererWorker extends TypedWorkerDefinition  {
  renderGif(commands: number[][], duration: number): Blob;
}

/**
 * Parent callback definition
 */
export interface IGifRendererParent extends TypedWorkerDefinition {
  frameRendered(frameIndex: number, totalFrames: number): void;
}

/**
 * Worker api implementation
 */
export const gifRendererWorker: IGifRendererWorker = {
  renderGif(commands: number[][], duration: number) {
    console.log("Rendering gif", commands, duration);
    const offscreenCanvas = new OffscreenCanvas(800, 600);
    const context = offscreenCanvas.getContext("2d", {willReadFrequently: true});
    if(!context) throw new Error("Failed to get 2d context");
    const processor = new CanvasCommandProcessor(context);

    const frameDelay = 50;
    const frameCount = Math.ceil(duration / frameDelay);
    const commandResolution = Math.max(1,Math.floor(commands.length / frameCount));

    const gif = createGif(processor, commands, commandResolution, frameDelay, frameCount, (frameIndex, totalFrames) => parent.send("frameRendered", frameIndex, totalFrames));
    return gif;
  }
};

/* run worker when file is loaded */
const parent = new TypedWorker<IGifRendererWorker, IGifRendererParent>(gifRendererWorker);