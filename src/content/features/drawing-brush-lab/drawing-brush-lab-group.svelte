<script lang="ts">
  import type { DrawingBrushLabFeature } from "@/content/features/drawing-brush-lab/drawing-brush-lab.feature";

  export let feature: DrawingBrushLabFeature;
  const tools = feature.toolbarItemsStore;

</script>

<style lang="scss">

  .typo-brush-lab-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }

</style>

<div class="typo-brush-lab-group">

  <div class="typo-brush-lab-mods">

    {#each $tools.mods as mod}
      <div class="tool clickable" class:selected={mod.active}
           use:feature.createTooltip={{title: mod.name, lock: "Y"}}
           on:click={() => {
             if(!mod.active){
               feature.activateMod(mod.mod);
             }
             else {
               feature.removeMod(mod.mod);
             }
           }}
      >
        <div class="icon" style="background-image: {mod.icon}"></div>
      </div>
    {/each}

  </div>


  <div class="typo-brush-lab-tools">

    {#each $tools.tools as tool}
      <div class="tool clickable" class:selected={tool.active}
           use:feature.createTooltip={{title: tool.name, lock: "Y"}}
           on:click={() => {
             if(!tool.active){
               feature.activateTool(tool.tool);
             }
           }}
      >
        <div class="icon" style="background-image: {tool.icon}"></div>
      </div>
    {/each}

  </div>

</div>