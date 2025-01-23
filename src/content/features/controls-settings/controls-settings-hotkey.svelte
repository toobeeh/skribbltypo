<script lang="ts">
  import type { HotkeyAction } from "@/content/core/hotkeys/hotkey";
  import type { ControlsSettingsFeature } from "@/content/features/controls-settings/controls-settings.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let hotkey: HotkeyAction;
  export let feature: ControlsSettingsFeature;

  const enabledStore = hotkey.enabledSetting.store;
  const comboStore = hotkey.comboSetting.store;

  let recordingElement: HTMLInputElement;
  let recordedKeys: string[];

  $: {
    recordedKeys = [...$comboStore];
  }

  const getHotkeyComboHumanReadable = async (combo: string[]) => {
    if((navigator as any)?.keyboard?.getLayoutMap){
      const layoutMap = await (navigator as any).keyboard.getLayoutMap();
      return combo.map(key => layoutMap.get(key) || key).join(' + ');
    }
    else {
      return combo.join(' + ');
    }
  }

</script>

<style lang="scss">

  .typo-feature-settings-hotkey {
    background-color: var(--COLOR_PANEL_HI);
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-template-rows: 1fr 1fr;
    flex-direction: column;
    border-radius: 3px;
    gap: 1rem;
    padding: 1rem;
    align-items: center;

    .inputs-disabled-hint {
      font-size: .8rem;
      opacity: .7;
    }

    .button-container {
      font-size: 1em;
    }
  }

</style>


<div class="typo-feature-settings-hotkey">

  <!-- title -->
  <h3>{hotkey.name}</h3>

  <!-- description -->
  <div>
    {hotkey.description}
    {#if hotkey.disabledOnInputs}
      <br><span class="inputs-disabled-hint">Disabled in text inputs</span>
    {/if}
  </div>

  <!-- reset -->
  <div class="button-container"> <FlatButton content="Reset to default" color="orange" on:click={async () => {
    const update = await feature.resetHotkeyCombo(hotkey);
    if(update){
      recordedKeys = update;
      recordingElement.value = await getHotkeyComboHumanReadable(recordedKeys);
    }
  }} /> </div>

  <!-- save -->
  <div class="button-container"> <FlatButton content="Save combo" color="green" on:click={() => {
    feature.setHotkeyCombo(hotkey, recordedKeys);
  }} /> </div>

  <!-- enabled toggle -->
  <div><Checkbox disabled="{$comboStore.length === 0}" bind:checked={$enabledStore} description="{$enabledStore ? 'Enabled' : 'Disabled'}" /></div>

  <!-- recording area -->
  <div style="grid-column: 2 / span 3">
    <input value="{recordedKeys.join(' + ')}" bind:this={recordingElement} type="text" placeholder="Press Keys" on:keydown={async event => {
        event.preventDefault();
        if(!recordedKeys.includes(event.code)) {
          recordedKeys.push(event.code);
          recordingElement.value = await getHotkeyComboHumanReadable(recordedKeys);
        }
        else {
          recordedKeys = recordedKeys.filter(key => key !== event.code);
          recordingElement.value = await getHotkeyComboHumanReadable(recordedKeys);
        }
      }}
    />
  </div>
</div>