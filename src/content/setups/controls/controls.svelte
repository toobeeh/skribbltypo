<script lang="ts">

  import type { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
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

  }
</style>

<div bind:this={elem} class='typo-controls {$position} {$direction}'></div>

