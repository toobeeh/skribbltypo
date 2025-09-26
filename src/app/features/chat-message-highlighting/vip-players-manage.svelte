<script lang="ts">
  import type {
    ChatMessageHighlightingFeature,
    VIPPlayer,
  } from "./chat-message-highlighting.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: ChatMessageHighlightingFeature;

  const vipListStore = feature.vipPlayersStore;

  let addInputTxt: string;
  let addInputCol: string;

  const addPlayer = () =>
    ($vipListStore = [...$vipListStore, { name: addInputTxt, color: addInputCol }]);

  const removePlayer = (index: number) =>
    ($vipListStore = $vipListStore.filter((_, i) => i !== index));

  const updateColor = (index: number, event: Event) => {
    $vipListStore = $vipListStore.map((v, i) =>
      i !== index ? v : { ...v, color: (event.target as HTMLInputElement).value },
    );
  };
</script>

<b>VIP Players</b>
<div>Highlight your friends' messages in chat!</div>
{#if $vipListStore.length == 0}
  No VIPs added!
{:else}
  {#each $vipListStore as vip, index}
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
