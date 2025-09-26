<script lang="ts">
  import type { ExtensionSetting } from "@/app/core/settings/setting";
  import type { VIPPlayer } from "@/app/features/chat-message-highlighting/chat-message-highlighting.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let setting: ExtensionSetting<VIPPlayer[]>;
  let settingStore: ExtensionSetting<VIPPlayer[]>["store"] | undefined;
  let currentVipList: VIPPlayer[];

  $: {
    settingStore = setting.store;
  }

  $: $settingStore && (currentVipList = $settingStore);

  let addInputTxt: string;
  let addInputCol: string;

  const addPlayer = () => {
    currentVipList = [...currentVipList, { name: addInputTxt, color: addInputCol }];
    settingStore?.set(currentVipList);
  };

  const removePlayer = (index: number) => {
    currentVipList = currentVipList.filter((_, i) => i !== index);
    settingStore?.set(currentVipList);
  };

  const updateColor = (index: number, event: Event) => {
    currentVipList = currentVipList.map((v, i) =>
      i !== index ? v : { ...v, color: (event.target as HTMLInputElement).value },
    );
    settingStore?.set(currentVipList);
  };
</script>

{#if settingStore !== undefined}
  <b>{setting.name}</b>
  <div>{setting.description}</div>
  {#if currentVipList.length == 0}
    No VIPs added!
  {:else}
    {#each currentVipList as vip, index}
      <div class="viplist-person">
        <div>{vip.name}</div>
        <div>
          <input type="color" value={vip.color} on:change={(e) => updateColor(index, e)} />
        </div>
        <div>
          <FlatButton on:click={() => removePlayer(index)} content="Remove" color="orange" />
        </div>
      </div>
    {/each}
  {/if}
  <div class="viplist-add">
    <div>
      <input type="text" placeholder="Name..." bind:value={addInputTxt} />
      <input type="color" bind:value={addInputCol} />
    </div>
    <FlatButton content="Add" on:click={() => addPlayer()} color="blue" />
  </div>
{/if}

<style lang="scss">
  .viplist-person {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;

    > div {
      flex-grow: 1;
      &:not(:first-child) {
        max-width: 70px;
      }
    }
  }

  .viplist-add {
    display: flex;
    flex-direction: column;

    > div {
      display: flex;
      flex-direction: row;
      gap: 3px;
      margin-bottom: 5px;

      > input {
        width: auto;

        &:first-child {
          flex-grow: 1;
        }

        &:last-child {
          width: 100px;
        }
      }
    }
  }

  b {
    font-size: 1.1em;
  }
</style>
