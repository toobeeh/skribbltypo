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

<div class="viplist-mgr">
  <b>VIP Players</b>
  <div>Highlight your friends' messages in chat!</div>
  {#if $vipListStore.length == 0}
    No VIPs added!
  {:else}
    <div class="viplist-list">
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
    </div>
  {/if}
  <div class="viplist-add">
    <div>
      <input type="text" placeholder="Name..." bind:value={addInputTxt} />
      <input type="color" bind:value={addInputCol} />
    </div>
    <FlatButton content="Add" on:click={() => addPlayer()} color="blue" />
  </div>
</div>

<style lang="scss">
  .viplist-mgr {
    max-width: 500px;
    background-color: var(--COLOR_PANEL_HI);
    border-radius: 3px;
    padding: 10px;
  }

  .viplist-list {
    background-color: #fff4;
    border-radius: 5px;
    padding: 8px;
    padding-right: 16px;
    margin: 8px 0;
  }

  .viplist-person {
    display: flex;
    flex-direction: row;
    gap: 5px;
    align-items: center;
    margin-bottom: 3px;

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
    margin-top: 2px;

    > div {
      display: flex;
      flex-direction: row;
      gap: 3px;
      margin-bottom: 5px;

      > input {
        width: 0;

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
