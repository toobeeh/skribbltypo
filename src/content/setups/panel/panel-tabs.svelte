<script lang="ts">
  export let tabs: {name: string, id: string}[] = [];
  let activeTab = tabs[0];
</script>

<div class="panel-header">
  {#each tabs as tab}
    <h2 class:inactive={tab !== activeTab} on:click={() => activeTab = tab}>{tab.name}</h2>
  {/each}
</div>

{#each tabs as tab}
  <div class="panel-tab-{tab.id}" hidden={tab !== activeTab}> </div>
{/each}