import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { ImageResetEventListener } from "@/content/events/image-reset.event";
import { LobbyLeftEventListener } from "@/content/events/lobby-left.event";
import { LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { type stickyToastHandle, ToastService } from "@/content/services/toast/toast.service";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { inject } from "inversify";
import {
  BehaviorSubject,
  combineLatestWith, distinctUntilChanged, filter, mergeWith,
  pairwise,
  type Subscription, take, tap, withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import CanvasZoomInfo from "./canvas-zoom-info.svelte";

export class CanvasZoomFeature extends TypoFeature {

  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(PrioritizedCanvasEventsSetup) private readonly _prioritizedCanvasEventsSetup!: PrioritizedCanvasEventsSetup;
  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEventListener!: LobbyLeftEventListener;
  @inject(ImageResetEventListener) private readonly _imageResetEventListener!: ImageResetEventListener;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public override get featureInfoComponent(): componentData<CanvasZoomInfo> {
    return {componentType: CanvasZoomInfo, props: { }};
  }

  public readonly name = "Canvas Zoom";
  public readonly description = "Lets you zoom a section of the canvas when you're drawing";
  public readonly featureId = 26;

  private readonly _enableOnlyWhenDrawingSetting = this.useSetting(new BooleanExtensionSetting("trigger_require_drawing", true, this)
    .withName("Zoom Only When Drawing")
    .withDescription("Only allow start zooming with the hotkey when you're currently drawing"));

  private readonly _toggleZoomHotkey = this.useHotkey(new HotkeyAction(
    "toggle_zoom",
    "Toggle Zoom",
    "Toggles canvas zooming on or off",
    this,
    () => {
      this._currentMouseoverCoordinates$.pipe(
        combineLatestWith(this._zoomActive$, this._enableOnlyWhenDrawingSetting.changes$, this._lobbyService.lobby$),
        take(1),
      ).subscribe(([coords, active, onlyWhenDrawing, lobby]) => {
        if(onlyWhenDrawing && (lobby === null || lobby.drawerId !== lobby.meId)) {
          this._zoomActive$.next(false);
        }
        else {
          this._zoomActive$.next((active !== false || coords === null) ? false : coords);
        }
      });
    },
    true,
    ["ControlLeft"]
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

  private _currentMouseoverCoordinates$ = new BehaviorSubject<[number, number] | null>(null);
  private _zoomActive$ = new BehaviorSubject<[number, number] | false>(false);
  private _zoomLevel$ = new BehaviorSubject<number>(1);
  private _toastHandle?: stickyToastHandle;
  private _zoomStateSubscription?: Subscription;
  private _zoomResetSubscription?: Subscription;
  private _zoomStyle?: CSSStyleSheet;

  private readonly _canvasPointermoveListener = this.onCanvasPointermove.bind(this);
  private readonly _canvasPointeroutListener = this.onCanvasPointerout.bind(this);

  protected override async onActivate() {
    const { add } =  await this._prioritizedCanvasEventsSetup.complete();
    add("postDraw")("pointermove", this._canvasPointermoveListener);
    add("postDraw")("pointerout", this._canvasPointeroutListener);

    this._zoomStyle = new CSSStyleSheet();
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, this._zoomStyle];

    /* reset zoom */
    this._zoomResetSubscription = this._imageResetEventListener.events$.pipe( /* on image clear */
      mergeWith(
        this._lobbyStateChangedEventListener.events$.pipe( /* when drawing revealed or started */
          filter(
            (event) =>
              event.data.drawingRevealed !== undefined ||
              event.data.drawingStarted !== undefined,
          )
        ),
        this._lobbyLeftEventListener.events$ /* when leaving the lobby */
      )
    ).subscribe(() => {
      this._zoomActive$.next(false);
    });

    this._zoomStateSubscription = this._zoomActive$.pipe(
      distinctUntilChanged(),
      combineLatestWith(this._zoomLevel$),
      pairwise()
    ).subscribe(state => this.processZoomStateUpdate(state));
  }

  protected override async onDestroy() {
    const { remove } = await this._prioritizedCanvasEventsSetup.complete();
    remove("pointermove", this._canvasPointermoveListener);
    remove("pointerout", this._canvasPointeroutListener);

    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(s => s !== this._zoomStyle);
    this._zoomStyle = undefined;

    this._toastHandle?.close();
    this._zoomStateSubscription?.unsubscribe();
    this._zoomResetSubscription?.unsubscribe();
    this._zoomStateSubscription = undefined;
    this._zoomResetSubscription = undefined;
    this._toastHandle = undefined;
    this._zoomActive$.next(false);
    this._currentMouseoverCoordinates$.next(null);
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
      #game-canvas {
        width: 800px;
        aspect-ratio: 8/6;
      }
   
      #game-canvas canvas {
        position: absolute;
        width: calc(${level * 2} * 100%);
        top: calc(-100% * (${position[1]} / 600 * ${level * 2 - 1}));
        left: calc(-100% * (${position[0]} / 800 * ${level * 2 - 1}));
      }
    `);
  }

  private onCanvasPointermove(event: MouseEvent){
     if(this._zoomActive$.value === false) this._currentMouseoverCoordinates$.next([event.offsetX, event.offsetY]);
  }

  private onCanvasPointerout(){
    this._currentMouseoverCoordinates$.next(null);
  }

  private async processZoomStateUpdate([[prevState, prevLevel], [state, level]]: [[false | [number, number], number], [false | [number, number], number]]){
    this._logger.debug("Zoom state processing", {prevState, prevLevel}, {state, level}, this._toastHandle);

    /* update canvas element */
    await this.setZoom(state !== false ? level : undefined, state !== false ? state : undefined);

    /* if just triggered, show toast */
    if(state !== false && prevState === false){
      if(this._toastHandle !== undefined){
        this._logger.warn("Toast handle unexpected existing when just triggered");
        this._toastHandle.close();
      }
      this._toastHandle = await this._toastService.showStickyToast("Canvas zoom", "Click one of the zoom level hotkeys to set the zoom level");
    }

    /* if just stopped, remove toast */
    if(state === false && prevState !== false){
      if(this._toastHandle === undefined){
        this._logger.warn("Toast handle unexpected not existing when just stopped");
      }
      this._toastHandle?.close();
      this._toastHandle = undefined;
    }

    return;
  }

  public get onlyWhenDrawingStore(){
    return this._enableOnlyWhenDrawingSetting.store;
  }
}