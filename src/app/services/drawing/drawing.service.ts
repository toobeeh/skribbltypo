import { DrawEvent, DrawEventListener } from "@/app/events/draw.event";
import { HintsAddedEvent, HintsAddedEventListener } from "@/app/events/hints-added.event";
import { ImageResetEvent, ImageResetEventListener } from "@/app/events/image-reset.event";
import { LobbyStateChangedEvent, LobbyStateChangedEventListener } from "@/app/events/lobby-state-changed.event";
import { WordGuessedEvent, WordGuessedEventListener } from "@/app/events/word-guessed.event";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { SkribblMessageRelaySetup } from "@/app/setups/skribbl-message-relay/skribbl-message-relay.setup";
import { arrayChunk } from "@/util/arrayChunk";
import { createCrossCustomEvent } from "@/util/document/crossCustomEvent";
import { ImageData } from "@/util/imageData";
import { inject, injectable } from "inversify";
import {
  BehaviorSubject,
  concatMap, debounceTime,
  delay, distinctUntilChanged,
  filter,
  map,
  merge, mergeWith, of, scan, Subject, tap,
  withLatestFrom,
} from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { LobbyLeftEvent, LobbyLeftEventListener } from "../../events/lobby-left.event";

export interface imageStateUpdate {
  drawerId?: number,
  word: {
    length: number[],
    hints: string,
    solution?: string
  }
}

export interface savedDrawCommands {
  name: string;
  commands: number[][]
}

@injectable()
export class DrawingService {

  private readonly _logger;

  private _currentImageState$ = new BehaviorSubject<imageStateUpdate | null>(null);
  private _currentCommands$ = new BehaviorSubject<number[][]>([]);
  private _drawingState$ = new BehaviorSubject<"drawing" | "idle">("idle");

  private _pasteInProgress$ = new BehaviorSubject<boolean>(false);
  private _abortCommands$ = new BehaviorSubject<number>(Number.MAX_VALUE);
  private _incomingDrawCommands$ = new Subject<[number[], boolean]>(); /* [commands, scheduled] -> scheduled false when cancel/schedule skipped */

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(LobbyLeftEventListener) private readonly lobbyLeft: LobbyLeftEventListener,
    @inject(LobbyStateChangedEventListener) private readonly lobbyChanged: LobbyStateChangedEventListener,
    @inject(HintsAddedEventListener) private readonly hintsAdded: HintsAddedEventListener,
    @inject(DrawEventListener) private readonly draw: DrawEventListener,
    @inject(WordGuessedEventListener) private readonly wordGuessed: WordGuessedEventListener,
    @inject(ImageResetEventListener) private readonly imageReset: ImageResetEventListener,
    @inject(ElementsSetup) private readonly elementsSetup: ElementsSetup,
    @inject(SkribblMessageRelaySetup) private readonly skribblMessages: SkribblMessageRelaySetup
  ) {
    this._logger = loggerFactory(this);

    this.listenDrawCommands();
    this.listenCurrentImageState();

    this.imageState$.subscribe(data => {
      this._logger.debug("Image state updated", data);
    });

    this.commands$.pipe(debounceTime(1000)).subscribe(data => {
      this._logger.debug("Commands updated", data);
    });

    /* cancel always when lobby left */
    lobbyLeft.events$.subscribe(() => this.cancelPendingDrawCommands());

    this._incomingDrawCommands$.pipe(

      /* not very satisfied with the access of the .value .. but it works */
      concatMap(([value, scheduled]) => {

        if(!scheduled) return of(value);

        const scheduledTime = Date.now();
        const abort = this._abortCommands$.value;

        /* if command is aborted, return as cancelled. else return as scheduled */
        if(scheduledTime < abort) return of(value).pipe(
          delay(2)
        );
        else return of(null);
      }),

      /* filter out cancelled commands */
      filter(value => value !== null),

      /* perform commands */
      tap((command) => this.onDrawCommand(command)),

      /* count amount of pasted commands, reset when not drawing*/
      mergeWith(this._pasteInProgress$.pipe(
        distinctUntilChanged()
      )),
      scan((acc, pastingOrCommands) => pastingOrCommands === false ? 0 : pastingOrCommands === true ? acc : acc + 1, 0),
      /*filter(count => count > 0),*/

      /* inset when aborted to "finish" state even when no commands were pending */
      mergeWith(this._abortCommands$.pipe(
        distinctUntilChanged(),
        map(() => 0)
      )),

      /* after 50ms of no commands, treat as action */
      debounceTime(50),
    ).subscribe((count) => {
      this._logger.debug("finished pasting", count);
      if(count > 0) document.dispatchEvent(new CustomEvent("collapseUndoActions", { detail: count }));
      this._pasteInProgress$.next(false);
      this._abortCommands$.next(Number.MAX_VALUE);
    });
  }

  private onDrawCommand(command: number[]) {
    this._logger.debug("Incoming draw command", command);
    document.dispatchEvent(createCrossCustomEvent("performDrawCommand", {detail: command}));
  }

  /**
   * create observable for all draw command updates
   * @private
   */
  private listenDrawCommands() {
    merge(
      this.lobbyLeft.events$,
      this.lobbyChanged.events$,
      this.draw.events$,
      this.imageReset.events$
    ).pipe(
      withLatestFrom(this._currentCommands$),
      map(data => ({update: data[0], currentCommands: data[1]})),
    ).subscribe(({update, currentCommands}) => {
      currentCommands = structuredClone(currentCommands);

      if(update instanceof LobbyLeftEvent) {
        currentCommands = [];
      }
      else if(update instanceof LobbyStateChangedEvent) {
        if(update.data.drawingStarted !== undefined) {
          currentCommands = [];
        }
      }
      else if(update instanceof LobbyLeftEvent) {
        currentCommands = [];
      }
      else if(update instanceof DrawEvent) {
        const commands = update.data.map(command => command.length > 7 ? arrayChunk(command, 7) : [command]).flat(1);
        currentCommands.push(...commands);
      }
      else if(update instanceof ImageResetEvent) {
        currentCommands = update.data === 0 ? [] : currentCommands.slice(0, update.data);
      }

      this._currentCommands$.next(currentCommands);
    });
  }

  /**
   * emit to observable for all drawing updates
   * @private
   */
  private listenCurrentImageState() {
    merge(
      this.lobbyLeft.events$,
      this.lobbyChanged.events$,
      this.hintsAdded.events$,
      this.wordGuessed.events$
    ).pipe(
      withLatestFrom(this._currentImageState$),
      map(data => ({update: data[0], currentImageState: data[1]})),
    ).subscribe(({update, currentImageState}) => {

      /* prevent issues with references */
      currentImageState = currentImageState === null ? null : structuredClone(currentImageState);

      if(update instanceof LobbyLeftEvent) {
        currentImageState = null;
        this._drawingState$.next("idle");
      }
      else if(update instanceof LobbyStateChangedEvent) {

        /* if current image state empty, prefill with defaults */
        currentImageState = currentImageState ?? {
          drawerId: undefined,
          word: {
            length: [0],
            hints: "",
            solution: undefined
          }
        };

        /*if(update.data.initialDrawerId !== undefined) {
          currentImageState.drawerId = update.data.initialDrawerId;
        }*/
        if(update.data.drawingStarted !== undefined) {
          this._drawingState$.next("drawing");

          currentImageState.drawerId = update.data.drawingStarted.drawerId;
          currentImageState.word.length = update.data.drawingStarted.characters;
          currentImageState.word.solution = update.data.drawingStarted.word;
          currentImageState.word.hints =
            update.data.drawingStarted.word ??
            update.data.drawingStarted.characters.map(len => "_".repeat(len)).join(" ");
        }
        if (update.data.drawingRevealed !== undefined) {
          this._drawingState$.next("idle");

          currentImageState.word.solution = update.data.drawingRevealed.word;
          currentImageState.word.hints = update.data.drawingRevealed.word;
        }
      }
      else if(currentImageState !== null && update instanceof HintsAddedEvent) {
        const hints = [...currentImageState.word.hints];
        update.data.forEach(hint => {
          hints[hint[0]] = hint[1];
        });
        currentImageState.word.hints = hints.join("");
      }
      else if(currentImageState !== null && update instanceof WordGuessedEvent) {
        if(update.data.word !== undefined) {
          currentImageState.word.solution = update.data.word;
          currentImageState.word.hints = update.data.word;
        }
      }
      else if(currentImageState !== null && update instanceof LobbyLeftEvent) {
        this._drawingState$.next("idle");
        currentImageState = null;
      }

      this._currentImageState$.next(currentImageState);
    });
  }

  /**
   * Observable which emits every change image state, including draw commands
   */
  public get imageState$() {
    return this._currentImageState$.asObservable();
  }

  /**
   * Observable which emits every change to captured current draw commands
   */
  public get commands$() {
    return this._currentCommands$.asObservable();
  }

  /**
   * Observable which emits when the drawer changes
   */
  public get drawingState$() {
    return this._drawingState$.asObservable();
  }

  /**
   * Get the current canvas image as a base64 string
   */
  private async getCurrentImageBase64() {
    return (await this.elementsSetup.complete()).canvas.toDataURL();
  }

  /**
   * Get the current canvas image as a blob
   */
  public async getCurrentImageData() {
    const base64 = await this.getCurrentImageBase64();
    return await ImageData.fromBase64(base64);
  }

  /**
   * Paste draw commands on the canvas
   * @param commands
   * @param scheduled set to false to skip 2ms-delay-scheduling (scheduled react to cancel signal)
   */
  public async pasteDrawCommands(commands: number[][], scheduled = true) {
    this._logger.debug("Pasting draw commands", commands);
    if(commands.length === 0) return;
    this._pasteInProgress$.next(true);
    commands.forEach(command => this._incomingDrawCommands$.next([command, scheduled]));
  }

  public cancelPendingDrawCommands(){
    this._abortCommands$.next(Date.now());
  }

  public get pasteInProgress$(){
    return this._pasteInProgress$.pipe(
      distinctUntilChanged()
    );
  }

  /**
   *
   * @param color the skribbl color code
   */
  public setColor(color: number) {
    this._logger.debug("Setting color", color);
    document.dispatchEvent(new CustomEvent("setColor", {detail: {code: color}}));
  }

  /**
   * Disable or enable cursor updates
   * Prevents performance bottlenecks when mods change cursor properties frequently
   * When set to false, cursor will be updated once
   * @param state
   */
  public disableCursorUpdates(state: boolean){
    document.dispatchEvent(new CustomEvent("disableCursorUpdates", {detail: state}));
  }

  /**
   * Set the brush size, from 4 to 40
   * @param size
   */
  public setSize(size: number) {
    this._logger.debug("Setting size", size);
    document.dispatchEvent(new CustomEvent("selectSkribblSize", {detail: size}));
  }

  public clearImage() {
    this._logger.debug("Clearing image");
    document.dispatchEvent(new CustomEvent("clearDrawing"));
  }

  public async drawImage(imageBase64: string, x?: number, y?: number, dx?: number, dy?: number) {
    this._logger.debug("Drawing image", imageBase64, x, y, dx, dy);

    const img = new Image();
    img.src = imageBase64;
    await new Promise(resolve => img.onload = resolve);

    const canvas = (await this.elementsSetup.complete()).canvas;
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(img, x ?? 0, y ?? 0, dx ?? img.width, dy ?? img.height);
  }

  public createLineCommand(coordinates: [number, number, number, number], colorCode: number | undefined = undefined, size: number | undefined = undefined, clip = true){
    const clipped = clip ?
      this.clipLine([coordinates[0], coordinates[1]], [coordinates[2], coordinates[3]])?.flat() :
      [Math.floor(coordinates[0]), Math.floor(coordinates[1]), Math.floor(coordinates[2]), Math.floor(coordinates[3])];
    if(clipped === undefined) return;

    return [0, colorCode ?? 1, size ?? 4, ...clipped];
  }

  public async drawLine(coordinates: [number, number, number, number], colorCode: number | undefined = undefined, size: number | undefined = undefined){
    this._logger.debug("Drawing line", coordinates, colorCode, size);

    const clipped = this.clipLine([coordinates[0], coordinates[1]], [coordinates[2], coordinates[3]])?.flat();
    if(clipped === undefined) return;
    await this.pasteDrawCommands([[0, colorCode ?? 1, size ?? 4, ...clipped]]);
  }

  private clipLine(origin: [number, number], target: [number, number]){
    const canvasWidth = 800;
    const canvasHeight = 600;

    /* if target and origin out of bounds, return dummy coords */
    if((origin[0] < 0 && target[0] < 0) || (origin[0] >= canvasWidth && target[0] >= canvasWidth) ||
       (origin[1] < 0 && target[1] < 0) || (origin[1] >= canvasHeight && target[1] >= canvasHeight)){
      return undefined;
    }

    /* if target x is outside of canvas, calculate new target by intersection of canvas bounds */
    if (target[0] < 0 || target[0] >= canvasWidth) {
      const slope = (target[1] - origin[1]) / (target[0] - origin[0]);
      const y = slope * ((target[0] < 0 ? 0 : canvasWidth - 1) - origin[0]) + origin[1];
      target = [target[0] < 0 ? 0 : canvasWidth - 1, y];
    }

    /* if target y is outside of canvas, calculate new target by intersection of canvas bounds */
    if (target[1] < 0 || target[1] >= canvasHeight) {
      const slope = (target[0] - origin[0]) / (target[1] - origin[1]);
      const x = slope * ((target[1] < 0 ? 0 : canvasHeight - 1) - origin[1]) + origin[0];
      target = [x, target[1] < 0 ? 0 : canvasHeight - 1];
    }

    /* if origin y is outside of canvas, calculate new origin by intersection of canvas bounds */
    if (origin[1] < 0 || origin[1] >= canvasHeight) {
      const slope = (target[0] - origin[0]) / (target[1] - origin[1]);
      const x = slope * ((origin[1] < 0 ? 0 : canvasHeight - 1) - origin[1]) + origin[0];
      origin = [x, origin[1] < 0 ? 0 : canvasHeight - 1];
    }

    /* if origin x is outside of canvas, calculate new origin by intersection of canvas bounds */
    if (origin[0] < 0 || origin[0] >= canvasWidth) {
      const slope = (target[1] - origin[1]) / (target[0] - origin[0]);
      const y = slope * ((origin[0] < 0 ? 0 : canvasWidth - 1) - origin[0]) + origin[1];
      origin = [origin[0] < 0 ? 0 : canvasWidth - 1, y];
    }

    origin = [Math.floor(origin[0]), Math.floor(origin[1])];
    target = [Math.floor(target[0]), Math.floor(target[1])];

    return [origin, target];
  }
}