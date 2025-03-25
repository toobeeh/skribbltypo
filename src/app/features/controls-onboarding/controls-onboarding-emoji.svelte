<script lang="ts">
  export let x;
  export let y;
  export let src;

  export const hasEnoughDistance = (x1: number, y1: number) => {
    const center = [x + 15, y + 15];
    const center1 = [x1 + 15, y1 + 15];
    const distance = Math.sqrt((center[0] - center1[0]) ** 2 + (center[1] - center1[1]) ** 2);
    return distance > 60;
  }
</script>

<style lang="scss">

  @keyframes iconAppear {
    0% {
      opacity: .3;
      transform: scale(0) translateY(30px);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: scale(1) translateY(-30px);
    }
  }

  .typo-onboarding-emote {
    height: 30px;
    aspect-ratio: 1;
    animation: iconAppear 2.5s forwards ease-out;
    position: absolute;
    user-select: none;
  }
</style>

<img class="typo-onboarding-emote" src="" style="top: {y}px; left: {x}px; content: var(--{src})">