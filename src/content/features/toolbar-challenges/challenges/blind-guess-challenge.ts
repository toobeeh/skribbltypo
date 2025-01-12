import { TypoChallenge } from "@/content/features/toolbar-challenges/challenge";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import { distinctUntilChanged, map, type Observable } from "rxjs";

export class BlindGuessChallenge extends TypoChallenge<boolean> {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  readonly name = "Blind Guess";
  readonly description = "You don't see what other people are drawing.";


  createTriggerObservable(): Observable<boolean> {
    return this._lobbyService.lobby$.pipe(
      map(lobby => {
        return lobby !== null && (lobby.meId !== lobby.drawerId);
      }),
      distinctUntilChanged(),
    );
  }

  async apply(trigger: boolean): Promise<void> {
    const elements = await this._elementsSetup.complete();

    if(trigger) {
      elements.canvas.style.opacity = "0";
    }
    else {
      elements.canvas.style.opacity = "";
    }

    return;
  }

  destroy(): Promise<void> {
    return this.apply(false);
  }
}