<script lang="ts">

</script>

<style lang="scss">
  :global(#game-chat:has(.typo-emojis-enabled)) :global(.typo-emoji-container){
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1ex;

    :global(.typo-emoji) {
      background-image: var(--typo-emoji-url);
      color: transparent;
      overflow: hidden;
      width: 1.5em;
      height: 1.5em;
      background-size: contain;
      background-repeat: no-repeat;
      display: inline-block;
      image-rendering: auto;

      &::selection {
        background-color: transparent;
        color: transparent;
      }
    }
  }

  .typo-command-preview {
    position: absolute;
    bottom: 100%;
    height: 1em;
    left: 0;
    right: 0;
  }
</style>

<div class="typo-emojis-enabled"></div>

