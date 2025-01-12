import { TypoChallenge } from "@/content/features/toolbar-challenges/challenge";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import { combineLatestWith, distinctUntilChanged, map, type Observable } from "rxjs";

export class DrunkVisionChallenge extends TypoChallenge<boolean> {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  readonly name = "Drunk Vision";
  readonly description = "You can only vaguely see what other people draw.";

  private _overlay?: HTMLDivElement;

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
      if(this._overlay === undefined){
        this._overlay = document.createElement("div");
        this._overlay.style.position = "absolute";
        this._overlay.style.width = "100%";
        this._overlay.style.height = "100%";
        this._overlay.style.backdropFilter = "blur(40px)";
        this._overlay.style.pointerEvents = "none";
        this._overlay.style.zIndex = "0";
        elements.canvasWrapper.appendChild(this._overlay);
      }
    }
    else {
      this._overlay?.remove();
      this._overlay = undefined;
    }

    return;
  }

  destroy(): Promise<void> {
    return this.apply(false);
  }
}