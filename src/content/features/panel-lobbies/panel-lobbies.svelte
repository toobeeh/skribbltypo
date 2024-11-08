<script lang="ts">
  import { PanelLobbiesFeature } from "./panel-lobbies.feature";
  export let feature: PanelLobbiesFeature;

  const lobbies = feature.lobbiesStore;
</script>

<style lang="scss">
</style>

<div>
  {#if $lobbies === "unauthorized"}
    <h2>Log in to use lobbies</h2>
  {:else}
    {#each $lobbies as lobby}
       - {lobby.userName}
    {/each}
  {/if}
</div>