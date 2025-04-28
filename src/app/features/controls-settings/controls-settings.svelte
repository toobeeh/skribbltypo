<script lang="ts">
  import type { TypoFeature } from "@/app/core/feature/feature";
  import { type FeatureTag, featureTags } from "@/app/core/feature/feature-tags";
  import { ControlsSettingsFeature } from "@/app/features/controls-settings/controls-settings.feature";
  import { firstValueFrom } from "rxjs";
  import ControlsSettingsDetails from "./controls-settings-details.svelte";
  import ControlsSettingsFeatureItem from "./controls-settings-feature.svelte";

  export let feature: ControlsSettingsFeature;
  const devMode = feature.devModeStore;
  let selectedDetailsFeature: TypoFeature | undefined;

  let filterTags: FeatureTag[] = [];
  let filterContent = "";

  const toggleFeature = async (feature: TypoFeature) => {
    if(feature.toggleEnabled === false) return feature;

    const state = await firstValueFrom(feature.activated$);
    if(!state) {
      await feature.activate();
    }
    else {
      await feature.destroy();
    }

    return feature;
  }

</script>

<style lang="scss">

  .typo-features-container {
    position:relative;
    width: 100%;
    flex-grow: 1;
    overflow-x: hidden;
  }

  .typo-features-info {
    max-width: clamp(40em, 40em, 100%);
    text-align: left;
    padding-bottom: 2em;
  }

  .typo-features-filter {

    display: grid;
    gap: 1rem;
    grid-template-columns: auto auto;
    padding-bottom: 2em;
    align-items: center;

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .filter {
      text-transform: lowercase;
      cursor: pointer;
      padding: .3rem;
      background-color: var(--COLOR_PANEL_HI);
      border-radius: 3px;
      opacity: .6;

      &.selected {
        opacity: 1;
      }
    }
  }

  .typo-feature-settings {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 0 2em 2em 2em;
    padding: 2em;
    overflow: auto;
    transform: translateX(-100vw);
    transition: transform .1s ease-in-out;
    /*background-color: var(--COLOR_PANEL_HI);*/
    border-radius: 3px;

    &.settingsVisible {
      transform: translateX(0);
    }
  }

  .typo-features {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    inset: 0;
    transform: translateX(0);
    transition: transform .1s ease-in-out;

    &.settingsVisible {
      transform: translateX(100vw);
    }

    .typo-features-list {
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
      margin: 0 2rem;
      padding-bottom: 2rem;
      overflow: auto;
    }
  }
</style>

<div class="typo-features-container">
  <div class="typo-features" class:settingsVisible={selectedDetailsFeature !== undefined}>
    <div class="typo-features-info">
      All features of skribbltypo can be managed here.<br>
      You can click on a feature name to toggle it. To open feature settings, click the settings icon.<br>
      If you are unsure how a feature works, you can have a look at the typo website or join the typo discord server and get help there!
    </div>

    <div class="typo-features-filter">
      <h3>Filter by tags:</h3>
      <div class="filters">
        {#each featureTags as tag}
        <span class="filter" class:selected={filterTags.includes(tag)} on:click={() => {
          if(filterTags.includes(tag)) {
            filterTags = filterTags.filter(t => t !== tag);
          }
          else {
            filterTags = [...filterTags, tag];
          }
        }}>#{tag}</span>
        {/each}
      </div>
      <h3>Filter by text:</h3>
      <input type="text" bind:value={filterContent} placeholder="Search for feature/hotkey/command/setting name or description" />
    </div>

    <div class="typo-features-list color-scrollbar">
      {#each feature.searchFeatures(feature.features, filterTags, filterContent) as feat}

        <ControlsSettingsFeatureItem feature="{feat}" devmodeEnabled="{$devMode}" featureSettingsClicked="{() => selectedDetailsFeature = feat}" />

      {/each}
    </div>
  </div>

  <div class="typo-feature-settings color-scrollbar" class:settingsVisible={selectedDetailsFeature !== undefined}>
    {#if selectedDetailsFeature}
      <ControlsSettingsDetails feature="{selectedDetailsFeature}" detailsClosed="{() => selectedDetailsFeature = undefined}" settingsFeature="{feature}" />
    {/if}
  </div>
</div>


