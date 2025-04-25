<script lang="ts">
  import { DropsFeature } from "@/app/features/drops/drops.feature";

  export let feature: DropsFeature;
  const claims = feature.recordedClaimsStore;
</script>


<style lang="scss">

  .typo-drop-claims {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    .typo-drop-claims-claim {
      display: flex;
      gap: .4rem;
    }
  }

</style>

<h3>Drop Log</h3>
<p>
  In the drop log, you can find all drops claims that happened while you were in lobbies.<br>
  To report a suspicious drop claim, copy the catch time and drop ID and send it on the typo server.
</p>
<br>

<div class="typo-drop-claims">
  {#each $claims as claim}

    <div class="typo-drop-claims-claim">
      <b>#{claim.dropId}</b>
      <span>{new Date(claim.dropId).toLocaleTimeString()}</span>
      <span>{claim.username}</span>
      <span>{claim.catchTime}ms</span>
      <span>{Math.round(claim.leagueWeight * 100)}%</span>
    </div>

  {/each}

  {#if $claims.length === 0}
    <p>No drop claims yet.</p>
  {/if}
</div>