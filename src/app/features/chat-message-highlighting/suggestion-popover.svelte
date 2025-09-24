<script lang="ts">
  import type { ChatMessageHighlightingFeature } from "@/app/features/chat-message-highlighting/chat-message-highlighting.feature";
  export let feature: ChatMessageHighlightingFeature;

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
