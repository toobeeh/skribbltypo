<script lang="ts">
  import type { EmojiDto } from "@/api";
  import type { ChatEmojisFeature } from "@/app/features/chat-emojis/chat-emojis.feature";

  export let feature: ChatEmojisFeature;
  export let onSelected: ((emoji: EmojiDto | string, keepOpen: boolean) => void) | undefined = undefined;

  let hoverEmoji: string | undefined;
  const emojiCandidates = feature.emojiCandidatesStore;
</script>

<style lang="scss">

  .typo-emoji-picker {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: .5ex;
    justify-content: space-evenly;

    .emoji-picker-candidate-unicode {
      font-size: 1.5rem;
    }

    .emoji-picker-candidate, .emoji-picker-candidate-unicode {
      height: 2rem;
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
  {#if $emojiCandidates.mode === "custom" && $emojiCandidates.custom.length === 0 || $emojiCandidates.mode === "unicode" && $emojiCandidates.unicode.length === 0}
    No matching emojis.<br>Type something else to search again!
  {:else }
    {#if hoverEmoji !== undefined}
      :{hoverEmoji}:
    {:else}
      Hover emojis & click to pick
    {/if}
  {/if}
</div>

<div class="typo-emoji-picker" on:mouseleave={() => hoverEmoji = undefined}>
  {#if $emojiCandidates.mode === "custom"}
    {#each $emojiCandidates.custom as emoji}
      <img loading="lazy" class="emoji-picker-candidate" src={emoji.url} alt={emoji.name}
           on:mouseenter={() => hoverEmoji = emoji.name}
           on:click={(e) => onSelected?.(emoji, e.shiftKey)}
      >
    {/each}
  {:else}
    {#each $emojiCandidates.unicode as emoji}
      <span class="emoji-picker-candidate-unicode"
            on:mouseenter={() => hoverEmoji = emoji.short_name}
           on:click={(e) => onSelected?.(emoji.emoji, e.shiftKey)}
      >
        {emoji.emoji}
      </span>
    {/each}
  {/if}
</div>

