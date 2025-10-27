<script lang="ts">
  import { PanelLobbiesFeature } from "./panel-lobbies.feature";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";
  export let feature: PanelLobbiesFeature;

  const lobbies = feature.lobbiesStore;
  const groupByLobby = feature.groupByLobbyStore;
  const groupByLobbyWrap = feature.groupByLobbyWrapStore;
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

    .typo-lobbies-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .typo-lobbies-discord-buttons {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: .5rem;
      margin-bottom: 0.6em;
    }

    .typo-lobbies-lobby-title {
      font-size: 0.8em;
      font-weight: bold;
    }

    .typo-lobbies-language-bucket {
      display: flex;
      align-items: start;
      gap: 0.5em;
      margin-bottom: 0.5em;

      .stat-icon {
        height: 42px;
      }
    }

    .typo-lobbies-lobby-buckets {
      display: flex;
      flex-wrap: wrap;
      gap: 0 0.5em;

      .dimmed {
        opacity: 0.7;
      };
    }

    .no-flex {
      display: block;
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
    <div class="typo-lobbies-header">
      <div><b>Online Friends</b></div>
      <div><Checkbox bind:checked={$groupByLobby} description="Group by lobby" /></div>
    </div>

    {#if $lobbies === null}
      <span>You need to log in to see lobbies of your discord friends.<br></span>
    {:else if $lobbies === undefined}
      <Bounceload content="Loading connected servers.."/>
    {:else}
      <div>
        {#each $lobbies.languageBuckets as languageBucket}
          <div class="typo-lobbies-language-bucket">
            <div class="stat-icon" style="content: var({languageBucket.languageIcon})"></div>
            {#if $groupByLobby }
              <div class="typo-lobbies-lobby-buckets" class:no-flex={!$groupByLobbyWrap}>
                {#each languageBucket.lobbyBuckets as lobbyBucket}
                  <div class:dimmed={lobbyBucket.dimmed}>
                    <div class="typo-lobbies-lobby-title">
                      👥 <span class:dimmed={lobbyBucket.dimmed}>{lobbyBucket.currentPlayers} {#if lobbyBucket.currentPlayers === 1}player{:else}players{/if}</span>
                    </div>
                    <div class="typo-lobbies-discord-buttons">
                      {#each lobbyBucket.players as player}
                        <div use:feature.createTooltip={{title: feature.buildButtonTooltip(player), lock: "Y"}}>
                          <FlatButton content="{player.userName}" color="{player.private ? 'green' : 'blue'}" on:click={() => feature.joinLobby(player.lobbyId, player.userName)}  />
                        </div>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="typo-lobbies-discord-buttons">
                {#each languageBucket.players as player}
                  <div use:feature.createTooltip={{title: feature.buildButtonTooltip(player), lock: "Y"}}>
                    <FlatButton content="{player.userName}" color="{player.private ? 'green' : 'blue'}" on:click={() => feature.joinLobby(player.lobbyId, player.userName)}  />
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/each}
        {#if $lobbies.languageBuckets.length === 0}
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