import { FeatureTag } from "@/app/core/feature/feature-tags";
import { TypoFeature } from "../../core/feature/feature";

export class PingAndRepliesFeature extends TypoFeature {
  public readonly name = "Pings and Replies";
  public readonly description =
    "Lets you reply to messages, ping others, and highlights when you're pinged.";
  public readonly tags = [FeatureTag.INTERFACE, FeatureTag.SOCIAL];
  public readonly featureId = 52;

  protected override async onActivate() {
    void 0;
  }

  protected override async onDestroy() {
    void 0;
  }
}
