<script lang="ts">
  import {
    DrawingColorPalettesFeature,
    type palette,
  } from "@/content/features/drawing-color-palettes/drawing-color-palettes.feature";
  export let palette: palette;
  export let feature: DrawingColorPalettesFeature;
</script>

<style lang="scss">

  .typo-palette-picker {
    display: grid;
    overflow: hidden;
    border-radius: var(--BORDER_RADIUS);

    .typo-palette-picker-item {
      aspect-ratio: 1;
      height: calc(var(--UNIT) / 2);
      cursor: pointer;
    }
  }
</style>

<div class="typo-palette-picker" style="grid-template-columns: repeat({palette.columns}, auto)">
  {#each palette.colorHexCodes as color}
    <div class="typo-palette-picker-item"
         on:click={() => feature.setColor(color)}
         style="background-color: {color};"></div>
  {/each}
</div>