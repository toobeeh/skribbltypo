import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { inject, injectable } from "inversify";
import {
  BehaviorSubject,
  delay,
  filter, forkJoin,
  map,
  type Observable, of, scan,
  switchMap, take,
  withLatestFrom,
} from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";


export interface imageHistory {
  name: string;
  base64: string;
  artist: string;
  date: Date;
  player: string;
  commands: number[][];
  blob: Blob;
}

@injectable()
export class ImageHistoryService {

  private readonly _logger;

  private _imageHistory$ = new BehaviorSubject<imageHistory[]>([]);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(DrawingService) private readonly _drawingService: DrawingService,
    @inject(LobbyService) private readonly _lobbyService: LobbyService,
  ) {
    this._logger = loggerFactory(this);
    this.listenImageHistory();
  }

  private listenImageHistory() {
    this.mapToImageState(this._drawingService.drawingState$.pipe(
      delay(100), /* avoid race conditions of state change and data observables */
      filter((state) => state === "idle"), /* update only when state entered idle (drawing finished) */
    ))
      .pipe(
        scan((acc, image) => {
          if (image === null) return acc;
          acc.push(image);
          return acc;
        }, [] as imageHistory[]),
      )
      .subscribe((data) => this._imageHistory$.next(data));
  }

  /**
   * A new observable is returned, that whenever the input observable emits, gets the current image state
   * @param input
   * @private
   */
  private mapToImageState(input: Observable<unknown>) {
    return input.pipe(
      withLatestFrom(this._drawingService.imageState$, this._lobbyService.lobby$, this._drawingService.commands$),  /* on every input, fetch latest lobby and drawing state */
      switchMap((data) =>
        forkJoin({
            base64: fromPromise(this._drawingService.getCurrentImageBase64()),
            blob: fromPromise(this._drawingService.getCurrentImageBlob())
        }).pipe(
          map((extra) => ({ image: data[1], lobby: data[2], commands: data[3], base64: extra.base64, blob: extra.blob })), /* fetch additionally current drawing blob and add to data */
        ),
      ),
      map((state) => {
        if (state.image === null || state.lobby === null) return null; /* something unexpected */
        const { lobby, image, base64, blob, commands } = state;
        return {
          name: image.word.solution ?? `${image.word.hints} (${image.word.length.join(", ")})`,
          base64: base64,
          blob: blob,
          commands: commands,
          artist: lobby.players.find((p) => p.id === image.drawerId)?.name ?? "Unknown Artist",
          date: new Date(),
          player: lobby.players.find(p => p.id === lobby.meId)?.name ?? "Unknown Poster",
        } as imageHistory; /* return mapped data as image history object */
      }),
    );
  }

  public getImageHistory$(withCurrent = false){
    return this._imageHistory$.pipe( /* take current history as base */
      switchMap((history) => this._drawingService.drawingState$.pipe(
        take(1), /* get current drawing state once */
        switchMap(state => {
          if(withCurrent && state === "drawing") return this.mapToImageState(of(1)); /* if someone is drawing, fetch current image state */
          else return of(null);
        }),
        map(currentImage => currentImage === null ? history : [...history, currentImage])  /* if someone drawing, temporary add current state to history */
      ))
    );
  }

}