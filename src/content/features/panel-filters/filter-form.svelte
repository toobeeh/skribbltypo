<script lang="ts">
  import { type lobbyFilter, PanelFiltersFeature } from "./panel-filters.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";

  export let feature: PanelFiltersFeature;
  export let onCreate: (filter: lobbyFilter) => void;

  const filter: lobbyFilter = {
    name: "",
    createdAt: new Date().getTime()
  };
</script>

<style lang="scss">

  .typo-filter-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .typo-filter-form-inputs {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .typo-filter-form-row {
        display: flex;
        gap: 1rem;
        align-items: center;

        input[type="text"] {
          width: auto;
          flex-grow: 1;
        }

        input[type="number"] {
          width: 5rem;
        }
      }
    }
  }

</style>

<div class="typo-filter-form">

  <div>
    A lobby filter checks if a lobby matches the filter criteria and skips automatically until a lobby is found.<br>
    You can add multiple filters; at least one of them hsa to be matched for a lobby to be accepted.<br>
    If you leave filter criteria empty, it will be ignored.
  </div>

  <div class="typo-filter-form-inputs">
    <div class="typo-filter-form-row">
      <input type="text" placeholder="Filter name" bind:value={filter.name} />
      <FlatButton content="Add Filter" color="blue" on:click={async () => {
        onCreate(filter);
      }} />
    </div>
  </div>

  <div class="typo-filter-form-inputs">
    <div class="typo-filter-form-row">
      <b>Names:</b>
      <span>Match lobbies with names containing one of the comma-separated names</span>
      <input type="text" placeholder="ice king, princess bubblegum, finn" on:change={(e) => {
        const names = e.currentTarget.value.split(",").map(name => name.trim());
        filter.containsUsernames = names.length > 0 ? names : undefined;
      }} />
    </div>

    <div class="typo-filter-form-row">
      <b>Players:</b>
      <span>Match lobbies having at least </span>
      <input type="number" placeholder="1" bind:value={filter.minAmountPlayers} />
      <span>and at most</span>
      <input type="number" placeholder="8" bind:value={filter.maxAmountPlayers} />
      <span>players.</span>
    </div>

    <div class="typo-filter-form-row">
      <b>Round:</b>
      <span>Match lobbies that are currently at least in round</span>
      <input type="number" placeholder="1" bind:value={filter.minRound} />
      <span>and at most in round</span>
      <input type="number" placeholder="3" bind:value={filter.maxRound} />
    </div>

    <div class="typo-filter-form-row">
      <b>Average Score:</b>
      <span>Match lobbies where the average player score is at least</span>
      <input type="number" placeholder="500" bind:value={filter.minAverageScore} />
      <span>points and at most</span>
      <input type="number" placeholder="3000" bind:value={filter.maxAverageScore} />
      <span>points.</span>
    </div>

    <div class="typo-filter-form-row">
      <Checkbox description="Match only lobbies with typo players" bind:checked={filter.containsTypoPlayers} />
    </div>
  </div>

</div>