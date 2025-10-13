<script lang="ts">

  import type { SpriteDto, SpriteInventoryDto } from "@/api";
  import type { PanelCabinFeature } from "@/app/features/panel-cabin/panel-cabin.feature";
  import { writable } from "svelte/store";

  export let feature: PanelCabinFeature;
  export let onPick: (sprite: SpriteDto | undefined | null) => void;
  export let sprites: SpriteDto[];
  export let inventory: SpriteInventoryDto[];

  let filter = writable("");
  const matchesFilter = (sprite: SpriteDto | undefined, filter: string) => {
    if (!filter || sprite === undefined) return true;
    const lowerFilter = filter.toLowerCase();
    return sprite.name.toLowerCase().includes(lowerFilter) || sprite.id.toString() === filter;
  };

  let spritesMap = new Map<number, SpriteDto>();
  $: {
    spritesMap = new Map(sprites.map(sprite => [sprite.id, sprite]));
  }
</script>

<style lang="scss">

  .typo-sprite-picker {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    overflow: auto;

    .typo-sprite-picker-filter {
      display: flex;
      flex-direction: row;
      gap: 2rem;
      align-items: center;
      justify-content: center;

      input {
        width: auto;
      }
    }

    .typo-sprite-picker-list {
      flex-grow: 1;
      width: 100%;
      overflow: auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, 8rem);
      gap: 1rem;
      padding: 0 2rem;

      .typo-sprite-picker-sprite {
        background-color: var(--COLOR_PANEL_BG);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: .1rem;
        padding: .1rem;
        align-items: center;
        cursor: pointer;
        transition: transform .1s;
        aspect-ratio: 1;

        &:hover {
          transform: scale(0.9);
        }

        .typo-sprite-picker-sprite-thumb{
          width: 5rem;
          aspect-ratio: 1;
          background-size: cover;
        }

        span {
          font-size: .9rem;
          opacity: .9;
          text-align: center;
        }
      }
    }
  }

</style>

<div class="typo-sprite-picker">

  <span>
    Choose a sprite from your inventory which will be used on the selected slot.<br>
    You can only choose sprites that are not already in use.
  </span>

  <div class="typo-sprite-picker-filter">
    <span>Filter sprites:</span>
    <input bind:value={$filter} type="text" placeholder="Search for ID or name" />
  </div>

  <div class="typo-sprite-picker-list color-scrollbar">

    <div class="typo-sprite-picker-sprite" on:click={() => onPick(null)}>
      <div class="typo-sprite-picker-sprite-thumb"></div>
      <span>Empty</span>
    </div>

    {#each inventory as sprite}
      {#if sprite.slot === undefined && matchesFilter(spritesMap.get(sprite.spriteId), $filter)}

        <div class="typo-sprite-picker-sprite" on:click={() => onPick(spritesMap.get(sprite.spriteId))} style="order: {sprite.spriteId}">
          <div class="typo-sprite-picker-sprite-thumb"
               style="background-image: url({spritesMap.get(sprite.spriteId)?.url})"></div>
          <span>#{spritesMap.get(sprite.spriteId)?.id}</span>
          <span>{spritesMap.get(sprite.spriteId)?.name}</span>
        </div>

      {/if}
    {/each}

  </div>

</div>