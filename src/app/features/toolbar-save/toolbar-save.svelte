<script lang="ts">
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import type { ToolbarSaveFeature } from "./toolbar-save.feature";
  export let feature: ToolbarSaveFeature;
  feature.customName = "";
</script>

<style lang="scss">
  .typo-toolbar-save-actions {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: 1em;
  }
</style>

<div class="typo-toolbar-save-actions">
  <input type="text" class="typo" placeholder="Custom image name" bind:value={feature.customName} />
  <FlatButton content="Download PNG" color="green" on:click={() => feature.saveAsPng()}  />
  <FlatButton content="Download GIF" color="green" on:click={() => feature.saveAsGif()} />
  <FlatButton content="Download Draw Progress" color="green" on:click={() => feature.saveAsDrawCommands()} />
  <FlatButton content="Copy to Clipboard" color="blue" on:click={() => feature.saveToClipboard()}  />
  <FlatButton content="Save in Cloud" color="blue" on:click={() => feature.saveInCloud()} />
</div>