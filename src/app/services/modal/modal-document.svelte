<script lang="ts">
  import type { componentData } from "./modal.service";
  import { onDestroy, type SvelteComponent } from "svelte";

  export let componentData: componentData<SvelteComponent>;
  export let closeHandler: () => void;
  export let title: string;

  let closing = false;
  const close = () => {
    closing = true;
    setTimeout(() => closeHandler(), 150);
  }
</script>

<style lang="scss">

  :global(body):has(.typo-modal) {
    overflow: hidden;
  }

  @keyframes slideIn {
    from {
      transform: translateY(50vh);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 100;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateY(0);
      opacity: 100;
    }
    to {
      transform: translateY(50vh);
      opacity: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 100;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 100;
    }
    to {
      opacity: 0;
    }
  }

  div.content {
    position: fixed;
    inset: 10vh 0 0 0;
    background: var(--COLOR_PANEL_BG);
    z-index: 9999;
    animation: slideIn 0.15s ease-out;
    backdrop-filter: blur(4px);

    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--COLOR_PANEL_TEXT);
    /*padding-bottom: 2rem;*/

    &.closing {
      animation: slideOut 0.15s ease-out forwards;
    }

    .content-title {
      display:flex;
      justify-content: space-between;
      width: 100%;
      align-items: center;
      padding-left: 2em;
      padding-right: 2em;

      > div:last-child {
        user-select: none;
        position: relative;
        top: -2vh;
        cursor: pointer;
        font-weight: bold;
        font-size: 2.5rem;
        opacity: .7;

        &:hover {
          opacity: 1;
        }
      }
    }

    .content-wrapper {
      overscroll-behavior: none;
      display: flex;
      flex-direction: column;
      overflow-y: scroll;
      width: 100%;
      align-items: stretch;
      flex-grow: 1;
    }
  }

  div.content-top {
    position: fixed;
    top: calc(7vh + 1px);
    z-index: 9999;
    background: var(--COLOR_PANEL_BG);
    clip-path: polygon(100% 0, 0% 100%, 100% 100%);
    backdrop-filter: blur(4px);
    border: none;
    height: 3vh;
    width: 100vw;
    animation: slideIn 0.15s ease-out;

    &.closing {
      animation: slideOut 0.15s ease-out forwards;
    }
  }

  div.backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9998;
    animation: fadeIn 0.15s ease-out;

    &.closing {
      animation: fadeOut 0.15s ease-out forwards;
    }
  }

</style>

<div class="backdrop" role="presentation" class:closing={closing} on:click={() => close()}></div>
<div class="content-top" role="presentation" class:closing={closing} on:click={() => close()}></div>

<div class="content typo-modal" class:closing={closing}>
  
  <div class="content-title">
    <div></div>
    <h1>{title}</h1>
    <div role="button" tabindex="0" class:closing={closing} on:keypress={(e) => e.key === "Alt" && close()} on:click={() => close()}>×</div>
  </div>

  <div class="content-wrapper color-scrollbar">
    <svelte:component this={componentData.componentType} {...componentData.props} />
  </div>
</div>