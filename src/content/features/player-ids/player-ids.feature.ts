import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { PlayersService } from "@/content/services/players/players.service";
import { take } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";

export class PlayerIdsFeature extends TypoFeature {
  @inject(PlayersService) private readonly _playersService!: PlayersService;

  public readonly name = "Player IDs";
  public readonly description = "Show player IDs in the lobby to execute commands like kick";
  public readonly featureId = 29;

  private readonly _revealIdsHotkey = this.useHotkey(
    new HotkeyAction(
      "reveal_id",
      "Reveal IDs",
      "Reveal the lobby player ID of all players",
      this,
      () => this.setRevealState(true),
      true,
      ["AltLeft"],
      () => this.setRevealState(false),
      false
    ),
  );

  private setRevealState(state: boolean) {
    this._playersService.players$.pipe(
      take(1)
    ).subscribe(players => {
      for (const player of players) {
        player.viewPlayerId = state;
      }
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this.setRevealState(false);
  }
}