<script lang="ts">
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";
  import type { ToolbarImageLabFeature } from "./toolbar-imagelab.feature";
  export let feature: ToolbarImageLabFeature;
  const store = feature.savedDrawCommandsStore;
</script>

<style lang="scss">
  .typo-toolbar-imagelab-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: .7rem;

    .saved-commands {
      display:flex;
      gap: 1rem;
      align-items: center;

      :global(:last-child){
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

  {#each $store as image}
    <div class="saved-commands">
      <div class="remove" >
        <IconButton
          icon="file-img-disabled-gif" name="Remove" size="1.5rem" hoverMove="{false}"
          on:click={() => feature.removeDrawCommands($store, image)}
        />
      </div>
      <FlatButton content="{image.name}" color="green" on:click={() => feature.addDrawCommandsFromFile()} />
    </div>
  {/each}

  <FlatButton content="Load SKD File" color="green" on:click={() => feature.addDrawCommandsFromFile()} />
  <FlatButton content="Save Current Image" color="blue" on:click={() => feature.saveCurrentDrawCommands()} />
</div>
