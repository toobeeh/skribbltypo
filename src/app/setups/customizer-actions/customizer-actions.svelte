<script lang="ts">
  import { onMount } from "svelte";

  let elem: HTMLDivElement;
  let resolve: (elem: HTMLDivElement) => void;
  export const element = new Promise<HTMLDivElement>((res) => {
    resolve = res;
  });

  onMount(() => {
    resolve(elem);
  });
</script>

<style lang="scss">
  .typo-customizer-actions {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 4px;
    top: 40px;
    right: 4px;
    
    @media (max-aspect-ratio: 1) {
      gap: 1.25vh;
      top: 7.5vh;
      right: 1.25vh;
    }
  }
</style>

<div bind:this={elem} class='typo-customizer-actions'></div>

