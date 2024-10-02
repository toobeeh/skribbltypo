import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { ImageData } from "@/util/imageData";
import { inject, injectable } from "inversify";
import {
  delay, distinctUntilChanged,
  filter,
  map,
  type Observable, scan,
  switchMap, tap,
  withLatestFrom,
} from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";


export interface skribblImage {
  name: string;
  artist: string;
  date: Date;
  player: string;
  commands: number[][];
  private: boolean;
  isOwn: boolean;
  language: string;
  image: ImageData;
}

@injectable()
export class ImageFinishedService {

  private readonly _logger;

  private _imageFinished$: Observable<skribblImage>;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(DrawingService) private readonly _drawingService: DrawingService,
    @inject(LobbyService) private readonly _lobbyService: LobbyService,
  ) {
    this._logger = loggerFactory(this);
    this._imageFinished$ = this.listenImageFinished();
  }

  private listenImageFinished(){
    return this.mapToImageState(
      this._drawingService.drawingState$.pipe(
        delay(100) /* avoid race conditions of state change and data observables */,
        filter(
          (state) => state === "idle",
        ) /* update only when state entered idle (drawing finished) */,
      ),
    ).pipe(
      filter((image) => image !== null), /* only if image mapping successfully */
      tap(() => this._logger.debug("Image finished")),
    );
  }

  /**
   * A new observable is returned, that whenever the input observable emits, gets the current image state
   * @param input
   * @private
   */
  public mapToImageState(input: Observable<unknown>) {
    return input.pipe(
      withLatestFrom(this._drawingService.imageState$, this._lobbyService.lobby$, this._drawingService.commands$),  /* on every input, fetch latest lobby and drawing state */
      switchMap((data) =>
        fromPromise(this._drawingService.getCurrentImageData()).pipe(
          map((imageData) => ({ image: data[1], lobby: data[2], commands: data[3], imageData })), /* fetch additionally current drawing blob and add to data */
        ),
      ),
      map((state) => {
        if (state.image === null || state.lobby === null) return null; /* something unexpected */
        const { lobby, image, imageData, commands } = state;
        return {
          name: image.word.solution ?? `${image.word.hints} (${image.word.length.join(", ")})`,
          image: imageData,
          commands: commands,
          private: lobby.private,
          artist: lobby.players.find((p) => p.id === image.drawerId)?.name ?? "Unknown Artist",
          date: new Date(),
          player: lobby.players.find(p => p.id === lobby.meId)?.name ?? "Unknown Poster",
          isOwn: lobby.meId === image.drawerId,
          language: lobby.settings.language,
        } as skribblImage; /* return mapped data as image history object */
      }),
    );
  }

  public get imageFinished$() {
    return this._imageFinished$;
  }

  public get imageHistory$() {
    return this._imageFinished$.pipe(
      scan((acc, image) => {
        if (image === null) return acc;
        else return [...acc, image];
      }, [] as skribblImage[]),
      distinctUntilChanged(
        (a, b) => a.length === b.length,
      ) /* only emit when new image is added */
    );
  }
}