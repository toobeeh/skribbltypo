<script lang="ts">
  import type { GuessCheckFeature } from "@/content/features/guess-check/guess-check.feature";

  export let feature: GuessCheckFeature;
  const guess = feature.guessChangedStore;
</script>

<style lang="scss">

  @keyframes warn-blink {
    0% {
      opacity: 1;
    }
    25% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    75% {
      opacity: 1;
    }
    100% {
      opacity: 1;
    }
  }

  :global(#game-word .hints) {
    position: relative;
  }

  .typo-hints-overlay {
    position: absolute;
    display: flex;
    gap: .08em;
    z-index: 10;

    /* warning container to sync blinking animation */
    &.warning {
      z-index: 11;
      animation: warn-blink .7s infinite;

      .overlay-character{
        &.warning {
          opacity: 1;
          color:red;
          background-color: var(--COLOR_CHAT_BG_BASE);
        }

        /* hide all normal in warning container */
        &:not(.warning) {
          opacity: 0;
        }
      }
    }

    /* hide all warnings in correct container */
    &.correct {
      .overlay-character.warning {
        opacity: 0;
      }
    }

    /* regular style */
    .overlay-character {
      width: 1ch;
      color: inherit;
      opacity: .6;

      &.hidden {
        opacity: 0;
      }
    }
  }
</style>

<!-- separate container for correct and incorrect, to sync animation -->
{#each ["warning", "correct"] as overlayType}
  <div class="typo-hints-overlay {overlayType}">
    {#if $guess !== null}
      {#each $guess.overlayContent as guessCharacter, index}
        <span class="overlay-character"
              class:hidden={feature.guessCorrectHint(guessCharacter, index, $guess.hints)}
              class:warning={!feature.guessMatchesHint(guessCharacter, index, $guess.hints)}
        >
          {guessCharacter}
        </span>
      {/each}
    {/if}
  </div>
{/each}