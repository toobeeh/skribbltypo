import { TypoChallenge } from "@/content/features/toolbar-challenges/challenge";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { element, requireElements } from "@/util/document/requiredQuerySelector";
import { inject } from "inversify";
import {
  combineLatestWith, distinctUntilChanged, map,
  type Observable
} from "rxjs";

export class MonochromeChallenge extends TypoChallenge<boolean> {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  private _style?: CSSStyleSheet;

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

    /* remove old stylesheet */
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(
      (style) => style !== this._style,
    );

    if(!trigger) {
      document.adoptedStyleSheets = document.adoptedStyleSheets.filter(style => style !== this._style);
      this._style = undefined;
    }

    else {
      this._style = new CSSStyleSheet();

      /* hide typo palette colors */
      const typoPalette = element(".typo-palette-picker");
      if(typoPalette) {
        const columns = window.getComputedStyle(typoPalette).getPropertyValue("grid-template-columns").split(" ").length;
        const random = Math.floor(Math.random() * columns) + 1;
        this._style.insertRule(
          `#game[style*="display: flex"] .typo-palette-picker :not(:nth-child(${columns}n + ${random} of .typo-palette-picker-item)) { width: 0; overflow: hidden; }`,
        );
        this._style.insertRule(
          `#game[style*="display: flex"] .typo-palette-picker :nth-child(${columns}n + ${random} of .typo-palette-picker-item) { aspect-ratio: ${columns} !important }`,
        );
      }

      /* hide default palette colors */
      const defaultColumns = requireElements(".top .color").length;
      const random = Math.floor(Math.random() * defaultColumns) + 1;
      this._style.insertRule(
        `#game[style*="display: flex"] #game-toolbar .colors > div .color:nth-child(${random}) { width: calc(${defaultColumns} * var(--UNIT) / 2); }`,
      );
      this._style.insertRule(
        `#game[style*="display: flex"] #game-toolbar .colors > div .color:not(:nth-child(${random})) { display: none; }`,
      );

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, this._style];
    }
  }

  destroy(): void {
    this.apply(false);
  }
}