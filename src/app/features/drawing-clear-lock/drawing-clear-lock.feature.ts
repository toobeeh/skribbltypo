import { FeatureTag } from "@/app/core/feature/feature-tags";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import { LobbyStatsService } from "@/app/services/lobby-stats/lobby-stats.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { inject } from "inversify";
import { TypoFeature } from "../../core/feature/feature";

export class DrawingClearLockFeature extends TypoFeature {

  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(LobbyStatsService) private readonly _lobbyStatsService!: LobbyStatsService;

  public readonly name = "Lock Clear";
  public readonly description = "Asks for confirmation before clearing the canvas in practice mode, and optionally in lobbies.";
  public readonly tags = [
    FeatureTag.DRAWING
  ];
  public readonly featureId = 53;

  protected override async onActivate() {
    this._drawingService.lockManualClear(true);

    // TODO complete with toast, listener at clear button, depending on lobby type
    /*const clearBtn = (await this._elementsSetup.complete()).clearButton;*/
  }

  protected override async onDestroy() {
    this._drawingService.lockManualClear(false);
  }
}