<script lang="ts">

  import type { ExtensionSetting } from "@/app/core/settings/setting";
  import Checkbox from "../checkbox/checkbox.svelte";

  export let setting: ExtensionSetting<number>;
  export let bounds: { min: number, max: number } | undefined;
  export let withSliderAndSteps: number | undefined;

  let settingStore: ExtensionSetting<number>["store"] | undefined;

  $: {
    settingStore = setting.store;
  }

</script>

<style lang="scss">
  .typo-numeric-setting {

    b {
      font-size: 1.1rem;
    }

    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;

    input:invalid{
      border-color: unset;
    }

    input[type=number] {
      width: 10ex;
    }

    input[type=range] {
      grid-column: span 2;
    }
  }
</style>

{#if settingStore}
  <div class="typo-numeric-setting">
    <b>{setting.name}</b>
    <input type="number" min="{bounds?.min}" max="{bounds?.max}" bind:value={$settingStore} />

    {#if withSliderAndSteps !== undefined && bounds}
      <input type="range" min="{bounds.min}" max="{bounds.max}" bind:value={$settingStore} step="{withSliderAndSteps}" />
    {/if}

    <div>{setting.description}</div>
  </div>
{/if}


