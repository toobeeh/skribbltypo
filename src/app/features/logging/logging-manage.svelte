<script lang="ts">
  import type { LoggingFeature } from "@/app/features/logging/logging.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: LoggingFeature;

  let resetAll: HTMLSelectElement;
  let loggers = feature.loggers;
  let loggerFilter: string = "";
</script>

<style lang="scss">
  .typo-logs-export, .typo-logs-logger-list, .typo-logs-overwrite {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 1rem;
    align-items: center;
  }

  .typo-logs-logger-list {

    .typo-logs-logger {
      min-width: clamp(10em, auto, 100%);
      max-width: clamp(10em, auto, 100%);
      background-color: var(--COLOR_PANEL_HI);

      display: flex;
      flex-direction: column;
      border-radius: 3px;
      gap: 1rem;
      padding: 1rem;

      &.hidden {
        display: none;
      }
    }
  }
</style>

<h3>Export Logs</h3>
<div class="typo-logs-export">
  <FlatButton on:click={() => feature.copyLogsToClipboard(false)} content="Copy logs text" color="blue"/>
  <FlatButton on:click={() => feature.copyLogsToClipboard(true)} content="Copy logs JSON" color="blue"/>
</div>

<h3>Reset Log Level</h3>
<div class="typo-logs-overwrite">
  <select bind:this={resetAll} style="width: auto">
    <option value="debug">Debug</option>
    <option value="info">Information</option>
    <option value="warn">Warn</option>
    <option value="error">Error</option>
  </select>
  <FlatButton on:click={async () => {
    await feature.resetAllLogLevels(resetAll.value);
    loggers = feature.loggers;
  }} content="Reset to selection" color="orange"/>
</div>

<h3>Customize Log Level</h3>
<div class="typo-logs-logger-list">
  <input style="max-width: 20rem" type="text" placeholder="Filter loggers" bind:value={loggerFilter}/>
</div>
<div class="typo-logs-logger-list">
  {#each loggers as logger}

    <div class="typo-logs-logger" class:hidden={!logger.boundTo.toLowerCase().includes(loggerFilter.toLowerCase())}>
      <b>{logger.boundTo}</b>
      <select on:change={(e) => feature.setLogLevelOfLogger(logger, e.currentTarget.value)}>
        <option value="debug" selected="{logger.level === 'debug'}">Debug</option>
        <option value="info" selected="{logger.level === 'info'}">Information</option>
        <option value="warn" selected="{logger.level === 'warn'}">Warn</option>
        <option value="error" selected="{logger.level === 'error'}">Error</option>
      </select>
    </div>

  {/each}
</div>