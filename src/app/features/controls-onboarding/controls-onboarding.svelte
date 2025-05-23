<script lang="ts">
  import ControlsOnboardingEmoji from "./controls-onboarding-emoji.svelte";
  import Bounceload from "@/lib/bounceload/bounceload.svelte";
  import OldTypoOnboarding from "./extras/old-typo-onboarding.svelte";
  import TypoCreditsOnboarding from "./extras/typo-credits-onboarding.svelte";
  import type { ControlsOnboardingFeature } from "@/app/features/controls-onboarding/controls-onboarding.feature";
  import { onDestroy, onMount } from "svelte";

  export let feature: ControlsOnboardingFeature;
  export let firstLoad: boolean;

  let hero: HTMLDivElement;
  let heading: HTMLDivElement;
  const icons = [
    "file-img-challenge-gif",
    "file-img-light-gif",
    "file-img-letter-gif",
    "file-img-line-rainbow-gif",
    "file-img-cloud-gif",
    "file-img-award-gif",
    "file-img-wand-gif",
    "file-img-wrench-gif",
    "file-img-floppy-drive-gif",
    "file-img-palantir-gif",
    "file-img-mask-gif",
    "file-img-palette-gif",
    "file-img-typo-gif",
    "file-img-trash-gif",
    "file-img-line-random-color-gif",
    "file-img-discord-gif",
    "file-img-connection-gif",
    "file-img-tasks-gif",
    "file-img-coin-gif"
  ];
  let shuffledArray = icons.sort(() => Math.random() - 0.5);
  let currentIndex = 0;
  let currentIcons: ControlsOnboardingEmoji[] = [];
  let interval: NodeJS.Timeout;

  const addIcon = () => {
    const randomIcon = shuffledArray[currentIndex];
    currentIndex = (currentIndex + 1) % shuffledArray.length;

    const heroRect = hero.getBoundingClientRect();
    const headingRect = heading.getBoundingClientRect();

    const noSpawnX = headingRect.width + 50;
    const noSpawnY = headingRect.height + 50;

    let x = heroRect.width/2;
    let y = heroRect.height/2;

    let tries = 0;
    while(
      x > (heroRect.width - noSpawnX) / 2 && x < (heroRect.width / 2 + noSpawnX)
      && y > ((heroRect.height - noSpawnY) / 2) && y < (heroRect.height / 2 + noSpawnY)
      || currentIcons.some((icon) => !icon.hasEnoughDistance(x, y))
      ){
      if(tries++ > 20) return;
      x = Math.random() * heroRect.width;
      y = Math.random() * heroRect.height;
    }

    const icon = new ControlsOnboardingEmoji({
      target: hero,
      props: {
        x,
        y,
        src: randomIcon
      }
    });
    currentIcons.push(icon);

    setTimeout(() => {
      icon.$destroy();
      currentIcons = currentIcons.filter((i) => i !== icon);
    }, 3000);
  }


  const activateFeaturePreset = (preset: "recommended" | "mobile" | "minimal" | "all" | "none") => {
    feature.activateFeaturePreset(preset);
    if(firstLoad) useTab("tasks");
    else feature.closeOnboardingIfOpen();
  }

  let activeTab: "presets" | "tasks" | "extras" = firstLoad ? "presets" : "tasks";
  const activeTabFocus = feature.tabFocusRequestsStore;
  activeTabFocus.subscribe(v => {
    if(v !== undefined) {
      useTab(v);
    }
  });

  let hideHero = false;
  const useTab = (tab: "presets" | "tasks" | "extras") => {
    hideHero = true;
    activeTab = tab;
    currentIcons.forEach((icon) => icon.$destroy());
    if(tab === "extras") feature.completeInfoTask();
  }

  let extraSections = [
    {name: "Introducing the new Typo", component: OldTypoOnboarding},
    {name: "Credits & Imprint", component: TypoCreditsOnboarding}
  ];
  let activeSection: typeof extraSections[number] = extraSections[0];

  onMount(() => {
    interval = setInterval(() => {
      addIcon();
    }, 250);

    for(let i = 0; i < 5; i++){
      addIcon();
    }
  });

  onDestroy(() => {
    clearInterval(interval);
  });

</script>

<style lang="scss">

  .typo-onboarding-wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin: 1rem;
  }

  .typo-onboarding-hero {
    display: grid;
    place-content: center;
    position: relative;
    padding: 100px 300px;
    margin: 40px 40px 2rem;
    transition: padding .4s, margin-top .4s;
    
    @media (max-aspect-ratio: 1) {
      padding: 4rem 0 0;
    }

    &.hidden {
      margin-top: 0;
      padding: 0;
    }

    > div {
      text-align: center;
      position: relative;
    }

    &:hover:not(.hidden) .beta-credits {
      opacity: .5;
    }

    .beta-credits {
      position: absolute;
      bottom: 0;
      width: 100%;
      opacity: 0;
      user-select: none;
      transition: opacity .4s;
      transition-delay: .5s;
      text-align: center;
      font-size: .8rem;
      z-index: 10;
    }
  }

  .onboarding-tabs {
    display: flex;
    gap: 1rem;
    justify-content: center;

    h4 {
      cursor: pointer;
      padding: 1rem;
      opacity: .5;
      user-select: none;
      text-align: center;

      &.active {
        opacity: 1;
      }
    }
  }

  .typo-onboarding-presets {

    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;

    .typo-onboarding-preset {
      position: relative;
      cursor: pointer;
      background-color: var(--COLOR_PANEL_HI);
      border-radius: 3px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: clamp(min(40em, 100%), min(40em, 100%), max(40em, 100%));
      transition: transform .2s;

      &:hover {
        transform: translateX(1rem);

        &:before {
          opacity: 1;
        }
      }

      &:before {
        content: "";
        background-image: var(--file-img-arrow-right-gif);
        background-repeat: no-repeat;
        background-size: contain;
        width: 2.5rem;
        background-position: center;
        position: absolute;
        top: 0;
        bottom: 0;
        left: -3.5rem;
        opacity: 0;
        transition: opacity .2s;
        pointer-events: none;
      }
    }
  }

  .typo-onboarding-checklist-wrapper {
    display: flex;
    flex-direction: column;
    align-items: stretch; /* for equal width */

    .typo-onboarding-checklist {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      margin-top: 1rem;

      .typo-onboarding-task {
        cursor: pointer;
        background-color: var(--COLOR_PANEL_HI);
        border-radius: 3px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: clamp(min(40em, 100%), min(40em, 100%), max(40em, 100%));

        &.done {
          cursor: auto;

          .description {
            opacity: .5;
          }
        }

        .details {
          display: flex;
          gap: 1rem;
        }
      }
    }
  }



  .typo-onboarding-extras {
    display: flex;
    flex-direction: row;
    gap: 3rem;
    align-self: stretch;
    padding: 0 2rem 2rem 2rem;

    @media (max-aspect-ratio: 1) {
      flex-direction: column;
    }

    .typo-onboarding-extras-sections {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      b {
        cursor: pointer;
        opacity: .5;
        user-select: none;

        &.active {
          opacity: 1;
        }
      }
    }

    .typo-onboarding-extras-content {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

</style>
<div class="typo-onboarding-wrapper color-scrollbar">
  <div bind:this={hero} class="typo-onboarding-hero {hideHero ? 'hidden' : ''}" on:click={() => useTab(activeTab)}>
    <div bind:this={heading}>
      <h2>{firstLoad ? "Welcome to" : "Thanks for using"} typo ✨</h2>
      <b>Typo is the toolbox for everything you need on skribbl.io</b>
    </div>
    <div class="beta-credits">XOXO to all beta testers &lt;3<br>Alpha, Foley, Hex, hunt3r, ibot, Max, Oivoo, shawty, Tuc, ShortM, XVIdevilIVX</div>
  </div>

  <div class="onboarding-tabs">
    <h4 class:active={activeTab === "presets"} on:click={() => useTab("presets")}>Feature Presets</h4>
    <h4 class:active={activeTab === "tasks"} on:click={() => useTab("tasks")}>Onboarding Tasks</h4>
    <h4 class:active={activeTab === "extras"} on:click={() => useTab("extras")}>More Info</h4>
  </div>
  <br>

  {#if activeTab === "presets"}
    <p style="text-align: center">
      To customize your experience, you can select from a variety of feature presets below.<br>
      You can always activate, deactivate, or customize features in the settings (the wrench icon), or come back to this page (magic wand icon).
    </p>

    <br>
    <div class="typo-onboarding-presets">
      <div class="typo-onboarding-preset" on:click={() => activateFeaturePreset("recommended")}>
        <h3>Recommended</h3>
        <div>
          A set of the most popular typo features that will enhance your skribbl.io experience.
        </div>
      </div>

      <div class="typo-onboarding-preset" on:click={() => activateFeaturePreset("mobile")}>
        <h3>Phone</h3>
        <div>
          Activates only features that will - probably - work on mobile devices. Limited support!
        </div>
      </div>

      <div class="typo-onboarding-preset" on:click={() => activateFeaturePreset("minimal")}>
        <h3>Minimal</h3>
        <div>
          Skribbl looks as close to original as possible, but essential features are still present.
        </div>
      </div>

      <div class="typo-onboarding-preset" on:click={() => activateFeaturePreset("all")}>
        <h3>Everything</h3>
        <div>
          The full package; all nifty tools that Typo has to offer!
        </div>
      </div>

      <div class="typo-onboarding-preset" on:click={() => activateFeaturePreset("none")}>
        <h3>Nothing</h3>
        <div>
          Vanilla skribbl.io experience. You will only notice the settings button.
        </div>
      </div>
    </div>
  {/if}

  {#if activeTab === "tasks"}

      {#await feature.getChecklist()}
        <Bounceload content="Loading checklist.." />
      {:then checklist}

        {#if checklist.every((task) => task.completed)}
          <span>Congrats, you have completed all tasks!</span>
        {:else}
          <span>You can complete following tasks to familiarize yourself with Typo:</span>
        {/if}

        <div class="typo-onboarding-checklist-wrapper">
          <div class="typo-onboarding-checklist">
            {#each checklist.filter(task => !task.completed) as task}
              <div class="typo-onboarding-task" style="order: {task.priority}"  on:click={async () => {
              const close = await task.start();
              if(close !== false) feature.closeOnboardingIfOpen();
            }}>
                <h4>
                  {task.name}
                </h4>

                <div class="details">
                  <img src="" style="content: var(--file-img-arrow-right-gif); height: 1.5rem;">
                  <div class="description">{task.description}</div>
                </div>

              </div>
            {/each}
          </div>


          <div class="typo-onboarding-checklist">
            {#each checklist.filter(task => task.completed) as task}
              <div class="typo-onboarding-task done" style="order: {task.priority}">
                <h4>
                  {task.name}
                </h4>

                <div class="details">
                  {#if task.completed}
                    <img src="" style="content: var(--file-img-enabled-gif); height: 1.5rem;">
                    <b>Done</b>
                  {:else}
                    <img src="" style="content: var(--file-img-arrow-right-gif); height: 1.5rem;">
                  {/if}
                  <div class="description">{task.description}</div>
                </div>

              </div>
            {/each}
          </div>
        </div>
      {/await}

  {/if}

  {#if activeTab === "extras"}

    <div class="typo-onboarding-extras">

      <div class="typo-onboarding-extras-sections">
        {#each extraSections as section}
          <b class:active={activeSection === section} on:click={() => activeSection = section}>{section.name}</b>
        {/each}
      </div>

      <div class="typo-onboarding-extras-content">
        <svelte:component this={activeSection.component} />
      </div>

    </div>

  {/if}


</div>

