<script lang="ts">
  import { ImageAgentFeature } from "./image-agent.feature";
  import Bounceload from "../../../lib/bounceload/bounceload.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";

  export let feature: ImageAgentFeature;
  const word = feature.wordStore;
  const hidden = feature.hiddenSettingStore;
  let textInput: string | undefined = undefined;
  let imageIndex: number | undefined = undefined;

  $: textInput = $word ?? undefined; // reset txt input on word change
  $: imageIndex = $word ? 0 : 0; // init image index with 0 if word is set
  $: images = (!$hidden && $word) ? feature.getImages($word) : []; // refresh images as soon as word changes
</script>

<style lang="scss">

  .typo-image-agent {
    grid-area: chat;
    align-self: flex-start;
    width: calc(300px - .4rem);
    position: relative;
    justify-self: center;
    margin-top: .2rem;
    border-radius: 10px;
    transform-origin: top;
    align-items: center;
    color: var(--COLOR_PANEL_TEXT);
    z-index: 1;
    padding: 1rem;
    transition: transform .08s ease-out, opacity .08s ease-out;

    &.closed {
      opacity: 0;
      transform: scaleY(0);
    }

    .close-agent {
      position: absolute;
      top: 0;
      right: .5rem;
      font-size: 1.5rem;
      font-weight: 900;
      cursor: pointer;
      z-index: 1;
    }

    /* background on separate after element because backdrop blur fucks rendering up */
    &:not(.hidden):after {
      background: var(--COLOR_PANEL_BG);
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 10px;
      z-index: 0;
      transform: none !important; // dont use transform from animation
      backdrop-filter: blur(2px);

      transition: transform .08s ease-out, opacity .08s ease-out;
    }

    &.closed:after {
      opacity: 0;
      transform: scaleY(0);
    }

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

    &.hidden {
      width: auto;
      justify-self: end;
      margin: .5rem;
      padding: 0;
    }

  }

</style>

<div class="typo-image-agent" class:closed={$word === null || $hidden === true}>
  <div class="agent-content">
    <h3>
      <img src="" alt="agent-icon" style="content: var(--file-img-light-gif)" />
      <span>Image Agent</span>
    </h3>

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

  <!-- close button -->
  <span class="close-agent" on:click={() => feature.setHiddenState(true)}>
        ×
    <!--<IconButton icon="file-img-disabled-gif" name="Close" size="1.5rem"
                hoverMove={false} greyscaleInactive="{true}"
                on:click={() => feature.setHiddenState(true)}
    />-->
      </span>
</div>

<div class:closed={$hidden === false} class="typo-image-agent hidden">
    <IconButton icon="file-img-light-gif" name="Close" size="2rem"
                hoverMove={false} greyscaleInactive="{true}"
                on:click={() => feature.setHiddenState(false)}
    />
</div>

