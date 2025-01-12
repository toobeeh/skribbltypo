import { CanvasClearedEventListener } from "@/content/events/canvas-cleared.event";
import { TypoChallenge } from "@/content/features/toolbar-challenges/challenge";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { inject } from "inversify";
import {
  type Observable,
  of, type Subscription,
} from "rxjs";

export class DontClearChallenge extends TypoChallenge<boolean> {

  @inject(CanvasClearedEventListener) private readonly _canvasClearedEvent!: CanvasClearedEventListener;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  private _style?: CSSStyleSheet;
  private _canvasClearedSubscription?: Subscription;

  readonly name = "Dont Clear";
  readonly description = "The canvas cannot be cleared; you draw over other previous drawings.";

  createTriggerObservable(): Observable<boolean> {
    return of(true);
  }

  async apply(trigger: boolean): Promise<void> {

    if(!trigger) return;

    /* hide undo and clear */
    this._style = new CSSStyleSheet();
    this._style.insertRule(".tool[data-tooltip='Undo'], .tool[data-tooltip='Clear'] { display: none }");
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, this._style];

    /* listen for canvas clear and restore image */
    this._canvasClearedSubscription = this._canvasClearedEvent.events$.subscribe(async (event) => {
      await this._drawingService.drawImage(event.data);
    });

    await this._toastService.showToast("Don't Clear active", "Attention: Your drawings will look different (likely as nonsense) for other people!");
  }

  destroy(): void {
    if(this._style) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(style => style !== this._style);
      this._style = undefined;
    }
    this._canvasClearedSubscription?.unsubscribe();
  }
}