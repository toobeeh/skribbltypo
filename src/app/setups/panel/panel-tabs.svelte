<script lang="ts">
  export let tabs: {name: string, id: string}[] = [];
  let activeTab = tabs[0];
</script>

<style lang="scss">

  /* hide headers that have no tab*/
  @mixin hide-empty-headers {
    @for $i from 2 through 5 {
      :global(#home .panel.typo-panel:has(.typo-panel-tab:empty:nth-child(#{$i}))) .panel-header :nth-child(#{$i - 1}) {
        display: none;
      }
    }
  }
  @include hide-empty-headers;

  /* hide panel that has no tabs */
  :global(#home .panel.typo-panel:not(:has(.typo-panel-tab:not(:empty)))) {
    display:none;
  }

  :global(#home .panel.panel-right){
    margin-left: 20px; /* like skribbl info panels below */
  }

  :global(#home .panel.panel-left){
    margin-right: 20px; /* like skribbl info panels below */
  }

  :global(#home .panel.typo-panel) {
      flex: 0 0 400px;
      max-height: calc(400px - 2em);
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

    .typo-panel-tab {
      margin-top: 1rem;
      /*padding: .5rem;*/
      overflow: auto;
      flex-grow: 1;
    }

    > div:empty {
      display: none;
    }
  }
</style>

<div class="panel-header">
  {#each tabs as tab}
    <h2 class:inactive={tab !== activeTab} tabindex="0" role="button"
        on:keydown={() => activeTab = tab}
        on:click={() => activeTab = tab}>{tab.name}</h2>
  {/each}
</div>

{#each tabs as tab}
  <div class="typo-panel-tab color-scrollbar panel-tab-{tab.id}" hidden={tab !== activeTab}> </div>
{/each}