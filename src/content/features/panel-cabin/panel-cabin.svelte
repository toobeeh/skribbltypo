<script lang="ts">
  import { PanelCabinFeature } from "./panel-cabin.feature";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";

  export let feature: PanelCabinFeature;
  const memberStore = feature.memberStore;
  const scenePickerEnabled = feature.scenePickerSettingStore;

  let dndTargetSlot: number | undefined;
  let dndTrack: number[] | undefined; // [originalSlot] -> newSlot
  let loading = false;
</script>

<style lang="scss">

  .typo-cabin {
    height: 100%;
    overflow: auto;
    position: relative;

    .typo-cabin-saving {
      position: absolute;
      inset: 0;
      display: none;
      place-content: center;
      z-index: 2;
    }

    &.loading {
      .typo-cabin-saving {
        display: grid;
      }

      .typo-cabin-picker {
        opacity: .2;
      }
    }

    .typo-cabin-scroll {
      height: 100%;
      overflow: auto;
      padding-right: .5rem;
    }
  }

  .typo-cabin-picker {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: .5rem;

    .typo-cabin-scene {
      order: 0;
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

      &:hover:not(.dragging) {
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

      &.dnd-placeholder {
        opacity: 0;
      }
    }
  }
</style>
<div class="typo-cabin" class:loading={loading}>

  <div class="typo-cabin-saving">
    <Bounceload content="Saving.." />
  </div>

{#if $memberStore === undefined}

  <Bounceload content="Loading inventory.." />

{:else if ($memberStore === null)}

  <div>You need to log in to use sprites.</div>

{:else}

  <div class="typo-cabin-scroll">
    <div class="typo-cabin-picker">

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
        <div class="typo-cabin-slot" role="gridcell" tabindex="{slot}" draggable="true" class:dragging={dndTargetSlot !== undefined}
             style="order: {dndTrack ? dndTrack[slot] : slot}"
             on:dragenter={(event) => {
               if(dndTargetSlot === slot || dndTrack === undefined || dndTargetSlot === undefined) return;

               const newTrack = [...Array($memberStore.memberData.slots.unlockedSlots).keys()];
               for(let i = 0; i < dndTrack.length; i++) {
                 if(i >= slot && i < dndTargetSlot){
                   newTrack[i] = i+1;
                 }
                 if(i <= slot && i > dndTargetSlot){
                   newTrack[i] = i-1;
                 }
               }
               newTrack[dndTargetSlot] = dndTrack[slot];
               dndTrack = newTrack;

               // TODO: BUG after adjacent (by oder) swapping elements twice, they are stuck??
             }}
             on:dragstart={() => {
                  dndTargetSlot = slot;
                  dndTrack = [...Array($memberStore.memberData.slots.unlockedSlots).keys()]; // original order
             }}
             on:dragend={async () => {
               loading = true;
               await feature.reorderSlots(dndTrack, $memberStore.memberData.spriteInventory, Number($memberStore.memberData.member.userLogin));
               dndTargetSlot = undefined;
               dndTrack = undefined;
                loading = false;
             }}
        >
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
        <div class="typo-cabin-slot locked" style="order: {slot + $memberStore.memberData.slots.unlockedSlots + 1}">
          <div class="typo-cabin-slot-info">
            Slot #{slot + $memberStore.memberData.slots.unlockedSlots + 1}
          </div>
          <div class="typo-cabin-slot-info">
            Locked
          </div>
        </div>
      {/each}

    </div>

  </div>

{/if}
</div>