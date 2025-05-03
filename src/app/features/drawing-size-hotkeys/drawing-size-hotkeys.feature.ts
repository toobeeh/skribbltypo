import { FeatureTag } from "@/app/core/feature/feature-tags";
import { HotkeyAction } from "@/app/core/hotkeys/hotkey";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";

export class DrawingSizeHotkeysFeature extends TypoFeature {
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  public readonly name = "Brush Size Hotkeys";
  public readonly description = "Adds hotkeys to change the brush size";
  public readonly tags = [
    FeatureTag.DRAWING
  ];
  public readonly featureId = 51;

  private readonly _sizeHotkeys = [1,2,3,4,5].map(level => this.useHotkey(new HotkeyAction(
    `size_${level}`,
    `Brush size ${level}`,
    `Set the brush size to level ${level}`,
    this,
    () => this._drawingService.setSize([4, 10, 20, 32, 40][level - 1]),
    true,
    [`Digit${level}`],
  )));

}