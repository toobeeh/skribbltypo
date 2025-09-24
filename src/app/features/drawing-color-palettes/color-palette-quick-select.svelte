<script lang="ts">
  export let palettes: string[];
  export let onSubmit: (palette: string) => void;
</script>

<style lang="scss">

  .typo-palette-switcher {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    .typo-palette-switcher-item {
      background-color: var(--COLOR_PANEL_BG);
      border-radius: 5px;
      cursor:pointer;
      padding: .5em;
    }
  }

</style>
<span>Select a custom palette for drawing.<br>Please note that only typo players can see custom colors!</span>
<br>

<div class="typo-palette-switcher">
  {#each palettes as palette}
    <span class="typo-palette-switcher-item" on:click={() => onSubmit(palette)}>{palette}</span>
  {/each}
</div>

