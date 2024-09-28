<script lang="ts">
  import { PanelNewsFeature } from "./panel-news.feature";
  export let feature: PanelNewsFeature;
</script>

<style lang="scss">
  div.typo-news {
    display: flex;
    flex-direction: column;
    justify-content: center;

    > .news {
      white-space: pre;
      text-wrap: pretty;
    }
  }
</style>

<div class="typo-news">
  <div class="news">{feature.news}</div>
</div>