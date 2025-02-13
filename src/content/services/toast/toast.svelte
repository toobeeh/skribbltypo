<script lang="ts">
  import Bounceload from "@/lib/bounceload/bounceload.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";

  export let content: string | undefined;
  export let title: string | undefined;
  export let closeHandler: () => void;
  export let confirmHandler: ((result: boolean) => void) | undefined = undefined;
  export let promptHandler: ((result: string) => void) | undefined = undefined;
  export let showLoading = false;
  export let allowClose = true;
  
  let promptContent = "";

  let closing = false;
  export const close = () => {
    setTimeout(() => closeHandler(), 150);
    closing = true;
  }
</script>

<style lang="scss">

  @keyframes slideIn {
    from {
      transform: translateY(-50vh);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 100;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateY(0);
      opacity: 100;
    }
    to {
      transform: translateY(-50vh);
      opacity: 0;
    }
  }

  .typo-toast {
    padding: 1rem 3rem 1rem 1rem;
    background-color: var(--COLOR_PANEL_HI);
    border-radius: 5px;
    color: var(--COLOR_PANEL_TEXT);
    filter: drop-shadow(0 5px 10px rgba(0, 0, 0, .3));
    min-width: clamp(20rem, 20rem, 80%);
    position: relative;
    animation: slideIn 0.15s ease-out;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    white-space-collapse: preserve;
    gap: .5rem;

    &.closing {
      animation: slideOut 0.15s ease-out forwards;
    }

    &.loading {
      cursor: progress;
    }

    form {
      display: flex;
      width: 100%;

      input[type=submit]{
        display: none;
      }
    }

    .typo-toast-confirm {
      width:100%;
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }

    .close-toast {
      position: absolute;
      right: .5rem;
      top: 0;
      font-weight: 900;
      opacity: .7;
      cursor:pointer;
      font-size: 2rem;
    }
  }

</style>

<div class="typo-toast" class:closing={closing} class:loading={showLoading}>

  {#if title !== undefined}
    <h3>{title}</h3>
  {/if}

  {#if showLoading}
    <Bounceload content="{content}" />
  {:else }

    <!--close button-->
    {#if allowClose}
      <span class="close-toast" on:click={() => close()}>
          ×
      </span>
    {/if}

    {#if content !== undefined && promptHandler === undefined}
      <span>{content}</span>
    {/if}

    {#if promptHandler !== undefined}
      <form on:submit={(e) =>{
        e.preventDefault();
        promptHandler(promptContent);
      }}>
        <input type="submit" hidden />
        <input bind:value={promptContent} type="text" placeholder="{content}">
      </form>
    {/if}

    {#if confirmHandler !== undefined}
      <div class="typo-toast-confirm">
        <IconButton icon="file-img-enabled-gif" name="Confirm" hoverMove="{false}" size="1.5rem" on:click={() => confirmHandler(true)} />
        <IconButton icon="file-img-disabled-gif" name="Abort" hoverMove="{false}" size="1.5rem" on:click={() => confirmHandler(false)} />
      </div>
    {/if}
  {/if}
</div>