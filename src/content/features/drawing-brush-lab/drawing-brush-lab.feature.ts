import { skribblTool } from "@/content/events/tool-changed.event";
import { TestMod } from "@/content/features/drawing-brush-lab/test-mod";
import { TestTool } from "@/content/features/drawing-brush-lab/test-tool";
import type { componentData } from "@/content/services/modal/modal.service";
import type { TypoDrawMod } from "@/content/services/tools/draw-mod";
import type { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { ToolsService } from "@/content/services/tools/tools.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import type { Type } from "@/util/types/type";
import { inject } from "inversify";
import { BehaviorSubject, combineLatestWith, firstValueFrom, map, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import DrawingBrushLabInfo from "./drawing-brush-lab-info.svelte";
import BrushLabSwitch from "./drawing-brush-lab-switch.svelte";
import BrushLabGroup from "./drawing-brush-lab-group.svelte";

export class DrawingBrushLabFeature extends TypoFeature {
  @inject(ToolsService) private readonly _toolsService!: ToolsService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly name = "Brush Laboratory";
  public readonly description = "Add custom drawing tools for special effects to the toolbar";
  public readonly featureId = 39;

  private _labSwitchComponent?: BrushLabSwitch;
  private _labGroupComponent?: BrushLabGroup;
  private _toolbarItems$ = new BehaviorSubject<{
    tools: {tool: TypoDrawTool, icon: string, active: boolean, name: string}[],
    mods: {mod: TypoDrawMod, icon: string, active: boolean, name: string}[]
  }>({ tools: [], mods: [] });

  private _tools: {icon: string, name: string, tool: Type<TypoDrawTool>}[] = [
    { icon: "var(--file-img-wand-gif)", name: "Test Tool",  tool: TestTool }
  ];

  private _mods: {icon: string, name: string, mod: Type<TypoDrawMod>}[] = [
    { icon: "var(--file-img-wand-gif)", name: "Test Mod",  mod: TestMod }
  ];

  public override get featureInfoComponent(): componentData<DrawingBrushLabInfo> {
    return { componentType: DrawingBrushLabInfo, props: { feature: this } };
  }

  /*private _pressureMod?: TypoDrawMod;*/

  protected override async onActivate() {
    /*const t = this._toolsService.resolveModOrTool(TestTool);
    this._toolsService.activateTool(t);*/
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
    /*if (this._pressureMod) {
      this._toolsService.removeMod(this._pressureMod);
      this._pressureMod = undefined;
    }*/

    if (this._labSwitchComponent) {
      this._labSwitchComponent.$destroy();
      this._labSwitchComponent = undefined;
    }

    if (this._labGroupComponent) {
      this._labGroupComponent.$destroy();
      this._labGroupComponent = undefined;
    }

    const items = await firstValueFrom(this._toolbarItems$);
    items.mods.forEach(({ mod }) => this._toolsService.removeMod(mod));
    this._toolsService.activateTool(skribblTool.brush);
  }

  public get toolbarItemsStore(){
    return fromObservable(this._toolbarItems$.pipe(
      combineLatestWith(this._toolsService.activeTool$, this._toolsService.activeMods$),
      map(([items, activeTool, activeMods]) => {
        items.tools.forEach(item => item.active = item.tool === activeTool);
        items.mods.forEach(item => item.active = activeMods.includes(item.mod));
        return items;
      })
    ), this._toolbarItems$.value);
  }

  private createItems(){
    const tools = this._tools.map(({ icon, tool, name }) => {
      return { tool: this._toolsService.resolveModOrTool(tool), name, icon, active: false };
    });

    const mods = this._mods.map(({ icon, mod, name }) => {
      return { mod: this._toolsService.resolveModOrTool(mod), name, icon, active: false };
    });

    this._toolbarItems$.next({ tools, mods });
  }

  public activateTool(tool: TypoDrawTool){
    this._toolsService.activateTool(tool);
  }

  public activateMod(mod: TypoDrawMod){
    this._toolsService.activateMod(mod);
  }

  public removeMod(mod: TypoDrawMod){
    this._toolsService.removeMod(mod);
  }
}