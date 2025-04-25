import { CanvasClearedEventListener } from "@/app/events/canvas-cleared.event";
import { TypoChallenge } from "@/app/features/toolbar-challenges/challenge";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { createStylesheet, type stylesheetHandle } from "@/util/document/applyStylesheet";
import { inject } from "inversify";
import {
  type Observable,
  of, type Subscription,
} from "rxjs";

export class DontClearChallenge extends TypoChallenge<boolean> {

  @inject(CanvasClearedEventListener) private readonly _canvasClearedEvent!: CanvasClearedEventListener;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  private _style?: stylesheetHandle;
  private _canvasClearedSubscription?: Subscription;

  readonly name = "Dont Clear";
  readonly description = "The canvas cannot be cleared; you draw over other previous drawings.";

  createTriggerObservable(): Observable<boolean> {
    return of(true);
  }

  async apply(trigger: boolean): Promise<void> {

    if(!trigger) return;

    /* hide undo and clear */
    this._style = createStylesheet();
    this._style.sheet.insertRule(".tool[data-tooltip='Undo'], .tool[data-tooltip='Clear'] { display: none }");

    /* listen for canvas clear and restore image */
    this._canvasClearedSubscription = this._canvasClearedEvent.events$.subscribe(async (event) => {
      await this._drawingService.drawImage(event.data);
    });

    await this._toastService.showToast("Don't Clear active", "Attention: Your drawings will look different (likely as nonsense) for other people!");
  }

  destroy(): void {
    if(this._style) {
      this._style.remove();
      this._style = undefined;
    }
    this._canvasClearedSubscription?.unsubscribe();
  }
}