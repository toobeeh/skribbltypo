<script lang="ts">
  import type { EmojiDto } from "@/api";
  import type { ChatEmojisFeature } from "@/content/features/chat-emojis/chat-emojis.feature";

  export let feature: ChatEmojisFeature;
  export let onSelected: ((emoji: EmojiDto) => void) | undefined = undefined;

  let hoverEmoji: EmojiDto | undefined;
  const emojiCandidates = feature.emojiCandidatesStore;
</script>

<style lang="scss">

  .typo-command-preview {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: .5ex;
    justify-content: space-evenly;

    .emoji-picker-candidate {
      height: 2.5em;
      aspect-ratio: 1;
      image-rendering: auto;
      cursor: pointer;
      transition: transform .1s;

      &:hover {
        transform: scale(.9);
      }
    }
  }

  .typo-emoji-picker-hint {
    text-align: center;
    margin-bottom: 1em;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
  }

</style>

<div class="typo-emoji-picker-hint">
  {#if $emojiCandidates.length === 0}
    No matching emojis.<br>Type something else to search again!
  {:else }
    {#if hoverEmoji !== undefined}
      :{hoverEmoji.name}:
    {:else}
      Hover emojis & click to pick
    {/if}
  {/if}
</div>

<div class="typo-command-preview" on:mouseleave={() => hoverEmoji = undefined}>
  {#each $emojiCandidates as emoji}
    <img class="emoji-picker-candidate" src={emoji.url} alt={emoji.name}
      on:mouseenter={() => hoverEmoji = emoji}
      on:click={() => onSelected?.(emoji)}
    >
  {/each}
</div>

