import UserInfo from "./user-info.svelte";
import { TypoFeature } from "../../core/feature/feature";
import {
  ScriptStoppedLifecycleEvent,
} from "../../core/lifetime/lifecycleEvents.interface";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class UserInfoFeature extends TypoFeature<ScriptStoppedLifecycleEvent> {

  @inject(ElementsSetup)
  private readonly _elements!: ElementsSetup;

  public readonly name = "User info";
  public readonly description = "Show user information beneath the avatar selection";
  public readonly activateOn = "scriptStopped";

  protected onRun = this.skipStep;
  protected onFreeze = this.skipStep;

  protected async onActivate(event: ScriptStoppedLifecycleEvent) {
    this._logger.info("Activatasdfasdfing feature", event);

    const elements = await this._elements.complete();
    new UserInfo({
      target: elements.avatarPanel,
      props: {
        feature: this,
      },
    });
  }

  protected onDestroy(): void {
    throw new Error("Method not implemented.");
  }
}