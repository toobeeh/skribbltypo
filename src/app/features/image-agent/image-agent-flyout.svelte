<script lang="ts">
  import { ImageAgentFeature } from "./image-agent.feature";
  import Bounceload from "../../../lib/bounceload/bounceload.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";

  export let feature: ImageAgentFeature;
  const word = feature.wordStore;
  let textInput: string | undefined = undefined;
  let imageIndex: number | undefined = undefined;

  $: textInput = $word ?? undefined; // reset txt input on word change
  $: imageIndex = $word ? 0 : 0; // init image index with 0 if word is set
  $: images = ($word) ? feature.getImages($word) : []; // refresh images as soon as word changes
</script>

<style lang="scss">

  .agent-content {
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: relative;

    > h3 {
      width: 100%;
      display: flex;
      gap: 1em;
      align-items: center;
      justify-content: center;
      margin-bottom: 0;

      > img {
        user-select: none;
        height: 1.8em;
        width: 1.8em;
        filter: drop-shadow(3px 3px 0px rgba(0, 0, 0, .3));
      }
    }

    > img {
      width: 100%;
      border-radius: 3px;
      cursor: pointer;
    }
  }

  .agent-inputs {
    display: flex;
    gap: 1rem;

    input {
      flex-grow: 1;
    }
  }

</style>

<div class="agent-content">
  <div class="agent-inputs">
    <!--previous image-->

    <!-- input for custom search -->
    <input type="text" class="typo" placeholder="Custom image name" bind:value={textInput} on:keydown={event => {
      if(event.key === 'Enter') word.set(textInput);
    }}
    />

    <!--next image-->
  </div>

  {#await images}
    <Bounceload />
  {:then images}
    {#if imageIndex !== undefined && images.length > 0}
      <img src="{images?.[imageIndex ?? 0] ?? ''}" alt="Image Agent Result"
           on:contextmenu={event => event.preventDefault()}
           on:mousedown={event => {
        if(imageIndex !== undefined && event.button === 2) imageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
        else if(imageIndex !== undefined && event.button === 0) imageIndex = imageIndex === images.length - 1 ? 0 : imageIndex + 1;
      }}>
    {/if}
  {/await}
</div>

