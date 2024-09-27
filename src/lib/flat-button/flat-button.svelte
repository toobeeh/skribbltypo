<script lang="ts">
  import { Subject } from "rxjs";

  export let content: string;
  export let color: "green" | "orange" | "blue";

  const click = new Subject<void>();
  export const click$ = click.asObservable();
</script>

<style lang="scss">

  .typo-flat-button {
    padding: .5rem;
    border-radius: .5em;
    position: relative;
    user-select: none;
    font-weight: 700;
    text-shadow: 1px 1px 0 #0000002b;

    &.green {
      background-color: var(--COLOR_BUTTON_SUBMIT_BG);
      color: var(--COLOR_BUTTON_SUBMIT_TEXT);
    }

    &.orange {
      background-color: var(--COLOR_BUTTON_DANGER_BG);
      color: var(--COLOR_BUTTON_DANGER_TEXT);
    }

    &.blue {
      background-color: var(--COLOR_BUTTON_NORMAL_BG);
      color: var(--COLOR_BUTTON_NORMAL_TEXT);
    }

    > span {
      z-index: 2;
      position: relative;
    }

    /* change brightness of background, but not text */
    &:after {
      position: absolute;
      inset: 0;
      content: "";
      z-index: 0;
      opacity: 0;
      background: black;
      transition: opacity .1s;
      border-radius: .5em;
    }

    &:hover:after {
      opacity: .1;
    }

  }
</style>

<button on:click={() => click.next(void 0)} on:click class="typo-flat-button flatUI {color}"> <!-- flatUI for legacy theming -->
  <span>{content}</span>
</button>