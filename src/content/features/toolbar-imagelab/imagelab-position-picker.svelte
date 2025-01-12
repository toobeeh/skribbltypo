<script lang="ts">
  import FlatButton from "@/lib/flat-button/flat-button.svelte";

  export let onPick: (mode: "fit" | "fill" | "position" | "range") => void;
</script>

<style lang="scss">
  .typo-imagelab-position-picker {
    display:flex;
    flex-direction: column;
    gap: .5rem;
  }
</style>

<div class="typo-imagelab-position-picker">
  <p>
    Pick a mode to paste the image on the canvas.<br>
    "Fill on canvas" and "Paste between click" might change the source image ratio.<br>
    <br>
    <b>Warning: This should be used only in practice mode.</b><br>
    No one else can see this image, and it will corrupt your drawing for others.
  </p>
  <br>
  <FlatButton content="Fit on canvas" color="green" on:click={() => onPick("fit")} />
  <FlatButton content="Fill canvas" color="green" on:click={() => onPick("fill")} />
  <FlatButton content="Paste top-right on click position" color="blue" on:click={() => onPick("position")} />
  <FlatButton content="Paste between two click positions" color="blue" on:click={() => onPick("range")} />
</div>
