<script lang="ts">
  import { skribblTool } from "@/app/events/tool-changed.event";
  import type { DrawingBrushLabFeature } from "@/app/features/drawing-brush-lab/drawing-brush-lab.feature";

  export let feature: DrawingBrushLabFeature;
  const tools = feature.toolbarItemsStore;

</script>

<style lang="scss">

  .typo-brush-lab-group {
    /*grid-area: preview / preview / preview / tools;*/
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2rem;
    grid-row: 2;
    /*position: absolute;
    top: calc(var(--UNIT) + var(--BORDER_GAP));*/

    .typo-brush-lab-mods, .typo-brush-lab-tools {
      display: flex;
      flex-direction: row;
      gap: .5rem;
    }
  }

</style>

<div class="typo-brush-lab-group">

  <div class="typo-brush-lab-settings">

    <div class="tool clickable"
         use:feature.createTooltip={{title: "Brush Lab Settings", lock: "Y"}}
         on:click={() => feature.openBrushLabSettings()}
    >
      <div class="icon" style="background-image: var(--file-img-wrench-gif)"></div>
    </div>

  </div>

  <div class="typo-brush-lab-mods">

    {#each $tools.mods as mod}
      <div class="tool clickable" class:selected={mod.active}
           use:feature.createTooltip={{title: mod.item.name, lock: "Y"}}
           on:click={() => {
             if(!mod.active){
               feature.activateMod(mod.item);
             }
             else {
               feature.removeMod(mod.item);
             }
           }}
      >
        <div class="icon" style="background-image: {mod.item.icon}"></div>
      </div>
    {/each}

  </div>


  <div class="typo-brush-lab-tools">

    {#each $tools.tools as tool}
      <div class="tool clickable" class:selected={tool.active}
           use:feature.createTooltip={{title: tool.item.name, lock: "Y"}}
           on:click={() => {
             if(!tool.active){
               feature.activateTool(tool.item);
             }
             else {
               feature.activateTool(skribblTool.brush);
             }
           }}
      >
        <div class="icon" style="background-image: {tool.item.icon}"></div>
      </div>
    {/each}

  </div>

</div>