<script lang="ts">

  import type { SceneDto, SceneInventoryDto, SpriteDto, SpriteInventoryDto } from "@/api";
  import type { PanelCabinFeature } from "@/content/features/panel-cabin/panel-cabin.feature";

  export let feature: PanelCabinFeature;
  export let onPick: (sprite: SceneDto | undefined | null, shift: number | undefined) => void;
  export let scenes: SceneDto[];
  export let inventory: SceneInventoryDto;

  let scenesMap = new Map<number, SceneDto>();
  $: {
    scenesMap = new Map(scenes.map(scene => [scene.id, scene]));
  }
</script>

<style lang="scss">

  .typo-scene-picker {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    align-items: center;
    gap: 2rem;
    margin-bottom: 2rem;
    overflow: auto;

    .typo-scene-picker-list {
      flex-grow: 1;
      width: 100%;
      overflow: auto;
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 1rem;
      padding: 0 2rem;

      .typo-scene-picker-scene {
        background-color: var(--COLOR_PANEL_BG);
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        gap: .1rem;
        padding: .1rem;
        align-items: center;
        cursor: pointer;
        transition: transform .1s;

        &:hover {
          transform: scale(0.9);
        }

        .typo-scene-picker-scene-thumb{
          width: 20rem;
          max-width: 90%;
          aspect-ratio: 3;
          background-size: cover;
        }

        span {
          font-size: .9rem;
          opacity: .9;
          text-align: center;
        }
      }
    }
  }

</style>

<div class="typo-scene-picker">

  <span>
    Choose a scene from your inventory which will be used as your avatar background.
  </span>

  <div class="typo-scene-picker-list color-scrollbar">

    <div class="typo-scene-picker-scene" on:click={() => onPick(null, undefined)}>
      <div class="typo-scene-picker-scene-thumb"></div>
      <span>Empty</span>
    </div>

    {#each inventory.scenes as scene}

      <!-- theme scene -->
      {#if scene.sceneShift}
        <div class="typo-scene-picker-scene" on:click={() => onPick(scenesMap.get(scene.sceneId), scene.sceneShift)} style="order: {scene.sceneId}">
          <div class="typo-scene-picker-scene-thumb"
               style="background-image: url({feature.getItemThumbnailUrl(scenesMap.get(scene.sceneId), scene.sceneShift)})"></div>
          <span>#{scenesMap.get(scene.sceneId)?.id} / {scene.sceneShift}</span>
          <span>{scenesMap.get(scene.sceneId)?.themes.find(t => t.shift === scene.sceneShift)?.name}</span>
        </div>

      <!-- regular scene -->
      {:else}
        <div class="typo-scene-picker-scene" on:click={() => onPick(scenesMap.get(scene.sceneId), undefined)} style="order: {scene.sceneId}">
          <div class="typo-scene-picker-scene-thumb"
               style="background-image: url({scenesMap.get(scene.sceneId)?.url})"></div>
          <span>#{scenesMap.get(scene.sceneId)?.id}</span>
          <span>{scenesMap.get(scene.sceneId)?.name}</span>
        </div>
      {/if}
    {/each}

  </div>

</div>