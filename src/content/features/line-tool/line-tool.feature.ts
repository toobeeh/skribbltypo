import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { ImageResetEventListener } from "@/content/events/image-reset.event";
import { LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { type stickyToastHandle, ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { inject } from "inversify";
import {
  BehaviorSubject, bufferTime, catchError,
  combineLatestWith, debounce, debounceTime, distinctUntilChanged, exhaustMap, filter, map, mergeWith, of,
  pairwise, skip, Subject,
  type Subscription, switchMap, take, tap, timeout, withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import LineToolInfo from "./line-tool-info.svelte";

export class LineToolFeature extends TypoFeature {
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(PrioritizedCanvasEventsSetup)
  private readonly _prioritizedCanvasEventsSetup!: PrioritizedCanvasEventsSetup;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(LobbyStateChangedEventListener)
  private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(ImageResetEventListener)
  private readonly _imageResetEventListener!: ImageResetEventListener;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public override get featureInfoComponent(): componentData<LineToolInfo> {
    return { componentType: LineToolInfo, props: {} };
  }

  public readonly name = "Line Tool";
  public readonly description = "Draw straight lines between two points";
  public readonly featureId = 27;

  private readonly _startLineHotkey = this.useHotkey(
    new HotkeyAction(
      "start_line",
      "Start Line",
      "While pressed, straight lines can be drawn. Press twice to enable horizontal/vertical snap.",
      this,
      () => {
        this._originCoordinates$.next(undefined);
        this._targetCoordinates$.next(undefined);
        this._lineListenToggle$.next(true);
      },
      true,
      ["ShiftLeft"],
      () => this._lineListenToggle$.next(false),
    ),
  );

  private _lineListenToggle$ = new BehaviorSubject<boolean>(false);
  private _originCoordinates$ = new BehaviorSubject<[number, number] | undefined>(undefined);
  private _targetCoordinates$ = new BehaviorSubject<[number, number] | undefined>(undefined);
  private _lineAccept$ = new Subject<boolean>();
  private _toastHandle?: stickyToastHandle;
  private _lineStateSubscription?: Subscription;
  private _linePreview?: HTMLCanvasElement;

  private readonly _canvasClickListener = this.onCanvasDown.bind(this);
  private readonly _documentMoveListener = this.onDocumentMove.bind(this);
  private readonly _documentUpListener = this.onDocumentUp.bind(this);

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    this._linePreview = document.createElement("canvas");
    this._linePreview.width = elements.canvas.width;
    this._linePreview.height = elements.canvas.height;
    this._linePreview.style.position = "absolute";
    this._linePreview.style.pointerEvents = "none";
    elements.canvasWrapper.appendChild(this._linePreview);

    const { add } = await this._prioritizedCanvasEventsSetup.complete();
    add("pointerdown", this._canvasClickListener);

    document.addEventListener("pointermove", this._documentMoveListener);
    document.addEventListener("pointerup", this._documentUpListener);

    const originPipe$ = this._originCoordinates$.pipe(
      withLatestFrom(this._lineListenToggle$),
      filter(([, listening]) => listening),
      map(([origin]) => origin),
      distinctUntilChanged(),
      tap((origin) => this._logger.debug("Origin changed", origin)),
    );

    const targetPipe$ = this._targetCoordinates$.pipe(
      withLatestFrom(this._originCoordinates$),
      map(([target, origin]) => origin ? target : undefined),
      distinctUntilChanged(),
      tap((target) => this._logger.debug("Target changed", target)),
    );

    const listenPipe$ = this._lineListenToggle$.pipe(
      exhaustMap(value => {
        if(!value) return of("disabled" as const);
        else return of("free" as const).pipe(
          mergeWith(this._lineListenToggle$.pipe(
            filter(v => v),
            skip(1), /* skip current value */
            take(1), /* take one value */
            map(() => "snap" as const), /* identify as snap */
            timeout(500), /* snap must have emitted at least 500ms after */
            catchError(() => this._lineListenToggle$.pipe(
              take(1),
              map(state => state ? "free" as const : "disabled" as const), /* if after listen period no snap detected, fallback to free or disabled  */
            ))
          ))
        );
      }),
      tap(mode => this._logger.info("Mode changed", mode)),
    );

    this._lineStateSubscription = this._lineAccept$
      .pipe(
        withLatestFrom(

          /* combine all updates */
          listenPipe$.pipe(
            combineLatestWith(originPipe$, targetPipe$),
            pairwise(),

            /* update ui */
            tap(([prev, current]) =>
              this.processUiStateUpdate(prev, current),
            ),

            /* map to current */
            map(([, current]) => current),
          )
        ),

        filter(
          ([accept, [mode, origin, target]]) =>
            accept && mode !== "disabled" && origin !== undefined && target !== undefined,
        ),
      )
      .subscribe(async ([,[mode , origin, target]]) => {
        this._logger.info("Line accepted", mode, origin, target);

        this._originCoordinates$.next(undefined);
        this._targetCoordinates$.next(undefined);
      });
  }

  protected override async onDestroy() {
    const { remove } = await this._prioritizedCanvasEventsSetup.complete();
    remove("pointerdown", this._canvasClickListener);

    this._linePreview?.remove();
    this._linePreview = undefined;
    this._toastHandle?.close();
    this._lineStateSubscription?.unsubscribe();
    this._lineStateSubscription = undefined;
    this._toastHandle = undefined;
    this._lineListenToggle$.next(false);
    this._originCoordinates$.next(undefined);
    this._targetCoordinates$.next(undefined);
  }

  private async setPreview(
    coordinates: [number, number, number | undefined, number | undefined] | undefined,
  ) {
    this._logger.debug("Drawing preview", coordinates);

    if (this._linePreview === undefined) {
      this._logger.error("Line preview canvas not initialized");
      return;
    }

    /* update visibility of preview */
    if (coordinates === undefined || coordinates[2] === undefined || coordinates[3] === undefined) {
      this._linePreview.style.display = "none";
      return;
    }
    this._linePreview.style.display = "block";

    const ctx = this._linePreview.getContext("2d");
    if (ctx === null) {
      this._logger.error("Line preview context not found");
      return;
    }

    ctx.clearRect(0, 0, this._linePreview.width, this._linePreview.height);
    ctx.beginPath();
    ctx.moveTo(coordinates[0], coordinates[1]);
    ctx.lineTo(coordinates[2], coordinates[3]);
    ctx.stroke();
  }

  private onCanvasDown(event: MouseEvent) {
    this._logger.debug("Canvas clicked", event);
    if (this._lineListenToggle$.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this._originCoordinates$.next([event.offsetX, event.offsetY]);
    }
  }

  private async onDocumentMove(event: MouseEvent) {
    /* if listening, cancel event and calculate new endpoint */
    if (this._lineListenToggle$.value) {
      this._logger.debug("Document pointer moved", event);
      const canvas = (await this._elementsSetup.complete()).canvas;
      const boundingRect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - boundingRect.left;
      const offsetY = event.clientY - boundingRect.top;
      this._targetCoordinates$.next([offsetX, offsetY]);
    }
  }

  private async onDocumentUp(event: MouseEvent) {
    this._logger.debug("Document pointer up", event);
    this._lineAccept$.next(true);
  }

  private async processUiStateUpdate(
    [prevListening, prevOrigin, prevTarget]: [
      "free" | "snap" | "disabled",
      [number, number] | undefined,
      [number, number] | undefined,
    ],
    [listening, origin, target]: [
      "free" | "snap" | "disabled",
      [number, number] | undefined,
      [number, number] | undefined,
    ],
  ) {
    this._logger.debug(
      "Line state processing",
      { prevListening, prevOrigin, prevTarget },
      { listening, origin, target },
      this._toastHandle,
    );

    /* update canvas element */
    await this.setPreview(
      listening && origin !== undefined
        ? [...origin, ...(target ?? [undefined, undefined])]
        : undefined,
    );
  }
}