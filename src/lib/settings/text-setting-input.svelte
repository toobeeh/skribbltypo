<script lang="ts">

  import type { ExtensionSetting } from "@/app/core/settings/setting";

  export let setting: ExtensionSetting<string>;

  let settingStore: ExtensionSetting<string>["store"] | undefined;

  $: {
    settingStore = setting.store;
  }

</script>

<style lang="scss">
  .typo-text-setting {

    b {
      font-size: 1.1rem;
    }

    display: grid;
    align-items: center;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto;

    input:invalid{
      border-color: unset;
    }

    input {
      grid-column: span 2;
    }
  }
</style>

{#if settingStore}
  <div class="typo-text-setting">
    <b>{setting.name}</b>
    <input type="text" bind:value={$settingStore} />

    <div>{setting.description}</div>
  </div>
{/if}


