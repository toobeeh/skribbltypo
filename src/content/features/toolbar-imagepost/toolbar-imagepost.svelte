<script lang="ts">
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";
  import type { ToolbarImagePostFeature } from "./toolbar-imagepost.feature";

  export let feature: ToolbarImagePostFeature;

  let sendAsEmbed = true;
  let viewIndex = 0;
  let loading: Promise<void> | null = null;
  const history = feature.imageHistoryStore;
  const member = feature.memberStore;

  let selectedWebhook = $member?.webhooks[0] ?? null;
  $: viewIndex = $history.length - 1;
</script>

<style lang="scss">

  .typo-image-post {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: stretch;
    gap: 1em;

    img {
      border-radius: 3px;
    }

    .navigate-image {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .not-logged-in, .typo-post-info {
      font-weight: 600;
      opacity: 0.7;
    }
  }

</style>

<div class="typo-image-post">

  {#if ($history.length > 0 && $member !== undefined && $member !== null)}

    <input type="text" class="typo" placeholder="Custom image name" bind:value={$history[viewIndex].name} />
    <img src="{$history[viewIndex].image.getBase64()}" alt="Post image" />

    <div class="navigate-image">
      <IconButton icon="file-img-arrow-left-gif" name="Previous" size="1.5rem" hoverMove="{false}"
                  disabled="{viewIndex <= 0}"
                  on:click={() => viewIndex--} />

      <span>{$history[viewIndex].artist} at  {$history[viewIndex].date.toLocaleTimeString()}</span>

      <IconButton icon="file-img-arrow-right-gif" name="Next" size="1.5rem" hoverMove="{false}"
                  disabled="{viewIndex >= $history.length - 1}"
        on:click={() => viewIndex++} />
    </div>

    <Checkbox bind:checked={sendAsEmbed} description="Send with Discord embed" />

    <div class="typo-post-info">
      Select one of your connected discord servers. When you submit, the image will appear in a channel on the server!
    </div>

    <select bind:value={selectedWebhook}>
      {#each $member.webhooks as webhook}
        <option value="{webhook}">{webhook.name} ({webhook.guild.guildName})</option>
      {/each}
    </select>

    {#if (selectedWebhook !== null && loading === null)}
      <FlatButton content="Send to Server" color="green" on:click={() => loading = selectedWebhook ? feature.postWebhook(selectedWebhook, $history[viewIndex], !sendAsEmbed) : null} />
    {/if}

  {/if}

  {#if ($member === null || $member === undefined)}
    <div class="not-logged-in">
      Log in with your typo account to post images to one of your Discord servers!
    </div>
  {/if}
</div>
