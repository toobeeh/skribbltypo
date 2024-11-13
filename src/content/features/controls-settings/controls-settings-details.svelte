<script lang="ts">
  import type { TypoFeature } from "@/content/core/feature/feature";
  import type { HotkeyAction } from "@/content/core/hotkeys/hotkey";
  import type { ControlsSettingsFeature } from "@/content/features/controls-settings/controls-settings.feature";
  import type { componentData } from "@/content/services/modal/modal.service";
  import type { SvelteComponent } from "svelte";
  import ControlsSettingsHotkey from "./controls-settings-hotkey.svelte";

  export let detailsClosed: () => void;
  export let feature: TypoFeature;
  export let settingsFeature: ControlsSettingsFeature;

  let settingsComponent: componentData<SvelteComponent> | undefined;
  let infoComponent: componentData<SvelteComponent> | undefined;
  let featureHotkeys: HotkeyAction[] = [];

  $: {
    featureHotkeys = [...feature.hotkeys];
    settingsComponent = feature.featureSettingsComponent;
    infoComponent = feature.featureInfoComponent;
  }
</script>

<style lang="scss">
  .typo-feature-settings-title {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;

    .typo-feature-settings-hero {
      opacity: .7;
      font-weight: 600;
      justify-self: start;
    }

    .typo-feature-settings-back {
      cursor: pointer;
      opacity: .7;
      font-weight: 600;
      &:hover {
        opacity: 1;
      }
      justify-self: end;
    }

    > h1 {
      justify-self: center;
    }
  }

  .typo-feature-settings-summary {
    text-align: center;
  }

  .typo-feature-settings-info, .typo-feature-settings-management, .typo-feature-settings-hotkeys {
    width: 100%;
    display: flex;
    flex-direction: column;
    /*align-items: center;
    justify-content: center;*/

    h2 {
      /*opacity: .7;*/
      margin-bottom: .5em;
    }
  }

  .typo-feature-settings-hotkeys-list {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
  }
</style>

<!-- header -->
<div class="typo-feature-settings-title">
  <div class="typo-feature-settings-hero">Feature Details</div>
  <h1>{feature.name}</h1>
  <div class="typo-feature-settings-back" on:click={() => detailsClosed()} >Back to Features ➜</div>
</div>

<!-- feature summary -->
<div class="typo-feature-settings-summary">
  {feature.description}
</div>

{#if infoComponent}
  <div class="typo-feature-settings-info">
    <h2>Feature Information</h2>
    <div>
      <svelte:component this={infoComponent.componentType} {...infoComponent.props} />
    </div>
  </div>
{/if}

{#if settingsComponent}
  <div class="typo-feature-settings-management">
    <h2>Feature Settings</h2>
    <div>
      <svelte:component this={settingsComponent.componentType} {...settingsComponent.props} />
    </div>
  </div>
{/if}

{#if featureHotkeys.length > 0}
  <div class="typo-feature-settings-hotkeys">
    <h2>Feature Hotkeys</h2>
    <p>
      Hotkeys are key combinations to quickly access feature functions. You can disable hotkeys that you don't need.<br>
      To change a hotkey, click in the input field and press the desired key combination. To remove a key from the combination, press it again.<br>
      Empty combinations will be disabled automatically.
    </p>
    <br>
    <div class="typo-feature-settings-hotkeys-list">
      {#each featureHotkeys as hotkey}
        <ControlsSettingsHotkey hotkey="{hotkey}" feature="{settingsFeature}" />
      {/each}
    </div>
  </div>
{/if}
