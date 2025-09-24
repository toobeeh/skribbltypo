<script lang="ts">

  import type { BrushLabItem } from "@/app/features/drawing-brush-lab/brush-lab-item.interface";
  import type { DrawingBrushLabFeature } from "@/app/features/drawing-brush-lab/drawing-brush-lab.feature";
  import { ConstantDrawMod } from "@/app/services/tools/constant-draw-mod";
  import type { TypoDrawMod } from "@/app/services/tools/draw-mod";
  import { TypoDrawTool } from "@/app/services/tools/draw-tool";

  export let feature: DrawingBrushLabFeature;
  export let initTool: (BrushLabItem & TypoDrawMod) | undefined = undefined;

  const items = feature.toolbarItemsStore;
  let selectedItem: (TypoDrawMod & BrushLabItem) | undefined = initTool;

  $: {
    selectedItem = initTool ?? ($items.tools.find(tool => tool.active)
      ?? $items.mods.find(mod => mod.active)
      ?? $items.tools[0]
    )?.item;
  }

</script>

<style lang="scss">

  .item-selection {

    display: grid;
    grid-template-columns: auto 1fr;
    flex-grow: 1;
    width: 100%;
    padding: 1rem 2rem;
    gap: 2rem;

    .item-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding-right: 2rem;
      height: 100%;
      border-right: 1px solid var(--COLOR_PANEL_BORDER_FOCUS);
      overflow: auto;

      h3 {
        opacity: .5;
      }

      .item-sidebar-entry {
        display: flex;
        gap: .5rem;
        align-items: center;
        cursor: pointer;

        img {
          height: 2rem;
        }
      }
    }

    .item-details {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .item-title {
        display: flex;
        align-items: center;
        gap: 2rem;

        b {
          opacity: .5;
        }
      }

      .item-details-settings-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 2rem;

        .item-details-settings-item {
          min-width: clamp(20em, 20em, 100%);
          max-width: clamp(20em, 20em, 100%);
          background-color: var(--COLOR_PANEL_HI);
          border-radius: 3px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          flex: 1 1 0px;
          position: relative;
        }
      }
    }
  }

</style>

<p>
  The Brush Laboratory has many mods and tools to create unique masterpices.<br>
  Below, you can find all available tools and mods and their settings.<br>
  Additionally to a tool, you can select one mod and multiple combo mods.
</p>


<div class="item-selection">

  <div class="item-sidebar">
    <h3>Tools</h3>
    {#each $items.tools as tool }
      <div class="item-sidebar-entry" on:click={() => selectedItem = tool.item}>
        <img src="" style="content: {tool.item.icon}" alt="icon" />
        <b>{tool.item.name}</b>
      </div>
    {/each}
    <h3>Mods</h3>
    {#each $items.mods.filter(mod => !(mod.item instanceof ConstantDrawMod)) as mod }
      <div class="item-sidebar-entry" on:click={() => selectedItem = mod.item}>
        <img src="" style="content: {mod.item.icon}" alt="icon" />
        <b>{mod.item.name}</b>
      </div>
    {/each}
    <h3>Combo Mods</h3>
    {#each $items.mods.filter(mod => mod.item instanceof ConstantDrawMod) as mod }
      <div class="item-sidebar-entry" on:click={() => selectedItem = mod.item}>
        <img src="" style="content: {mod.item.icon}" alt="icon" />
        <b>{mod.item.name}</b>
      </div>
    {/each}
  </div>

  <div class="item-details">
    <div class="item-title">
      <img src="" style="content: {selectedItem?.icon}" alt="icon">
      <h2>{selectedItem?.name}</h2>
      <b>({selectedItem instanceof ConstantDrawMod ? (selectedItem instanceof TypoDrawTool ? "TOOL" : "COMBO MOD") : "MOD"})</b>
    </div>
    <p>{selectedItem?.description}</p>

    {#if selectedItem !== undefined && selectedItem.settings.length > 0}
        <div class="item-details-settings-list">
          {#each selectedItem.settings as setting}
            <div class="item-details-settings-item">
              <svelte:component this={setting.componentData.componentType} {...setting.componentData.props} />
            </div>
          {/each}
        </div>
    {/if}
  </div>

</div>