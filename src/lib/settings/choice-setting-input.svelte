<script lang="ts" generics="TChoice extends string">

  import type { ExtensionSetting } from "@/app/core/settings/setting";

  export let setting: ExtensionSetting<TChoice>;
  export let choices: { choice: TChoice, name: string }[];
  let settingStore: ExtensionSetting<TChoice>["store"] | undefined;

  $: {
    settingStore = setting.store;
  }

</script>

<style lang="scss">
  .typo-numeric-setting {

    b {
      font-size: 1.1rem;
    }

    display: flex;
    flex-direction: column;
    justify-items: stretch;
    gap: .5rem;
  }
</style>

{#if settingStore}
  <div class="typo-numeric-setting">
    <b>{setting.name}</b>
    <select bind:value={$settingStore}>
      {#each choices as { choice, name }}
        <option value={choice}>{name}</option>
      {/each}
    </select>

    <div>{setting.description}</div>
  </div>
{/if}


