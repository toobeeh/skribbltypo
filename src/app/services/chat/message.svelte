<script lang="ts">

  import type { pendingElement } from "@/app/services/chat/chat.service";
  import { onMount } from "svelte";

  export let content: string = "";
  export let title: string = "";
  export let style: "info" | "success" | "warn" | "normal" = "normal"

  let resolve: (value: pendingElement) => void;
  export const message = new Promise<pendingElement>((res) => resolve = res);

  let messageElement: HTMLElement;
  let titleElement: HTMLElement;
  let contentElement: HTMLElement;

  onMount(() => {
    resolve({
      element: messageElement,
      title,
      content,
      contentElement,
      titleElement
    });
  });


</script>

<style lang="scss">

  .typo-chat-message{

    b {
      &.info{
        color: var(--COLOR_CHAT_TEXT_DRAWING);
      }

      &.error {
        color: var(--COLOR_CHAT_TEXT_LEAVE);
      }

      &.success {
        color: var(--COLOR_CHAT_TEXT_GUESSED);
      }

      &.normal {
        color: var(--COLOR_CHAT_TEXT_BASE);
      }
    }

    span {
      white-space: preserve;
    }

  }

</style>

<p bind:this={messageElement} class="typo-chat-message" >
  <b bind:this={titleElement} class="{style}">{title}</b>
  <span bind:this={contentElement}>{content}</span>
</p>