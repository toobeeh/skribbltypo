import type { SceneDto, SpriteDto } from "@/api";
import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { MemberService } from "@/content/services/member/member.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { switchMap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelCabin from "./panel-cabin.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class PanelCabinFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(MemberService) private readonly _memberService!: MemberService;

  private _component?: PanelCabin;

  public readonly name = "Sprite Cabin";
  public readonly description = "Displays a drag-n-drop interface on the start page to customize your sprite combo";
  public readonly featureId = 3;

  private readonly _enableScenePickerSetting = this.useSetting(new BooleanExtensionSetting("enable_scene_picker", true, this)
    .withName("Enable Scene Picker")
    .withDescription("Show the scene picker at the top of the sprite cabin"));

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelCabin({
      target: elements.cabinTab,
      props: {
        feature: this
      }
    });
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }

  public get scenePickerSettingStore() {
    return this._enableScenePickerSetting.store;
  }

  public get memberStore() {
    return fromObservable(this._memberService.memberData$.pipe(
      switchMap(async memberData => {
        if(memberData === null || memberData === undefined) {
          return undefined;
        }
        const apiData = await this._apiDataSetup.complete();
        const slots = memberData.spriteInventory
          .filter(i => i.slot !== undefined)
          .sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0))
          .map(i => ({
          ...i,
          sprite: apiData.sprites.find(s => s.id === i.spriteId)
        }));

        const scene = memberData.sceneInventory.activeId ? {
          id: memberData.sceneInventory.activeId,
          shift: memberData.sceneInventory.activeShift,
          scene: apiData.scenes.find(s => s.id === memberData.sceneInventory.activeId)
        } : undefined;

        return { memberData, slots, scene };
      })
    ), undefined);
  }

  getItemThumbnailUrl(item: SpriteDto | SceneDto | undefined, shift: number | undefined) {
    return item ? shift ? `https://static.typo.rip/sprites/rainbow/modulate.php?url=${item.url}&hue=${shift}` : item.url : "";
  }
}