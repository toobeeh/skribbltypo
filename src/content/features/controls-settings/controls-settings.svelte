<script lang="ts">
  import type { TypoFeature } from "@/content/core/feature/feature";
  import { ControlsSettingsFeature } from "@/content/features/controls-settings/controls-settings.feature";

  export let feature: ControlsSettingsFeature;

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

  .typo-features {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
    padding: 0 2em;
    overflow: auto;

    .typo-feature-item {
      min-width: clamp(20em, 20em, 100%);
      max-width: clamp(20em, 20em, 100%);
      background-color: var(--COLOR_PANEL_HI);
      border-radius: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
      flex: 1 1 0px;

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

<div class="typo-features color-scrollbar">
  {#each feature.features as feat}

    <!-- container box for a feature, works as toggle-->
    <div class="typo-feature-item"
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
      <div>{feat.description}</div>
    </div>

  {/each}
</div>