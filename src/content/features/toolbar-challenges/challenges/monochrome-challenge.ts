import { defaultPalettes } from "@/content/features/drawing-color-palettes/default-palettes";
import { TypoChallenge } from "@/content/features/toolbar-challenges/challenge";
import { ColorsService } from "@/content/services/colors/colors.service";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { inject } from "inversify";
import {
  combineLatestWith, distinctUntilChanged, map,
  type Observable
} from "rxjs";

export class MonochromeChallenge extends TypoChallenge<boolean> {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ColorsService) private readonly _colorsService!: ColorsService;

  readonly name = "Monochrome";
  readonly description = "You can only use shades of a random color column.";

  createTriggerObservable(): Observable<boolean> {
    return this._lobbyService.lobby$.pipe(
      combineLatestWith(this._drawingService.drawingState$),
      map(([lobby, drawing]) => drawing === "drawing" && lobby !== null && (lobby.meId === lobby.drawerId)),
      distinctUntilChanged()
    );
  }

  apply(trigger: boolean): void {

    if(!trigger) {
      this._colorsService.resetColorSelector();
    }

    else {
      this._colorsService.setColorSelector((palette) => {
        palette = palette ?? defaultPalettes.skribblPalette;
        const random = Math.floor(Math.random() * palette.columns);
        return {
          columns: 1,
          colorHexCodes: palette?.colorHexCodes.filter((_, index) => (index % palette.columns) === random) ?? []
        };
      });
    }
  }

  destroy(): void {
    this.apply(false);
  }
}