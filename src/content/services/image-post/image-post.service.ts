import { serviceBinding, ServiceBinding } from "@/content/core/feature/service-binding";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ToolbarImagePostFeature } from "@/content/features/toolbar-imagepost/toolbar-imagepost.feature";
import { ImageFinishedService, type skribblImage } from "@/content/services/image-finished/image-finished.service";
import { inject, injectable } from "inversify";
import { BehaviorSubject, Subscription } from "rxjs";

@injectable()
export class ImagePostService {

  private readonly _logger;
  private _serviceBinding: ServiceBinding;
  private _history$?: BehaviorSubject<skribblImage[]>;
  private _historySubscription?: Subscription;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(serviceBinding) serviceBinding: serviceBinding,
    @inject(ImageFinishedService) private readonly _imageFinishedService: ImageFinishedService
  ) {
    this._logger = loggerFactory(this);
    this._serviceBinding = serviceBinding(ToolbarImagePostFeature, this.init.bind(this), this.reset.bind(this));
  }

  /**
   *  listen for finished images and create history
   *
   */
  private init() {
    this._history$ = new BehaviorSubject<skribblImage[]>([]);
    this._historySubscription = this._imageFinishedService.imageHistory$.subscribe(data => this._history$?.next(data));
  }

  /**
   * unsubscribe from history subscription
   * @private
   */
  private reset(){
    this._history$ = undefined;
    this._historySubscription?.unsubscribe();
  }

  public get enabled() {
    return this._serviceBinding.active;
  }

  public get history$() {
    if (!this._history$) {
      this._logger.error("Tried to access history without initializing the service first. Imagelab feature enabled?");
      throw new Error("illegal state");
    }
    return this._history$.asObservable();
  }

}