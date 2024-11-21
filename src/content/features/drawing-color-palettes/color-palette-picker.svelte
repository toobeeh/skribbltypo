<script lang="ts">
  import {type palette} from "@/content/features/drawing-color-palettes/drawing-color-palettes.feature";
  export let palette: palette;
</script>

<style lang="scss">

</style>

<div>
  {palette.name}
</div>