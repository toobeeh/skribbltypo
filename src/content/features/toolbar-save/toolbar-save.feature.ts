import { DrawingService } from "@/content/services/drawing/drawing.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarSave from "./toolbar-save.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";

export class ToolbarSaveFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  public readonly name = "Save Image";
  public readonly description =
    "Save the current image locally, to cloud, as gif or as draw command file";

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    console.log(this._drawingService);

    /* create icon and attach to toolbar */
    this._iconComponent = new IconButton({
      target: elements.toolbar,
      props: {
        icon: "file-img-floppy-drive-gif",
        name: "Save Image",
        order: 2,
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {

      /* if already opened, return */
      if (this._flyoutComponent) {
        return;
      }

      /* create fly out content */
      const flyoutContent: componentData<ToolbarSave> = {
        componentType: ToolbarSave,
        props: {
          feature: this,
        },
      };

      /* open flyout and destroy when clicked out */
      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          title: "Save Image",
          iconName: "file-img-floppy-drive-gif",
        },
      });
      this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(() => {
        this._logger.info("Destroyed flyout");
        this._flyoutComponent?.$destroy();
        this._flyoutSubscription?.unsubscribe();
        this._flyoutComponent = undefined;
      });
    });
  }

  saveInCloud() {
    this._logger.debug("Saving in cloud");
  }

  saveAsPng() {
    this._logger.debug("Saving as png");
  }

  saveAsGif() {
    this._logger.debug("Saving as gif");
  }

  saveAsDrawCommands() {
    this._logger.debug("Saving as draw commands");
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
  }
}