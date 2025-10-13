import { FeatureTag } from "@/app/core/feature/feature-tags";
import { HotkeyAction } from "@/app/core/hotkeys/hotkey";
import { skribblTool } from "@/app/events/tool-changed.event";
import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
import { MandalaMod } from "@/app/features/drawing-brush-lab/mods/mandala-mod";
import { NoiseMod } from "@/app/features/drawing-brush-lab/mods/noise-mod";
import { ParallelLineMod } from "@/app/features/drawing-brush-lab/mods/parallel-line-mod";
import { PressureInkMod } from "@/app/features/drawing-brush-lab/mods/pressure-ink-mod";
import { RainbowMod } from "@/app/features/drawing-brush-lab/mods/rainbow-mod";
import { RandomColorMod } from "@/app/features/drawing-brush-lab/mods/random-color-mod";
import { SculptMod } from "@/app/features/drawing-brush-lab/mods/sculpt-mod";
import { TiltMod } from "@/app/features/drawing-brush-lab/mods/tilt-mod";
import { DashTool } from "@/app/features/drawing-brush-lab/tools/dash-tool";
import { DotTool } from "@/app/features/drawing-brush-lab/tools/dot-tool";
import { GridTool } from "@/app/features/drawing-brush-lab/tools/grid-tool";
import { type componentData, ModalService } from "@/app/services/modal/modal.service";
import type { TypoDrawMod } from "@/app/services/tools/draw-mod";
import { TypoDrawTool } from "@/app/services/tools/draw-tool";
import { ToolsService } from "@/app/services/tools/tools.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import type { Type } from "@/util/types/type";
import { inject } from "inversify";
import { BehaviorSubject, combineLatestWith, firstValueFrom, map } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import DrawingBrushLabInfo from "./drawing-brush-lab-info.svelte";
import BrushLabSwitch from "./drawing-brush-lab-switch.svelte";
import BrushLabGroup from "./drawing-brush-lab-group.svelte";
import BrushLabManage from "./drawing-brush-lab-manage.svelte";

export class DrawingBrushLabFeature extends TypoFeature {
  @inject(ToolsService) private readonly _toolsService!: ToolsService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;

  public readonly name = "Brush Laboratory";
  public readonly description = "Add custom drawing tools for special effects to the toolbar";
  public readonly tags = [
    FeatureTag.DRAWING
  ];
  public readonly featureId = 39;

  private _labSwitchComponent?: BrushLabSwitch;
  private _labGroupComponent?: BrushLabGroup;
  private _toolbarItems$ = new BehaviorSubject<{
    tools: { item: TypoDrawTool & BrushLabItem, active: boolean }[],
    mods: { item: TypoDrawMod & BrushLabItem, active: boolean }[]
  }>({ tools: [], mods: [] });

  private _items: Type<TypoDrawMod & BrushLabItem>[] = [
    ParallelLineMod,
    MandalaMod,
    SculptMod,
    DotTool,
    DashTool,
    RainbowMod,
    RandomColorMod,
    PressureInkMod,
    GridTool,
    NoiseMod,
    TiltMod
  ];

  private readonly _brushLabToggleHotkey = this.useHotkey(
    new HotkeyAction(
      "toggle_lab",
      "Toggle Brush Lab",
      "Toggle the visibility of the brush lab below skribbl tools",
      this,
      () => this._labSwitchComponent?.toggle(),
      true,
      ["ShiftLeft", "KeyL"]
    )
  );

  public override get featureInfoComponent(): componentData<DrawingBrushLabInfo> {
    return { componentType: DrawingBrushLabInfo, props: { feature: this } };
  }

  /*public override get featureManagementComponent(): componentData<BrushLabManage> {
    return { componentType: BrushLabManage, props: { feature: this } };
  }*/

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    this._labGroupComponent = new BrushLabGroup({
      target: elements.skribblToolbar,
      props: { feature: this },
    });

    this._labSwitchComponent = new BrushLabSwitch({
      target: elements.skribblActions,
      props: { feature: this },
    });

    this.createItems();
  }

  protected override async onDestroy() {
    if (this._labSwitchComponent) {
      this._labSwitchComponent.$destroy();
      this._labSwitchComponent = undefined;
    }

    if (this._labGroupComponent) {
      this._labGroupComponent.$destroy();
      this._labGroupComponent = undefined;
    }

    const items = await firstValueFrom(this._toolbarItems$);
    items.mods.forEach(({ item }) => this._toolsService.removeMod(item));
    await this._toolsService.activateTool(skribblTool.brush);
  }

  public get toolbarItemsStore(){
    return fromObservable(this._toolbarItems$.pipe(
      combineLatestWith(this._toolsService.activeTool$, this._toolsService.activeMods$),
      map(([items, activeTool, activeMods]) => {
        return {
          mods: items.mods.map(item => ({item: item.item, active: activeMods.includes(item.item)})),
          tools: items.tools.map(item => ({item: item.item, active: activeTool === item.item}))
        };
      })
    ), this._toolbarItems$.value);
  }

  private createItems(){
    const items = this._items.map(item => this._toolsService.resolveModOrTool(item));

    const tools = items.filter(item => item instanceof TypoDrawTool).map(item => ({ item, active: false }));
    const mods = items.filter(item => !(item instanceof TypoDrawTool)).map(item => ({ item, active: false }));

    this._toolbarItems$.next({ tools, mods });
  }

  public async activateTool(tool: TypoDrawTool | skribblTool){
    await this._toolsService.activateTool(tool);
  }

  public async activateMod(mod: TypoDrawMod){
    await this._toolsService.activateMod(mod);
  }

  public async removeMod(mod: TypoDrawMod){
    await this._toolsService.removeMod(mod);
  }

  public openBrushLabSettings(initTool?: (BrushLabItem & TypoDrawMod) | undefined){
    const componentData: componentData<BrushLabManage> = {
      componentType: BrushLabManage,
      props: { feature: this, initTool }
    };
    this._modalService.showModal(componentData.componentType, componentData.props, "Brush Laboratory");
  }
}