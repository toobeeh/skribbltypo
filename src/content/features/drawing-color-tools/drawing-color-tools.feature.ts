import { skribblTool } from "@/content/events/tool-changed.event";
import { PipetteTool } from "@/content/features/drawing-color-tools/pipette-tool";
import type { componentData } from "@/content/services/modal/modal.service";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { ToolsService } from "@/content/services/tools/tools.service";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import ColorToolsInfo from "./drawing-color-tools-info.svelte";
import DrawingColorTools from "./drawing-color-tools.svelte";

export class DrawingColorToolsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly elementsSetup!: ElementsSetup;
  @inject(ToolsService) private readonly _toolsService!: ToolsService;

  public readonly name = "Color Tools";
  public readonly description = "Add a pipette and color picker to the toolbar";
  public readonly featureId = 31;

  private _component?: DrawingColorTools;
  private _pipetteTool?: TypoDrawTool;

  public override get featureInfoComponent(): componentData<ColorToolsInfo> {
    return { componentType: ColorToolsInfo, props: {} };
  }

  protected override async onActivate() {
    const elements = await this.elementsSetup.complete();
    this._pipetteTool = this._toolsService.resolveModOrTool(PipetteTool);

    this._component = new DrawingColorTools({
      target: elements.skribblTools,
      anchor: elements.skribblBrushTools,
      props: {
        feature: this,
      },
    });
  }

  protected override async onDestroy() {
    this._component?.$destroy();
    this._component = undefined;
  }

  public selectPipetteTool() {
    if (!this._pipetteTool) {
      this._logger.error("Pipette tool not initialized");
      throw new Error("Pipette tool not initialized yet");
    }

    this._toolsService.activateTool(this._pipetteTool);
  }

  public get selectedToolStore() {
    return fromObservable(this._toolsService.activeTool$, skribblTool.brush);
  }
}