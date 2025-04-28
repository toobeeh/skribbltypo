<script lang="ts">

  import type { GlobalSettingsService } from "@/app/services/global-settings/global-settings.service";
  import { onMount } from "svelte";

  let elem: HTMLDivElement;
  let resolve: (elem: HTMLDivElement) => void;

  export let globalSettings: GlobalSettingsService;
  export const element = new Promise<HTMLDivElement>((res) => {
    resolve = res;
  });

  onMount(() => {
    resolve(elem);
  });

  const position = globalSettings.settings.controlsPosition.store;
  const direction = globalSettings.settings.controlsDirection.store;
  let mobileExpanded = false;

</script>

<style lang="scss">
  .typo-controls {
    position:fixed;
    display: flex;
    align-items: center;
    gap: .5em;
    z-index: 100;

    &.topleft {
      left: .5em;
      top: .5em;
    }

    &.topright {
      right: .5em;
      top: .5em;
    }

    &.bottomright {
      right: .5em;
      bottom: .5em;
    }

    &.bottomleft {
      left: .5em;
      bottom: .5em;
    }

    &.vertical {
      flex-direction: column;
    }

    &.horizontal {
      flex-direction: row;
    }

    @media (max-aspect-ratio: 1) {
      &:not(.expanded) > :global(:not(.typo-controls-mobile-expand)) {
        display: none;
      }
    }

    .typo-controls-mobile-expand {
      display: none;

      @media (max-aspect-ratio: 1) {
        display: grid;
        place-content: center;
        height: 2rem;
        aspect-ratio: 1;
        border-radius: 100%;
        background-color: var(--COLOR_PANEL_HI);
        background-size: 1.2rem;
        background-position: center;
        background-repeat: no-repeat;
        cursor:pointer;
        user-select: none;
        opacity: .9;
      }
    }

  }
</style>

<div bind:this={elem} class:expanded={mobileExpanded} class='typo-controls {$position} {$direction}'>

  <div class="typo-controls-mobile-expand" style="background-image: var(--file-img-typo-gif)" on:click={() => mobileExpanded = !mobileExpanded}></div>

</div>

