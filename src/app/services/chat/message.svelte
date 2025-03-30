<script lang="ts">

  import type { pendingElement } from "@/app/services/chat/chat.service";
  import { onMount } from "svelte";

  export let content: string = "";
  export let title: string = "";
  export let style: "info" | "success" | "warn" | "normal" = "normal"
  type typoMessageElements = pendingElement & {wrapperElement: HTMLElement};

  let resolve: (value: typoMessageElements) => void;
  export const message = new Promise<typoMessageElements>((res) => resolve = res);

  let messageElement: HTMLElement;
  let titleElement: HTMLElement;
  let contentElement: HTMLElement;
  let wrapperElement: HTMLElement;

  onMount(() => {
    resolve({
      element: messageElement,
      title,
      content,
      contentElement,
      titleElement,
      wrapperElement
    });
  });


</script>

<style lang="scss">

  .typo-chat-message {

    display: flex;
    flex-direction: row;
    align-items: center;

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

<p bind:this={wrapperElement} class="typo-chat-message">
  <span bind:this={messageElement}>
    <b bind:this={titleElement} class="{style}">{title}</b>
    <span bind:this={contentElement}>{content}</span>
  </span>
</p>