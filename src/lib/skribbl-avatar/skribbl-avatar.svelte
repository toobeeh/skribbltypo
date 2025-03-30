<script lang="ts">

  import { calculateAtlasOffsets, wrapOffsetAsStyle } from "@/util/skribbl/avatar";

  export let avatar: [number, number, number, number | undefined];
  export let size: string = "80px";

</script>


<style lang="scss">

    .typo-avatar-container {
        width: var(--typo-avatar-container-size);
        aspect-ratio: 1;
        position: relative;

        .typo-avatar-layer {
            position: absolute;

            &:is(.color, .mouth, .eyes, .special) {
                background-position: center;
                background-repeat: no-repeat
            }

            &:is(.color, .mouth, .eyes) {
                inset: calc(var(--typo-avatar-container-size) * (80 - 48)/80 / 2);
            }

            &.color {
                z-index: 0;
                background-image: url("img/avatar/color_atlas.gif");
            }

            &.mouth {
                z-index: 1;
                background-image: url("img/avatar/mouth_atlas.gif");
            }

            &.eyes {
                z-index: 2;
                background-image: url("img/avatar/eyes_atlas.gif");
            }

            &.special {
                z-index: 3;
                background-image: url("img/avatar/special_atlas.gif");
                inset: 0;
            }
        }
    }

</style>

<div class="typo-avatar-container" style="--typo-avatar-container-size: {size}">

  <div class="typo-avatar-layer color" style="{wrapOffsetAsStyle('avatar', calculateAtlasOffsets('avatar', avatar[0]), 'var(--typo-avatar-container-size)')}"></div>
  <div class="typo-avatar-layer mouth" style="{wrapOffsetAsStyle('avatar', calculateAtlasOffsets('avatar', avatar[1]), 'var(--typo-avatar-container-size)')}"></div>
  <div class="typo-avatar-layer eyes" style="{wrapOffsetAsStyle('avatar', calculateAtlasOffsets('avatar', avatar[2]), 'var(--typo-avatar-container-size)')}"></div>

  {#if avatar[3] !== undefined}
    <div class="typo-avatar-layer special" style="{wrapOffsetAsStyle('container', calculateAtlasOffsets('container', avatar[3]), 'var(--typo-avatar-container-size)')}"></div>
  {/if}

</div>


