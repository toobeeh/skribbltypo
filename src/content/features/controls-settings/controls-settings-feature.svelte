<script lang="ts">
  import type { TypoFeature } from "@/content/core/feature/feature";
  import { fromObservable } from "@/util/store/fromObservable";
  import { firstValueFrom } from "rxjs";

  export let devmodeEnabled: boolean;
  export let feature: TypoFeature;
  export let featureSettingsClicked: () => void;

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

  let featureState: ReturnType<typeof fromObservable<boolean>> | undefined;

  $: {
    featureState = fromObservable(feature.activated$, false);
  }
</script>

<style lang="scss">
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
</style>

<!-- container box for a feature, works as toggle-->
<div class="typo-feature-item"
     class:devMode={devmodeEnabled}
     class:hidden={!feature.toggleEnabled && !devmodeEnabled}
>
  <!-- icon with name -->
  <div class="name-toggle" role="button" tabindex="0"
       class:locked={!feature.toggleEnabled}
       on:click={async () => feature = await toggleFeature(feature)}
       on:keypress={async (key) => {
         if(key.key === 'Enter') feature = await toggleFeature(feature);
       }}
  >
    <img src="" alt="{$featureState ? 'enabled' : 'disabled'}" style="content: var(--{$featureState ? 'file-img-enabled-gif' : 'file-img-disabled-gif'})" />
    <span>{feature.name}</span>
    <span>{$featureState ? 'enabled' : 'disabled'}</span>
  </div>

  <!--description-->
  {#if feature.hasDetailComponents}
    <div class="description" role="button" on:click={() => featureSettingsClicked()}>
      <img src="" alt="{$featureState ? 'enabled' : 'disabled'}" style="content: var(--file-img-wrench-gif)" />
      <span>{feature.description}</span>
    </div>
  {:else}
    <div class="description">
      {feature.description}
    </div>
  {/if}

  <!-- feature id in dev mode -->
  <div class="feature-id">#{feature.featureId}</div>
</div>