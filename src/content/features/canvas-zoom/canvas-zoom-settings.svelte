<script lang="ts">
  import type { CanvasZoomFeature } from "@/content/features/canvas-zoom/canvas-zoom.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";

  export let feature: CanvasZoomFeature;

  const onlyWhenDrawing = feature.onlyWhenDrawingStore;
</script>

<style lang="scss">
</style>

<Checkbox bind:checked={$onlyWhenDrawing} description="Enable the Start Zoom hotkey only when you are drawing"/>