<script lang="ts">

  import type { SpriteDto, SpriteInventoryDto } from "@/api";
  import type { PanelCabinFeature } from "@/app/features/panel-cabin/panel-cabin.feature";

  export let feature: PanelCabinFeature;
  export let onPick: (sprite: SpriteDto | undefined | null) => void;
  export let sprites: SpriteDto[];
  export let inventory: SpriteInventoryDto[];

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

    .typo-sprite-picker-list {
      flex-grow: 1;
      width: 100%;
      overflow: auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
      gap: 1rem;
      padding: 0 2rem;

      .typo-sprite-picker-scene {
        background-color: var(--COLOR_PANEL_BG);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: .1rem;
        padding: .1rem;
        align-items: center;
        cursor: pointer;
        transition: transform .1s;

        &:hover {
          transform: scale(0.9);
        }

        .typo-sprite-picker-scene-thumb{
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

  <div class="typo-sprite-picker-list color-scrollbar">

    <div class="typo-sprite-picker-scene" on:click={() => onPick(null)}>
      <div class="typo-sprite-picker-scene-thumb"></div>
      <span>Empty</span>
    </div>

    {#each inventory as sprite}
      {#if sprite.slot === undefined}

        <div class="typo-sprite-picker-scene" on:click={() => onPick(spritesMap.get(sprite.spriteId))} style="order: {sprite.spriteId}">
          <div class="typo-sprite-picker-scene-thumb"
               style="background-image: url({spritesMap.get(sprite.spriteId)?.url})"></div>
          <span>#{spritesMap.get(sprite.spriteId)?.id}</span>
          <span>{spritesMap.get(sprite.spriteId)?.name}</span>
        </div>

      {/if}
    {/each}

  </div>

</div>