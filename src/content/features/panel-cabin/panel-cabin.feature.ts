import { InventoryApi, type SceneDto, type SpriteDto, type SpriteInventoryDto, type SpriteSlotDto } from "@/api";
import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { ApiService } from "@/content/services/api/api.service";
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
  @inject(ApiService) private readonly _apiService!: ApiService;

  private _component?: PanelCabin;

  public readonly name = "Outfit Cabin";
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

      /* map data into useful structure */
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

  async reorderSlots(slotMap: number[], inventory: SpriteInventoryDto[], login: number){
    this._logger.debug("Reordering slots", slotMap, inventory);

    if(slotMap.every((v, i) => v === i)){
      this._logger.info("No change in slot order");
      return;
    }

    const slots: SpriteSlotDto[] = [];
    inventory.forEach(item => {
      if(item.slot !== undefined){
        slots.push({slotId: slotMap[item.slot-1]+1, spriteId: item.spriteId});
      }
    });

    await this._apiService.getApi(InventoryApi).setMemberSpriteCombo({login, spriteComboDto: {slots}});
    await this._memberService.refreshInventory();
    this._logger.info("Reordered slots", slots);
  }
}