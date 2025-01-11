<script lang="ts">
  import { PanelLobbiesFeature } from "./panel-lobbies.feature";
  export let feature: PanelLobbiesFeature;

  const lobbies = feature.lobbiesStore;
</script>

<style lang="scss">
</style>

<div>
  {#if $lobbies === "unauthorized"}
    <span>You need to log in to use lobbies.</span>
  {:else}
    {#each $lobbies as lobby}
       - {lobby.userName}
    {/each}
  {/if}
</div>