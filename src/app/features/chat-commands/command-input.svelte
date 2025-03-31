<script lang="ts">
  export let onInput: (args: string) => void;
</script>


<style lang="scss">

  :global(.chat-form:has(#typo-command-input) input:not(#typo-command-input)){
    display: none;
  }

</style>

<input id="typo-command-input" autofocus type="text" value="/" placeholder="Type your command here.."
   on:input={e => {
     onInput(e.currentTarget.value);
   }}
   on:submit={e => {
      e.preventDefault();
      e.stopImmediatePropagation();
   }}
/>