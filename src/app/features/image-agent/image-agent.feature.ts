import { FeatureTag } from "@/app/core/feature/feature-tags";
import { ExtensionSetting } from "@/app/core/settings/setting";
import AgentFlyout from "./image-agent-flyout.svelte";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import type { componentData } from "@/app/services/modal/modal.service";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import { fromObservable } from "@/util/store/fromObservable";
import { delay, map, type Subscription, tap, withLatestFrom } from "rxjs";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class ImageAgentFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  private _autoOpenOwnTurnSetting = new ExtensionSetting<boolean>("autoOpenOwnTurn", true, this);

  private _iconElement?: IconButton;
  private _flyoutComponent?: AreaFlyout;
  private _iconClickSubscription?: Subscription;
  private _flyoutSubscription?: Subscription;
  private _activationSubscription?: Subscription;

  public readonly name = "Image Agent";
  public readonly description = "Displays a reference image of the word when it's your turn to draw";
  public readonly featureId = 14;
  public readonly tags = [
    FeatureTag.DRAWING
  ];
  protected override readonly featureEnabledDefault = false;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    this._iconElement = new IconButton({
      target: elements.chatControls,
      props: {
        icon: "file-img-light-gif",
        name: "Image Agent",
        order: 1,
        size: "2rem",
        hoverMove: false,
        greyscaleInactive: true,
        tooltipAction: this.createTooltip
      }
    });

    /* show agent when icon clicked */
    this._iconClickSubscription = this._iconElement.click$.pipe(
      withLatestFrom(this._drawingService.drawingState$),
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    ).subscribe(([,state]: [void, "drawing" | "idle"]) => {
      this.setAgentVisibility(true);
      if(state === "drawing") this._autoOpenOwnTurnSetting.setValue(true);
    });

    this.listenForActivation();
  }

  protected override onDestroy() {
    this._flyoutComponent?.$destroy();
    this._flyoutComponent = undefined;
    this._iconElement?.$destroy();
    this._iconElement = undefined;
    this._iconClickSubscription?.unsubscribe();
    this._iconClickSubscription = undefined;
    this._flyoutSubscription?.unsubscribe();
    this._flyoutSubscription = undefined;
    this._activationSubscription?.unsubscribe();
    this._activationSubscription = undefined;
  }

  private get isOpen() {
    return this._flyoutComponent !== undefined;
  }

  get wordStore() {

    /* create observable that emits the current word if the drawer is self */
    const ownWordChanges = this._drawingService.drawingState$.pipe(
      delay(100), /* delay so that no race condition between latest occurs */
      withLatestFrom(this._lobbyService.lobby$, this._drawingService.imageState$),
      map(([state, lobby, image]) => {

        /* if drawing ended or any state faulty, hide always */
        if(state === "idle" || lobby === null || image === null) return null;
        return image.word.solution ?? null;
      }),
      tap(word => this._logger.debug("Word change", word))
    );

    return fromObservable(ownWordChanges, null);
  }

  async getImages(word: string){
    return await (await fetch(`https://agent.typo.rip/${word}`)).json() as string[];
  }

  private listenForActivation(){
    this._activationSubscription = this._drawingService.drawingState$.pipe(
      tap(() => this._logger.debug("Hidden setting changed")),
      withLatestFrom(this._lobbyService.lobby$, this._drawingService.imageState$, this._autoOpenOwnTurnSetting.changes$)
    ).subscribe(async ([state, lobby, image, autoOpen]) => {
      if(lobby === null || image === null || state === "idle") {
        await this.setAgentVisibility(false);
      }

      if(!this.isOpen){
        if(autoOpen && state === "drawing"){
          await this.setAgentVisibility(true);
        }
      }
    });
  }

  async setAgentVisibility(visible: boolean) {
    if(!visible){
      if(this._flyoutComponent){
        this._flyoutComponent?.close();
      }
    }

    else {
      const elements = await  this._elementsSetup.complete();

      /* create fly out content */
      const flyoutContent: componentData<AgentFlyout> = {
        componentType: AgentFlyout,
        props: {
          feature: this,
        },
      };

      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          maxWidth: "300px",
          title: "Image Agent",
          closeStrategy: "explicit",
          iconName: "file-img-light-gif",
          alignment: "top",
          contentPadding: false
        },
      });

      this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(() => {
        this._logger.info("Destroyed flyout");
        this._flyoutComponent?.$destroy();
        this._flyoutSubscription?.unsubscribe();
        this._flyoutComponent = undefined;
        this._autoOpenOwnTurnSetting.setValue(false);
      });
    }
  }
}