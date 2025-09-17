<script lang="ts">
  import type { PingAndRepliesFeature } from "@/app/features/ping-and-replies/ping-and-replies.feature";

  export let feature: PingAndRepliesFeature;
  export let onSelected: (name: string) => void;

  const people = feature.playerCandidatesStore;
  const selIndex = feature.kbSelectedPlayerIndexStore;
</script>

<div class="typo-ping-suggestion-popover">
  {#if $people.length == 0}
    No people
  {:else}
    {#each $people as person, index}
      <button type="button" on:click={() => onSelected(person)} class:selected={index == $selIndex}>
        {person}
      </button>
    {/each}
  {/if}
</div>

<style lang="scss">
  .typo-ping-suggestion-popover {
    display: flex;
    flex-direction: column;

    button {
      background-color: transparent;
      border-radius: 3px;

      &.selected {
        background-color: #fff3;
      }
    }
  }
</style>
