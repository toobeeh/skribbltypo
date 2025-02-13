<style>

    :global(#game-canvas #game-rate :is(.like, .dislike)){
        background-repeat: no-repeat;
        background-size: 90%;
        background-position: center;
    }

  :global(#game-canvas #game-rate .like){
    background-image: var(--file-img-thumbsup-gif);
  }

  :global(#game-canvas #game-rate .dislike){
      background-image: var(--file-img-thumbsdown-gif);
  }

</style>