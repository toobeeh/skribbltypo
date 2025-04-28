<style lang="scss">
  :global(.typo-toolbar) {
    grid-area: 4/3/4/3;
    border-radius: 3px;
    background-color: var(--COLOR_CHAT_BG_BASE);
    display:flex;
    align-items: center;
    justify-content: space-evenly;

    @media (max-aspect-ratio: 1) {
      display: none; /* all hidden always on mobile */
    }

    &:empty {
      display: none;
    }
  }
</style>

