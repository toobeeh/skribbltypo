<script lang="ts">

  import { calculateAtlasOffsets, wrapOffsetAsStyle } from "@/util/skribbl/avatar";
  import { onMount } from "svelte";

  export let avatar: [number, number, number, number | undefined];
  export let size: string = "80px";

  let resolve: (elem: HTMLDivElement) => void;
  let container: HTMLDivElement;
  export const element = new Promise<HTMLDivElement>((res) => resolve = res);

  onMount(() => {
    resolve(container);
  });

</script>


<style lang="scss">

    .typo-avatar-container {
        width: var(--typo-avatar-container-size);
        aspect-ratio: 1;
        position: relative;
        z-index: 0;

        .typo-avatar-layer {
            position: absolute;

            &:is(.color, .mouth, .eyes, .special) {
                background-repeat: no-repeat;
            }

            &:is(.color, .mouth, .eyes) {
                inset: 0;
            }

            &.color {
                z-index: 0;
                background-image: url("https://skribbl.io/img/avatar/color_atlas.gif");
            }

            &.mouth {
                z-index: 1;
                background-image: url("https://skribbl.io/img/avatar/mouth_atlas.gif");
            }

            &.eyes {
                z-index: 2;
                background-image: url("https://skribbl.io/img/avatar/eyes_atlas.gif");
            }

            &.special {
                z-index: 3;
                background-image: url("https://skribbl.io/img/avatar/special_atlas.gif");
                inset: calc(-1 * var(--typo-avatar-container-size) * (80 - 48) / 48 / 2);
            }
        }
    }

</style>

<div class="typo-avatar-container" style="--typo-avatar-container-size: {size}" bind:this={container}>

  <div class="typo-avatar-layer color" style="{wrapOffsetAsStyle('avatar', calculateAtlasOffsets('avatar', avatar[0]), 'var(--typo-avatar-container-size)')}"></div>
  <div class="typo-avatar-layer mouth" style="{wrapOffsetAsStyle('avatar', calculateAtlasOffsets('avatar', avatar[2]), 'var(--typo-avatar-container-size)')}"></div>
  <div class="typo-avatar-layer eyes" style="{wrapOffsetAsStyle('avatar', calculateAtlasOffsets('avatar', avatar[1]), 'var(--typo-avatar-container-size)')}"></div>

  {#if avatar[3] !== undefined && avatar[3] >= 0}
    <div class="typo-avatar-layer special" style="{wrapOffsetAsStyle('container', calculateAtlasOffsets('container', avatar[3]), 'var(--typo-avatar-container-size)')}"></div>
  {/if}

</div>


