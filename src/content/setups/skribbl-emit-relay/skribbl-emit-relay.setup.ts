import { type Observable, Subject } from "rxjs";
import { earlySetup } from "../../core/setup/earlySetup.decorator";
import { Setup } from "../../core/setup/setup";

/**
 * Setup that waits until the message emit relay has been set up
 */
@earlySetup()
export class SkribblEmitRelaySetup extends Setup<Observable<{event: string, data: any}>> {  // eslint-disable-line @typescript-eslint/no-explicit-any
  protected async runSetup(): Promise<Observable<{event: string, data: any}>> { // eslint-disable-line @typescript-eslint/no-explicit-any
    return new Promise<Subject<{   event: string, data: any }>>((resolve) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      window.addEventListener("message", (data) => {
        if (data.data === "skribblEmitPort") {
          const ports = data.ports;
          if(ports.length === 0) return;

          const observable = new Subject<{event: string, data: any}>(); // eslint-disable-line @typescript-eslint/no-explicit-any
          ports[0].onmessage = (message) => {

            /*this._logger.debug("Sent message", message.data);*/
            observable.next({event: message.data[0], data: message.data[1]});
          };
          resolve(observable);
        }
      });
    });
  }
}