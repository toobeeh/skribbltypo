import {
  InventoryApi,
  type SceneDto,
  type SceneInventoryDto,
  type SpriteDto,
  type SpriteInventoryDto,
  type SpriteSlotDto,
} from "@/api";
import { FeatureTag } from "@/content/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { ApiService } from "@/content/services/api/api.service";
import { MemberService } from "@/content/services/member/member.service";
import {
  type componentDataFactory,
  ModalService,
} from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { switchMap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelCabin from "./panel-cabin.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import SpritePicker from "./panel-cabin-sprite-picker.svelte";
import ScenePicker from "./panel-cabin-scene-picker.svelte";

export class PanelCabinFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ApiService) private readonly _apiService!: ApiService;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  private _component?: PanelCabin;

  public readonly name = "Outfit Cabin";
  public readonly description =
    "Displays a drag-n-drop interface on the start page to customize your sprite combo";
  public readonly tags = [
    FeatureTag.PALANTIR
  ];
  public readonly featureId = 3;

  private readonly _enableScenePickerSetting = this.useSetting(
    new BooleanExtensionSetting("enable_scene_picker", true, this)
      .withName("Enable Scene Picker")
      .withDescription("Show the scene picker at the top of the sprite cabin"),
  );

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelCabin({
      target: elements.cabinTab,
      props: {
        feature: this,
      },
    });
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }

  public get scenePickerSettingStore() {
    return this._enableScenePickerSetting.store;
  }

  public get memberStore() {
    return fromObservable(
      this._memberService.memberData$.pipe(
        /* map data into useful structure */
        switchMap(async (memberData) => {
          if (memberData === null || memberData === undefined) {
            return null;
          }
          const apiData = await this._apiDataSetup.complete();
          const slots = new Map(
            memberData.spriteInventory
              .filter((i) => i.slot !== undefined)
              .map((i) => ({
                ...i,
                sprite: apiData.sprites.find((s) => s.id === i.spriteId),
              }))
              .map((i) => [(i.slot ?? 0) - 1, i]),
          );

          const scene = memberData.sceneInventory.activeId
            ? {
                id: memberData.sceneInventory.activeId,
                shift: memberData.sceneInventory.activeShift,
                scene: apiData.scenes.find((s) => s.id === memberData.sceneInventory.activeId),
              }
            : undefined;

          return { memberData, slots, scene };
        }),
      ),
      undefined,
    );
  }

  /**
   * Generates a url of a scene or sprite, optionally shifted if provided
   * @param item
   * @param shift
   */
  getItemThumbnailUrl(item: SpriteDto | SceneDto | undefined, shift: number | undefined) {
    return item
      ? shift
        ? `https://static.typo.rip/sprites/rainbow/modulate.php?url=${item.url}&hue=${shift}`
        : item.url
      : "";
  }

  /**
   * Reorder the slots of a user
   * @param slotMap
   * @param inventory
   * @param login
   */
  async reorderSlots(slotMap: number[], inventory: SpriteInventoryDto[], login: number) {
    this._logger.debug("Reordering slots", slotMap, inventory);

    if (slotMap.every((v, i) => v === i)) {
      this._logger.info("No change in slot order");
      return;
    }

    const slots: SpriteSlotDto[] = [];
    inventory.forEach((item) => {
      if (item.slot !== undefined) {
        slots.push({ slotId: slotMap[item.slot - 1] + 1, spriteId: item.spriteId });
      }
    });

    await this._apiService
      .getApi(InventoryApi)
      .setMemberSpriteCombo({ login, spriteComboDto: { slots } });
    await this._memberService.refreshInventory();
    this._logger.info("Reordered slots", slots);
  }

  /**
   * Prompt the user to select a sprite
   * @param inventory
   */
  async promptSpriteSelection(inventory: SpriteInventoryDto[]): Promise<undefined | null | SpriteDto> {
    this._logger.debug("Opening sprite picker");

    const sprites = (await this._apiDataSetup.complete()).sprites;
    const pickerComponent: componentDataFactory<SpritePicker, SpriteDto | null | undefined> = {
      componentType: SpritePicker,
      propsFactory: submit => ({
        feature: this,
        inventory,
        sprites,
        onPick: submit.bind(this),
      }),
    };

    const sprite = await this._modalService.showPrompt(
      pickerComponent.componentType,
      pickerComponent.propsFactory,
      "Sprite Picker",
      "document"
    );

    this._logger.debug("Sprite picker closed", sprite);
    return sprite;
  }

  /**
   * Set a sprite on a slot for a user
   * @param slot
   * @param sprite
   * @param login
   */
  async setSpriteOnSlot(slot: number, sprite: SpriteDto | null, login: number) {
    this._logger.debug("Setting sprite on slot", slot, sprite);

    try {
      await this._apiService
        .getApi(InventoryApi)
        .setMemberSpriteSlot({ login, spriteSlotDto: { slotId: slot, spriteId: sprite?.id ?? 0 } });
      await this._memberService.refreshInventory();
    } catch (e) {
      this._logger.error("Failed to set sprite on slot", e);
      await this._toastService.showToast("Failed to set sprite on slot");
    }
  }

  /**
   * Prompt the user to select a scene
   * @param inventory
   */
  async promptSceneSelection(inventory: SceneInventoryDto): Promise<undefined | null | { scene: SceneDto, shift: number | undefined }> {
    this._logger.debug("Opening scene picker");

    const scenes = (await this._apiDataSetup.complete()).scenes;
    const pickerComponent: componentDataFactory<ScenePicker, { scene: SceneDto, shift: number | undefined } | null | undefined> = {
      componentType: ScenePicker,
      propsFactory: submit => ({
        feature: this,
        inventory,
        scenes,
        onPick: (scene: SceneDto | null | undefined, shift: number | undefined) => submit(scene ? {scene, shift} : scene),
      }),
    };

    const scene = await this._modalService.showPrompt(
      pickerComponent.componentType,
      pickerComponent.propsFactory,
      "Scene Picker",
      "document"
    );

    this._logger.debug("Scene picker closed", scene);
    return scene;
  }

  /**
   * Set the scene of a user
   * @param scene
   * @param shift
   * @param login
   */
  async setScene(scene: SceneDto | null, shift: number | undefined, login: number) {
    this._logger.debug("Setting scene", scene, shift);

    try {
      await this._apiService
        .getApi(InventoryApi)
        .setMemberScene({ login, setActiveSceneDto: { scene: scene ? {sceneId: scene.id, sceneShift: shift} : undefined } });
      await this._memberService.refreshInventory();
    } catch (e) {
      this._logger.error("Failed to set scene", e);
      await this._toastService.showToast("Failed to set scene");
    }
  }
}