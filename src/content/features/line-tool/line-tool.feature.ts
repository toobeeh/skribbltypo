import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { type stickyToastHandle, ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { inject } from "inversify";
import {
  BehaviorSubject, catchError,
  combineLatestWith, debounce, distinctUntilChanged, exhaustMap, filter, map, mergeWith, of,
  pairwise, skip, startWith, Subject,
  type Subscription, take, tap, timeout, withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import LineToolInfo from "./line-tool-info.svelte";

export class LineToolFeature extends TypoFeature {
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(PrioritizedCanvasEventsSetup)
  private readonly _prioritizedCanvasEventsSetup!: PrioritizedCanvasEventsSetup;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

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
      () => {
        this._lineListenToggle$.next(false);
      },
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

    /* pipe to detect current mode depending on hotkey action */
    const listenPipe$ = this._lineListenToggle$.pipe(
      exhaustMap((value) => {
        if (!value) return of("disabled" as const);
        else
          return of("free" as const).pipe(
            mergeWith(
              this._lineListenToggle$.pipe(
                filter((v) => v),
                skip(1) /* skip current value */,
                take(1) /* take one value */,
                map(() => "snap" as const) /* identify as snap */,
                timeout(500) /* snap must have emitted at least 500ms after */,
                catchError(() =>
                  this._lineListenToggle$.pipe(
                    take(1),
                    map((state) =>
                      state ? ("free" as const) : ("disabled" as const),
                    ) /* if after listen period no snap detected, fallback to free or disabled  */,
                  ),
                ),
              ),
            ),
          );
      }),
      distinctUntilChanged(),
      combineLatestWith(this._lobbyService.lobby$.pipe(map(lobby => (lobby?.drawerId ?? undefined) !== undefined && lobby?.drawerId === lobby?.meId))),
      map(([mode, isDrawer]) => (isDrawer ? mode : "disabled" as const)),
      distinctUntilChanged(),
      tap((mode) => this._logger.info("Mode changed", mode)),
    );

    /* pipe for origin coordinates; filter out when not listening */
    const originPipe$ = this._originCoordinates$.pipe(
      withLatestFrom(this._lineListenToggle$),
      map(([origin, listening]) => (listening ? origin : undefined)),
      distinctUntilChanged(),
      tap((origin) => this._logger.debug("Origin changed", origin)),
    );

    /* pipe for target coordinates; filter out when not listening or no origin, and calculate snap if enabled */
    const targetPipe$ = this._targetCoordinates$.pipe(
      withLatestFrom(listenPipe$, originPipe$),
      map(([target, mode, origin]) =>
        mode == "disabled" || origin === undefined || target === undefined
          ? undefined
          : mode === "free"
            ? target
            : this.calculateSnap(origin, target),
      ),
      distinctUntilChanged(),
      tap((target) => this._logger.debug("Target changed", target)),
    );

    /* combine all updates */
    this._lineStateSubscription = listenPipe$
      .pipe(
        combineLatestWith(originPipe$, targetPipe$),
        startWith(["disabled", undefined, undefined] as ["disabled", undefined, undefined]),
        pairwise(),

        /* update ui */
        tap(([prev, current]) => this.processUiStateUpdate(prev, current)),
        map(([, current]) => current),

        /* map to current and emit only when line accepted */
        debounce(() => this._lineAccept$.pipe(take(1), tap(() => this._logger.debug("Line accept debounce emitted")))),
        startWith(["disabled", undefined, undefined] as ["disabled", undefined, undefined]),
        pairwise(),

        tap(data => this._logger.debug("Line accepted", data)),
      )
      .subscribe(async ([[, prevOrigin, prevTarget], [listening, origin, target]]) => {

        if (!origin || listening === "disabled") {
          return;
        }

        this._logger.info("Line accepted", origin, target);
        if (target === undefined || target[0] === origin[0] && target[1] === origin[1]) {
          this._logger.info(
            "Line accepted without or same target - connecting with last origin or target, if existing",
            origin,
            target,
          );
          if (prevTarget) { // if last was drag
            this._logger.info("Connecting with last drag end", prevTarget);
            await this.drawLine(prevTarget, origin);
          }
          else if (prevOrigin) { // if last was also one-click
            this._logger.info("Connecting with last click", prevOrigin);
            await this.drawLine(prevOrigin, origin);
          }
          else {
            this._logger.info("No previous line to connect to; waiting for next");
          }

          /* reset origin */
          this._originCoordinates$.next(undefined);
        } else {

          // regular drag action
          await this.drawLine(origin, target);
        }
      });
  }

  protected override async onDestroy() {
    const { remove } = await this._prioritizedCanvasEventsSetup.complete();
    remove("pointerdown", this._canvasClickListener);
    document.removeEventListener("pointermove", this._documentMoveListener);
    document.removeEventListener("pointerup", this._documentUpListener);

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

  /**
   * Transforms a line to snap either on horizontal or vertical axis, depending on the longer distance
   * @param origin
   * @param target
   * @private
   */
  private calculateSnap(origin: [number, number], target: [number, number]): [number, number] {
    const dx = Math.abs(target[0] - origin[0]);
    const dy = Math.abs(target[1] - origin[1]);

    /* if horizontal */
    if (dx > dy) {
      return [target[0], origin[1]];
    } else if (dy > dx) {

    /* if vertical */
      return [origin[0], target[1]];
    } else {

    /* if diagonal */
      return target;
    }
  }

  /**
   * Update the line preview canvas with the current line origin and target coordinates
   * @param coordinates
   * @private
   */
  private async setPreview(
    coordinates: [number, number, number | undefined, number | undefined] | undefined,
  ) {
    this._logger.debug("Updating preview", coordinates);

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

  /**
   * Listener when pointer clicked on canvas; sets current line origin
   * @param event
   * @private
   */
  private onCanvasDown(event: MouseEvent) {
    this._logger.debug("Canvas clicked", event);
    if (this._lineListenToggle$.value) {
      event.preventDefault();
      event.stopImmediatePropagation();
      this._originCoordinates$.next([event.offsetX, event.offsetY]);
    }
  }

  /**
   * Listener when pointer moved on document; updates current line target
   * @param event
   * @private
   */
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

  /**
   * Listener when pointer released on document; accepts current line preview
   * @param event
   * @private
   */
  private async onDocumentUp(event: MouseEvent) {
    this._logger.debug("Document pointer up", event);
    this._lineAccept$.next(true);
  }

  /**
   * Update the toast ui depending on the tool state
   * @param prevListening
   * @param prevOrigin
   * @param prevTarget
   * @param listening
   * @param origin
   * @param target
   * @private
   */
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
      listening !== "disabled" && origin !== undefined
        ? [...origin, ...(target ?? [undefined, undefined])]
        : undefined,
    );

    /* if just entered line tool, add toast */
    if (prevListening === "disabled" && listening !== "disabled") {
      if (this._toastHandle) {
        this._logger.warn("Toast handle unexpected existing when entering line tool");
        this._toastHandle.close();
      }
      this._toastHandle = await this._toastService.showStickyToast(
        "Line Tool: " + (listening === "snap" ? "Snap" : "Free"),
        "Click to start line, release to finish",
      );
    }

    /* if mode active but changed */
    else if (
      prevListening !== "disabled" &&
      listening !== "disabled" &&
      listening !== prevListening
    ) {
      if (!this._toastHandle) {
        this._logger.error("Toast handle unexpected not existing when changing mode", {
          prevListening,
          listening,
        });
        return;
      }
      this._toastHandle.update(
        "Line Tool: " + (listening === "snap" ? "Snap" : "Free"),
        "Click to start line, release to finish",
      );
    }

    /* if line tool exited */
    else if (prevListening !== "disabled" && listening === "disabled") {
      if (!this._toastHandle) {
        this._logger.warn("Toast handle unexpected not existing when exiting line tool");
      }
      this._toastHandle?.close();
      this._toastHandle = undefined;
    }
  }

  /**
   * Draw a line and reset current selected coordinates
   * @param origin
   * @param target
   * @param canvas
   * @private
   */
  private async drawLine(
    origin: [number, number],
    target: [number, number]
  ) {
    if (!origin || !target) return;

    await this._drawingService.drawLine([...origin, ...target]);

    this._originCoordinates$.next(undefined);
    this._targetCoordinates$.next(undefined);
  }
}