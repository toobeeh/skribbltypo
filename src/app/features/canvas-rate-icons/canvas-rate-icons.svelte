<style>

    :global(#game-canvas #game-rate.typo-icons :is(.like, .dislike)){
        background-repeat: no-repeat;
        background-size: 90%;
        background-position: center;
    }

  :global(#game-canvas #game-rate.typo-icons .like, .player-bubble .icon[style*='thumbsup']){
    background-image: var(--file-img-thumbsup-gif) !important;
  }

  :global(#game-canvas #game-rate.typo-icons .dislike, .player-bubble .icon[style*='thumbsdown']){
      background-image: var(--file-img-thumbsdown-gif) !important;
  }

</style>