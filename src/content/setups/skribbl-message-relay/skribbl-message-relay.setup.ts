import { type Observable, Subject } from "rxjs";
import { earlySetup } from "../../core/setup/earlySetup.decorator";
import { Setup } from "../../core/setup/setup";

export interface messageRelay {
  serverMessages$: Observable<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  insertMessage: (message: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * Setup that waits until the game js has been patched
 */
@earlySetup()
export class SkribblMessageRelaySetup extends Setup<messageRelay> {
  protected async runSetup(): Promise<messageRelay> {
    return new Promise((resolve) => {
      window.addEventListener("message", (data) => {
        if (data.data === "skribblMessagePort") {
          const ports = data.ports;
          if(ports.length === 0) return;

          const observable = new Subject<any>(); // eslint-disable-line @typescript-eslint/no-explicit-any
          ports[0].onmessage = (message) => {

            /* log everything except draw commands */
            if(message.data.id !== 19) {
              this._logger.debug("Received message", message.data);
            }

            observable.next(message.data);
          };
          resolve({
            serverMessages$: observable,
            insertMessage: (message) => ports[0].postMessage(message)
          });
        }
      });
    });
  }
}