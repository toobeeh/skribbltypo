<script lang="ts">
  import { Color } from "@/util/color";
  import ColorPicker from "./color-picker.svelte";

  export let color = Color.fromHex("#45588d");
  export let allowAlpha = false;
  export let useBackground = true;
  export let height = '2rem';
  export let borderRadius = '3px';
  export let colorChanged: undefined | ((color: Color) => void) = undefined;
  export let description = "";

  let popupPosition: {top: string | undefined, left: string | undefined, right: string | undefined, bottom: string | undefined, transformOrigin: string} | undefined = undefined;
  let closing = false;

  const openPopup = (event: MouseEvent) => {
    /*event.stopImmediatePropagation();*/
    closing = false;
    const anchor = event.target as HTMLElement;
    const rect = anchor.getBoundingClientRect();

    const handler = (e: MouseEvent) => {

      if(e.target === anchor) return;
      document.removeEventListener("click", handler);

      /* dispatch changed event */
      colorChanged?.(color);

      /* close popup */
      closing = true;
      setTimeout(() => {
        popupPosition = undefined;
      }, 150);
    };

    document.addEventListener("click", handler);
    
    let left, right, bottom, top: string | undefined;
    let transformOrigin: string;
    if(rect.x > window.innerWidth / 2) {
      right = `0`;
    }
    else {
      left = `0`;
    }

    if(rect.y > window.innerHeight / 2) {
      bottom = `0`;
      transformOrigin = 'bottom';
    }
    else {
      top = `0`;
      transformOrigin = 'top';
    }
    
    popupPosition = {
      top, left, right, bottom, transformOrigin
    };
  };
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

  .typo-color-picker-button {
    aspect-ratio: 1;
    position: relative;

    .color-picker-button-content {
      position: absolute;
      inset: 0;
      cursor: pointer;
      /*background-image: var(--file-img-crosshair-gif);
      background-size: contain;*/
    }

    .color-picker-popout {
      position: absolute;
      z-index: 10;
      width: 20em;
      border-radius: 10px;
      padding: 1rem;
      background-color: var(--COLOR_PANEL_HI);
      /*backdrop-filter: blur(2px);*/
      filter: drop-shadow(0 5px 10px rgba(0, 0, 0, .3));
      animation: slideIn .08s ease-out;

      &.closing {
        animation: slideOut .08s ease-out forwards;
      }
    }
  }

</style>

<div class="typo-color-picker-button" style="height: {height}" on:click={openPopup} data-rgb="{color.rgbString}">

  <!-- actual visible part of the button-->
  <div class="color-picker-button-content" style="background-color: {useBackground ? color.hex : undefined}; border-radius: {borderRadius}; "></div>

  <!-- popout -->
  {#if popupPosition}
    <div class="color-picker-popout" class:closing={closing}
         style="top: {popupPosition.top}; left: {popupPosition.left}; right: {popupPosition.right}; bottom: {popupPosition.bottom}; transform-origin: {popupPosition.transformOrigin};"
         on:click={e => e.stopImmediatePropagation()}
    >
      <ColorPicker bind:color={color} allowAlpha="{allowAlpha}" description="{description}" />
    </div>
  {/if}
</div>