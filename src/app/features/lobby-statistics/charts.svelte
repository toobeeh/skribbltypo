<script lang="ts">
  import type { LobbyStatisticsFeature } from "@/app/features/lobby-statistics/lobby-statistics.feature";
  import { Chart } from "@/util/chart/chart";
  import { onMount } from "svelte";

  export let feature: LobbyStatisticsFeature;

  let canvas: HTMLCanvasElement | undefined;
  let chart: Chart | undefined;
  const views = feature.getViews();
  const lobby = feature.lobbyStore;
  const archive = feature.archiveStore;
  const seenPlayers = feature.seenPlayersStore;
  let selectedViewIndex = 0;
  let selectedArchiveKey = "";

  onMount(() => {
    if(canvas === undefined) throw new Error("canvas is undefined");
    chart = feature.createChart(canvas);
    updateChart();
  });

  function updateChart(){
    const view = views[selectedViewIndex];
    if(chart === undefined || $lobby === null || $lobby.id === null) {
      console.log("Chart or lobby is undefined");
      chart?.clear();
      return;
    }

    const archiveEntry = selectedArchiveKey.length > 0 ? $archive.get(selectedArchiveKey) : undefined;

    if(archiveEntry === undefined){
      const players = [... $seenPlayers.get($lobby.id)?.values() ?? []];

      try {
        view.drawChart(players, chart);
      }
      catch (e) {
        console.error("Error drawing chart:", e);
        chart.clear();
      }
    }

    else {
      try {
        view.drawChart(archiveEntry.players, chart, archiveEntry.key);
      }
      catch (e) {
        console.error("Error drawing chart:", e);
        chart.clear();
      }
    }
  }
</script>

<style lang="scss">

  .typo-stats-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .typo-stats-chart-caption {
      text-align: center;
    }

    .typo-stats-chart-selection {
      display: grid;
      grid-template-columns: auto auto;
      gap: 1rem;
      align-items: center;
      justify-items: right;

      label {
        font-weight: bold;
      }
    }
  }

</style>

<div class="typo-stats-chart">

  <span class="typo-stats-chart-caption">View statistics of this or previous recorded lobby rounds</span>

  <div class="typo-stats-chart-selection">

    <label for="typo-stats-archive">Select round:</label>
    <select id="typo-stats-archive" bind:value={selectedArchiveKey} on:change={() => updateChart()}>
      <option value="" selected={selectedArchiveKey.length === 0}>
        Current Round
      </option>
      {#each $archive as key}
        <option value={key[0]} selected={key[0] === selectedArchiveKey}>
          {key[1].name}
        </option>
      {/each}
    </select>

    <label for="typo-stats-view">Select view:</label>
    <select id="typo-stats-view" bind:value={selectedViewIndex} on:change={() => updateChart()}>
      {#each views as view, index}
        <option value={index} selected={view === views[selectedViewIndex]}>
          {view.name}
        </option>
      {/each}
    </select>
  </div>

  <canvas bind:this={canvas}></canvas>
</div>