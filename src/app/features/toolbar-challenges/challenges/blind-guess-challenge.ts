import { TypoChallenge } from "@/app/features/toolbar-challenges/challenge";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { inject } from "inversify";
import { combineLatestWith, distinctUntilChanged, map, type Observable } from "rxjs";

export class BlindGuessChallenge extends TypoChallenge<boolean> {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  readonly name = "Blind Guess";
  readonly description = "You don't see what other people are drawing.";


  createTriggerObservable(): Observable<boolean> {
    return this._lobbyService.lobby$.pipe(
      combineLatestWith(this._drawingService.drawingState$),
      map(([lobby, drawing]) => {
        return drawing === "drawing"
          && lobby !== null && (lobby.meId !== lobby.drawerId)
          && !lobby.players.some(player => player.id === lobby.meId && player.guessed);
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