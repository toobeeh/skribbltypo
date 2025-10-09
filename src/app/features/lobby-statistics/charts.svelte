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
  let selectedViewIndex = 0;
  let selectedArchiveKey = "";

  onMount(() => {
    if(canvas === undefined) throw new Error("canvas is undefined");
    chart = feature.createChart(canvas);
    updateChart();
  });

  function updateChart(){
    const view = views[selectedViewIndex];
    if(chart === undefined) throw new Error("chart is undefined");
    if($lobby === null) throw new Error("lobby is null");
    view.drawChart($lobby.players, chart, selectedArchiveKey.length === 0 ? undefined : selectedArchiveKey);
  }
</script>

<style lang="scss">


</style>

<div class="typo-stats-chart">
  <div class="typo-stats-chart-selection">
    <label for="typo-stats-view">Select view:</label>
    <select id="typo-stats-view" bind:value={selectedViewIndex} on:change={() => updateChart()}>
      {#each views as view, index}
        <option value={index} selected={view === views[selectedViewIndex]}>
          {view.name}
        </option>
      {/each}
    </select>

    <!--<label for="typo-stats-archive">Select archive:</label>
    <select id="typo-stats-archive" bind:value={selectedArchiveKey} on:change={() => updateChart()}>
      <option value="" selected={selectedArchiveKey.length === 0}>
        Current Round
      </option>
      {#each $archive as key}
        <option value={key[0]} selected={key[0] === selectedArchiveKey}>
          {key[1]}
        </option>
      {/each}
    </select>-->
  </div>

  <canvas bind:this={canvas}></canvas>
</div>