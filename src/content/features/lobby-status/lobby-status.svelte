<script lang="ts">
  import type { LobbyStatusFeature } from "@/content/features/lobby-status/lobby-status.feature";
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
    if(conn && conn !== "unauthorized"){
      console.log(conn);
      lobbyDescription = conn.typoLobbyState.lobbySettings.description;
      lobbyDisableWhitelistAllowedServers = !conn.typoLobbyState.lobbySettings.whitelistAllowedServers;
      lobbyAllowedServers = Object.fromEntries(
        conn.typoLobbyState.lobbySettings.allowedServers.map(s => [s, true])
      );
    }
  });
</script>

<style lang="scss">
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
      <b>Log-in required:</b> You need to log in with typo to use the lobby status feature.<br>
    {:else}
      <b>Lobby Connected:</b> Your lobby is connected to typo and will be visible on Discord.<br>
    {/if}
  </div>

  <!-- lobby settings if player is owner -->
  {#if $connection !== undefined && $connection !== "unauthorized"
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
  {#if $connection !== undefined && $connection !== "unauthorized"
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
            $connection?.typoLobbyState.lobbyId
        } <br>
        <b>Ownership Claim:</b> {
        $connection === undefined ? "/" :
          $connection === "unauthorized" ? "not logged in" :
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
