import { FeatureTag } from "@/content/core/feature/feature-tags";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import ChatMessageSplitsComponent from "./chat-message-splits.svelte";

export class ChatMessageSplitsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly name = "Longer Chat Messages";
  public readonly description = "Allows typing longer chat messages and splits them";
  public readonly tags = [
    FeatureTag.INTERFACE,
    FeatureTag.GAMEPLAY
  ];
  public readonly featureId = 43;

  private _component?: ChatMessageSplitsComponent;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    this._component = new ChatMessageSplitsComponent({
      target: elements.chatForm,
    });

    elements.chatForm.classList.add("typo-extended");
    elements.chatInput.maxLength = 300; /* functionality is actually implemented in gamepatch */
  }

  protected override async onDestroy() {
    const elements = await this._elementsSetup.complete();
    elements.chatForm.classList.remove("typo-extended");
    elements.chatInput.maxLength = 100;
    this._component?.$destroy();
    this._component = undefined;
  }
}