<script lang="ts">
  import type { AnnouncementDto } from "@/api";
  import { PanelNewsFeature } from "./panel-news.feature";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";

  export let feature: PanelNewsFeature;
  export let announcements: AnnouncementDto[] | undefined = undefined;
</script>

<style lang="scss">
  div.typo-news {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 .5rem;

    > .news {
      white-space: pre;
      text-wrap: pretty;
      display: flex;
      flex-direction: column;

      .announcement {
        display: flex;
        flex-direction: column;
        gap: .5rem;
        padding: .5rem 0;

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
  }
</style>

<div class="typo-news">
  <div class="news">
    {#if announcements === undefined}
      <Bounceload content="Loading news.." />

    {:else}
      {#each announcements as announcement}
        <div class="announcement">
          <div class="title">
            <b>{announcement.title}</b>
            <span>{new Date(Number(announcement.date)).toDateString()}</span>
          </div>
          <p>{announcement.content}</p>
        </div>
      {/each}
    {/if}
  </div>
</div>