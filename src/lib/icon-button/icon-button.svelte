<script lang="ts">
  import { Subject } from "rxjs";

  export let disabled: boolean = false;
  export let icon: string;
  export let name: string;
  export let hoverMove: boolean = true;
  export let greyscaleInactive: boolean = false;
  export let size: string = "37px"
  export let order: undefined | number = undefined;
  const click = new Subject<void>();
  export const click$ = click.asObservable();
</script>

<style lang="scss">
  .typo-icon-button {
    user-select: none;
    display: block;
    cursor: pointer;
    filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, .3));

    &.disabled {
      pointer-events: none;
      opacity: .5;
    }

    img {
      aspect-ratio: 1;
      transform: translateY(0);
      transition: transform 65ms ease-in-out;
    }

    &:hover img.effect {
      transform: translateY(-3px);
    }

    &.greyscale img {
      filter: grayscale(0.7);
      opacity: .7;

      &:hover {
        filter: grayscale(0);
        opacity: 1;
      }
    }
  }
</style>

<div class="typo-icon-button" style="order: {order ?? 'auto'}" role="button" data-name="{name}" tabindex="0"
     class:greyscale={greyscaleInactive} class:disabled={disabled}
     on:click
     on:click={() => click.next(void 0)}
     on:keypress={evt => evt.code === "Enter" && click.next(void 0)}
>
  <img class="typo-icon-button-graphic" class:effect={hoverMove} src="" style="content: var(--{icon}); width: {size}" alt="{name}"/>
</div>