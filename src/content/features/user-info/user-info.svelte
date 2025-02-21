<script lang="ts">
  import { UserInfoFeature } from "./user-info.feature";
  import Bounceload from "../../../lib/bounceload/bounceload.svelte";

  export let feature: UserInfoFeature;
  const member = feature.memberStore;
  const devmode  = feature.devmodeStore;
</script>

<style lang="scss">

  :global(#home) .panel.member-info {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
    width: 100%;
    margin-bottom: 10px; // like avatar customizer above
    color: var(--COLOR_PANEL_TEXT);

    > .member-info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      > span, > a {
        display: flex;
        align-items: center;
        gap: .5em;
        font-weight: bold;
        font-size: 0.9rem;
        cursor: pointer;
        opacity: 0.7;
        color: inherit;
        text-decoration: none;

        > img {
          height: 1.2em;
          image-rendering: auto;
          aspect-ratio: 1;
          content: var(--file-icons-128maxfit-png);
        }
      }
    }

    > .member-info-stats {
      display: flex;
      justify-content: space-evenly;

      > div {
        display: flex;
        gap: .2em;

        > div.stat-icon {
          height: 1.5rem;
          aspect-ratio: 1;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        > span {
          font-weight: bold;
        }

        > span:nth-child(2) {
          opacity: 0.8;
        }
      }
    }
  }

</style>

<div class="member-info panel">
  {#if ($member === null)}
    <div>
      <input type="button" value="Login" on:click={() => feature.login()} />
    </div>

  {:else if ($member === undefined)}
    <div>
      <Bounceload content="Loading..."/>
    </div>

  {:else}

    <div class="member-info-header">
      <a href="https://www.typo.rip">
        <img alt="typo icon" src=""/>
        {$member.userName}
      </a>
      <a href="https://www.typo.rip/user">Manage</a>
      <span role="button" tabindex="0" on:keydown={() => feature.logout()} on:click={() => feature.logout()}>Logout</span>
    </div>

    <div class="member-info-stats">
      <div><div class="stat-icon" style="content: var(--file-img-palantir-gif)"></div><span>Bubbles:</span><span>{$member.bubbles}</span></div>
      <div><div class="stat-icon" style="content: var(--file-img-drop-gif)"></div><span>Drops:</span><span>{Math.round($member.drops * 10) / 10}</span></div>
    </div>

    {#if $devmode}
      <div class="member-info-stats">
        <div><span></span><span>Typo ID:</span><span>{$member.userLogin}</span></div>
      </div>
    {/if}

  {/if}
</div>