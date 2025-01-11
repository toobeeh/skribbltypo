<script lang="ts">
  import { type lobbyFilter, PanelFiltersFeature } from "./panel-filters.feature";

  export let feature: PanelFiltersFeature;
  export let filters: lobbyFilter[];
  export let lobbySelected: (id: string) => void;
  const visitedLobbies = feature.visitedLobbiesStore;
</script>

<style lang="scss">

  .typo-filter-search {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .typo-filter-search-list {

      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: center;

      .typo-filter-search-list-item {

        display: flex;
        flex-direction: column;
        gap: .5rem;
        background-color: var(--COLOR_PANEL_HI);
        border-radius: 3px;
        padding: .5rem;
        
        &.lobby {
          cursor: pointer;
        }

        > b {
          flex-grow: 1;
          text-align: center;
        }

        .typo-filter-search-list-item-description {
          white-space: preserve;
        }
      }

    }


  }

</style>

<div class="typo-filter-search">

  <div>
    Lobby search is currently running and joining through lobbies.<br>
    The search will stop once a lobby is found that matches one of the filters:
  </div>

  <div class="typo-filter-search-list">
    {#each filters as filter}

      <div class="typo-filter-search-list-item">
        <b>{filter.name}</b>

        <div class="typo-filter-search-list-item-description">
          {feature.buildFilterTooltipText(filter)}
        </div>

      </div>
    {/each}
  </div>

  <div>
    Visited lobbies: {$visitedLobbies.length}<br>
    To join one of the visited lobbies, use the "Lobbies" tab.
  </div>

  <div class="typo-filter-search-list">

    {#each $visitedLobbies.filter(lobby => lobby.players.length > 1) as lobby}

      <div class="typo-filter-search-list-item lobby" on:click={() => lobbySelected(lobby.id ?? "")}>
        <b>{lobby.players.length - 1} players</b>

        <div class="typo-filter-search-list-item-description">
          {lobby.players.filter(p => p.id !== lobby.meId).map(p => p.name).join(", ")}
        </div>
      </div>
    {/each}
  </div>
</div>