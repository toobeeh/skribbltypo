<script lang="ts">
  import type { LobbyNavigationFeature } from "./lobby-navigation.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  export let feature: LobbyNavigationFeature;
  const flat = feature.flatButtonsStore;
</script>

<style lang="scss">

  .lobby-navigation {
    gap: 1rem;
    display: flex;
    position: absolute;
    width: fit-content;
    right: 50px;
    padding-right: 1rem;
    height: 100%;
    align-items: center;

    .lobby-exit, .lobby-next {
      content: var(--file-img-arrow-small-gif);
      cursor: pointer;
      height: 42px;
      aspect-ratio: 1;
      transition: scale 0.1s ease-in-out;

      &:hover {
        scale: 1.1;
      }
    }

    .lobby-exit {
      filter: drop-shadow(rgba(0, 0, 0, 0.3) 3px 3px 0px) sepia(1) saturate(5) brightness(0.8) hue-rotate(324deg);
    }

    .lobby-next {
      transform: rotateY(180deg);
      filter: drop-shadow(rgba(0, 0, 0, 0.3) -3px 3px 0px) sepia(1) saturate(5) brightness(0.7) hue-rotate(56deg);
    }
  }
</style>

<div class="lobby-navigation">
{#if $flat}
    <FlatButton content="Exit Lobby" color="orange" on:click={() => feature.exitLobby()} />
    <FlatButton content="Next Lobby" color="blue" on:click={() => feature.nextLobby()} />
{:else }
    <!-- lobbyNavIcon exit for legacy theme compatibility -->
    <img src="" alt="Exit Lobby" class="lobby-exit lobbyNavIcon exit" on:click={() => feature.exitLobby()} use:feature.createTooltip={{title: "Exit Lobby", lock: "Y"}} />

    <!-- lobbyNavIcon next for legacy theme compatibility -->
    <img src="" alt="Next Lobby" class="lobby-next lobbyNavIcon next" on:click={() => feature.nextLobby()} use:feature.createTooltip={{title: "Next Lobby", lock: "Y"}} />
{/if}
</div>


