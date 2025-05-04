<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import { type AnnouncementDto } from "@/api";

  export let change: AnnouncementDto;
</script>

<style lang="scss">
  .details {
    padding: 0 1rem;

    :global(li){
      margin-left: 1rem;
    }

    :global(:is(p, ul, ol)){
      margin-bottom: 1.5rem;
    }

  }

  .info {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
    font-size: .8em;
    opacity: .8;
  }
</style>

<div class="info">
  <span>{new Date(Number(change.date)).toDateString()}</span>
  <span>Update changelog for v{change.affectedTypoVersion}</span>
</div>
<br>
<div class="details">
  <SvelteMarkdown source="{change.details}" />
</div>