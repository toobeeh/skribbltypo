<script lang="ts">
  import type { CloudImageDto } from "@/api";
  import { ControlsCloudFeature } from "@/content/features/controls-cloud/controls-cloud.feature";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import IconButton from "@/lib/icon-button/icon-button.svelte";

  export let feature: ControlsCloudFeature;

  const member = feature.memberStore;

  let page = 0;
  const pageSize = 200;

  let authorQuery = "";
  let titleQuery = "";
  let createdInPrivateLobbyQuery = false;
  let isOwnQuery = false;
  let createdBeforeQuery: Date | string = new Date();
  let createdAfterQuery: Date | string = new Date(new Date().setFullYear(2020, 9, 1));

  let hiddenImages: string[] = [];

  const search = (login: number, resetPage = false) => {
    if(resetPage) page = 0;
    return feature.getImages({
      page,
      pageSize,
      authorQuery,
      titleQuery,
      isOwnQuery,
      createdInPrivateLobbyQuery,
      createdAfterQuery: createdAfterQuery !== "" ? new Date(createdAfterQuery).getTime().toString() : undefined,
      createdBeforeQuery: createdBeforeQuery !== "" ? new Date(createdBeforeQuery).getTime().toString() : undefined,
    }, login);
  }

  let selectedImage: CloudImageDto | null = null;
  let images: Promise<CloudImageDto[]> | null = $member ? search(Number($member.userLogin)) : null;
  $: page, images = $member ? search(Number($member.userLogin)) : null

</script>


<style lang="scss">

  .typo-gallery-grid {
    display: grid;
    grid-template-columns: 20rem auto;
    gap: 2rem;
    width: 100%;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 2rem;
    height: 100%;
    overflow: hidden;

    h3 {
      text-align: center;
    }

    .gallery-sidebar {
      display: flex;
      flex-direction: column;
      gap: .5rem;
      border-right: 1px solid var(--COLOR_PANEL_BORDER_FOCUS);
      padding-right: 2rem;
      margin-bottom: 2rem;
      transition: opacity .06s;
      grid-area: 1/1/1/1;

      > :not(span, .navigate-page){
        margin-bottom: 1rem;
      }

      .navigate-page {
        width: 100%;
        justify-content: space-between;
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-top: auto;


        span {
          font-weight: 600;
          user-select: none;
        }
      }

      &.present {
         opacity: 0;
         pointer-events: none;
       }
    }

    .gallery-results {
      height: 100%;
      overflow: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, 20rem);
      gap: 1rem;
      justify-content: space-between;
      margin-bottom: 2rem;
      grid-area: 1/2/1/2;
      transition: opacity .06s;

      img {
        width: 100%;
        cursor:pointer;
        border-radius: 3px;
      }

      .loading {
        grid-column: 1/-1;
        display: grid;
      }

      &.present {
        opacity: 0;
        pointer-events: none;
      }
    }

    .present-image {
      grid-area: 1/2/1/2;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      overflow: auto;

      img {
        border-radius: 3px;
      }
    }

    .present-sidebar {
      display: flex;
      flex-direction: column;
      gap: .5rem;
      border-right: 1px solid var(--COLOR_PANEL_BORDER_FOCUS);
      padding-right: 2rem;
      margin-bottom: 2rem;
      grid-area: 1/1/1/1;

      .exit-present {
        cursor: pointer;
        display:flex;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        font-weight: 600;
        margin-top: auto;
      }
    }
  }

</style>

<div class="typo-gallery-grid color-scrollbar">

  <div class="gallery-sidebar" class:present={selectedImage !== null}>
    <h3>Filter Cloud</h3>
    <span>Artist Name</span>
    <input type="text" bind:value={authorQuery} placeholder="Filter exact artist name">
    <span>Image Name</span>
    <input type="text" bind:value={titleQuery} placeholder="Filter exact image title">
    <span>Created Before</span>
    <input type="datetime-local" bind:value={createdBeforeQuery} >
    <span>Created After</span>
    <input type="datetime-local" bind:value={createdAfterQuery} >
    <Checkbox bind:checked={createdInPrivateLobbyQuery} description="Only private lobbies" />
    <Checkbox bind:checked={isOwnQuery} description="Only own drawings" />

    <br>

    {#if ($member !== null)}
      <FlatButton content="Search Cloud" color="green" on:click={() => images = search(Number($member?.userLogin), true)}/>
    {/if}

    <div class="navigate-page">
      <IconButton icon="file-img-arrow-left-gif" name="Previous" size="2rem" hoverMove="{false}"
                  disabled="{page <= 0}"
                  on:click={() => page--} />

      <span>Page {page + 1}</span>

      <IconButton icon="file-img-arrow-right-gif" name="Next" size="2rem" hoverMove="{false}"
                  on:click={() => page++} />
    </div>
  </div>


  <div class="gallery-results" class:present={selectedImage !== null}>

    <!-- check if member logged in -->
    {#if ($member !== null && images !== null)}
      {#await images}

        <!--load images-->
        <div class="loading">
          <Bounceload content="Loading Images..." />
        </div>

      {:then images}

        <!-- display grid -->
        {#each images as image}
          <img src={image.imageUrl} alt={image.name} style="display: {hiddenImages.includes(image.id) ? 'none' : ''}" on:click={() => selectedImage = image} />
        {/each}

      {/await}
    {/if}
  </div>

  <!-- display only selected image if present -->
  {#if selectedImage !== null}

    <!-- big image display -->
    <div class="present-image" on:click={() => selectedImage = null}>
      <img src={selectedImage.imageUrl} alt={selectedImage.name} on:click={(e) => e.stopImmediatePropagation()} />
    </div>


    <!-- sidebar for image actions -->
    <div class="present-sidebar"  >
      <h3>{selectedImage.name}</h3>
      <span>Drawn by {selectedImage.author} </span>
      <span>Created on {new Date(Number(selectedImage.createdAt)).toLocaleString()}</span>

      <br>
      <FlatButton content="Download PNG" color="green" />
      <FlatButton content="Download GIF" color="green" />

      <br>
      <FlatButton content="Add to Image Post" color="blue" on:click={async () => {
        if($member === null || $member === undefined || selectedImage === null) throw new Error("illegal state");
        await feature.addToImagePost(selectedImage, $member);
        selectedImage = null;
      }} />
      <FlatButton content="Add to Image Lab" color="blue" />

      <br>
      <FlatButton content="Delete Image" color="orange" on:click={async () => {
        if($member === null || $member === undefined || selectedImage === null) throw new Error("illegal state");
        await feature.deleteImage(selectedImage.id, Number($member.userLogin));
        hiddenImages = [...hiddenImages, selectedImage.id];
        selectedImage = null;
      }} />

      <div class="exit-present" on:click={() => selectedImage = null}>
        <IconButton icon="file-img-arrow-left-gif" hoverMove="{false}" name="Exit" on:click />
        Back to Gallery
      </div>
    </div>

  {/if}
</div>
