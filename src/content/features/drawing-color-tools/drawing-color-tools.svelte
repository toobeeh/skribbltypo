<script lang="ts">
  import type { DrawingColorToolsFeature } from "@/content/features/drawing-color-tools/drawing-color-tools.feature";
  import { PipetteTool } from "@/content/features/drawing-color-tools/pipette-tool";
  import ColorPickerButton from "@/lib/color-picker/color-picker-button.svelte";

  export let feature: DrawingColorToolsFeature;

  const selectedTool = feature.selectedToolStore;
  const color = feature.colorStore;
</script>

<style lang="scss">
  .color-tools {
    height: var(--UNIT);
    width: calc(var(--UNIT) / 2);

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
      border-radius: var(--BORDER_RADIUS) var(--BORDER_RADIUS) 0 0;
    }

    .picker {
      border-top: 1px solid lightgray;
      background-image: var(--file-img-inspect-gif);
      border-radius: 0 0 var(--BORDER_RADIUS) var(--BORDER_RADIUS);
    }

  }
</style>

<div class="color-tools">
  <div class="pipette"
       on:click={() => feature.selectPipetteTool()} class:selected={$selectedTool instanceof PipetteTool}
       use:feature.createTooltip={{title: "Pipette", lock: "Y"}}
  ></div>
  <div class="picker" use:feature.createTooltip={{title: "Picker", lock: "Y"}}>
    <ColorPickerButton
      color="{$color}"
      allowAlpha="{false}"
      useBackground="{false}"
      height="auto"
      borderRadius="0"
      colorChanged={c => feature.updatePickedColor(c)}
      description="Warning: Only typo users can see custom colors."
    />
  </div>
</div>