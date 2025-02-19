<script lang="ts">
  import {
    DrawingColorPalettesFeature
  } from "@/content/features/drawing-color-palettes/drawing-color-palettes.feature";
  import type { pickerColors } from "@/content/services/colors/colors.service";
  export let colors: pickerColors;
  export let feature: DrawingColorPalettesFeature;
</script>

<style lang="scss">

  :global(#game-toolbar) .typo-palette.colors {
    height: fit-content;
  }

  .typo-palette-picker {
    display: grid;
    overflow: hidden;
    border-radius: var(--BORDER_RADIUS);

    .typo-palette-picker-item {
      aspect-ratio: 1;
      height: calc(var(--UNIT) / 2);
      cursor: pointer;
      position: relative;

      &:after {
        content: "";
        position: absolute;
        left: 2px;
        top: 2px;
        right: 2px;
        bottom: 2px;
        border-radius: 3px;
      }

      &:hover:after {
        border-width: 3px;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.6);
      }
    }
  }
</style>

<div class="colors typo-palette">
  <div class="typo-palette-picker" style="grid-template-columns: repeat({colors.columns}, auto)">
    {#each colors.colorHexCodes as color}
      <div class="typo-palette-picker-item"
           on:click={() => feature.setColor(color)}
           style="background-color: {color};"></div>
    {/each}
  </div>
</div>