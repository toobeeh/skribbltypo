import { inject } from "inversify";
import { TypoFeature } from "../../core/feature/feature";
import { LobbyService } from "../../services/lobby/lobby.service";
import { GamePatchReadySetup } from "../../setups/game-patch-ready/game-patch.setup";

export class LobbyNavigationFeature extends TypoFeature {

  @inject(GamePatchReadySetup) private readonly _gamePatchReady!: GamePatchReadySetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public readonly name = "name";
  public readonly description = "description";

  protected override async onActivate() {
    await this._gamePatchReady.complete();
    console.log();
  }
}