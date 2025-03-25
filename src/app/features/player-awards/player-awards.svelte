<script lang="ts">

  import type { AwardDto } from "@/api";
  import type { PlayerAwardsFeature } from "@/app/features/player-awards/player-awards-feature";
  import IconButton from "@/lib/icon-button/icon-button.svelte";

  export let feature: PlayerAwardsFeature;
  export let currentAwardPresentation: AwardDto | undefined = undefined;

  const member = feature.memberStore;
  const awardable = feature.playerAwardableStore;

</script>

<style lang="scss">

  @keyframes award-presentation {
    0% {
      opacity: 0;
      background-size: 100%;
    }

    25% {
      opacity: 1;
      background-size: 30px;
    }

    50% {
      opacity: 1;
      background-size: 48px;
    }

    100% {
      opacity: 0;
      background-size: 48px;
    }
  }

  .typo-awards-icon {
    position: absolute;
    top: 60px;
    right: 4px;
  }

  .typo-awards-presentation {
    position: absolute;
    inset: 0;
    background-position: center;
    background-repeat: no-repeat;
    pointer-events: none;
    animation: award-presentation 3s ease-out forwards;
  }

</style>

{#if $member !== undefined && $member !== null && $awardable}

  <div class="typo-awards-icon">
    <IconButton
      hoverMove="{false}"
      size="48px"
      name="Award this drawing"
      tooltipAction="{feature.createTooltip}"
      icon="file-img-award-gif"
      on:click={async () => {
        const award = await feature.promptAwardSelection($member);
        if(award !== undefined && award.inventoryIds.length > 0) {
          await feature.giveAward(award.inventoryIds[0]);
        }
      }}
    />
  </div>

{/if}

{#if currentAwardPresentation !== undefined}
  {#key currentAwardPresentation}
    <div class="typo-awards-presentation" style="background-image: url({currentAwardPresentation.url})"></div>
  {/key}
{/if}