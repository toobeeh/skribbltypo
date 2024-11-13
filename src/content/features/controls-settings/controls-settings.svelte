<script lang="ts">
  import type { TypoFeature } from "@/content/core/feature/feature";
  import { ControlsSettingsFeature } from "@/content/features/controls-settings/controls-settings.feature";
  import type { componentData } from "@/content/services/modal/modal.service";
  import type { SvelteComponent } from "svelte";

  export let feature: ControlsSettingsFeature;
  const devMode = feature.devModeStore;
  let currentSettingsComponent: componentData<SvelteComponent> | undefined;

  const toggleFeature = async (feature: TypoFeature) => {
    if(feature.toggleEnabled === false) return feature;

    if(feature.state === "destroyed") {
      await feature.activate();
    }
    else if(feature.state === "running") {
      await feature.destroy();
    }

    return feature;
  }

</script>

<style lang="scss">

  .typo-features-info {
    max-width: clamp(40em, 40em, 100%);
    text-align: left;
    padding-bottom: 2em;
  }

  .typo-feature-settings {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    padding: 0 2em 2em 2em;
    overflow: auto;
    transform: translateX(-100vw);
    transition: transform .3s ease-in-out;

    &.settingsVisible {
      transform: translateX(0);
    }
  }

  .typo-features {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    padding: 0 2em 2em 2em;
    overflow: auto;
    transform: translateX(0);
    transition: transform .3s ease-in-out;

    &.settingsVisible {
      transform: translateX(100vw);
    }

    .typo-feature-item {
      min-width: clamp(20em, 20em, 100%);
      max-width: clamp(20em, 20em, 100%);
      background-color: var(--COLOR_PANEL_HI);
      border-radius: 3px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      flex: 1 1 0px;
      position: relative;

      &.hidden {
        display: none;
      }

      &.devMode .feature-id {
        display: block;
        position: absolute;
        bottom: 0;
        right: 0;
        user-select: none;
        opacity: .5;
        padding: .2rem;
      }

      .feature-id {
        display: none;
      }

      .description {
        flex-grow: 1;
        display: flex;
        align-items: center;
      }

      .name-toggle {
        display:flex;
        align-items: center;
        gap: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
        cursor: pointer;
        user-select: none;

        &.locked {
          cursor: not-allowed;

          img {
            filter: grayscale(100%);
            opacity: 0.7;
          }
        }

        img {
          width: 1.5em;
          height: 1.5em;
          filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, .3));
        }

        span:last-child {
          font-size: 1rem;
          opacity: .5;
          margin-left: auto;
          text-transform: uppercase;
        }
      }
    }
  }

</style>

<div class="typo-features-info">
  All features of skribbltypo can be managed here.<br>
  You can click on a feature name to toggle it.<br>
  If you are unsure how a feature works, you can have a look at the typo website or join the typo discord server and get help there!
</div>

<div class="typo-features color-scrollbar" class:settingsVisible={currentSettingsComponent !== undefined}>
  {#each feature.features as feat}

    <!-- container box for a feature, works as toggle-->
    <div class="typo-feature-item"
         class:devMode={$devMode}
         class:hidden={!feat.toggleEnabled && !$devMode}
    >
      <!-- icon with name -->
      <div class="name-toggle" role="button" tabindex="0"
           class:locked={!feat.toggleEnabled}
           on:click={async () => feat = await toggleFeature(feat)}
           on:keypress={async (key) => {
           if(key.key === 'Enter') feat = await toggleFeature(feat);
         }}
      >
        <img src="" alt="{feat.state}" style="content: var(--{feat.state === 'destroyed' ? 'file-img-disabled-gif' : 'file-img-enabled-gif'})" />
        <span>{feat.name}</span>
        <span>{feat.state === 'destroyed' ? 'disabled' : 'enabled'}</span>
      </div>

      <!--description-->
      <div class="description" on:click={() => {
        const settings = feat.featureSettingsComponent;
        if(settings) {
          currentSettingsComponent = settings;
        }
      }}>
        {feat.description}
      </div>

      <!-- feature id in dev mode -->
      <div class="feature-id">#{feat.featureId}</div>
    </div>

  {/each}
</div>

<div class="typo-feature-settings color-scrollbar" class:settingsVisible={currentSettingsComponent !== undefined}>
  {#if currentSettingsComponent}
    <svelte:component this={currentSettingsComponent.componentType} {...currentSettingsComponent.props} />
  {/if}
</div>