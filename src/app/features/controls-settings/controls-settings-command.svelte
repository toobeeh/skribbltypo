<script lang="ts">
  import type { ExtensionCommand } from "@/app/core/commands/command";
  import type { HotkeyAction } from "@/app/core/hotkeys/hotkey";
  import type { ControlsSettingsFeature } from "@/app/features/controls-settings/controls-settings.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let command: ExtensionCommand;
  export let feature: ControlsSettingsFeature;

  const enabledStore = command.enabledSetting.store;
  const idStore = command.idSetting.store;

  let idInput = "";
  $: {
    idInput = $idStore;
  }

</script>

<style lang="scss">

  .typo-feature-settings-command {
    background-color: var(--COLOR_PANEL_HI);
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-template-rows: 1fr 1fr;
    flex-direction: column;
    border-radius: 3px;
    gap: 1rem;
    padding: 1rem;
    align-items: center;

    .button-container {
      font-size: 1em;
    }
  }

</style>


<div class="typo-feature-settings-command">

  <!-- title -->
  <h3>{command.name}</h3>

  <!-- description -->
  <div>{command.description}</div>

  <!-- reset -->
  <div class="button-container"> <FlatButton content="Reset name" color="orange" on:click={() => {
    $idStore = command.defaultId;
  }} /> </div>

  <!-- save -->
  <div class="button-container"> <FlatButton content="Save name" color="green" on:click={() => {
    $idStore = idInput.length === 0 ? command.defaultId : idInput;
  }} /> </div>

  <!-- enabled toggle -->
  <div><Checkbox bind:checked={$enabledStore} description="{$enabledStore ? 'Enabled' : 'Disabled'}" /></div>

  <!-- recording area -->
  <div style="grid-column: 2 / span 3">
    <input bind:value={idInput} type="text" placeholder="Enter command name" />
  </div>
</div>