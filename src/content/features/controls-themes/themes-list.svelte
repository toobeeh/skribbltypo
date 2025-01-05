<script lang="ts">

  import type { ControlsThemesFeature } from "@/content/features/controls-themes/controls-themes.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: ControlsThemesFeature;
  const devmode = feature.devmodeStore;
  const savedThemes = feature.savedThemesStore;
  const currentThemeId = feature.currentThemeStore;
  const loadedEditorTheme = feature.loadedEditorThemeStore;
  const selectedTab = feature.activeThemeTabStore;
</script>

<style lang="scss">

  .typo-themes-list-header {
    padding-bottom: 1rem;
    text-align: center;
  }

  .typo-themes-list-list {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .typo-themes-list-item {
    background-color: var(--COLOR_PANEL_HI);
    border-radius: 3px;
    padding: 1rem;
    gap: 1rem;
    justify-content: center;
    align-items: start;
    display: flex;
    flex-direction: column;
    min-width: clamp(20em, 20em, 100%);
    max-width: clamp(20em, 20em, 100%);

    .active-marker {
      display: flex;
      gap: .5rem;
      align-items: center;

      img {
        height: 1.5rem;
        aspect-ratio: 1;
      }
    }

    > div {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      width: 100%;

      span {
        opacity: .5;
      }

      > :last-child:not(:first-child) {
        flex-grow: 1;
        text-align: end;
      }
    }
  }
</style>

<div class="typo-themes-list-header">
  Downloaded and created themes will appear here. Select a theme to change the appearance of skribbl!
</div>

<div class="typo-themes-list-list">
  {#each $savedThemes as theme}
    <div class="typo-themes-list-item">
      <div>
        <b>{theme.theme.meta.name}</b>
        <span>{theme.publicTheme ? 'Featured Theme' : 'Local Theme'}</span>
      </div>

      <div>
        {#if $currentThemeId === theme.theme.meta.id && $loadedEditorTheme === undefined}
          <div class="active-marker">
            <img src="" alt="enabled" style="content: var(--file-img-enabled-gif)" />
            <div>Selected</div>
          </div>
        {:else if $loadedEditorTheme?.theme.meta.id === theme.theme.meta.id}
          <div class="active-marker">
            <img src="" alt="enabled" style="content: var(--file-img-enabled-gif)" />
            <div>Editing</div>
          </div>
        {:else}
          <div class="active-marker">
            <img src="" alt="disabled" style="content: var(--file-img-disabled-gif)" />
            <div>Inactive</div>
          </div>
        {/if}
        <div>by {theme.theme.meta.author}</div>
        {#if $devmode && theme.publicTheme}
          <span>v{theme.publicTheme.localVersion}</span>
          <span>#{theme.publicTheme.publicId}</span>
        {/if}
      </div>

      <div>

        <FlatButton
          content="{$currentThemeId === theme.theme.meta.id && $loadedEditorTheme === undefined ? 'Active' : 'Activate'}"
          disabled="{$currentThemeId === theme.theme.meta.id && $loadedEditorTheme === undefined}"
          color="green"
          on:click={() => feature.activateLocalTheme(theme.theme.meta.id)}
        />

        {#if theme.publicTheme || theme.enableManage === true}
          <FlatButton
            content="Remove"
            color="orange"
            on:click={() => feature.removeLocalTheme(theme.theme.meta.id)}
          />
        {/if}

        {#if theme.enableManage === true}
          <FlatButton
            content="{$loadedEditorTheme?.theme.meta.id === theme.theme.meta.id ? 'Editing' : 'Edit'}"
            color="blue"
            disabled="{$loadedEditorTheme?.theme.meta.id === theme.theme.meta.id}"
            on:click={() => {
              feature.loadThemeToEditor(theme);
              $selectedTab = "editor";
            }}
          />
        {/if}
      </div>
    </div>
  {/each}
</div>