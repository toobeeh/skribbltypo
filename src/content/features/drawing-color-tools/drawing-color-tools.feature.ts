import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { ColorChangedEventListener } from "@/content/events/color-changed.event";
import { skribblTool } from "@/content/events/tool-changed.event";
import { PipetteTool } from "@/content/features/drawing-color-tools/pipette-tool";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { ToolsService } from "@/content/services/tools/tools.service";
import { Color } from "@/util/color";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {  filter, map, Subject, type Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import ColorToolsInfo from "./drawing-color-tools-info.svelte";
import DrawingColorTools from "./drawing-color-tools.svelte";

export class DrawingColorToolsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly elementsSetup!: ElementsSetup;
  @inject(ToolsService) private readonly _toolsService!: ToolsService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ColorChangedEventListener) private readonly _colorChangedListener!: ColorChangedEventListener;

  public readonly name = "Color Tools";
  public readonly description = "Add a pipette and color picker to the toolbar";
  public readonly featureId = 31;

  private readonly pipetteHotkey = this.useHotkey(new HotkeyAction(
    "activate_pipette",
    "Use Pipette",
    "Activate the pipette tool to select a color from the canvas",
    this,
    () => this.selectPipetteTool(),
    undefined
  ));

  private _component?: DrawingColorTools;
  private _pipetteTool?: TypoDrawTool;
  private _colorChangeSubscription?: Subscription;
  private readonly _currentColor$ = new Subject<Color>();

  public override get featureInfoComponent(): componentData<ColorToolsInfo> {
    return { componentType: ColorToolsInfo, props: {} };
  }

  protected override async onActivate() {
    const elements = await this.elementsSetup.complete();
    this._pipetteTool = this._toolsService.resolveModOrTool(PipetteTool);

    this._colorChangedListener.events$.pipe(
      withLatestFrom(this._currentColor$),
      filter(([event, currentColor]) => event.data.hex !== currentColor.hex),
      map(([event]) => event),
    ).subscribe((event) => {
      this._currentColor$.next(event.data);
    });

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
    this._colorChangeSubscription?.unsubscribe();
    this._colorChangeSubscription = undefined;
    this._pipetteTool = undefined;
  }

  public selectPipetteTool() {
    if (!this._pipetteTool) {
      this._logger.error("Pipette tool not initialized");
      throw new Error("Pipette tool not initialized yet");
    }

    this._logger.info("Pipette tool selected");
    this._toolsService.activateTool(this._pipetteTool);
  }

  public get selectedToolStore() {
    return fromObservable(this._toolsService.activeTool$, skribblTool.brush);
  }

  public get colorStore() {
    return fromObservable(this._currentColor$, new Color(0, 0, 0));
  }

  public updatePickedColor(color: Color){
    this._logger.info("Color picked", color);
    this._drawingService.setColor(color.skribblCode);
  }
}