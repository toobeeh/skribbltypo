<script lang="ts">

  import type { ExtensionSetting } from "@/app/core/settings/setting";
  import ColorPickerButton from "@/lib/color-picker/color-picker-button.svelte";
  import { Color } from "@/util/color";
  import { onMount } from "svelte";

  export let setting: ExtensionSetting<string>;

  let settingStore: ExtensionSetting<string>["store"] | undefined;
  let color: Color | undefined;

  $: {
    settingStore = setting.store;
  }

  $: {
    if(color) {
      $settingStore = color.hex;
    }
  }

  onMount(async () => {
    color = Color.fromHex(await setting.getValue());
  });

</script>

<style lang="scss">
  .typo-text-setting {

    b {
      font-size: 1.1rem;
    }

    gap: .5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
  }
</style>

{#if settingStore}
  <div class="typo-text-setting">
    <b>{setting.name}</b>
    <div>{setting.description}</div>
    <div><ColorPickerButton bind:color={color} /></div>
  </div>
{/if}


