import type { featureBinding } from "@/app/core/feature/featureBinding";
import { loggerFactory } from "@/app/core/logger/loggerFactory.interface";
import { ImageFinishedService, type skribblImage } from "@/app/services/image-finished/image-finished.service";
import { inject, injectable } from "inversify";
import { BehaviorSubject, Subscription } from "rxjs";

@injectable()
export class ImagePostService implements featureBinding {

  private readonly _logger;
  private _history$?: BehaviorSubject<skribblImage[]>;
  private _historySubscription?: Subscription;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(ImageFinishedService) private readonly _imageFinishedService: ImageFinishedService
  ) {
    this._logger = loggerFactory(this);
  }

  /**
   *  listen for finished images and create history
   *
   */
  async onFeatureActivate() {
    this._history$ = new BehaviorSubject<skribblImage[]>([]);
    this._historySubscription = this._imageFinishedService.imageHistory$.subscribe(data => this._history$?.next(data));
  }

  /**
   * unsubscribe from history subscription
   * @private
   */
  async onFeatureDestroy(){
    this._history$ = undefined;
    this._historySubscription?.unsubscribe();
  }

  public get history$() {
    if (!this._history$) {
      this._logger.error("Tried to access history without initializing the service first. Imagelab feature enabled?");
      throw new Error("illegal state");
    }
    return this._history$.asObservable();
  }

  public addToHistory(image: skribblImage) {
    if (!this._history$) {
      this._logger.error("Tried to access history without initializing the service first. Imagelab feature enabled?");
      throw new Error("illegal state");
    }
    this._history$.next([...this._history$.value, image]);
  }

}