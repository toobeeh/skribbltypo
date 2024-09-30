import { GuildsApi, type MemberWebhookDto } from "@/api";
import { ApiService } from "@/content/services/api/api.service";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { MemberService } from "@/content/services/member/member.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {
  BehaviorSubject, delay,
  filter,
  map, mergeWith,
  type Observable, of,
  scan, Subject,
  Subscription,
  switchMap, take,
  withLatestFrom,
} from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarPost from "./toolbar-imagepost.svelte";

interface imageHistory {
  name: string;
  base64: string;
  artist: string;
  date: Date;
  poster: string;
}

export class ToolbarImagePostFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _memberDataSetup!: ApiDataSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
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

  private _imageHistory$ = new BehaviorSubject<imageHistory[]>([]);
  private _popoutOpened$ = new Subject<void>();
  private _submitted = new Subject<void>();

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

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

  /**
   * A new observable is returned, that whenever the input observable emits, gets the current image state
   * @param input
   * @private
   */
  private mapToImageState(input: Observable<unknown>) {
    return input.pipe(
      withLatestFrom(this._drawingService.imageState$, this._lobbyService.lobby$),  /* on every input, fetch latest lobby and drawing state */
      switchMap((data) =>
        fromPromise(this._drawingService.getCurrentImageBase64()).pipe(
          map((base64) => ({ image: data[1], lobby: data[2], base64 })), /* fetch additionally current drawing blob and add to data */
        ),
      ),
      map((state) => {
        if (state.image === null || state.lobby === null) return null; /* something unexpected */
        const { lobby, image, base64 } = state;
        return {
          name: image.word.solution ?? `${image.word.hints} (${image.word.length.join(", ")})`,
          base64: base64,
          artist: lobby.players.find((p) => p.id === image.drawerId)?.name ?? "Unknown Artist",
          date: new Date(),
          poster: lobby.players.find(p => p.id === lobby.meId)?.name ?? "Unknown Poster",
        } as imageHistory; /* return mapped data as image history object */
      }),
    );
  }

  public get imageHistoryStore() {
    const history = this._imageHistory$.pipe( /* take current history as base */
      switchMap((history) => this._drawingService.drawingState$.pipe(
        take(1), /* get current drawing state once */
        switchMap(state => {
          if(state === "drawing") return this.mapToImageState(of(1)); /* if someone is drawing, fetch current image state */
          else return of(null);
        }),
        map(currentImage => currentImage === null ? history : [...history, currentImage])  /* if someone drawing, temporary add current state to history */
      ))
    );
    return fromObservable(history, []);
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
        posterName: image.poster,
        onlyImage,
        imageBase64: image.base64.split(",")[1].replace("==", ""),
      }
    });
    this._submitted.next();
  }
}