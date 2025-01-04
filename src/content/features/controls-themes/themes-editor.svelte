<script lang="ts">

  import type { ControlsThemesFeature, savedTheme } from "@/content/features/controls-themes/controls-themes.feature";
  import FlatButton from "@/lib/flat-button/flat-button.svelte";
  import ColorPickerButton from "@/lib/color-picker/color-picker-button.svelte";
  import { Color } from "@/util/color";
  import Checkbox from "@/lib/checkbox/checkbox.svelte";
  import { themeColors as baseColors } from "@/util/typo/themes/colors";

  let schemePrimaryColor = Color.fromHex("#4197c5");
  let schemeTextColor = Color.fromHex("#FFFFFF");
  let schemeBackgroundTint = Color.fromHex("#4517a899");
  let schemeOnInputs = true;
  let schemeInvertInputBrightness = false;
  let schemeEnableBackgroundTint = true;
  let schemeIngame = false;

  export let feature: ControlsThemesFeature;
  export let variableHooks: Record<string, string[]>;
  const loadedTheme = feature.loadedEditorThemeStore;
  let themeColors: [keyof typeof baseColors, Color][] = [];

  $: {
    themeColors = $loadedTheme ? Object
        .entries($loadedTheme.theme.colors)
        .map(entry => {
          const color = Color.fromHsl(entry[1][0], entry[1][1], entry[1][2], entry[1][3]);
          return ([entry[0] as keyof typeof baseColors, color] as const);
        }) :
      [];
    if($loadedTheme?.theme.images.backgroundTint) schemeBackgroundTint = Color.fromHex($loadedTheme.theme.images.backgroundTint)
  }

</script>

<style lang="scss">

  .typo.themes.typo-themes-editor {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .typo-themes-editor-header {
    padding-bottom: 1rem;
    text-align: center;
  }

  .typo-themes-editor-content {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: start;
    padding: 0 2rem;
    overflow: auto;
  }

  summary {
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    font-size: 1.2rem;
    padding-bottom: .5rem;
  }

  .typo-themes-editor-content-section {
    display: flex;
    flex-direction: row;
    gap: 3rem;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding-bottom: .5rem;

    .group {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      align-items: center;

      &:vertical {
        flex-direction: column;
      }

      input {
        width: auto;
        box-sizing: border-box;
      }
    }
  }

  .color-pickers {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: .5rem 2rem;
  }

  .style-hooks {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: .5rem 2rem;
  }

</style>

<div class="typo-themes-editor">

  {#if $loadedTheme === undefined}
    <div class="typo-themes-editor-header">
      No theme loaded for editing. Select one of your themes in the "Saved Themes" tab or create a new one!<br>
      <br>

      <FlatButton content="Create new Theme" color="green" on:click={async () => {
      const theme = await feature.createLocalTheme();
      await feature.loadThemeToEditor(theme);
    }} />
    </div>

  {:else}

    <div class="typo-themes-editor-header">
      <h3 style="flex-grow: 1">Editing Theme: {$loadedTheme.theme.meta.name}</h3>
      <br>

      <FlatButton content="Discard & Delete" color="orange" on:click={async () => {
        const id = $loadedTheme.theme.meta.id;
        await feature.unloadThemeFromEditor();
        await feature.removeLocalTheme(id);
      }} />
      <FlatButton content="Discard Changes" color="blue" on:click={() => feature.unloadThemeFromEditor()} />
      <FlatButton content="Save Theme" color="green" on:click={() =>{
        feature.saveLoadedEditorTheme();
        feature.activeThemeTabStore.set("list");
      }} />
    </div>

    <div class="typo-themes-editor-content">

      <!--<div class="typo-themes-editor-content-section">
        <h3 style="flex-grow: 1">Editing Theme: {$loadedTheme.theme.meta.name}</h3>
        <FlatButton content="Discard & Delete" color="orange" on:click={async () => {
          const id = $loadedTheme.theme.meta.id;
          await feature.unloadThemeFromEditor();
          await feature.removeLocalTheme(id);
        }} />
        <FlatButton content="Discard Changes" color="blue" on:click={() => feature.unloadThemeFromEditor()} />
        <FlatButton content="Save Theme" color="green" on:click={() =>{
          feature.saveLoadedEditorTheme();
          feature.activeThemeTabStore.set("list");
        }} />
      </div>-->

      <div class="typo-themes-editor-content-section">
        <div class="group">
          <div>Theme Name:</div>
          <input type="text" bind:value={$loadedTheme.theme.meta.name} />
        </div>

        <div class="group">
          <div>Creator Name:</div>
          <input type="text" bind:value={$loadedTheme.theme.meta.author} />
        </div>
      </div>

      <details open>
        <summary>Color Scheme</summary>

        Using the color scheme generator, you can easily create a unique color theme for skribbl.<br>
        This overwrites all existing color customizations in "Advanced Color Settings".<br>
        <br>

        <!-- scheme color pickers-->
        <div class="typo-themes-editor-content-section">
          <div class="group">
            <div>Primary Color:</div>
            <ColorPickerButton bind:color={schemePrimaryColor} />
          </div>

          <div class="group">
            <div>Text Color:</div>
            <ColorPickerButton bind:color={schemeTextColor}  />
          </div>

          <div class="group">
            <div>Background Tint:</div>
            <ColorPickerButton allowAlpha="{true}" colorChanged={(color) => {
              schemeBackgroundTint = color;
            }} />
          </div>
        </div>

        <br>

        <!-- scheme color settings -->
        <div class="typo-themes-editor-content-section">
          <Checkbox bind:checked={schemeOnInputs} description="Generate colors for input fields" />
          <Checkbox bind:checked={schemeInvertInputBrightness} description="Invert text brightness on input fields" />
          <Checkbox bind:checked={schemeEnableBackgroundTint} description="Tint the skribbl background with a color" />
          <Checkbox bind:checked={schemeIngame} description="Use theme colors in-game" />
        </div>

        <br>

        <FlatButton content="Generate Color Scheme" color="green" on:click={async () => {
        await feature.setColorScheme(
          $loadedTheme.theme,
          schemePrimaryColor,
          schemeTextColor,
          schemeBackgroundTint,
          schemeOnInputs,
          schemeInvertInputBrightness,
          schemeEnableBackgroundTint,
          schemeIngame
        );
        feature.updateLoadedEditorTheme($loadedTheme);
      }}/>
      </details>

      <details>
        <summary>Advanced Color Settings</summary>
        <p>Advanced color settings allow you to customize the appearance of skribbl in more detail.</p>
        <p>These settings are overwritten when the color scheme generator is used.</p>
        <p>The color names are taken from the skribbl code.</p>
        <br>

        <div class="typo-themes-editor-content-section">
          <div class="group">
            <div class="color-pickers">
              {#each themeColors as color}
                <div>{color[0].replace("--", "")}:</div>
                <ColorPickerButton color={color[1]} allowAlpha="{true}" colorChanged={(update) => {
                  $loadedTheme.theme.colors[color[0]] = update.hsl;
                  feature.updateLoadedEditorTheme($loadedTheme);
                }} />
              {/each}
            </div>
          </div>
        </div>
      </details>

      <details>
        <summary>Skribbl Style Hooks</summary>
        <p>Skribbl style hooks allow more advanced CSS styling without having to dig through the skribbl css classes.</p>
        <p>The CSS you write will be applied wherever the skribbl color variable is used.</p>
        <br>

        <div class="typo-themes-editor-content-section">
          <div class="group">
            <div class="style-hooks">
              {#each Object.entries(variableHooks) as color}
                <div>{color[0].replace("--", "")} <abbr title="{color[1].join(', ')}">classes</abbr>:</div>
                <input type="text" bind:value={$loadedTheme.theme.hooks[color[0]]} on:change={() => {
                  feature.updateLoadedEditorTheme($loadedTheme);
                }} />
              {/each}
            </div>
          </div>
        </div>
      </details>

    </div>

  {/if}
</div>
