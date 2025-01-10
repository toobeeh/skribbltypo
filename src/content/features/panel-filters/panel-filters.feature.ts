import { ExtensionSetting, type serializableObject } from "@/content/core/settings/setting";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { type componentData, type modalHandle, ModalService } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelFilters from "./panel-filters.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import FilterForm from "./filter-form.svelte";

export interface lobbyFilter extends serializableObject {
  name: string;
  createdAt: number;

  minAmountPlayers?: number;
  maxAmountPlayers?: number;
  minAverageScore?: number;
  maxAverageScore?: number;
  minRound?: number;
  maxRound?: number;
  containsUsernames?: string[];
  containsTypoPlayers?: boolean;
}

export class PanelFiltersFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  public readonly name = "Lobby Filters";
  public readonly description = "Lets you create custom filters for a quick lobby search";
  public readonly featureId = 5;

  private _component?: PanelFilters;
  private _savedFiltersSetting = new ExtensionSetting<lobbyFilter[]>("saved_filters", [], this);

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelFilters({
      target: elements.filterTab,
      props: {
        feature: this
      }
    });
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }

  /**
   * Open the filter modal to add a new filter
   */
  public openFilterModal() {
    // eslint-disable-next-line prefer-const
    let modalHandle: modalHandle;

    const settingsComponent: componentData<FilterForm> = {
      componentType: FilterForm,
      props: {
        feature: this,
        onCreate: async (filter: lobbyFilter) => {
          if(await this.addFilter(filter)) {
            modalHandle.close();
          }
        }
      },
    };

    modalHandle = this._modalService.showModal(
      settingsComponent.componentType,
      settingsComponent.props,
      "Add Lobby Filter",
    );
  }

  public async removeFilter(filter: lobbyFilter) {
    this._logger.debug("Removing filter", filter);

    const toast = await this._toastService.showLoadingToast("Removing filter");
    try {
      let filters = await this._savedFiltersSetting.getValue();
      filters = filters.filter(f => f.createdAt !== filter.createdAt);
      await this._savedFiltersSetting.setValue(filters);

      toast.resolve(`Filter "${filter.name}" removed`);
    }
    catch(e){
      this._logger.error("Failed to remove filter", e);
      toast.reject("Failed to remove filter");
    }
  }

  /**
   * Validate a filter and add it to the saved filters
   * @param filter
   */
  public async addFilter(filter: lobbyFilter) {
    this._logger.debug("Adding filter", filter);

    /*validate name*/
    filter.name = filter.name.trim();
    if(filter.name.length === 0){
      await this._toastService.showToast("Invalid Filter", "Filter name cannot be empty");
      return false;
    }

    /* sanitize properties */
    if(filter.containsUsernames?.length === 0) filter.containsUsernames = undefined;
    if(filter.minRound !== undefined && filter.minRound <= 0) filter.minRound = undefined;
    if(filter.maxRound !== undefined && filter.maxRound <= 0) filter.maxRound = undefined;
    if(filter.minAmountPlayers !== undefined && filter.minAmountPlayers <= 0) filter.minAmountPlayers = undefined;
    if(filter.maxAmountPlayers !== undefined && filter.maxAmountPlayers <= 0) filter.maxAmountPlayers = undefined;
    if(filter.minAverageScore !== undefined && filter.minAverageScore <= 0) filter.minAverageScore = undefined;
    if(filter.maxAverageScore !== undefined && filter.maxAverageScore <= 0) filter.maxAverageScore = undefined;

    /* validate score */
    if(filter.minAverageScore !== undefined && filter.maxAverageScore !== undefined && filter.minAverageScore > filter.maxAverageScore){
      await this._toastService.showToast("Invalid Filter", "Minimum average score cannot be higher than maximum average score");
      return false;
    }

    /* validate round */
    if(filter.minRound !== undefined && filter.maxRound !== undefined && filter.minRound > filter.maxRound){
      await this._toastService.showToast("Invalid Filter", "Minimum round cannot be higher than maximum round");
      return false;
    }

    /* validate players */
    if(filter.minAmountPlayers !== undefined && filter.maxAmountPlayers !== undefined && filter.minAmountPlayers > filter.maxAmountPlayers){
      await this._toastService.showToast("Invalid Filter", "Minimum amount of players cannot be higher than maximum amount of players");
      return false;
    }

    const toast = await this._toastService.showLoadingToast("Adding filter");
    try {
      let filters = await this._savedFiltersSetting.getValue();
      filters = [filter, ...filters];
      await this._savedFiltersSetting.setValue(filters);

      toast.resolve(`Filter "${filter.name}" added`);
    }
    catch(e){
      this._logger.error("Failed to add filter", e);
      toast.reject("Failed to add filter");
      return false;
    }

    return true;
  }

  /**
   * Build tooltip text for a filter
   * @param filter
   */
  public buildFilterTooltipText(filter: lobbyFilter) {
    let desc = "";

    if(filter.minAmountPlayers != undefined || filter.maxAmountPlayers !== undefined) {
      desc +=`\n👤 ${filter.minAmountPlayers ?? "x"} - ${filter.maxAmountPlayers ?? "x"} players`;
    }

    if(filter.minAverageScore != undefined || filter.maxAverageScore !== undefined) {
      desc +=`\n🏆 ${filter.minAverageScore ?? "x"} - ${filter.maxAverageScore ?? "x"} average score`;
    }

    if(filter.minRound != undefined || filter.maxRound !== undefined) {
      desc +=`\n🔄 ${filter.minRound ?? "x"} - ${filter.maxRound ?? "x"} rounds`;
    }

    if(filter.containsUsernames?.length) {
      desc +=`\n🔎 ${filter.containsUsernames.join(", ")}`;
    }

    if(filter.containsTypoPlayers) {
      desc += "\n🤖 Typo players";
    }

    return desc.length === 0 ? "Empty filter :(" : desc.trim();
  }

  get savedFiltersStore() {
    return this._savedFiltersSetting.store;
  }
}