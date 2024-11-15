import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { Interceptor } from "@/content/core/interceptor/interceptor";
import { type stickyToastHandle, ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { inject } from "inversify";
import {
  BehaviorSubject,
  combineLatestWith,
  pairwise,
  type Subscription
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";

export class CanvasZoomFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(Interceptor) private readonly _interceptor!: Interceptor;
  @inject(PrioritizedCanvasEventsSetup) private readonly _prioritizedCanvasEventsSetup!: PrioritizedCanvasEventsSetup;

  public readonly name = "Canvas Zoom";
  public readonly description = "Lets you zoom a section of the canvas when you're drawing";
  public readonly featureId = 26;

  private readonly _startZoomHotkey = this.useHotkey(new HotkeyAction(
    "start_zoom",
    "Start Zoom",
    "While pressed, a click on the canvas will start zooming",
    this,
    () => this._zoomListenToggle$.next(true),
    true,
    ["ControlLeft"],
    () => this._zoomListenToggle$.next(false)
  ));

  private readonly _zoomLevelHotkeys = [1,2,3,4,5].map(level => this.useHotkey(new HotkeyAction(
    `zoom_level_${level}`,
    `Zoom Level ${level}`,
    `Set the zoom level to ${level}`,
    this,
    () => this._zoomLevel$.next(level),
    true,
    [`Digit${level}`],
  )));

  private _zoomListenToggle$ = new BehaviorSubject<boolean>(false);
  private _zoomActive$ = new BehaviorSubject<boolean>(false);
  private _zoomLevel$ = new BehaviorSubject<number>(1);
  private _toastHandle?: stickyToastHandle;
  private _zoomToggleSubscription?: Subscription;

  private readonly _canvasClickListener = this.onCanvasClick.bind(this);

  protected override async onActivate() {
    const { add } =  await this._prioritizedCanvasEventsSetup.complete();
    add("pointerdown", this._canvasClickListener);

    this._zoomToggleSubscription = this._zoomListenToggle$.pipe(
      combineLatestWith(this._zoomActive$, this._zoomLevel$),
      pairwise()
    ).subscribe(state => this.processZoomStateUpdate(state));
  }

  protected override async onDestroy() {
    const { remove } = await this._prioritizedCanvasEventsSetup.complete();
    remove("pointerdown", this._canvasClickListener);

    this._toastHandle?.close();
    this._zoomToggleSubscription?.unsubscribe();
    this._zoomToggleSubscription = undefined;
    this._toastHandle = undefined;
  }

  private setZoom(level: number | undefined){
    this._logger.debug("Setting zoom level", level);
  }

  private onCanvasClick(event: MouseEvent){
    this._logger.debug("Canvas clicked", event);
    if(this._zoomListenToggle$.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const next = !this._zoomActive$.value;
      if(next) this._zoomLevel$.next(1);
      this._zoomActive$.next(next);
    }
  }

  private async processZoomStateUpdate([[prevListening, prevActive, prevLevel], [listening, active, level]]: [[boolean, boolean, number], [boolean, boolean, number]]){
    this._logger.debug("Zoom state processing", { prevListening, prevActive, prevLevel }, { listening, active, level }, this._toastHandle);

    /* update canvas element */
    this.setZoom(active ? level : undefined);

    /* if not active and not yet changed, but listening, and previously not listening show toast with initial message */
    if(!active && !prevActive && listening && !prevListening) {
      if(this._toastHandle !== undefined){
        this._logger.warn("Toast handle unexpected existing when not active and listening");
        this._toastHandle.close();
      }
      this._toastHandle = await this._toastService.showStickyToast("Starting Zoom", "Click on the canvas to start zooming");
    }

    /* if stopped listening and not active (not entered), or not active changed and toast existent, remove toast */
    else if(!listening && prevListening && !active && !prevActive || !active && prevActive) {
      if(!this._toastHandle && !active && prevActive) {
        this._logger.warn("Toast handle unexpected not existing when ended active", { listening, active, level });
      }
      this._toastHandle?.close();
      this._toastHandle = undefined;
    }

    /* if active and not yet changed and listening and previously not listening, show hint to stop zooming */
    else if(active && prevActive && listening && !prevListening){
      if(this._toastHandle === undefined){
        this._logger.error("Toast handle unexpected not existing when active and listening");
        return;
      }
      this._toastHandle.update("Stopping Zoom", "Click on the canvas to exit zooming");
    }

    /* if active show zoom level message */
    else if(active){
      if(this._toastHandle === undefined){
        this._logger.error("Toast handle unexpected not existing when active and not listening");
        return;
      }
      this._toastHandle.update("Canvas Zoom Active", `Current zoom level: ${level}`);
    }
  }
}