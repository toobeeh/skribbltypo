<style>

    :global(#game-canvas #game-rate.typo-icons :is(.like, .dislike)){
        background-repeat: no-repeat;
        background-size: 90%;
        background-position: center;
    }

  :global(#game-canvas #game-rate.typo-icons .like){
    background-image: var(--file-img-thumbsup-gif);
  }

  :global(#game-canvas #game-rate.typo-icons .dislike){
      background-image: var(--file-img-thumbsdown-gif);
  }

</style>