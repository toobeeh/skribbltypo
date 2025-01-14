<script lang="ts">
  import type { ChatQuickReactFeature } from "@/content/features/chat-quick-react/chat-quick-react.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import { onMount } from "svelte";

  export let feature: ChatQuickReactFeature;
  let wrapper: HTMLDivElement;
  const availableInteractions = feature.availableInteractionsStore;

  const onKeyPress = (event: KeyboardEvent) => {
    if ($availableInteractions !== undefined && $availableInteractions.interactionTarget !== undefined) {
      switch (event.key) {
        case "ArrowLeft":
          feature.votekickPlayer($availableInteractions.interactionTarget);
          feature.toggleQuickReactMenu();
          break;
        case "ArrowRight":
          feature.toggleQuickReactMenu();
          break;
        case "ArrowUp":
          feature.likeCurrentPlayer();
          feature.toggleQuickReactMenu();
          break;
        case "ArrowDown":
          feature.dislikeCurrentPlayer();
          feature.toggleQuickReactMenu();
          break;
      }
    }
  };

  onMount(() => {
    wrapper.focus();
  });
</script>

<style lang="scss">
  .typo-quickreact-focus:focus {
    outline: none;
  }

  .typo-quickreact-keys {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;

    b {
      grid-column: span 2;
      text-align: center;
    }
  }
</style>

<div class="typo-quickreact-focus" tabindex="0" bind:this={wrapper} on:keydown={event => onKeyPress(event)}>
  {#if $availableInteractions !== undefined && $availableInteractions.interactionTarget !== undefined}

    <div class="typo-quickreact-keys">
      <b>Press an arrow key to react to {$availableInteractions.interactionTarget.name}</b>
      <FlatButton content="⬅️ Kick" disabled="{!$availableInteractions.votekickAvailable}" on:click={() => feature.votekickPlayer($availableInteractions.interactionTarget)} color="blue" />
      <FlatButton content="➡️ Close" color="blue" />
      <FlatButton content="⬆️ Like" disabled="{!$availableInteractions.rateAvailable}" color="blue" on:click={() => feature.likeCurrentPlayer()} />
      <FlatButton content="⬇️ Dislike" disabled="{!$availableInteractions.rateAvailable}" color="blue" on:click={() => feature.dislikeCurrentPlayer()} />
    </div>

  {:else}

    <div class="typo-quickreact-keys">
      <b>No interactions available</b>
    </div>

  {/if}
</div>


