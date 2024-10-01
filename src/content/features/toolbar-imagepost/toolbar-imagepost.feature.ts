import { GuildsApi, type MemberWebhookDto } from "@/api";
import { ApiService } from "@/content/services/api/api.service";
import { type imageHistory, ImageHistoryService } from "@/content/services/image-history/image-history.service";
import { MemberService } from "@/content/services/member/member.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {
  mergeWith,
  Subject,
  Subscription,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarPost from "./toolbar-imagepost.svelte";

export class ToolbarImagePostFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ImageHistoryService) private readonly _historyService!: ImageHistoryService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ApiService) private readonly _apiService!: ApiService;

  public readonly name = "Image Post";
  public readonly description =
    "Adds an icon to the typo toolbar to send images from your lobby directly to one of your connected discord servers";
  public readonly featureId = 11;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;

  private _popoutOpened$ = new Subject<void>();
  private _submitted = new Subject<void>();

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
        .pipe(mergeWith(this._submitted))
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

  public get imageHistoryStore() {
    return fromObservable(this._historyService.getImageHistory$(true), []);
  }

  public get memberStore() {
    return fromObservable(this._memberService.memberData$, null);
  }

  public async postWebhook(webhook: MemberWebhookDto, image: imageHistory, onlyImage: boolean){
    await this._apiService.getApi(GuildsApi).postImageToGuild({
      token: webhook.guild.invite,
      id: webhook.name,
      postImageDto: {
        title: image.name,
        author: image.artist,
        posterName: image.player,
        onlyImage,
        imageBase64: image.base64.split(",")[1].replace("==", ""),
      }
    });
    this._submitted.next();
  }
}