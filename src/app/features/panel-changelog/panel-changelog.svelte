<script lang="ts">
  import type { AnnouncementDto } from "@/api";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";
  import { Color } from "@/util/color";
  import { PanelChangelogFeature } from "./panel-changelog.feature";
  import ColorPicker from "@/lib/color-picker/color-picker-button.svelte";
  export let feature: PanelChangelogFeature;
  export let changes: AnnouncementDto[] | undefined = undefined;
  const devmode = feature.devmodeStore;
</script>

<style lang="scss">
  div.panel-changelog {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 .5rem;

    > .changelog {
      white-space: pre;
      text-wrap: pretty;

      .change {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: .5rem 0;

        &:has(.details){
          cursor:pointer;
        }

        .details {
          font-size: .8rem;
          opacity: .7;
        }

        &:not(:last-child) {
          border-bottom: 1px solid var(--COLOR_PANEL_BORDER_FOCUS);
        }

        .title {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;

          span {
            font-size: .8rem;
            opacity: .7;
          }
        }
      }
    }

    .typo-version {
      font-size: .8rem;
      opacity: .7;
    }
  }
</style>

<div class="panel-changelog">
  {#if $devmode}
    <p class="typo-version">
      Typo version: {feature.getVersion()}
    </p>
  {/if}
  <div class="changelog">
    {#if changes === undefined}
      <Bounceload content="Loading changelog.." />
    {:else}
      {#each changes as change}
        <div class="change" on:click={() => {
          if(change.details) feature.showDetailsModal(change);
        }}>
          <div class="title">
            <b>{change.title}</b>
            <span>{change.affectedTypoVersion} ({new Date(Number(change.date)).toLocaleDateString()})</span>
          </div>
          <p>{change.content}</p>

          {#if change.details !== undefined}
            <span class="details">Read more..</span>
          {/if}
        </div>
      {/each}
    {/if}
  </div>
</div>