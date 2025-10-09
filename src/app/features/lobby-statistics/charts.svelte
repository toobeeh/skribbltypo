<script lang="ts">
  import type { LobbyStatisticsFeature } from "@/app/features/lobby-statistics/lobby-statistics.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import { Chart } from "@/util/chart/chart";
  import type { skribblPlayer } from "@/util/skribbl/lobby";
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

  let availablePlayers: skribblPlayer[] = [];
  let selectedPlayers: {[key: number]: boolean} = {};
  let selectedTableData: string[][] = [];

  onMount(() => {
    if(canvas === undefined) throw new Error("canvas is undefined");
    chart = feature.createChart(canvas);
    updatePlayerSelection();
    updateChart();
  });

  function updatePlayerSelection() {
    let players: skribblPlayer[] = [];
    if(selectedArchiveKey.length === 0){

      if($lobby === null || $lobby.id === null) {
        console.log("Lobby is null but required for current round stats");
        availablePlayers = [];
        selectedPlayers = {};
        return;
      }

      players = [... $seenPlayers.get($lobby.id)?.values() ?? []];
    }
    else {
      const archiveEntry = $archive.get(selectedArchiveKey);
      if(archiveEntry === undefined) {
        console.log("Archive entry is undefined but required for selected archive stats");
        availablePlayers = [];
        selectedPlayers = {};
        return;
      }
      players = archiveEntry.players;
    }

    const view = views[selectedViewIndex];
    availablePlayers = view.filterPlayersWithData(players, selectedArchiveKey);
    selectedPlayers = {};
    for(const player of players) {
      selectedPlayers[player.id] = true;
    }
  }

  function updateChart(){
    const view = views[selectedViewIndex];
    if(chart === undefined) {
      console.log("Chart is undefined");
      selectedTableData = [];
      return;
    }

    const archiveEntry = selectedArchiveKey.length > 0 ? $archive.get(selectedArchiveKey) : undefined;
    const players = availablePlayers.filter(p => selectedPlayers[p.id]);
    try {
      view.drawChart(players, chart, archiveEntry?.key);
      selectedTableData = view.generateTable(players, archiveEntry?.key);
    }
    catch (e) {
      console.error("Error drawing chart:", e);
      chart.clear();
      selectedTableData = [];
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

    canvas.hidden {
      display: none;
    }

    .typo-stats-chart-players {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .typo-stats-chart-table {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      justify-content: start;

      table {
        width: 100%;
        border-collapse: collapse;

        th, td {
          border: 1px solid var(--COLOR_PANEL_TEXT);;
          padding: 8px;
          text-align: left;
        }

        th {
          font-weight: bold;
        }

        tr:nth-child(even) {
          background-color: rgba(0, 0, 0, 0.2);
        }
      }
    }
  }

</style>

<div class="typo-stats-chart">

  <span class="typo-stats-chart-caption">View statistics of this or previous recorded lobby rounds</span>

  <div class="typo-stats-chart-selection">

    <label for="typo-stats-archive">Select round:</label>
    <select id="typo-stats-archive" bind:value={selectedArchiveKey} on:change={() => {
      updatePlayerSelection();
      updateChart();
    }}>
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

  <canvas class:hidden={selectedTableData.length === 0} bind:this={canvas}></canvas>

  <div class="typo-stats-chart-players">
    {#each availablePlayers as player}
      <Checkbox description="{player.name} (#{player.id})" bind:checked={selectedPlayers[player.id]} on:change={() => {
        updateChart();
      }} />
    {/each}
  </div>

  <div class="typo-stats-chart-table">
    {#if selectedTableData.length > 0}

      <h3>Chart Data</h3>
      <div class="typo-stats-chart-table-download">
        <FlatButton color="green" content="Download as CSV" on:click={() =>
          feature.downloadCsv(
            selectedTableData,
            views[selectedViewIndex].name,
            selectedArchiveKey.length === 0 ? "current" : $archive.get(selectedArchiveKey)?.name ?? "archive"
            )
          }
        />

        <FlatButton color="green" content="Download Chart" on:click={() =>
          {
            if(canvas === undefined) {
              throw new Error("Can't download Chart");
            }
            feature.downloadChart(
              canvas,
              views[selectedViewIndex].name,
              selectedArchiveKey.length === 0 ? "current" : $archive.get(selectedArchiveKey)?.name ?? "archive"
            );
          }}
        />
      </div>

      <table>
        <thead>
          <tr>
            {#each selectedTableData[0] as header}
              <th>{header}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each selectedTableData.slice(1) as row}
            <tr>
              {#each row as cell}
                <td>{cell}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p>No data available for the selected players and view.</p>
    {/if}

  </div>
</div>