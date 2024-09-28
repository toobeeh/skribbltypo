import { DrawEvent, DrawEventListener } from "@/content/events/draw.event";
import { HintsAddedEvent, HintsAddedEventListener } from "@/content/events/hints-added.event";
import { ImageResetEvent, ImageResetEventListener } from "@/content/events/image-reset.event";
import { LobbyStateChangedEvent, LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { WordGuessedEvent, WordGuessedEventListener } from "@/content/events/word-guessed.event";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { arrayChunk } from "@/util/arrayChunk";
import { inject, injectable } from "inversify";
import { BehaviorSubject, debounceTime, map, merge, Subject, withLatestFrom } from "rxjs";
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

@injectable()
export class DrawingService {

  private readonly _logger;

  private _currentImageState$ = new BehaviorSubject<imageStateUpdate | null>(null);
  private _currentCommands$ = new BehaviorSubject<number[][]>([]);
  private _drawerChange$ = new Subject<"start" | "end">();

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(LobbyLeftEventListener) private readonly lobbyLeft: LobbyLeftEventListener,
    @inject(LobbyStateChangedEventListener) private readonly lobbyChanged: LobbyStateChangedEventListener,
    @inject(HintsAddedEventListener) private readonly hintsAdded: HintsAddedEventListener,
    @inject(DrawEventListener) private readonly draw: DrawEventListener,
    @inject(WordGuessedEventListener) private readonly wordGuessed: WordGuessedEventListener,
    @inject(ImageResetEventListener) private readonly imageReset: ImageResetEventListener,
    @inject(ElementsSetup) private readonly elementsSetup: ElementsSetup
  ) {
    this._logger = loggerFactory(this);

    /* create observable for all drawing updates */
    merge(
      lobbyLeft.events$,
      lobbyChanged.events$,
      draw.events$,
      imageReset.events$
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

    /* create observable for all drawing updates */
    merge(
      lobbyLeft.events$,
      lobbyChanged.events$,
      hintsAdded.events$,
      wordGuessed.events$
    ).pipe(
      withLatestFrom(this._currentImageState$),
      map(data => ({update: data[0], currentImageState: data[1]})),
    ).subscribe(({update, currentImageState}) => {

      /* prevent issues with references */
      currentImageState = currentImageState === null ? null : structuredClone(currentImageState);

      if(update instanceof LobbyLeftEvent) {
        currentImageState = null;
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

        if(update.data.initialDrawerId !== undefined) {
          currentImageState.drawerId = update.data.initialDrawerId;
        }
        if(update.data.drawingStarted !== undefined) {
          this._drawerChange$.next("start");

          currentImageState.drawerId = update.data.drawingStarted.drawerId;
          currentImageState.word.length = update.data.drawingStarted.characters;
          currentImageState.word.solution = update.data.drawingStarted.word;
          currentImageState.word.hints =
            update.data.drawingStarted.word ??
            update.data.drawingStarted.characters.map(len => "_".repeat(len)).join(" ");
        }
        if (update.data.drawingRevealed !== undefined) {
          this._drawerChange$.next("end");

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
        this._drawerChange$.next("end");
        currentImageState = null;
      }

      this._currentImageState$.next(currentImageState);
    });

    this.imageState$.subscribe(data => {
      this._logger.info("Image state updated", data);
    });

    this.commands$.pipe(debounceTime(1000)).subscribe(data => {
      this._logger.debug("Commands updated", data);
    });
  }

  /**
   * Observable which emits every change image state, including draw commands
   */
  public get imageState$() {
    return this._currentImageState$.asObservable();
  }

  public get commands$() {
    return this._currentCommands$.asObservable();
  }

  /**
   * Observable which emits when the drawer changes
   */
  public get drawerChange$() {
    return this._drawerChange$.asObservable();
  }

  public async getCurrentImageBase64() {
    return (await this.elementsSetup.complete()).canvas.toDataURL();
  }

  public async getCurrentImageBlob() {
    return new Promise<Blob>(async (resolve, reject) => {
      (await this.elementsSetup.complete()).canvas.toBlob(blob => {
        if(blob === null) reject("Failed to convert canvas to blob");
        else resolve(blob);
      });
    });
  }
}