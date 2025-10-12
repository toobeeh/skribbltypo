<script lang="ts">
  import type { LobbyStatisticsFeature } from "@/app/features/lobby-statistics/lobby-statistics.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";

  export let feature: LobbyStatisticsFeature;
  const categoriesStore = feature.chatSummarizeCategoriesStore;
  const rankingsStore = feature.chatSummarizeTopStore;
  const views = feature.getViewsWithKeys();

  const enabledViews: {[key: string]: boolean} = {};

  $: {
    for(const v of feature.getViewsWithKeys()){
      enabledViews[v.key] = $categoriesStore.includes(v.key);
    }
  }

  const updateCategories = () => {
    const enabledCategories: string[] = [];
    for (const view of views) {
      const enabled = enabledViews[view.key] === true;
      if(enabled) enabledCategories.push(view.key);
    }
    $categoriesStore = enabledCategories;
  };

</script>

<style lang="scss">

  input[type="number"] {
    width: 7ex;
  }

</style>

<h3>Chat Summary Ranks</h3>
<p>
  Set the amount of ranks that will be shown in the chat after a round has passed.
</p>
<input type="number" min="0" bind:value={$rankingsStore} />
<br><br>

<h3>Chat Summary Categories</h3>
<p>
  Select categories that will show up in the chat after a round has passed.
  Categories will appear in the order in which they are selected.
</p>
{#each views as { view, key }}
  <Checkbox
    bind:checked={enabledViews[key]}
    description="{view.name} {$categoriesStore.indexOf(key) !== -1 ? `(page ${$categoriesStore.indexOf(key) + 1})` : ''}"
    on:change={() => updateCategories()}
  />
{/each}