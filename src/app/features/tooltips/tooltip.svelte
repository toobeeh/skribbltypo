<script lang="ts">
  export let title: string;
  export let direction: "N" | "S" | "E" | "W";
  export let anchorX: number;
  export let anchorY: number;
</script>

<style lang="scss">

  @keyframes appear {
    from {
      opacity: 0;
      scale: 0;
    }
    to {
      opacity: 1;
      scale: 1;
    }
  }

  .typo-tooltip {
    position: fixed;
    display: flex;
    z-index: 10000;
    align-items: center;
    animation: appear .1s forwards ease-out;
    pointer-events: none;
    transform-origin: 0 0;

    span {
      background-color: var(--COLOR_TOOL_TIP_BG);
      color: var(--COLOR_PANEL_TEXT);
      border-radius: var(--BORDER_RADIUS);
      padding: 7px;
      text-shadow: 1px 1px 0 #00000038;
      text-align: center;
      font-size: 13px;
      font-weight: 700;
      white-space: pre;
    }

    .typo-tooltip-arrow {
      height: 0;
      width: 0;
    }

    &.E {
      transform: translateY(-50%);
      flex-direction: row;

      .typo-tooltip-arrow {
        border-right: 10px solid var(--COLOR_TOOL_TIP_BG);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
      }
    }

    &.S {
      transform: translateX(-50%);
      flex-direction: column;

      .typo-tooltip-arrow {
        border-bottom: 10px solid var(--COLOR_TOOL_TIP_BG);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
    }

    &.N {
      flex-direction: column-reverse;
      transform: translateX(-50%) translateY(-100%); ;

      .typo-tooltip-arrow {
        border-top: 10px solid var(--COLOR_TOOL_TIP_BG);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
      }
    }

    &.W {
      flex-direction: row-reverse;
      transform: translateX(-100%) translateY(-50%);

      .typo-tooltip-arrow {
        border-left: 10px solid var(--COLOR_TOOL_TIP_BG);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
      }
    }
  }

</style>

<div class="typo-tooltip {direction}" style="top: {anchorY}px; left: {anchorX}px">
  <div class="typo-tooltip-arrow"></div>
  <span>{title}</span>
</div>