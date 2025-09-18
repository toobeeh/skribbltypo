<script lang="ts">
  import type { ChatPingFeature } from "@/app/features/chat-ping/chat-ping.feature";

  export let feature: ChatPingFeature;
  const ping = feature.pingStore;

</script>

<style lang="scss">
  .typo-ping-info {
    position: absolute;
    top: -1.2em;
    right: .2em;
    opacity: .5;
    font-weight: bold;
    font-size: .8em;
  }
</style>

{#if $ping !== undefined}
  <div class="typo-ping-info">{$ping}ms</div>
{/if}