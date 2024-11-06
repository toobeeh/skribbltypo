<script lang="ts">
  import type { componentData } from "@/content/services/modal/modal.service";
  import { Subject } from "rxjs";
  import { onDestroy, onMount, type SvelteComponent } from "svelte";

  /* explicit: close via close button, implicit: outbound click */
  export let closeStrategy: "implicit" | "explicit" = "implicit";

  export let alignment: "top" | "bottom" = "bottom";
  export let areaName: string;
  export let maxHeight: string | undefined = undefined;
  export let maxWidth: string | undefined = undefined;
  export let componentData: componentData<SvelteComponent>;
  export let title: string | undefined = undefined;
  export let iconName: string | undefined = undefined;

  const clickedOutside = new Subject<void>();
  export const closed$ = clickedOutside.asObservable();

  let self: HTMLElement | undefined;
  let closing = false;

  /**
   * Listen for clicks outside and emit event
   * @param event
   */
  const clickListener = (event: MouseEvent) => {
    if(!self || closeStrategy !== "implicit") return;
    const target = event.target as HTMLElement;
    if(!(self === target) && !self.contains(target)) {
      close();
    }
  };

  /**
   * Init closing of the flyout
   */
  export const close = () => {
    closing = true;
    setTimeout(() => {
      clickedOutside.next();
    }, 80);
  }

  /**
   * Remove event listener on destroy
   */
  onDestroy(() => {
    document.removeEventListener("click", clickListener);
  });

  /**
   * Add event listener on mount
   */
  onMount(() => {

    // hack to escape immediately closing on event that opened the flyout???
    setTimeout(()=>document.addEventListener("click", clickListener), 1);
  });

</script>

<style lang="scss">

  @keyframes slideIn {
    from {
      transform: scaleY(0);
      opacity: 0;
    }
    to {
      transform: scaleY(100%);
      opacity: 100;
    }
  }

  @keyframes slideOut {
    from {
      transform: scaleY(100%);
      opacity: 100;
    }
    to {
      transform: scaleY(0);
      opacity: 0;
    }
  }

  .typo-area-flyout {
    position: relative;
    color: var(--COLOR_PANEL_TEXT);
    z-index: 1;
    margin: .5em 1em;
    border-radius: 10px;
    padding: 1em;
    animation: slideIn .08s ease-out;
    display: flex;
    gap:1rem;
    flex-direction: column;
    align-items: center;

    &.align-top  {
      align-self: start;
      transform-origin: top;
    }

    &.align-bottom {
      align-self: end;
      transform-origin: bottom;
    }

    &.closing {
      animation: slideOut .08s ease-out forwards;
    }

    /* background on separate after element because backdrop blur fucks rendering up */
    &:after {
      animation: slideIn .08s ease-out;
      background: var(--COLOR_PANEL_BG);
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 10px;
      z-index: -1;
      transform: none !important; // dont use transform from animation
      backdrop-filter: blur(2px);
    }

    &.closing:after {
      animation: slideOut .08s ease-out forwards;
    }

    .close-explicit {
      position: absolute;
      top: 0;
      right: .5rem;
      font-size: 1.5rem;
      font-weight: 900;
      cursor: pointer;
      z-index: 1;
    }

    > h3 {
      display: flex;
      gap: 1em;
      align-items: center;

      > img {
        user-select: none;
        height: 1.8em;
        width: 1.8em;
        filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, .3));
      }
    }

    > .content {
      width: 100%;
      overflow-y: auto;
      padding: 0 1em;
    }
  }

</style>

<div class="typo-area-flyout color-scrollbar" class:closing={closing} class:align-top={alignment === "top"} class:align-bottom={alignment === "bottom"}
     style="max-height: {maxHeight ? `calc(${maxHeight} - 1em)` : 'auto'}; max-width: {maxWidth ? `calc(${maxWidth} - 2em)` : 'auto'}; grid-area: {areaName}"
  bind:this={self}
>
  {#if title}
    <h3>
      {#if iconName}
        <img src="" alt="Icon" style="content: var(--{iconName})" />
      {/if}
      <span>{title}</span>
    </h3>
  {/if}

  <div class="content">
    <svelte:component this={componentData.componentType} {...componentData.props} />
  </div>


  <!-- close button -->
  {#if closeStrategy === "explicit"}
    <span class="close-explicit" on:click={() => close()}>
        ×
    </span>
  {/if}
</div>