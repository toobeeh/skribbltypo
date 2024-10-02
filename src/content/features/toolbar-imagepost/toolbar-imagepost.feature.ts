import { GuildsApi, type MemberWebhookDto } from "@/api";
import { ApiService } from "@/content/services/api/api.service";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { ImageFinishedService, type skribblImage } from "@/content/services/image-finished/image-finished.service";
import { ImagePostService } from "@/content/features/toolbar-imagepost/image-post.service";
import { MemberService } from "@/content/services/member/member.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {
  map,
  mergeWith, of,
  Subject,
  Subscription, switchMap, take,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarPost from "./toolbar-imagepost.svelte";

export class ToolbarImagePostFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ImagePostService) private readonly _imagePostService!: ImagePostService;
  @inject(ImageFinishedService) private readonly _imageFinishedService!: ImageFinishedService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ApiService) private readonly _apiService!: ApiService;

  public readonly name = "Image Post";
  public readonly description =
    "Adds an icon to the typo toolbar to send images from your lobby directly to one of your connected discord servers";
  public readonly featureId = 11;

  protected override get boundServices(){
    return [this._imagePostService];
  }

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;

  private _popoutOpened$ = new Subject<void>();
  private _submitted$ = new Subject<void>();

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    /* create icon and attach to toolbar */
    this._iconComponent = new IconButton({
      target: elements.toolbar,
      props: {
        icon: "file-img-letter-gif",
        name: "Post Image",
        order: 5,
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      /* if already opened, return */
      if (this._flyoutComponent) {
        return;
      }

      this._popoutOpened$.next();

      /* create fly out content */
      const flyoutContent: componentData<ToolbarPost> = {
        componentType: ToolbarPost,
        props: {
          feature: this,
        },
      };

      /* open flyout and destroy when clicked out */
      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          maxWidth: "300px",
          title: "Post Image",
          iconName: "file-img-letter-gif",
        },
      });
      this._flyoutSubscription = this._flyoutComponent.closed$
        .pipe(mergeWith(this._submitted$))
        .subscribe(() => {
          this._logger.info("Destroyed flyout");
          this._flyoutComponent?.$destroy();
          this._flyoutSubscription?.unsubscribe();
          this._flyoutComponent = undefined;
        });
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
    this._flyoutComponent = undefined;
  }

  /**
   * Gets a store based on the saved image history, joined with the current image
   * state if someone is currently drawing
   */
  public get imageHistoryStore() {

    const observable = this._imagePostService.history$.pipe( /* take current history as base */
      switchMap((history) => this._drawingService.drawingState$.pipe(
        take(1), /* get current drawing state once */
        switchMap(state => {
          if(state === "drawing") return this._imageFinishedService.mapToImageState(of(1)); /* if someone is drawing, fetch current image state */
          else return of(null);
        }),
        map(currentImage => currentImage === null ? history : [...history, currentImage])  /* if someone drawing, temporary add current state to history */
      ))
    );
    return fromObservable(observable, []);
  }

  /**
   * Gets a store based on the authenticated member
   */
  public get memberStore() {
    return fromObservable(this._memberService.memberData$, null);
  }

  /**
   * Post an image to discord
   * @param webhook
   * @param image
   * @param onlyImage
   */
  public async postWebhook(webhook: MemberWebhookDto, image: skribblImage, onlyImage: boolean){
    await this._apiService.getApi(GuildsApi).postImageToGuild({
      token: webhook.guild.invite,
      id: webhook.name,
      postImageDto: {
        title: image.name,
        author: image.artist,
        posterName: image.player,
        onlyImage,
        imageBase64: image.image.base64ApiTruncated,
      }
    });
    this._submitted$.next();
  }
}