<script lang="ts">
  import type { LobbyStatisticsFeature } from "@/app/features/lobby-statistics/lobby-statistics.feature";
  import IconButton from "@/lib/icon-button/icon-button.svelte";
  import type { datasetSummaryEntry } from "@/util/chart/dataset.interface";

  export let feature: LobbyStatisticsFeature;
  export let summaries: {name: string, summary: datasetSummaryEntry[]}[];
  let summaryIndex = 0;
</script>


<style lang="scss">
  .typo-chat-summary-stats {
    display: flex;
    flex-direction: column;
    gap: .3rem;
    width: 100%;

    > b {
      justify-self: flex-end;
      color: var(--COLOR_CHAT_TEXT_DRAWING);
      text-align: center;
    }

    .chat-summary-stats-category {
      ol {
        list-style-type: decimal;
        list-style-position: inside;

        li::marker {
          opacity: 0.8;
        }
      }
    }

    .chat-summary-stats-nav {
      justify-self: stretch;
      display: flex;
      align-items: center;
      gap: 1em;
      justify-content: center;
      user-select: none;
    }
  }
</style>

<div class="typo-chat-summary-stats">

  <b>Lobby Stats Summary</b>

  {#if summaries.length > 0}

    <div class="chat-summary-stats-category">
      <b>{summaries[summaryIndex].name}</b>
      {#if summaries[summaryIndex].summary.length > 0}
        <ol>
          {#each summaries[summaryIndex].summary as entry}
            <li>{entry.player}: {entry.result.toFixed(entry.result < 100 ? 1 : 0)}{entry.unit ?? ""}</li>
          {/each}
        </ol>
      {:else}
        <p>No data available.</p>
      {/if}
    </div>

    {#if summaries.length > 1}
      <div class="chat-summary-stats-nav">
        <IconButton icon="file-img-arrow-left-gif" name="Next" size="1.5rem" hoverMove="{false}"
                    disabled="{summaryIndex <= 0}"
                    on:click={() => summaryIndex--} />
        <span> {summaryIndex + 1} / {summaries.length} </span>
        <IconButton icon="file-img-arrow-right-gif" name="Next" size="1.5rem" hoverMove="{false}"
                    disabled="{summaryIndex >= summaries.length - 1}"
                    on:click={() => summaryIndex++} />
      </div>
    {/if}

  {/if}
</div>