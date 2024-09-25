import { TypoFeature } from "../../core/feature/feature";
import {
  ScriptStoppedLifecycleEvent,
} from "../../core/lifetime/lifecycleEvents.interface";
import { inject } from "inversify";
import TypoNews from "./typo-news.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class TypoNewsFeature extends TypoFeature<ScriptStoppedLifecycleEvent> {

  @inject(ElementsSetup)
  private readonly _elements!: ElementsSetup;

  private _component?: TypoNews;

  public readonly name = "Typo News";
  public readonly description = "Display typo hints and changelog on the start page";
  public readonly activateOn = "scriptStopped";

  protected async onActivate() {
    const elements = await this._elements.complete();
    this._component = new TypoNews({
      target: elements.newsTab,
      props: {
        feature: this
      }
    });
  }

  protected onDestroy(): void {
    throw new Error("Method not implemented.");
  }

  protected onFreeze = this.skipStep;
  protected onRun = this.skipStep;

  public readonly news = "Hello there ❤️✏️\n" +
    "Typo got a new look - enjoy the all-new icons!";
}