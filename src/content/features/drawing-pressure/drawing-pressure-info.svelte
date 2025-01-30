<script lang="ts">

  import type { DrawingPressureFeature } from "@/content/features/drawing-pressure/drawing-pressure.feature";
  import { calculatePressurePoint } from "@/util/typo/pressure";

  export let feature: DrawingPressureFeature;

  const sensitivity = feature.sensitivitySettingStore;
  const balance = feature.balanceSettingStore;
  let canvas: HTMLCanvasElement | undefined;

  $: {
    let s = $sensitivity;
    let v = $balance;

    const ctx = canvas?.getContext("2d");

    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, 100, 100);
      ctx.fillStyle = "white";
      ctx.lineWidth = 2;
      ctx.fillRect(0, 0, 100, 100);

      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.beginPath();
      for(let x = 0; x < 100; x++) {
        ctx.lineTo(x, 100 - calculatePressurePoint(x / 100, s, v) * 100);
      }
      ctx.stroke();
    }
  }

</script>

<style lang="scss">

  canvas {
    border-radius: 3px;
    width: 10rem;
  }

</style>
<div>
  <p>
    Typo modifies pressure so that you can use the full brush size range without switching brush sizes in skribbl.<br>
    Additionally, you can customize the sensitivity of the pen pressure.<br>
    By default, a performance mode is activated. This mode is recommended for devices with lower performance.<br>
    To use pressure in combination with the typo brush laboratory, disable performance mode.
  </p>
  <br>

  <b>Attention!</b>
  <p>
    The performance mode needs "Pressure Sensitivity" enabled in the skribbl settings.
  </p>
  <br>

  <b>Current sensitivity curve:</b>
  <p>
    The sensitivity curve shows how the brush size changes depending on pen pressure.<br>
    The x-axis represents the pressure (from light to hard), and the y-axis represents the brush size (small to big).
  </p>
  <br>
  <canvas bind:this={canvas} width="100" height="100" />
</div>