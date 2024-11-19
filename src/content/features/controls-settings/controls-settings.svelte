<script lang="ts">
  import type { TypoFeature } from "@/content/core/feature/feature";
  import { ControlsSettingsFeature } from "@/content/features/controls-settings/controls-settings.feature";
  import { firstValueFrom } from "rxjs";
  import ControlsSettingsDetails from "./controls-settings-details.svelte";
  import ControlsSettingsFeatureItem from "./controls-settings-feature.svelte";

  export let feature: ControlsSettingsFeature;
  const devMode = feature.devModeStore;
  let selectedDetailsFeature: TypoFeature | undefined;

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
  }

  .typo-features-info {
    max-width: clamp(40em, 40em, 100%);
    text-align: left;
    padding-bottom: 2em;
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
      flex-grow: 1;
      width: 100%;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
      padding: 0 2em 2em 2em;
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

    <div class="typo-features-list color-scrollbar">
      {#each feature.features as feat}

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


