<script lang="ts">
  import type { SpriteDto } from "@/api";
  import { PanelCabinFeature } from "./panel-cabin.feature";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";

  export let feature: PanelCabinFeature;
  const memberStore = feature.memberStore;
  const scenePickerEnabled = feature.scenePickerSettingStore;
</script>

<style lang="scss">
  .typo-cabin {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: .5rem;

    .typo-cabin-scene {
      grid-column: span 3;
      width: 100%;
      aspect-ratio: 3;
      background-color: var(--COLOR_PANEL_BG);
      border-radius: 5px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      overflow: hidden;
      transition: transform .1s;
      cursor: pointer;
      user-select: none;
      position: relative;

      .typo-cabin-scene-thumb {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 0;
        opacity: 1;
        transition: opacity .1s;
      }

      &:hover {
        transform: scale(0.98);

        .typo-cabin-scene-info {
          opacity: 1;
        }

        .typo-cabin-scene-thumb {
          opacity: .2;
        }
      }

      .typo-cabin-scene-info {
        opacity: 0;
        text-align: center;
        font-size: .8rem;
        transition: opacity .1s;
        z-index: 1;
      }
    }

    .typo-cabin-slot {
      background-color: var(--COLOR_PANEL_BG);
      border-radius: 5px;
      width: 100%;
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: .5rem;
      overflow: hidden;
      transition: transform .1s;
      cursor: pointer;
      user-select: none;
      position: relative;

      .typo-cabin-slot-thumb {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 0;
        opacity: 1;
        transition: opacity .1s;
      }

      &:hover {
        transform: scale(0.9);

        .typo-cabin-slot-info {
          opacity: 1;
        }

        .typo-cabin-slot-thumb {
          opacity: .2;
        }
      }

      .typo-cabin-slot-info {
        opacity: 0;
        text-align: center;
        font-size: .8rem;
        transition: opacity .1s;
        z-index: 1;
      }

      &.locked {
        cursor: not-allowed;

        .typo-cabin-slot-info {
          opacity: .9;
        }
      }

    }
  }
</style>

{#if $memberStore === undefined}

  <Bounceload content="Loading inventory.." />

{:else if ($memberStore === null)}

  <div>You need to log in to use sprites.</div>

{:else}

  <div class="typo-cabin">

    {#if $scenePickerEnabled}
      <div class="typo-cabin-scene">
        {#if $memberStore.scene && $memberStore.scene.scene}
          <div class="typo-cabin-scene-info">
            {$memberStore.scene.scene.name} (#{$memberStore.scene.scene.id})
          </div>
          <div class="typo-cabin-scene-thumb"
               style="background-image: url({feature.getItemThumbnailUrl($memberStore.scene.scene, $memberStore.scene.shift)})"
          ></div>
        {:else }
          <div class="typo-cabin-scene-info">No scene selected</div>
        {/if}
      </div>
    {/if}

    {#each {length: $memberStore.memberData.slots.unlockedSlots} as _, slot}
      <div class="typo-cabin-slot">
        <div class="typo-cabin-slot-info">
          Slot #{slot + 1}
        </div>

        {#if $memberStore.slots.length > slot}
          <div class="typo-cabin-slot-info">
            {$memberStore.slots[slot].sprite?.name ?? "Unknown"}
            (#{$memberStore.slots[slot].spriteId})
          </div>

          <div class="typo-cabin-slot-thumb"
               style="background-image: url({feature.getItemThumbnailUrl($memberStore.slots[slot].sprite, $memberStore.slots[slot].colorShift)})"
          ></div>
        {:else }
          <div class="typo-cabin-slot-info">
            Empty
          </div>
        {/if}

      </div>
    {/each}

    <!-- fill for full row or at least 9 with locked slots -->
    {#each {length: Math.max(9 - $memberStore.memberData.slots.unlockedSlots, 3 - ($memberStore.memberData.slots.unlockedSlots % 3))} as _, slot}
      <div class="typo-cabin-slot locked">
        <div class="typo-cabin-slot-info">
          Slot #{slot}
        </div>
        <div class="typo-cabin-slot-info">
          Locked
        </div>
      </div>
    {/each}

  </div>

{/if}
