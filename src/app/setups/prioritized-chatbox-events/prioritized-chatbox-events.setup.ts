import {
  Interceptor,
  type prioritizedChatboxEvents,
} from "@/app/core/interceptor/interceptor";
import { earlySetup } from "@/app/core/setup/earlySetup.decorator";
import { inject } from "inversify";
import { Setup } from "../../core/setup/setup";

/**
 * Setup that waits until prioritized canvas events are set up in the interceptor
 */
@earlySetup()
export class PrioritizedChatboxEventsSetup extends Setup<prioritizedChatboxEvents> {

  @inject(Interceptor) private readonly _interceptor!: Interceptor;

  protected async runSetup(): Promise<prioritizedChatboxEvents> {
    return this._interceptor.chatboxPrioritizedEventsReady;
  }
}