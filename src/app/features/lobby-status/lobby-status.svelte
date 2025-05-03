<script lang="ts">
  import type { LobbyStatusFeature } from "@/app/features/lobby-status/lobby-status.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";

  export let feature: LobbyStatusFeature;

  let lobbyDescription: string = "";
  let lobbyDisableWhitelistAllowedServers: boolean = false;
  let lobbyAllowedServers: Record<string, boolean> = {};

  const connection = feature.connectionStore;
  const devmode = feature.isDevmodeStore;
  connection.subscribe(conn => {
    if(conn && conn !== "unauthorized" && conn !== "paused"){
      lobbyDescription = conn.typoLobbyState.lobbySettings.description;
      lobbyDisableWhitelistAllowedServers = !conn.typoLobbyState.lobbySettings.whitelistAllowedServers;
      lobbyAllowedServers = Object.fromEntries(
        conn.typoLobbyState.lobbySettings.allowedServers.map(s => [s, true])
      );
    }
  });
</script>

<style lang="scss">

  .status-info {
    display:flex;
    flex-direction: column;
    gap: 1rem;
  }

  .typo-lobby-status-settings {
    display:flex;
    flex-direction: column;
    gap: 1rem;

    .status-settings {
      display: flex;
      gap: 1rem;
      flex-direction: column;
    }
  }
</style>

<div class="typo-lobby-status-settings">

  <!-- current status -->
  <div class="status-info">
    {#if $connection === undefined}
      <Bounceload content="Connecting lobby..."></Bounceload>
    {:else if $connection === "unauthorized"}
      <span><b>Log-in required:</b> You need to log in with typo to use the lobby status feature.<br></span>
    {:else if $connection === "paused"}
      <FlatButton content="Resume Connection" color="blue" on:click={() => feature.setPaused(false)} />
      <span>
        <b>Connection paused:</b>
        Your lobby is currently not visible on Discord.<br>
        You are incognito and no data is sent, but your sprites and scenes won't show up.<br>
        Drops won't appear and you won't be able to give or receive awards.
      </span>
    {:else}
      <FlatButton content="Pause Connection" color="blue" on:click={() => feature.setPaused(true)} />
      <span><b>Lobby Connected:</b> Your lobby is connected to typo and will be visible on Discord.<br></span>
    {/if}
  </div>

  <!-- lobby settings if player is owner -->
  {#if $connection !== undefined && $connection !== "unauthorized" && $connection !== "paused"
    && $connection.typoLobbyState.playerIsOwner}

    <div class="status-settings">
      <span>You are the typo lobby owner. Only you can change these settings.</span>

      <div>
        <b>Lobby Description:</b>
        <input type="text" bind:value={lobbyDescription} placeholder="Description in the Palantir Bot" />
      </div>

      <div>
        <b>Lobby Link Privacy:</b>
        <Checkbox bind:checked={lobbyDisableWhitelistAllowedServers} description="Share link on all servers"/>
        {#each $connection.member.guilds as guild}
          <Checkbox disabled="{lobbyDisableWhitelistAllowedServers}" bind:checked={lobbyAllowedServers[guild.guildID]} description="{guild.guildName}"/>
        {/each}
      </div>

      <FlatButton content="Save Settings" color="green" on:click={() => {
        feature.updateLobbySettings(lobbyDescription, !lobbyDisableWhitelistAllowedServers, lobbyAllowedServers);
      }} />
    </div>

  {/if}

  <!-- lobby overview if player is not owner -->
  {#if $connection !== undefined && $connection !== "unauthorized" && $connection !== "paused"
  && $connection.typoLobbyState.playerIsOwner === false}

    <div class="status-settings">
      {#if $connection.typoLobbyState.lobbySettings.description !== ""}
        <b>Lobby Description:</b><br>
        {$connection.typoLobbyState.lobbySettings.description}
      {/if}

      <div>
        <b>Lobby Link Privacy:</b><br>
        {$connection.typoLobbyState.lobbySettings.whitelistAllowedServers ? "Only on selected servers by the lobby owner" : "On all servers"}
      </div>
    </div>

  {/if}

  <!-- dev settings if devmode enabled -->
  {#if $devmode === true}

    <div class="status-settings">
      <div>
        <b>Lobby ID:</b> {
        $connection === undefined ? "/" :
          $connection === "unauthorized" ? "not logged in" :
            $connection === "paused" ? "paused" :
            $connection?.typoLobbyState.lobbyId
        } <br>
        <b>Ownership Claim:</b> {
        $connection === undefined ? "/" :
          $connection === "unauthorized" ? "not logged in" :
            $connection === "paused" ? "paused" :
            $connection?.typoLobbyState.ownershipClaim
      }
      </div>

      <FlatButton content="Reset Connection" color="orange" on:click={() => {
        feature.resetConnection();
      }} />

      <FlatButton content="Trigger refresh" color="orange" on:click={() => {
        feature.triggerManualRefresh();
      }} />
    </div>

  {/if}

</div>
