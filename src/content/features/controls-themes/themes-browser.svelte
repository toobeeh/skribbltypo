<script lang="ts">

  import type { ThemeListingDto } from "@/api";
  import type { ControlsThemesFeature, savedTheme } from "@/content/features/controls-themes/controls-themes.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: ControlsThemesFeature;
  const devmode = feature.devmodeStore;
  const savedThemes = feature.savedThemesStore;
  const currentThemeId = feature.activeThemeStore;
  const loadedEditorTheme = feature.loadedEditorThemeStore;

  let currentTheme: savedTheme | undefined;

  $: {
    currentTheme = $loadedEditorTheme === undefined ? $savedThemes.find(t => t.theme.meta.id === $currentThemeId) : undefined;
  }

</script>

<style lang="scss">
  .typo-themes-browser-header {
    padding-bottom: 1rem;
    text-align: center;
  }

  .typo-themes-browser-list {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .typo-themes-browser-item {
    background-color: var(--COLOR_PANEL_HI);
    border-radius: 3px;
    padding: 1rem;
    gap: 1rem;
    justify-content: start;
    align-items: center;
    min-width: clamp(30em, 30em, 100%);
    max-width: clamp(30em, 30em, 100%);

    display: grid;
    grid-template-columns: auto 1fr;

    span {
      opacity: .5;
    }

    div {
      justify-self: end;
    }
  }

</style>

<div class="typo-themes-browser-header">
  Here you can discover themes made by other typo users. When you download a theme, it will be activated and saved to your local themes.<br>
  When a theme receives an update, it will be automatically downloaded.
</div>

{#await feature.getOnlineThemes() then themes}
  <div class="typo-themes-browser-list">
    {#each themes as theme}
      <div class="typo-themes-browser-item">
        <b>{theme.name}</b>
        <div>by {theme.author}</div>

        {#if $devmode}
          <div></div>
          <div>
            <span>v{theme.version}</span>
            <span>#{theme.id}</span>
          </div>
        {/if}

        {#if $savedThemes.some(t => t.publicTheme?.publicId === theme.id)}
          <FlatButton
            content="{currentTheme?.publicTheme?.publicId === theme.id ? 'Active' : 'Activate'}"
            disabled="{currentTheme?.publicTheme?.publicId === theme.id}"
            color="green"
            on:click={() => feature.activatePublicTheme(theme)}
          />
        {:else}
          <FlatButton
            content="Download"
            color="blue"
            on:click={async () => {
              await feature.savePublicTheme(theme);
              await feature.activatePublicTheme(theme);
            }}
          />
        {/if}

        <div>{theme.downloads} downloads</div>
      </div>
    {/each}
  </div>
{/await}