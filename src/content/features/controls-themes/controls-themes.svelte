<script lang="ts">
  import type { ControlsThemesFeature } from "@/content/features/controls-themes/controls-themes.feature";
  import ThemesBrowser from "./themes-browser.svelte";
  import ThemesEditor from "./themes-editor.svelte";
  import ThemesList from "./themes-list.svelte";

  export let feature: ControlsThemesFeature;
  const selectedTab = feature.activeThemeTabStore;
</script>


<style lang="scss">

  .typo-themes-content {
    padding: 0 1rem;
    width: 100%;
  }

  .typo-themes-navigation {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin-top: 1rem;
    margin-bottom: 2rem;

    h3 {
      opacity: .5;
      cursor: pointer;

      &.selected {
        opacity: 1;
      }
    }
  }

</style>

<div class="typo-themes-content">
  <div class="typo-themes-navigation">
    <h3 class:selected={$selectedTab === "list"} on:click={() => $selectedTab = "list"}>Saved Themes</h3>
    <h3 class:selected={$selectedTab === "editor"} on:click={() => $selectedTab = "editor"}>Theme Editor</h3>
    <h3 class:selected={$selectedTab === "browser"} on:click={() => $selectedTab = "browser"}>Discover Themes</h3>
  </div>

  {#if $selectedTab === "list"}
    <ThemesList {feature} />
  {:else if $selectedTab === "editor"}
    <ThemesEditor {feature} />
  {:else if $selectedTab === "browser"}
    <ThemesBrowser {feature} />
  {/if}
</div>