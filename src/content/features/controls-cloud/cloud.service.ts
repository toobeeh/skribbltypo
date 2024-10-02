import type { featureBinding } from "@/content/core/feature/featureBinding";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ImageFinishedService, type skribblImage } from "@/content/services/image-finished/image-finished.service";
import { inject, injectable } from "inversify";
import { Subject, type Subscription } from "rxjs";

@injectable()
export class CloudService implements featureBinding{
  @inject(ImageFinishedService) private readonly _imageFinishedService!: ImageFinishedService;

  private readonly _logger;
  private _savedImages$?: Subject<skribblImage>;
  private _finishedSubscription?: Subscription;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  async onFeatureActivate() {
    this._savedImages$ = new Subject<skribblImage>();
    this._finishedSubscription = this._imageFinishedService
      .imageFinished$
      .subscribe(image => this._savedImages$?.next(image));
  }

  async onFeatureDestroy() {
    this._finishedSubscription?.unsubscribe();
  }

  public get savedImages$() {
    if(!this._savedImages$) {
      this._logger.error("Tried to access saved images without initializing the service first. Cloud feature enabled?");
      throw new Error("illegal state");
    }

    return this._savedImages$;
  }

  public saveImage(image: skribblImage) {
    if(!this._savedImages$) {
      this._logger.error("Tried to access saved images without initializing the service first. Cloud feature enabled?");
      throw new Error("illegal state");
    }

    this._savedImages$?.next(image);
  }
}