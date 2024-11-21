<script lang="ts">

  import type {
    DrawingColorPalettesFeature
  } from "@/content/features/drawing-color-palettes/drawing-color-palettes.feature";
  import ColorPaletteBuilder from "./color-palette-builder.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: DrawingColorPalettesFeature;

  let paletteImport = "";
  const palettes = feature.savedPalettesStore;
  const defaultPalettes = feature.defaultPalettes;
  const activePalette = feature.activePaletteStore;
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

<h3>Active palette</h3>
Select one of the saved palettes to customize the colors available in the skribbl toolbar.<br>
<select bind:value={$activePalette} style="width: auto">
  {#each Object.values(defaultPalettes) as palette}
    <option value={palette === defaultPalettes.skribblPalette ? undefined : palette.name} selected="{palette === defaultPalettes.skribblPalette && $activePalette === undefined || $activePalette === palette.name}">{palette.name}</option>
  {/each}

  {#each $palettes as palette}
    <option value={palette.name} selected="{$activePalette === palette.name}">{palette.name}</option>
  {/each}
</select><br>
<br>

<h3>Create a new empty palette</h3>
Create a new palette to customize the colors available in the skribbl toolbar.<br>
You can enter a name to identify the palette, choose a number of columns for the palette layout and add as many colors as you like.<br>
Click a color box to change it, remove the last color with "Remove Color" or add a new color with "Add Color".<br>
When you are done, click "Save Palette" to save the changes.<br>
<br>
<FlatButton color="green" content="Add new palette" on:click={() => feature.savePalette({name: "palette-" + Date.now(), columns: 10, colorHexCodes: ["#77c5fa"]})} /><br>
<br>

<h3>Saved palettes</h3>
<br><br>
<div class="typo-color-palette-manage-list">
  {#each $palettes as palette}
    <ColorPaletteBuilder
      initialPalette="{palette}"
      onPaletteSave={(newPalette) => feature.savePalette(newPalette, palette.name)}
      onPaletteExport={(newPalette) => feature.exportPalette(newPalette)}
      onPaletteDelete="{() => feature.removePalette(palette.name)}"
    />
  {/each}

  {#each Object.values(defaultPalettes) as palette}
    <ColorPaletteBuilder
      initialPalette="{palette}"
      onPaletteExport={() => feature.exportPalette(palette)}
    />
  {/each}
</div>

<h3>Import a palette</h3>
You can import existing palettes by pasting their data here.<br>
Existing palettes can be exported by clicking the "Export to clipboard" button on the palette.<br>
The data is a JSON string that represents the palette; you can also create a new palette without the typo palette builder.<br>
The palette has to satisfy following interface: <i>&lbrace; name: string; columns: number; colorHexCodes: string[] }</i><br>
<br>
<input bind:value={paletteImport} type="text" placeholder="Paste palette data" style="width: auto"  /><br>
<br>
<FlatButton color="green" content="Import palette" on:click={() => feature.savePalette(feature.parsePalette(paletteImport))} /><br>
<br>
