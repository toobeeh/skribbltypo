import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";

export class ToolbarFullscreenFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly name = "Fullscreen";
  public readonly description =
    "Adds a toggle in-game to quickly enter/exit the browser fullscreen mode";
  public readonly featureId = 9;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

  private readonly _toggleHotkey = this.useHotkey(new HotkeyAction(
    "toggle_fullscreen",
    "Toggle Fullscreen",
    "Toggle the browser fullscreen mode",
    this,
    async () => await this.toggleFullscreen(),
    true,
    ["ShiftLeft", "KeyF"]
  ));

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    /* create icon and attach to toolbar */
    this._iconComponent = new IconButton({
      target: elements.toolbar,
      props: {
        icon: "file-img-fullscreen-gif",
        name: "Fullscreen",
        order: 1,
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(async () => {
      await this.toggleFullscreen();
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
  }

  private async toggleFullscreen() {
    if(document.fullscreenElement === null) {
      this._logger.debug("Entering fullscreen");
      await document.documentElement.requestFullscreen();
    }
    else {
      this._logger.debug("Exiting fullscreen");
      await document.exitFullscreen();
    }
  }
}