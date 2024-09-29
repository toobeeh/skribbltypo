<script lang="ts">
  export let checked = false;
  export let disabled = false;
  export let description = "";
</script>

<style lang="scss">

  div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: .5em;
    cursor: pointer;
    padding: .2em;

    .disabled {
      opacity: .5;
      pointer-events: none;
    }

    img {
      height: 1.5em;
      aspect-ratio: 1;
      filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, .3));
    }

    span {
      user-select: none;
      font-weight: 600;
    }
  }
</style>

<div class:disabled={disabled} role="checkbox" tabindex="0" aria-checked="{checked}" on:click
     on:click={() => checked = !checked} on:keypress={(key) => key.key === 'Enter' ? checked = !checked : 0}>
  <img src="" alt="icon" style="content: var(--{checked ? 'file-img-enabled-gif' : 'file-img-disabled-gif'})">
  {#if (description)}
    <span>{description}</span>
  {/if}
</div>