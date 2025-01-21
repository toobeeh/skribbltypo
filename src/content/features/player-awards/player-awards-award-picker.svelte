<script lang="ts">

  import type { AwardInventoryDto, SpriteDto, SpriteInventoryDto } from "@/api";
  import type { PanelCabinFeature } from "@/content/features/panel-cabin/panel-cabin.feature";
  import type { PlayerAwardsFeature } from "@/content/features/player-awards/player-awards-feature";

  export let onPick: (sprite: AwardInventoryDto) => void;
  export let awards: AwardInventoryDto[];

  const getAwardRarityName = (rarity: number) => {
    switch (rarity) {
      case 0:
        return "Common";
      case 1:
        return "Special";
      case 2:
        return "Epic";
      default:
        return "Legendary";
    }
  }

</script>

<style lang="scss">

  .typo-award-picker {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    overflow: auto;

    .typo-award-picker-list {
      flex-grow: 1;
      width: 100%;
      overflow: auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
      gap: 1rem;
      padding: 0 2rem;

      .typo-award-picker-award {
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

        .typo-award-picker-award-thumb{
          width: 4rem;
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

<div class="typo-award-picker">

  <span>
    Choose an award from your inventory to award the current drawing.
  </span>

  <div class="typo-award-picker-list color-scrollbar">

    {#each awards as award}

      <div class="typo-award-picker-award" on:click={() => onPick(award)} style="order: {award.award.id}">
        <div class="typo-award-picker-award-thumb"
             style="background-image: url({award.award.url})"></div>
        <span><b>{award.award.name}</b></span>
        <span>{getAwardRarityName(award.award.rarity)}</span>
        <span>x{award.inventoryIds.length}</span>
      </div>

    {/each}

  </div>

</div>