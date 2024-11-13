import { inject } from "inversify";
import { filter, take, tap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { LobbyService } from "../../services/lobby/lobby.service";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import LobbyNavigation from "./lobby-navigation.svelte";

export class LobbyNavigationFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public readonly name = "Lobby Navigation";
  public readonly description = "Show a navigation bar in-game to exit or skip the current lobby";
  public readonly featureId = 2;

  private _component?: LobbyNavigation;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    this._component = new LobbyNavigation({
      target: elements.gameBar,
      anchor: elements.gameSettings,
      props: {
        feature: this,
      },
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._component?.$destroy();
  }

  public nextLobby() {
    /* get first lobby from observable (current) and leave if not null until null received, then join */
    this._lobbyService.lobby$
      .pipe(
        tap((lobby) => {
          if (lobby !== null) {
            this._lobbyService.leaveLobby();
          }
        }),
        filter((lobby) => lobby === null),
        take(1),
      )
      .subscribe(() => {
        this._lobbyService.joinLobby();
      });
  }

  public exitLobby() {
    /* get first lobby from observable (current) and leave if not null*/
    this._lobbyService.lobby$
      .pipe(
        take(1),
        filter((lobby) => lobby !== null),
      )
      .subscribe(() => {
        this._lobbyService.leaveLobby();
      });
  }
}