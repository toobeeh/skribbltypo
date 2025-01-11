<script lang="ts">
  import { type lobbyFilter, PanelFiltersFeature } from "./panel-filters.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";

  export let feature: PanelFiltersFeature;

  const filters = feature.savedFiltersStore;
  const selectedFilters = feature.selectedFiltersStore;

  $: filterStates = $filters.map(filter => $selectedFilters.includes(filter.createdAt));
</script>

<style lang="scss">

  .typo-lobby-filters {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 100%;
    gap: 1rem;

    .typo-lobby-filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .typo-lobby-filters-list{
      flex-grow: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-content: flex-start;
      overflow: auto;

      .typo-lobby-filters-item {
        display: flex;
        align-items: center;
        gap: .5rem;
        padding: .2rem;
        background-color: var(--COLOR_PANEL_HI);
        border-radius: 3px;

        .typo-lobby-filters-item-remove {
          opacity: 0;
          transition: opacity .1s;
        }

        &:hover .typo-lobby-filters-item-remove {
          opacity: 1;
        }
      }
    }
  }

</style>

<div class="typo-lobby-filters">

  <div class="typo-lobby-filters-list" >

    {#if $filters.length === 0}
      <div>No filters saved.</div>
    {/if}

    {#each $filters as filter, i}
      <div class="typo-lobby-filters-item" style="order: {filter.createdAt}" use:feature.createTooltip={{title: `${feature.buildFilterTooltipText(filter)}`}} >
        <Checkbox description="{filter.name}" checked="{filterStates[i]}" on:change={checked => {
          const other = $selectedFilters.filter(f => f !== filter.createdAt);
          selectedFilters.set(checked.detail ? [...other, filter.createdAt] : other);
        }} />
        <div class="typo-lobby-filters-item-remove">
          <IconButton
            icon="file-img-disabled-gif"
            name="Remove Filter"
            greyscaleInactive="{true}"
            hoverMove="{false}"
            size="1.5rem"
            on:click={() => feature.removeFilter(filter)}
          />
        </div>
      </div>
    {/each}
  </div>

  <div class="typo-lobby-filters-header">
    <FlatButton content="Start Search" color="green" on:click={async () => {
      await feature.startSearch();
    }} />

    <FlatButton content="Add Lobby Filter" color="blue"  on:click={async () => {
      const filter = await feature.promptFilterCreation();
      if(filter) {
        await feature.addFilter(filter);
      }
    }} />

    <!--<div use:feature.createTooltip={{title: "Lobby filters skip lobbies until\n a matching lobby is found."}}>

    </div>-->
  </div>
</div>