<script lang="ts">
  import type { TypoFeature } from "@/content/core/feature/feature";
  import { ControlsSettingsFeature } from "@/content/features/controls-settings/controls-settings.feature";
  import ControlsSettingsDetails from "./controls-settings-details.svelte";

  export let feature: ControlsSettingsFeature;
  const devMode = feature.devModeStore;
  let selectedDetailsFeature: TypoFeature | undefined;

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
          gap: 1rem;
          align-items: center;
          user-select: none;

          &[role='button'] {
            cursor: pointer;
          }

          img {
            filter: grayscale(100%);
            opacity: 0.7;
            width: 1.5em;
            height: 1.5em;

            &:hover {
              filter: grayscale(0%);
              opacity: 1;
            }
          }
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
          {#if feat.hasDetailComponents}
            <div class="description" role="button" on:click={() => selectedDetailsFeature = feat}>
              <img src="" alt="{feat.state}" style="content: var(--file-img-wrench-gif)" />
              <span>{feat.description}</span>
            </div>
          {:else}
            <div class="description">
              {feat.description}
            </div>
          {/if}

          <!-- feature id in dev mode -->
          <div class="feature-id">#{feat.featureId}</div>
        </div>

      {/each}
    </div>
  </div>

  <div class="typo-feature-settings color-scrollbar" class:settingsVisible={selectedDetailsFeature !== undefined}>
    {#if selectedDetailsFeature}
      <ControlsSettingsDetails feature="{selectedDetailsFeature}" detailsClosed="{() => selectedDetailsFeature = undefined}" settingsFeature="{feature}" />
    {/if}
  </div>
</div>


