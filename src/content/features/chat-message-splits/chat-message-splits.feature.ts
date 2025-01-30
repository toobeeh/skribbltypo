import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";

export class ChatMessageSplitsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly name = "Longer Chat Messages";
  public readonly description = "Allows typing longer chat messages and splits them";
  public readonly featureId = 43;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    elements.chatInput.maxLength = 300; /* functionality is actually implemented in gamepatch */
  }

  protected override async onDestroy() {
    const elements = await this._elementsSetup.complete();
    elements.chatInput.maxLength = 100;
  }
}