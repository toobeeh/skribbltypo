<script lang="ts">
  import type { spriteSlot } from "@/content/features/player-sprites/player-sprites.feature";
  import type { SkribblPlayerDisplay } from "@/content/services/players/skribblPlayerDisplay.interface";
  import { onDestroy } from "svelte";

  export let sprites: spriteSlot[] = [];
  export let playerDisplay: SkribblPlayerDisplay;
  export const getSprites = () => sprites;

  $: {
    playerDisplay.adjustToContainSprites = sprites.length > 0;
    playerDisplay.hideAvatar = sprites.some(sprite => sprite.sprite.isSpecial);
  }

  const getUrl = (slot: spriteSlot) => {
    return slot.shift === undefined ?
      slot.sprite.url :
      `https://static.typo.rip/sprites/rainbow/modulate.php?url=${slot.sprite.url}&hue=${slot.shift}`;
  }

  onDestroy(() => {
    playerDisplay.adjustToContainSprites = false;
  });
</script>

<style lang="scss">
  .sprite-slot {
    position: absolute;
    left: -33%;
    top: -33%;
    width: 166%;
    height: 166%;
    background-repeat: no-repeat;
    background-size: contain;
  }
</style>

{#each sprites as slot}
  <div class="sprite-slot" style="background-image: url('{ getUrl(slot) }'); z-index: {slot.slot + 10}"> </div>
{/each}

