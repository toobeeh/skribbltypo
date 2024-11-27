<script lang="ts">

  import type { ControlsThemesFeature } from "@/content/features/controls-themes/controls-themes.feature";

  export let feature: ControlsThemesFeature;
  const savedThemes = feature.savedThemesStore;
</script>

<style lang="scss">

</style>

{#each $savedThemes as theme}
  {theme.theme.meta.name}
{/each}