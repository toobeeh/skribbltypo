<script lang="ts">
  import type { DrawingBrushLabFeature } from "@/app/features/drawing-brush-lab/drawing-brush-lab.feature";

  export const toggle = () => {
    expanded = !expanded;
  };

  export let feature: DrawingBrushLabFeature;
  let expanded = false;

</script>

<style lang="scss">

  /* hide colors, skribbl tools */
  /*:global(#game-toolbar:has(.typo-brush-lab-switch.expanded) > :not(.typo-brush-lab-group, .toolbar-group-actions)){
    display: none;
  }*/

  /* change grid area height */
  :global(#game-toolbar:has(.typo-brush-lab-switch.expanded)){
    grid-template-rows: max-content;
  }

  /* hide typo brushlab section */
  :global(#game-toolbar:not(:has(.typo-brush-lab-switch.expanded)) > .typo-brush-lab-group){
    display: none;
  }

</style>

<div class="typo-brush-lab-switch tool clickable"
     class:expanded on:click={() => expanded = !expanded}
     use:feature.createTooltip={{title: "Toggle Brush Lab", lock: "Y"}}
>
  <div class="icon" style="background-image: var(--file-img-wand-gif)"></div>
</div>