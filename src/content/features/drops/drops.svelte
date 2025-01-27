<script lang="ts">
  import type { EventDropDto } from "@/api";
  import type { DropsFeature } from "./drops.feature";
  export let feature: DropsFeature;
  export let drops: EventDropDto[];
  const currentDrop = feature.currentDropStore;

  function getDropUrl(id?: number){
    const drop = drops.find(drop => drop.id === id);
    return drop ? `url(${drop.url})` : "var(--file-img-drop-gif)";
  }
</script>

<style lang="scss">

  @keyframes drop-in {
    0% {
      transform: translateY(-50%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .typo-drop {
    position: absolute;
    bottom: 5px;
    height: 48px;
    aspect-ratio: 1;
    background-size: cover;
    background-position: center;
    cursor: pointer;
    user-select: none;
    animation: drop-in .05s ease-in forwards;
  }
</style>

{#if $currentDrop !== undefined}
  <div class="typo-drop"
       on:click={async () => {
         const token = $currentDrop?.dropToken;
         $currentDrop = undefined;
         if(token) {
           const claim = await feature.claimDrop(token);
           if(claim !== undefined) feature.processClaim(claim, true);
         }
       }}
       style="left: calc((100% - 48px) * ({$currentDrop.position} / 100)); background-image: {getDropUrl($currentDrop.eventDropId)}"
  ></div>
{/if}