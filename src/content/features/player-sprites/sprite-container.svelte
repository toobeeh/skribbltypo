<script lang="ts">
  import type { spriteSlot } from "@/content/features/player-sprites/player-sprites.feature";

  export let sprites: spriteSlot[] = [];
  export const getSprites = () => sprites;
</script>

<style lang="scss">

</style>

{#each sprites as slot}
  <div class="sprite-slot">
    {slot.sprite.name}
  </div>
{/each}

