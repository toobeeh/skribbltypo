<script lang="ts">

  import type { ExtensionSetting } from "@/content/core/settings/setting";
  import Checkbox from "../checkbox/checkbox.svelte";

  export let setting: ExtensionSetting<boolean>;
  let settingStore: ExtensionSetting<boolean>["store"] | undefined;

  $: {
    settingStore = setting.store;
  }

</script>

<style lang="scss">
  b {
    font-size: 1.1rem;
  }
</style>

{#if settingStore}
  <b><Checkbox bind:checked={$settingStore} description={setting.name}/></b>
  <div>{setting.description}</div>
{/if}


