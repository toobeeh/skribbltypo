<script lang="ts">
  import { Color } from "@/util/color";
  export let color = Color.fromHex("#45588d");
  export let allowAlpha = false;
  export let description = "";

  let inputHex = color.hex;

  let hue: number;
  let saturation: number;
  let value: number;
  let alpha: number | undefined;

  let listenSV = false;
  const handleSV = (event: MouseEvent) => {
    if(!listenSV) return;
    listenSV = false;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    saturation = Math.min(100, Math.max(0, (x / rect.width) * 100));
    value = Math.min(100, Math.max(0, 100 - (y / rect.height) * 100));
    color = Color.fromHsv(hue, saturation, value, alpha);
    inputHex = color.hex;
  }

  let listenHue = false;
  const handleHue = (event: MouseEvent) => {
    if(!listenHue) return;
    listenHue = false;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    hue = Math.min(359, Math.max(0, (x / rect.width) * 360));
    color = Color.fromHsv(hue, saturation, value, alpha);
    inputHex = color.hex;
  }

  let listenAlpha = false;
  const handleAlpha = (event: MouseEvent) => {
    if(!listenAlpha || !allowAlpha) return;
    listenAlpha = false;
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    alpha = Math.min(100, Math.max(0,(x / rect.width)));
    color = Color.fromHsv(hue, saturation, value, alpha);
    inputHex = color.hex;
  }


  $: {
    const newHex = color.hex;
    const oldHex = Color.fromHsv(hue, saturation, value, alpha).hex;
    console.log(newHex, oldHex);

    /* update sliders only if colors differ in result */
    if(newHex !== oldHex) {
      const hsv = color.hsv;
      hue = hsv[0] ?? 0;
      saturation = hsv[1] ?? 100;
      value = hsv[2] ?? 50;
      alpha = allowAlpha ? hsv[3] : undefined;
    }
  }
  
</script>

<style lang="scss">
    .color-picker {
      color: var(--COLOR_PANEL_TEXT);
      user-select: none;
      display: flex;
      flex-direction: column;
      gap: .5rem;
      width: 100%;

      .picker-header {
        display: flex;
        width: 100%;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
        justify-content: center;

        > img {
          user-select: none;
          height: 1.2rem;
          width: 1.2rem;
          filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, .3));
        }

        h3 {
          margin-bottom: 0;
        }
      }

      .color-rect {
        width: 100%;
        aspect-ratio: 1;
        position: relative;
        cursor: crosshair;
        border-radius: 3px;

        .color-thumb {
          position: absolute;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-color: white;

          &.listen {
            display:none;
          }
        }
      }

      .hue-rect {
        width: 100%;
        height: 1rem;
        position: relative;
        cursor: pointer;
        border-radius: 3px;
        /* hue gradient */
        background: linear-gradient(to right in hsl increasing hue, hsl(1deg 100% 50%), hsl(360deg 100% 50%));

        .hue-thumb {
          position: absolute;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-color: white;
        }
      }

      .alpha-rect {
        width: 100%;
        height: 1rem;
        position: relative;
        cursor: pointer;
        border-radius: 3px;

        .alpha-thumb {
          position: absolute;
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background-color: white;
        }
      }

      .slider {
        width: 100%;
        height: 1rem;
      }

      .preview {
        width: 100%;
        height: 40px;
      }
    }
</style>

<div class="color-picker">

  <div class="picker-header">
    <img src="" alt="picker icon" style="content: var(--file-img-crosshair-gif)">
    <h3>Color Picker</h3>
  </div>

  {#if description.length > 0}
    <p>{description}</p>
  {/if}

  <!-- show saturation/value picker -->
  <div
    class="color-rect"
    on:mousedown={() => listenSV = true}
    on:mouseup={handleSV}
    on:mouseleave={handleSV}
    style="
      background:
        linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)),
        linear-gradient(to right, hsl(0, 0%, 100%), hsl({hue}, 100%, 50%));
    "
  >
    <div class="color-thumb" style="top: calc(100% - {value}% - .5rem); left: calc({saturation}% - .5rem)" class:listen={listenSV}></div>
  </div>

   <!-- show hue picker -->
  <div
    class="hue-rect"
    on:mousedown={() => listenHue = true}
    on:mouseup={handleHue}
    on:mouseleave={handleHue}
  >
    <div class="hue-thumb" style="top: calc(50% - .5rem); left: calc({hue / 3.6}% - .5rem)" class:listen={listenHue}></div>
  </div>

  <!-- if alpha allowed, show alpha picker -->
  {#if allowAlpha}
    <div
      class="alpha-rect"
      on:mousedown={() => listenAlpha = true}
      on:mouseup={handleAlpha}
      on:mouseleave={handleAlpha}
      style="background: linear-gradient(to right, {color.copy().withAlpha(0).rgbString}, {color.copy().withAlpha(1).rgbString});"
    >
      <div class="alpha-thumb" style="top: calc(50% - .5rem); left: calc({(alpha ?? 1) * 100}% - .5rem)" class:listen={listenAlpha}></div>
    </div>
  {/if}

  <!-- show manual hex input -->
  <input type="text" placeholder="#aabbcc" bind:value={inputHex} on:change={event => {
    color = Color.fromHex(inputHex);
  }}>
</div>
