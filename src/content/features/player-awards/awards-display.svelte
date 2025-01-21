<script lang="ts">
  import type { AwardDto } from "@/api";
  import type { SkribblPlayerDisplay } from "@/content/services/players/skribblPlayerDisplay.interface";

  export let playerDisplay: SkribblPlayerDisplay;
  export let awards: AwardDto[];

  export const getAwards = () => {
    return awards;
  }
</script>

<style>
  :global(#game-players .player .player-icons) .typo-awards-icon {
      height: 20px;
      width: 20px;
      align-self: flex-end;
  }
</style>

{#each awards as award}
  <div class="icon visible typo-awards-icon" style="background-image: url({award.url})" > </div>
{/each}