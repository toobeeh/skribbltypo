<script lang="ts">
  import type { ChatFocusFeature } from "@/content/features/chat-focus/chat-focus.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";

  export let feature: ChatFocusFeature;

  const autoFocus = feature.chatAutoFocusStore;
</script>

<style lang="scss">
</style>

<Checkbox bind:checked={$autoFocus} description="Auto-Focus when someone starts to draw"/>