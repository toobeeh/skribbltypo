<script lang="ts">
  import type { ToolbarChallengesFeature } from "./toolbar-challenges.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  export let feature: ToolbarChallengesFeature;

  const challenges = feature.challenges;
  const activeIds = feature.activatedChallengesSettingStore;
</script>

<style lang="scss">

  .typo-toolbar-challenges-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: 1rem;

    .challenge {
      display: flex;
      flex-direction: column;

      span {
        padding-left: 2rem;
      }
    }
  }

</style>

<div class="typo-toolbar-challenges-list">

  {#each challenges as challenge}
    <div class="challenge">
      <Checkbox
        checked={$activeIds.includes(challenge.id)}
        on:change={(event) => {
          const other = $activeIds.filter(id => id !== challenge.id);
          $activeIds = event.detail ? [...other, challenge.id] : other;
        }}
        description="{challenge.challenge.name}"
      />
      <span>{challenge.challenge.description}</span>
    </div>
  {/each}

</div>
