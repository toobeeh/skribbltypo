<script lang="ts">
  import type { ControlsProfilesFeature } from "@/app/features/controls-profiles/controls-profiles.feature";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let feature: ControlsProfilesFeature;
</script>

<style lang="scss">
  .typo-profiles {

    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
    width: fit-content;

    .typo-profile {
      display: flex;
      position: relative;
      gap: 1rem;
      cursor: pointer;
      border-radius: 3px;
      padding: .5rem;
      align-items: center;
      background-color: var(--COLOR_PANEL_HI);
      transition: transform .2s;
      justify-content: space-between;

      &:hover {
        transform: translateX(1rem);

        &:before {
          opacity: 1;
        }
      }

      &:before {
        content: "";
        background-image: var(--file-img-arrow-right-gif);
        background-repeat: no-repeat;
        background-size: contain;
        width: 2rem;
        background-position: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -3rem;
        opacity: 0;
        transition: opacity .2s;
        pointer-events: none;
      }
    }
  }
</style>

{#await feature.getProfiles()}
  <Bounceload content="Loading Profiles" />
{:then profiles}

  <h3>Saved Profiles</h3>
  <p>
    Typo profiles let you save and switch the entire data of typo.<br>
    Switching to a profile or deleting a profile will reload the page.
  </p>
  <br>

  <div class="typo-profiles">
    {#each profiles as profile}
      <div class="typo-profile" class:active={profile.active} on:click={() => {
        if(!profile.active) feature.switchToProfile(profile.name)
      }}>
        <span>{profile.name}</span>
        <IconButton
          size="1.5rem"
          icon={profile.active ? "file-img-enabled-gif" : "file-img-trash-gif"}
          name="Delete"
          hoverMove={false}
          greyscaleInactive={true}
          on:click={(e) => {
            e.stopImmediatePropagation();
            if(!profile.active) feature.deleteProfile(profile.name)
          }}
        />
      </div>
    {/each}
  </div>
{/await}

<br>

<h3>Create new profile</h3>
<p>
  A new empty profile will be added.<br>
  This will reload the page.
</p>
<br>

<FlatButton
  content="Create profile"
  color="green"
  on:click={() => feature.createProfile()}
/>

<br>
<br>

<h3>Reset typo</h3>
<p>
  Resetting typo will erase all data. Typo will behave like after a fresh installation.<br>
  This is irreversible and will reload the page.
</p>
<br>

<FlatButton
  content="Reset typo"
  color="orange"
  on:click={() => feature.resetTypo()}
/>