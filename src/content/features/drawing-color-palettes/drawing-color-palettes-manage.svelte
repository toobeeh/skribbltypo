<script lang="ts">

  import type {
    DrawingColorPalettesFeature
  } from "@/content/features/drawing-color-palettes/drawing-color-palettes.feature";
  import ColorPaletteBuilder from "./color-palette-builder.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: DrawingColorPalettesFeature;

  const palettes = feature.savedPalettesStore;
</script>

<style lang="scss">
  .typo-color-palette-manage-list {
    display: flex;
    flex-direction: row-reverse;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
</style>

<FlatButton color="green" content="Add new palette" on:click={() => feature.savePalette({name: "palette-" + Date.now(), columns: 10, colorHexCodes: ["#77c5fa"]})} /><br>
<br>

<div class="typo-color-palette-manage-list">
  {#each $palettes as palette}

    <ColorPaletteBuilder
      initialPalette="{palette}"
      onPaletteSave={(newPalette) => feature.savePalette(newPalette, palette.name)}
      onPaletteExport={(newPalette) => feature.exportPalette(newPalette)}
      onPaletteDelete="{() => feature.removePalette(palette.name)}"
    />
    
  {/each}
  
</div>
