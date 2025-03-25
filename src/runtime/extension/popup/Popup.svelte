<script lang="ts">
  export let mode: "skribbl" | "external";
</script>

<style lang="scss">
  :global(body){
      width: 500px;
      height: 120px;
      background-image: url("https://static.typo.rip/scenes/sceneSpace.gif");
      background-size: cover;
      background-repeat: no-repeat;
      image-rendering: pixelated;
      box-shadow: inset 0 0 30px black;
      margin: 0;
      padding: 1em;
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-gap: .5em;
      place-items: center;
      position: relative;
  }

  a {
      text-decoration: none;
      color: unset;
  }

  .icon-item {
      display: flex;
      flex-direction: row;
      gap: .5em;
      align-items: center;
      justify-items: flex-start;
      width: 100%;
      text-shadow: 0 0 10px black;
      font-family: 'Fira Code', monospace;
      color: white;
      font-weight: bold;
      transition: transform .2s;

      &:hover {
        transform: translateX(-5px);
          .icon {
              transform: rotate(-10deg) scale(1.1);
          }
      }
  }

  .extra {
      font-size: 1.5em;
  }

  .icon {
      width: 1.5em;
      aspect-ratio: 1;
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      transition: transform .2s;
  }

  .play {
      grid-column: 1;
      grid-row: 1 / span 3;
      font-size: 3em;
      justify-content: center;
  }

  .signature {
      position: absolute;
      bottom: 5px;
      left: 5px;
      font-size: 1em;
      color: white;
      opacity: .1;
      font-weight: bold;
      font-family: 'Fira Code', monospace;
      text-shadow: 0 0 10px black;
  }
</style>

<a href="https://skribbl.io" target="_blank" class="icon-item play" >
  <div class="icon" style="background-image: url({chrome.runtime.getURL('/img/wand.gif')})"></div>
  Play!
</a>

<a href="https://www.typo.rip" target="_blank" class="icon-item extra">
  <div class="icon" style="background-image: url({chrome.runtime.getURL('/img/typo.gif')})"></div>
  Typo Website
</a>

<a href="https://patreon.com/skribbltypo" target="_blank" class="icon-item extra">
  <div class="icon" style="background-image: url({chrome.runtime.getURL('/img/coin.gif')})"></div>
  Support Typo
</a>

<a href="https://discord.com/invite/pAapmUmWAM" target="_blank" class="icon-item extra">
  <div class="icon" style="background-image: url({chrome.runtime.getURL('/img/discord.gif')})"></div>
  Discord Community
</a>

<div class="signature">
  skribbltypo by tobeh
</div>