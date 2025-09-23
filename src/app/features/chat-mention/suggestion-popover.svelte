<script lang="ts">
  import type { ChatMentionFeature } from "@/app/features/chat-mention/chat-mention.feature";

  export let feature: ChatMentionFeature;

  const people = feature.playerCandidatesStore;
  const selIndex = feature.kbSelectedPlayerIndexStore;
</script>

<div class="typo-ping-suggestion-popover">
  {#if $people.length == 0}
    No people
  {:else}
    {#each $people as person, index}
      <button type="button" on:click={() => feature.autocompleteSelected(person)} class:selected={index == $selIndex}>
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
