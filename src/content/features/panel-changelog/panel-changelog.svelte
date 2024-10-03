<script lang="ts">
  import { Color } from "@/util/color";
  import { PanelChangelogFeature } from "./panel-changelog.feature";
  import ColorPicker from "@/lib/color-picker/color-picker-button.svelte";
  export let feature: PanelChangelogFeature;

  let color: Color = Color.fromHex("#45588d");
</script>

<style lang="scss">
  div.panel-changelog {
    display: flex;
    flex-direction: column;
    justify-content: center;

    > .changelog {
      white-space: pre;
      text-wrap: pretty;
    }
  }
</style>

<div class="panel-changelog">
  <div class="changelog">{feature.changelog}</div>

  {color.hex}

  <div style="align-self: start; ">
    <ColorPicker bind:color={color} />
  </div>
</div>