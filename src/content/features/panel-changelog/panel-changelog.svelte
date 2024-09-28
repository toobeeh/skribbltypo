<script lang="ts">
  import { PanelChangelogFeature } from "./panel-changelog.feature";
  export let feature: PanelChangelogFeature;
</script>

<style lang="scss">
  div.panel-changelog {
    display: flex;
    flex-direction: column;
    justify-content: center;

    > .changelog {
      white-space: pre;
      text-wrap: pretty;
    }
  }
</style>

<div class="panel-changelog">
  <div class="changelog">{feature.changelog}</div>
</div>