<script lang="ts">
  import { PanelLobbiesFeature } from "./panel-lobbies.feature";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";
  export let feature: PanelLobbiesFeature;

  const lobbies = feature.lobbiesStore;
  const showDiscovered = feature.showDiscoveredLobbiesStore;
  const discoveredLobbies = feature.discoveredLobbiesStore;
</script>

<style lang="scss">

  .typo-lobbies-discord {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding-bottom: 1rem;
    padding-right: .5rem;

    .typo-lobbies-discord-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: .5rem;
    }
  }

  .typo-lobbies-discovered {
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding-right: .5rem;
    border-top: 1px solid var(--COLOR_PANEL_BORDER_FOCUS);

    .typo-lobbies-discovered-buttons {
      display: flex;
      flex-direction: column-reverse;
      gap: .5rem;

      > div {
        display: grid;
        grid-template-columns: auto auto;
        grid-template-rows: 1fr 1fr;
        gap: 1rem;
        row-gap: 0;
        place-items: center;
        background-color: var(--COLOR_PANEL_BG);
        padding: .2rem;
        border-radius: 3px;
        font-size: .9rem;
        cursor: pointer;
        user-select: none;

        b {
          opacity: .7;
          justify-self: baseline;
        }

        span {
          grid-column: 2/2;
          grid-row: 1/3;
        }
      }
    }
  }

</style>

<div>

  <div class="typo-lobbies-discord">
    <b>Online Friends</b>

    {#if $lobbies === null}
      <span>You need to log in to see lobbies of your discord friends.<br></span>
    {:else if $lobbies === undefined}
      <Bounceload content="Loading connected servers.."/>
    {:else}
      <div class="typo-lobbies-discord-buttons">
        {#each $lobbies as lobby}
          <div use:feature.createTooltip={{title: feature.buildButtonTooltip(lobby), lock: "Y"}}>
            <FlatButton content="{lobby.userName}" color="{lobby.private ? 'green' : 'blue'}" on:click={() => feature.joinLobby(lobby.lobbyId, lobby.userName)}  />
          </div>
        {/each}

        {#if $lobbies.length === 0}
          <span>None of your friends are online.</span>
        {/if}
      </div>
    {/if}
  </div>

  {#if $showDiscovered}
    <div class="typo-lobbies-discovered">
      <b>Discovered Lobbies</b>

      {#if $discoveredLobbies.length === 0}
        <div>Join a lobby to see it here afterwards.</div>
      {/if}

      <div class="typo-lobbies-discovered-buttons">
        {#each $discoveredLobbies as lobby}
          <div style="order: {lobby.seenAt % 100000000}" on:click={() => feature.joinLobby(lobby.id ?? "")}>
            <b>{new Date(Number(lobby.seenAt)).toLocaleTimeString()}</b>
            <span>{lobby.players.map(p => p.name).join(", ")}</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>