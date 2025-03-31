<script lang="ts">

  import type { palette } from "@/app/features/drawing-color-palettes/drawing-color-palettes.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import ColorPickerButton from "@/lib/color-picker/color-picker-button.svelte";
  import { Color } from "@/util/color";
  import { onMount } from "svelte";

  let name = "new-palette";
  let colors: Color[] = [];
  let columns = 10;

  const loadPalette = (palette: palette) => {
    name = palette.name;
    colors = palette.colorHexCodes.map(code => Color.fromHex(code));
    columns = palette.columns;
  };

  export let onPaletteSave: undefined | ((palette: palette) => void) = undefined;
  export let onPaletteExport: undefined | ((palette: palette) => void) = undefined;
  export let onPaletteDelete: undefined | (() => void) = undefined;
  export let initialPalette: undefined | palette = undefined;

  onMount(() => {
    if(initialPalette) {
      loadPalette(initialPalette);
    }
  });
</script>

<style lang="scss">

  .typo-palette-builder-container {
    background-color: var(--COLOR_PANEL_HI);
    border-radius: 3px;
    gap: 2rem;
    padding: 1rem;
    display: grid;
    grid-template-columns: auto auto;
    flex-direction: column;

    .typo-palette-builder-inputs {
      display: flex;
      flex-direction: column;
      gap: .5rem;

      b {
        margin-top: .5rem;
      }
    }

    .typo-palette-builder-actions {
      display: flex;
      flex-direction: column;
      gap: .5rem;
    }

    .typo-palette-builder-colors {
      display: grid;
      gap: .2rem;
    }
  }

</style>

<div class="typo-palette-builder-container">

  <div class="typo-palette-builder-inputs">
    <b>Palette Name</b>
    <input type="text" bind:value={name} disabled="{onPaletteSave === undefined}" />

    <b>Columns per row</b>
    <input type="number" bind:value={columns} min="0" disabled="{onPaletteSave === undefined}" />

    <b>Palette colors</b>
    <div class="typo-palette-builder-colors"
         style="pointer-events: {onPaletteSave === undefined ? 'none' : 'all'}; grid-template-columns: repeat({columns}, 2rem); width: calc({columns} * 2rem + {columns - 1} * .2rem)">
      {#each colors as color, i}
        <div class="typo-palette-builder-color" >
          <ColorPickerButton bind:color="{color}" height="auto" />
        </div>
      {/each}
    </div>

  </div>

  <div class="typo-palette-builder-actions">
    {#if onPaletteSave}
      <FlatButton color="green" content="Save Palette" on:click={() => onPaletteSave({name, columns, colorHexCodes: colors.map(c => c.hex)})} />
    {/if}

    {#if onPaletteDelete}
      <FlatButton color="orange" content="Delete Palette" on:click={() => onPaletteDelete()} />
    {/if}

    {#if onPaletteExport}
      <FlatButton color="blue" content="Export to clipboard" on:click={() => onPaletteExport({name, columns, colorHexCodes: colors.map(c => c.hex)})} />
    {/if}

    <br>

    {#if onPaletteSave}
      <FlatButton content="Add Color" color="green" on:click={() => colors = [...colors, Color.fromHex("#77c5fa")]}  />
    {/if}

    {#if onPaletteSave}
      <FlatButton content="Remove Color" color="orange" on:click={() => colors = [...colors.slice(0, colors.length - 1)]}  />
    {/if}
  </div>

</div>