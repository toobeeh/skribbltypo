<script lang="ts">
  import type { DrawingColorToolsFeature } from "@/content/features/drawing-color-tools/drawing-color-tools.feature";
  import { PipetteTool } from "@/content/features/drawing-color-tools/pipette-tool";

  export let feature: DrawingColorToolsFeature;

  const selectedTool = feature.selectedToolStore;
</script>

<style lang="scss">
  .color-tools {
    height: var(--UNIT);
    width: calc(var(--UNIT) / 2);
    border-radius: var(--BORDER_RADIUS);
    overflow: hidden;

    .pipette, .picker {
      height: 50%;
      width: 100%;
      color: var(--COLOR_TOOL_TEXT);
      background-color: var(--COLOR_TOOL_BASE);
      cursor: pointer;
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      &:hover {
        background-color: var(--COLOR_TOOL_HOVER);
      }

      &.selected {
        background-color: var(--COLOR_TOOL_ACTIVE);
      }
    }

    .pipette {
      border-bottom: 1px solid lightgray;
      background-image: var(--file-img-crosshair-gif);
    }

    .picker {
      border-top: 1px solid lightgray;
      background-image: var(--file-img-inspect-gif);
    }

  }
</style>

<div class="color-tools">
  <div class="pipette" on:click={() => feature.selectPipetteTool()} class:selected={$selectedTool instanceof PipetteTool}></div>
  <div class="picker"></div>
</div>