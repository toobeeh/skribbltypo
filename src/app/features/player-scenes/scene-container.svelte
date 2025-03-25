<script lang="ts">
  import type { activeScene } from "@/app/features/player-scenes/player-scenes.feature";
  import type { SkribblPlayerDisplay } from "@/app/services/players/skribblPlayerDisplay.interface";
  import { onDestroy } from "svelte";

  export let scene: activeScene | undefined = undefined;
  export let playerDisplay: SkribblPlayerDisplay;
  export const getScene = () => scene;

  const getUrl = (scene: activeScene) => {
    return scene.shift === undefined ?
      scene.scene.url :
      `https://static.typo.rip/sprites/rainbow/modulate.php?url=${scene.scene.url}&hue=${scene.shift}`;
  }

  $: {
    playerDisplay.useSafeColor = scene !== undefined;
    playerDisplay.useBackground = scene === undefined;
  }

  onDestroy(() => {
    playerDisplay.useSafeColor = false;
    playerDisplay.useBackground = false;
  });
</script>

<style lang="scss">
  .typo-player-scene {
    position: absolute;
    inset: 0;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    z-index: -1;
  }
</style>

{#if scene !== undefined}
  <div class="typo-player-scene" style="background-image: url('{ getUrl(scene) }')"> </div>
{/if}