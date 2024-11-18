<script lang="ts">
  import type {
    LobbyTimeVisualizerFeature
  } from "@/content/features/lobby-time-visualizer/lobby-time-visualizer.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";

  export let feature: LobbyTimeVisualizerFeature;

  const chooseVisualizer = feature.enableChooseVisualizerStore;
  const drawVisualizer = feature.enableDrawVisualizerStore;
  const guessVisualizer = feature.enableGuessVisualizerStore;
</script>

<style lang="scss">
</style>

<Checkbox bind:checked={$chooseVisualizer} description="Visualize remaining word choose time"/>
<Checkbox bind:checked={$drawVisualizer} description="Visualize remaining drawing time"/>
<Checkbox bind:checked={$guessVisualizer} description="Visualize remaining guessing time"/>