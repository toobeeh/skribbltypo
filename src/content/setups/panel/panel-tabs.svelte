<script lang="ts">
  export let tabs: {name: string, id: string}[] = [];
  let activeTab = tabs[0];
</script>

<style lang="scss">
  :global(#home .panel.typo-panel) {
      flex: 0 0 400px;
      margin-top: 2em;
      display: flex;
      flex-direction: column;
      align-items: normal;
      justify-content: flex-start;
      color: var(--COLOR_PANEL_TEXT);

      .panel-header {
          display:flex;
          justify-content:space-between;
          font-weight: 600;

          h2 {
              cursor: pointer;

              &.inactive {
                  opacity: 0.5;
              }
          }
      }
  }
</style>

<div class="panel-header">
  {#each tabs as tab}
    <h2 class:inactive={tab !== activeTab} tabindex="0" role="button" on:keydown={() => activeTab = tab} on:click={() => activeTab = tab}>{tab.name}</h2>
  {/each}
</div>

{#each tabs as tab}
  <div class="panel-tab-{tab.id}" hidden={tab !== activeTab}> </div>
{/each}