import { inject } from "inversify";
import { TypoFeature } from "../../core/feature/feature";
import {
  type ScriptStoppedLifecycleEvent,
} from "../../core/lifetime/lifecycleEvents.interface";
import { LobbyService } from "../../services/lobby/lobby.service";

export class LobbyNavigationFeature extends TypoFeature<ScriptStoppedLifecycleEvent> {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public readonly name = "name";
  public readonly description = "description";
  public readonly activateOn = "scriptStopped";

  protected async onActivate() {
    console.log();
  }

  protected onDestroy(): void {
    throw new Error("Method not implemented.");
  }

  protected onFreeze = this.skipStep;
  protected onRun = this.skipStep;
}