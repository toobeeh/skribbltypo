<script lang="ts">

  export let content: string = "";
  export let title: string = "";
  export let style: "info" | "success" | "warn" | "normal" = "normal"

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

<p class="typo-chat-message" >
  <b class="{style}">{title}</b>
  <span>{content}</span>
</p>