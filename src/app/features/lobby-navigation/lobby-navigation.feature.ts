import { ExtensionCommand } from "@/app/core/commands/command";
import { InterpretableSuccess } from "@/app/core/commands/results/interpretable-success";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { inject } from "inversify";
import { filter, type Subscription, take, tap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { LobbyService } from "../../services/lobby/lobby.service";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import LobbyNavigation from "./lobby-navigation.svelte";

export class LobbyNavigationFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public readonly name = "Lobby Navigation";
  public readonly description = "Show a navigation bar in-game to exit or skip the current lobby";
  public readonly tags = [
    FeatureTag.SOCIAL
  ];
  public readonly featureId = 2;

  private _component?: LobbyNavigation;

  private readonly _overrideLogoExitSetting = this.useSetting(
    new BooleanExtensionSetting("overrideLogoExit", true, this)
      .withName("Enhanced Logo Exit")
      .withDescription("Exit the lobby instead reloading skribbl when clicking the logo"),
  );

  private readonly _nextCommand = this.useCommand(
    new ExtensionCommand("skip", this, "Skip Lobby", "Leave the current lobby and join another"),
  ).run(async (command) => {
    this.nextLobby();
    return new InterpretableSuccess(command, "Skipping lobby");
  });

  private readonly _leaveCommand = this.useCommand(
    new ExtensionCommand("leave", this, "Left Lobby", "Leave the current lobby"),
  ).run(async (command) => {
    this.exitLobby();
    return new InterpretableSuccess(command, "Skipped lobby");
  });

  private _logoClickListener = this.onLogoClick.bind(this);
  private _settingChangeSubscription?: Subscription;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    this._component = new LobbyNavigation({
      target: elements.gameBar,
      anchor: elements.gameSettings,
      props: {
        feature: this,
      },
    });

    this._settingChangeSubscription = this._overrideLogoExitSetting.changes$.subscribe((value) => {
      if (value) {
        elements.logoIngame.addEventListener("click", this._logoClickListener);
      } else {
        elements.logoIngame.removeEventListener("click", this._logoClickListener);
      }
    });
  }

  protected override async onDestroy(): Promise<void> {
    this._component?.$destroy();
    const elements = await this._elementsSetup.complete();
    elements.logoIngame.removeEventListener("click", this._logoClickListener);
  }

  private onLogoClick(event: Event){
    event.stopImmediatePropagation();
    event.preventDefault();
    this._settingChangeSubscription?.unsubscribe();
    this._settingChangeSubscription = undefined;
    this.exitLobby();
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