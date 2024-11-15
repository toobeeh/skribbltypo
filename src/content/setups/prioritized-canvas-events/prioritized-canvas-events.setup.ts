import { Interceptor, type prioritizedCanvasEvents } from "@/content/core/interceptor/interceptor";
import { earlySetup } from "@/content/core/setup/earlySetup.decorator";
import { inject } from "inversify";
import { Setup } from "../../core/setup/setup";

/**
 * Setup that waits until prioritized canvas events are set up in the interceptor
 */
@earlySetup()
export class PrioritizedCanvasEventsSetup extends Setup<prioritizedCanvasEvents> {

  @inject(Interceptor) private readonly _interceptor!: Interceptor;

  protected async runSetup(): Promise<prioritizedCanvasEvents> {
    return this._interceptor.canvasPrioritizedEventsReady;
  }
}