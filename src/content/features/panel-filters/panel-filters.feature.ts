import { ExtensionSetting, type serializableObject } from "@/content/core/settings/setting";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import {
  type componentDataFactory,
  ModalService,
} from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import type { skribblLobby } from "@/util/skribbl/lobby";
import { fromObservable } from "@/util/store/fromObservable";
import {
  BehaviorSubject,
  combineLatestWith, distinctUntilChanged, filter, firstValueFrom,
  pairwise,
  startWith,
  Subject,
  type Subscription,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelFilters from "./panel-filters.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import FilterForm from "./filter-form.svelte";
import FilterSearch from "./filter-search.svelte";

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
  private _selectedFiltersSetting = new ExtensionSetting<number[]>("selected_filters", [], this);
  private _currentSearch = new Subject<lobbyFilter[] | null>();
  private _visitedLobbies = new BehaviorSubject<skribblLobby[]>([]);
  private _searchSubscription?: Subscription;

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelFilters({
      target: elements.filterTab,
      props: {
        feature: this
      }
    });
    
    this._searchSubscription = this._currentSearch.pipe(
      startWith(null),
      distinctUntilChanged(),
      combineLatestWith(this._lobbyService.lobby$),
      pairwise(),
    ).subscribe(([ [previousFilter, previousLobby], [currentFilter, currentLobby] ]) => this.handleSearchChange(previousFilter, previousLobby, currentFilter, currentLobby));
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
    this._searchSubscription?.unsubscribe();
    this._visitedLobbies.next([]);
  }

  get savedFiltersStore() {
    return this._savedFiltersSetting.store;
  }

  get selectedFiltersStore() {
    return this._selectedFiltersSetting.store;
  }

  get visitedLobbiesStore() {
    return fromObservable(this._visitedLobbies, []);
  }
  
  private async handleSearchChange(previousFilter: lobbyFilter[] | null, previousLobby: skribblLobby | null, currentFilter: lobbyFilter[] | null, currentLobby: skribblLobby | null) {
    this._logger.debug("Search changed", previousFilter, previousLobby, currentFilter, currentLobby);
    
    /* if not joined a lobby */
    if(!currentLobby) {
      
      /* if filter has just been set (search started) */
      if(previousFilter === null && currentFilter !== null) {
        this._logger.info("Starting search");
        await this._lobbyService.joinLobby();
        await this.promptFilterSearch(currentFilter);
      }

      /* if search is running, join next lobby */
      if(currentFilter !== null) {
        this._logger.info("Joining next lobby");
        await this._lobbyService.joinLobby();
      }
    }
    
    /* if joined a lobby */
    else {

      /* if search is running regular, check filters */
      if(currentFilter !== null){

        /* update visited lobbies */
        this._visitedLobbies.next([currentLobby, ...this._visitedLobbies.value.filter(lobby => lobby.id !== currentLobby.id)]);

        /* if lobby does not match previous filters, leave */
        if(!currentFilter.some(filter => this.checkLobbyFilterMatch(filter, currentLobby))) {
          this._logger.info("Lobby does not match filter, leaving");
          this._lobbyService.leaveLobby();
        }

        /* lobby found*/
        else {
          this._logger.info("Lobby found");
          this._currentSearch.next(null);
        }
      }
    }

    /* reset visited lobbies when no filter set */
    if(currentFilter === null) {
      this._visitedLobbies.next([]);
    }
  }

  /**
   * Check if a lobby matches a filter
   * @param filter
   * @param lobby
   * @private
   */
  private checkLobbyFilterMatch(filter: lobbyFilter, lobby: skribblLobby) {
    this._logger.info("Checking lobby filter match", filter, lobby);

    if(filter.minAmountPlayers !== undefined && lobby.players.length < filter.minAmountPlayers) return false;
    if(filter.maxAmountPlayers !== undefined && lobby.players.length > filter.maxAmountPlayers) return false;

    const averageScore = lobby.players.map(p => p.score).reduce((a, b) => a + b, 0) / lobby.players.length;
    if(filter.minAverageScore !== undefined && averageScore < filter.minAverageScore) return false;
    if(filter.maxAverageScore !== undefined && averageScore > filter.maxAverageScore) return false;

    if(filter.minRound !== undefined && lobby.round < filter.minRound) return false;
    if(filter.maxRound !== undefined && lobby.round > filter.maxRound) return false;

    if(filter.containsUsernames && filter.containsUsernames.length) {
      const usernames = lobby.players.map(p => p.name);
      if(!filter.containsUsernames.some(name => usernames.includes(name))) return false;
    }

    return true;
  }

  public async startSearch() {

    let filters = await this._savedFiltersSetting.getValue();
    const selectedFilters = await this._selectedFiltersSetting.getValue();
    filters = filters.filter(filter => selectedFilters.includes(filter.createdAt));

    if(filters.length === 0) {
      await this._toastService.showToast("No filters selected", "Select search filters from the list above\n or create a new filter");
      return;
    }

    this._logger.debug("Starting search", filters);
    this._currentSearch.next(filters);
  }

  /**
   * Opens a prompt which indicates that the search is currently in progress.
   * If the user submits/closes, the search is aborted
   * If a search filter is removed while the prompt is open, the prompt is closed
   */
  private async promptFilterSearch(filters: lobbyFilter[]) {
    let finishSubscription: Subscription | undefined;

    const formComponent: componentDataFactory<FilterSearch, null | string> = {
      componentType: FilterSearch,
      propsFactory: (submit) => {

        /* automatically submit after lobby filter removed */
        finishSubscription = this._currentSearch.pipe(
          filter(filters => filters === null),
        ).subscribe(() => submit(null));

        return {
          feature: this,
          filters,
          lobbySelected: (id: string) => submit(id),
        };
      }
    };

    const result = await this._modalService.showPrompt(
      formComponent.componentType,
      formComponent.propsFactory,
      "Lobby Search",
      "card"
    );


    finishSubscription?.unsubscribe();
    this._currentSearch.next(null);

    if(result === undefined){
      await this._toastService.showToast("Search aborted");
    }

    if(typeof result === "string"){ // TODO not working yet
      this._logger.info("Lobby selected", result);

      /* wait until not in a lobby anymore */
      await firstValueFrom(this._lobbyService.lobby$.pipe(
        filter(lobby => lobby === null)
      ));
      await this._lobbyService.joinLobby(result);
    }
  }

  /**
   * Prompt the user to create a new filter
   */
  public async promptFilterCreation() {
    const formComponent: componentDataFactory<FilterForm, lobbyFilter> = {
      componentType: FilterForm,
      propsFactory: submit => ({
        feature: this,
        onCreate: submit.bind(this)
      }),
      validate: filter => this.validateFilter(filter)
    };

    const result = this._modalService.showPrompt(
      formComponent.componentType,
      formComponent.propsFactory,
      "Add Lobby Filter",
      "card",
      formComponent.validate
    );

    return await result;
  }

  /**
   * Remove a filter from the saved filters
   * @param filter
   */
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
   * Add a filter to the saved filters
   * @param filter
   */
  public async addFilter(filter: lobbyFilter) {
    this._logger.debug("Adding filter", filter);

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
   * Validate a filter and show toasts if errors found
   * @param filter
   */
  public async validateFilter(filter: lobbyFilter) {
    this._logger.debug("Validating filter", filter);

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
}