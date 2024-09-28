import { DrawEvent, DrawEventListener } from "@/content/events/draw.event";
import { HintsAddedEvent, HintsAddedEventListener } from "@/content/events/hints-added.event";
import { LobbyStateChangedEvent, LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { WordGuessedEvent, WordGuessedEventListener } from "@/content/events/word-guessed.event";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject, injectable } from "inversify";
import { BehaviorSubject, map, merge, Subject, withLatestFrom } from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { LobbyLeftEvent, LobbyLeftEventListener } from "../../events/lobby-left.event";

export interface imageStateUpdate {
  drawerId?: number,
  word: {
    length: number,
    hints: string,
    solution?: string
  },
  drawCommands: number[][]
}

@injectable()
export class DrawingService {

  private readonly _logger;

  private _currentImageState$ = new BehaviorSubject<imageStateUpdate | null>(null);
  private _drawerChange$ = new Subject<"start" | "end">();

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(LobbyLeftEventListener) private readonly lobbyLeft: LobbyLeftEventListener,
    @inject(LobbyStateChangedEventListener) private readonly lobbyChanged: LobbyStateChangedEventListener,
    @inject(HintsAddedEventListener) private readonly hintsAdded: HintsAddedEventListener,
    @inject(DrawEventListener) private readonly draw: DrawEventListener,
    @inject(WordGuessedEventListener) private readonly wordGuessed: WordGuessedEventListener,
    @inject(ElementsSetup) private readonly elementsSetup: ElementsSetup
  ) {
    this._logger = loggerFactory(this);

    /* create observable for all drawing updates */
    merge(
      lobbyLeft.events$,
      lobbyChanged.events$,
      hintsAdded.events$,
      wordGuessed.events$,
      draw.events$
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
            length: 0,
            hints: "",
            solution: undefined
          },
          drawCommands: []
        };

        if(update.data.initialDrawerId !== undefined) {
          currentImageState.drawerId = update.data.initialDrawerId;
        }
        if(update.data.drawingStarted !== undefined) {
          this._drawerChange$.next("start");

          currentImageState.drawerId = update.data.drawingStarted.drawerId;
          currentImageState.word.length = update.data.drawingStarted.characters;
          currentImageState.word.solution = update.data.drawingStarted.word;
          currentImageState.word.hints = update.data.drawingStarted.word ?? "_".repeat(update.data.drawingStarted.characters);
          currentImageState.drawCommands = [];
        }
        if (update.data.drawingRevealed !== undefined) {
          this._drawerChange$.next("end");

          currentImageState.word.solution = update.data.drawingRevealed.word;
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
      else if(currentImageState !== null && update instanceof DrawEvent) {
        currentImageState.drawCommands.push(...update.data);
      }

      this._currentImageState$.next(currentImageState);
    });

    this.imageState$.subscribe(data => {
      this._logger.info("Image state updated", data);
    });
  }

  /**
   * Observable which emits every change image state, including draw commands
   */
  public get imageState$() {
    return this._currentImageState$.asObservable();
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