<script lang="ts">
  import { TypoNewsFeature } from "./typo-news.feature.js";
  export let feature: TypoNewsFeature;
</script>

<style lang="scss">
  div.typo-news {
    display: flex;
    flex-direction: column;
    justify-content: center;

    > .news {
      white-space: pre;
    }
  }
</style>

<div class="typo-news">
  <div class="news">{feature.news}</div>

  <input type="button" value="Open popup" on:click={() => feature.modalTest()}>

</div>