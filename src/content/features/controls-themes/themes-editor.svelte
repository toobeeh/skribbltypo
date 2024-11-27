<script lang="ts">

  import type { ControlsThemesFeature, savedTheme } from "@/content/features/controls-themes/controls-themes.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: ControlsThemesFeature;
  const loadedTheme = feature.loadedEditorThemeStore;
</script>

<style lang="scss">

  .typo-themes-editor-header {
    padding-bottom: 1rem;
    text-align: center;
  }

  .typo-themes-editor-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: start;
  }

  .typo-themes-editor-content-section {
    display: flex;
    flex-direction: row;
    gap: 3rem;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;

    summary {
      font-weight: bold;
      cursor: pointer;
      user-select: none;
      font-size: 1.2rem;
      padding-bottom: .5rem;
    }

    .group {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;

      input {
        width: auto;
        box-sizing: border-box;
      }
    }
  }

</style>



{#if $loadedTheme === undefined}
  <div class="typo-themes-editor-header">
    No theme loaded for editing. Select one of your themes in the "Saved Themes" tab or create a new one!<br>
    <br>

    <FlatButton content="Create new Theme" color="green" on:click={async () => {
      const theme = await feature.createNewTheme();
      await feature.loadThemeToEditor(theme);
    }} />
  </div>

{:else}

  <div class="typo-themes-editor-content">


    <div class="typo-themes-editor-content-section">
      <h3 style="flex-grow: 1">Editing Theme: {$loadedTheme.theme.meta.name}</h3>
      <FlatButton content="Abort Editing" color="orange" on:click={() => feature.unloadThemeFromEditor()} />
      <FlatButton content="Save Theme" color="green" />
    </div>

    <div class="typo-themes-editor-content-section">
      <div class="group">
        <div>Theme Name:</div>
        <input type="text" bind:value={$loadedTheme.theme.meta.name} />
      </div>

      <div class="group">
        <div>Creator Name:</div>
        <input type="text" bind:value={$loadedTheme.theme.meta.author} />
      </div>
    </div>

    <details class="typo-themes-editor-content-section">
      <summary>hello there</summary>

      <div class="group">
        <div>Creator Name:</div>
        <input type="text" bind:value={$loadedTheme.theme.meta.author} />
      </div>
    </details>


  </div>

{/if}

