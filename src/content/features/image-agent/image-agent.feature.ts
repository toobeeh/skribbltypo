import { ExtensionSetting } from "@/content/core/settings/setting";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { fromObservable } from "@/util/store/fromObservable";
import { delay, map, tap, withLatestFrom } from "rxjs";
import ImageAgent from "./image-agent.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class ImageAgentFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  private _hiddenSetting = new ExtensionSetting<boolean>("hidden", false, this);

  private _element?: ImageAgent;
  private _iconElement?: IconButton;

  public readonly name = "Image Agent";
  public readonly description = "Displays a reference image of the word when it's your turn to draw";
  public readonly featureId = 14;
  protected override readonly featureEnabledDefault = false;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    this._element = new ImageAgent({
      target: elements.gameWrapper,
      props: {
        feature: this
      },
    });

    this._iconElement = new IconButton({
      target: elements.chatControls,
      props: {
        icon: "file-img-light-gif",
        name: "Image Agent",
        order: 1,
        size: "2rem",
        hoverMove: false,
        greyscaleInactive: true
      }
    });

    /* show agent when icon clicked */
    this._iconElement.click$.subscribe(() => {
      this.setHiddenState(false);
    });
  }

  protected override onDestroy() {
    this._element?.$destroy();
    this._iconElement?.$destroy();
  }

  get wordStore() {

    /* create observable that emits the current word if the drawer is self */
    const ownWordChanges = this._drawingService.drawingState$.pipe(
      delay(100), /* delay so that no race condition between latest occurs */
      withLatestFrom(this._lobbyService.lobby$, this._drawingService.imageState$),
      map(([state, lobby, image]) => {

        /* if drawing ended or any state faulty, hide always */
        if(state === "idle" || lobby === null || image === null) return null;
        /* else get word if current drawer is player */
        const drawer = lobby?.players.find(p => p.id === image.drawerId);
        if(drawer?.id === lobby.meId) return image.word.solution;
        else return null;
      }),
      tap(word => this._logger.debug("Word change", word))
    );

    return fromObservable(ownWordChanges, null);
  }

  async getImages(word: string){
    return await (await fetch(`https://agent.typo.rip/${word}`)).json() as string[];
  }

  get hiddenSettingStore(){
    return fromObservable(this._hiddenSetting.changes$, false);
  }

  setHiddenState(hidden: boolean){
    this._hiddenSetting.setValue(hidden);
  }
}