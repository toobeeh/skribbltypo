import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ModalService } from "../../services/modal/modal.service";
import { GamePatchReadySetup } from "../../setups/game-patch-ready/game-patch.setup";
import TypoNews from "./typo-news.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class TypoNewsFeature extends TypoFeature {

  @inject(GamePatchReadySetup) private readonly _gamePatchReady!: GamePatchReadySetup;
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ModalService) private readonly _modal!: ModalService;

  private _component?: TypoNews;

  public readonly name = "Typo News";
  public readonly description = "Display typo hints and changelog on the start page";

  protected override async onActivate() {
    await this._gamePatchReady.complete();
    const elements = await this._elements.complete();
    this._component = new TypoNews({
      target: elements.newsTab,
      props: {
        feature: this
      }
    });
  }

  public readonly news = "Hello there ❤️✏️\n" +
    "Typo got a new look - enjoy the all-new icons!";

  public modalTest() {
    this._modal.showModal(TypoNews, {feature: this});
  }
}