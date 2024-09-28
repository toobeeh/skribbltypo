import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { downloadBlob, downloadText } from "@/util/download";
import { inject } from "inversify";
import { combineLatest, Subscription, take } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarSave from "./toolbar-save.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";

export class ToolbarSaveFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public readonly name = "Save Image";
  public readonly description =
    "Adds an icon to the typo toolbar to save the current image locally, to cloud, as gif or as draw command file";
  public readonly featureId = 12;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;

  private _customName?: string;
  public set customName(value: string | undefined){
    const val = value?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ?? undefined;
    this._customName = val && val.length > 0 ? val : undefined;
  }
  public get customName(){
    return this._customName;
  }

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

  async saveAsPng() {
    combineLatest({
      blob: this._drawingService.getCurrentImageBlob(),
      meta: this._drawingService.imageState$.pipe(take(1)),
      lobby: this._lobbyService.lobby$.pipe(take(1)),
    }).subscribe(({ blob, meta, lobby }) => {
      if(!meta) {
        this._logger.error("Failed to get image meta data, no drawing active?");
        return;
      }

      if(!lobby) {
        this._logger.error("Failed to get lobby, not joined?");
        return;
      }

      const drawer = lobby.players.find(player => player.id === meta.drawerId)?.name ?? "unknown";
      downloadBlob(blob, (this._customName ?? `skribbl-${meta.word.hints}-by-${drawer}`) + ".png");
    });
  }

  saveAsGif() {
    this._logger.debug("Saving as gif");
  }

  saveAsDrawCommands() {
    this._logger.debug("Saving as draw commands");

    combineLatest({
      meta: this._drawingService.imageState$.pipe(take(1)),
      lobby: this._lobbyService.lobby$.pipe(take(1)),
      commands: this._drawingService.commands$.pipe(take(1)),
    }).subscribe(({meta, lobby, commands}) => {
      if(!meta) {
        this._logger.error("Failed to get image meta data, no drawing active?");
        return;
      }

      if(!lobby) {
        this._logger.error("Failed to get lobby, not joined?");
        return;
      }

      const json = JSON.stringify(commands);
      const drawer = lobby.players.find(player => player.id === meta.drawerId)?.name ?? "unknown";
      downloadText(json, (this._customName ?? `skribbl-${meta.word.hints}-by-${drawer}`) + ".skd");
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
  }
}