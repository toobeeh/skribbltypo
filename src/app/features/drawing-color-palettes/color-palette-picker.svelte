<script lang="ts">
  import {
    DrawingColorPalettesFeature
  } from "@/app/features/drawing-color-palettes/drawing-color-palettes.feature";
  import type { pickerColors } from "@/app/services/colors/colors.service";
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

    max-width: calc(13 * var(--UNIT) / 2);
    overflow-x: auto;

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
  <div class="typo-palette-picker color-scrollbar" style="grid-template-columns: repeat({colors.columns}, auto)" use:feature.createTooltip={{title: "Choose a color!\nOnly typo users see custom colors.", lock: "Y"}} >
    {#each colors.colorHexCodes as color}
      <div class="typo-palette-picker-item"
           on:pointerdown={(e) => {
             const secondary = e.button !== 0;
             if(secondary) e.preventDefault();
             feature.setColor(color, secondary)
           }}
           style="background-color: {color}; width: {colors.preferredColumnWidth ? `calc(var(--UNIT) / 2 * ${colors.preferredColumnWidth}` : ''}"></div>
    {/each}
  </div>
</div>