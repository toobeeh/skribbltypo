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
</style>

<br>
<div class="details">
  <SvelteMarkdown source="{change.details}" />
</div>