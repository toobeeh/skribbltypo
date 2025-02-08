<script lang="ts">
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import type { ToolbarImageLabFeature } from "./toolbar-imagelab.feature";
  export let feature: ToolbarImageLabFeature;
  const store = feature.savedDrawCommandsStore;
  const devmode = feature.devmodeStore;
  feature.customName = "";

  const locked = feature.locked;
</script>

<style lang="scss">
  .typo-toolbar-imagelab-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: .7rem;

    .lockedHint {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1rem;
      width: 100%;

      span {
        flex-grow: 1;
        user-select: none;
        font-weight: 600;
        opacity: .8;
      }
    }

    .saved-commands {
      display:flex;
      gap: 1rem;
      align-items: center;

      &.locked > :global(:last-child){
        pointer-events: none;
        opacity: .5;
      }

      > :global(:last-child){
        flex-grow: 1;
      }

      .remove {
        filter: grayscale(.7);
        transition: filter 60ms;

        &:hover {
          filter: grayscale(0);
        }
      }
    }
  }
</style>

<div class="typo-toolbar-imagelab-actions">


  {#if $locked}
    <div class="lockedHint">
      <IconButton
        icon="file-img-disabled-gif" name="Abort" size="1.5rem" hoverMove="{false}"
        on:click={() => feature.abortPaste()}
      />
      <span>Drawing in progress...</span>
    </div>
  {/if}

  {#each $store as image}
    <div class="saved-commands" class:locked={$locked}>
      <div class="remove" >
        <IconButton
          icon="file-img-trash-gif" name="Remove" size="1.5rem" hoverMove="{false}"
          on:click={() => feature.removeDrawCommands($store, image)}
        />
      </div>
      <FlatButton content="{image.name}" color="blue" on:click={() => feature.pasteDrawCommands(image)} />
    </div>
  {/each}

  <FlatButton content="Paste Image" color="green" on:click={async () => {
    const data = await feature.pickImageFromLocal();
    if(data != null) await feature.pasteImageToLocation(data);
  }} />
  <FlatButton content="Save Current Image" color="green" on:click={() => feature.saveCurrentDrawCommands()} />
  <FlatButton content="Load SKD File" color="blue" on:click={() => feature.addDrawCommandsFromFile()} />
  <FlatButton content="Download Current SKD" color="blue" on:click={() => feature.downloadCurrentDrawCommands()} />
  <input type="text" class="typo" placeholder="Custom save name" bind:value={feature.customName} />
  <Checkbox bind:checked={feature.clearBeforePaste} description="Clear before paste" />

  {#if $devmode}
    <Checkbox bind:checked={feature.pasteInstant} description="Paste instant (practice!)" />
  {/if}
</div>
