import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { ImageResetEventListener } from "@/content/events/image-reset.event";
import { LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { type stickyToastHandle, ToastService } from "@/content/services/toast/toast.service";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { inject } from "inversify";
import {
  BehaviorSubject,
  combineLatestWith, distinctUntilChanged, filter, map, mergeWith,
  pairwise,
  type Subscription, tap,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";

export class CanvasZoomFeature extends TypoFeature {

  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(PrioritizedCanvasEventsSetup) private readonly _prioritizedCanvasEventsSetup!: PrioritizedCanvasEventsSetup;
  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(ImageResetEventListener) private readonly _imageResetEventListener!: ImageResetEventListener;

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
  private _zoomActive$ = new BehaviorSubject<[number, number] | false>(false);
  private _zoomLevel$ = new BehaviorSubject<number>(1);
  private _toastHandle?: stickyToastHandle;
  private _zoomStateSubscription?: Subscription;
  private _zoomStyle?: CSSStyleSheet;

  private readonly _canvasClickListener = this.onCanvasClick.bind(this);

  protected override async onActivate() {
    const { add } =  await this._prioritizedCanvasEventsSetup.complete();
    add("pointerdown", this._canvasClickListener);

    this._zoomStyle = new CSSStyleSheet();
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, this._zoomStyle];

    /* pipe that combines manual enable/disable with events that trigger disable */
    const zoomActivePipe$ = this._zoomActive$.pipe(

      mergeWith(
        /* reset when drawing started / ended */
        this._lobbyStateChangedEventListener.events$.pipe(
          filter(
            (event) =>
              event.data.drawingRevealed !== undefined ||
              event.data.drawingStarted !== undefined,
          ),
          map(() => "reset" as const),
        ),

        /* reset drawing on clear */
        this._imageResetEventListener.events$.pipe(
          filter((event) => event.data === 0),
          map(() => "reset" as const),
        ),
      ),

      /* emit to source if reset detected */
      tap(data => {
        if (data === "reset") {
          this._zoomActive$.next(false);
          this._logger.info("Resetting zoom state");
        }
      }),

      /* map reset signal out */
      filter(data => data !== "reset"),
      distinctUntilChanged(),

      tap(active => this._logger.info("Zoom active state", active))
    );

    this._zoomStateSubscription = this._zoomListenToggle$.pipe(
      combineLatestWith(zoomActivePipe$, this._zoomLevel$),
      pairwise()
    ).subscribe(state => this.processZoomStateUpdate(state));
  }

  protected override async onDestroy() {
    const { remove } = await this._prioritizedCanvasEventsSetup.complete();
    remove("pointerdown", this._canvasClickListener);

    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== this._zoomStyle);
    this._zoomStyle = undefined;

    this._toastHandle?.close();
    this._zoomStateSubscription?.unsubscribe();
    this._zoomStateSubscription = undefined;
    this._toastHandle = undefined;
  }

  private async setZoom(level: number | undefined, position: [number, number] | undefined){
    this._logger.debug("Setting zoom level", level);

    const sheet = this._zoomStyle;
    if(!sheet) {
      this._logger.error("Zoom style element not found");
      return;
    }

    if(level === undefined || position === undefined) {
      await sheet.replace("");
      return;
    }

    await sheet.replace(`
      #game-canvas:after {
        width: 800px;
        aspect-ratio: 8/6;
        pointer-events: none;
        background: transparent;
        content: '';
      }
   
      #game-canvas canvas {
        position: absolute;
        width: calc(${level * 2} * 100%);
        top: calc(-100% * (${position[1]} / 600 * ${level * 2 - 1}));
        left: calc(-100% * (${position[0]} / 800 * ${level * 2 - 1}));
      }
    `);
  }

  private onCanvasClick(event: MouseEvent){
    this._logger.debug("Canvas clicked", event);
    if(this._zoomListenToggle$.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const next = this._zoomActive$.value === false;
      if(next) this._zoomLevel$.next(1);
      this._zoomActive$.next(next ? [event.offsetX , event.offsetY] : false);
    }
  }

  private async processZoomStateUpdate([[prevListening, prevActive, prevLevel], [listening, active, level]]: [[boolean, false | [number, number], number], [boolean, false | [number, number], number]]){
    this._logger.debug("Zoom state processing", { prevListening, prevActive, prevLevel }, { listening, active, level }, this._toastHandle);

    /* update canvas element */
    await this.setZoom(active !== false ? level : undefined, active !== false ? active : undefined);

    /* if not active and not yet changed, but listening, and previously not listening show toast with initial message */
    if(active === false && prevActive === false && listening && !prevListening) {
      if(this._toastHandle !== undefined){
        this._logger.warn("Toast handle unexpected existing when not active and listening");
        this._toastHandle.close();
      }
      this._toastHandle = await this._toastService.showStickyToast("Starting Zoom", "Click on the canvas to start zooming");
    }

    /* if stopped listening and not active (not entered), or not active changed and toast existent, remove toast */
    else if(!listening && prevListening && active === false && prevActive === false || active === false && prevActive !== false) {
      if(!this._toastHandle && active === false && prevActive !== false) {
        this._logger.warn("Toast handle unexpected not existing when ended active", { listening, active, level });
      }
      this._toastHandle?.close();
      this._toastHandle = undefined;
    }

    /* if active and not yet changed and listening and previously not listening, show hint to stop zooming */
    else if(active !== false && prevActive !== false && listening && !prevListening){
      if(this._toastHandle === undefined){
        this._logger.error("Toast handle unexpected not existing when active and listening");
        return;
      }
      this._toastHandle.update("Stopping Zoom", "Click on the canvas to exit zooming");
    }

    /* if active show zoom level message */
    else if(active !== false){
      if(this._toastHandle === undefined){ /* when zoom is re-triggered without releasing hotkey*/
        this._toastHandle = await this._toastService.showStickyToast("Starting Zoom", "Click on the canvas to start zooming");
      }
      this._toastHandle.update("Canvas Zoom Active", `Current zoom level: ${level}`);
    }

    else if(!listening && this._toastHandle !== undefined){
      this._logger.warn("Toast handle unexpected existing when in inactive catch-all state");
      this._toastHandle.close();
      this._toastHandle = undefined;
    }
  }
}