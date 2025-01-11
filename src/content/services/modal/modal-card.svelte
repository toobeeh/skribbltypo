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
    background: var(--COLOR_PANEL_BG);
    animation: slideIn 0.15s ease-out;
    backdrop-filter: blur(4px);

    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--COLOR_PANEL_TEXT);
    padding: 2rem;
    border-radius: 3px;

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
        right: -2rem;
        cursor: pointer;
        font-weight: bold;
        font-size: 2.5rem;
        opacity: .7;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  div.backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    animation: fadeIn 0.15s ease-out;
    display: grid;
    place-content: center;
    padding: 3rem;

    &.closing {
      animation: fadeOut 0.15s ease-out forwards;
    }
  }

</style>

<div class="backdrop" role="presentation" class:closing={closing} on:click={(e) => {
   if(e.currentTarget === e.target) close();
}}>

  <div class="content" class:closing={closing}>

    <div class="content-title">
      <div></div>
      <h1>{title}</h1>
      <div role="button" tabindex="0" class:closing={closing} on:keypress={(e) => e.key === "Alt" && close()} on:click={() => close()}>×</div>
    </div>

    <svelte:component this={componentData.componentType} {...componentData.props} />
  </div>
</div>

