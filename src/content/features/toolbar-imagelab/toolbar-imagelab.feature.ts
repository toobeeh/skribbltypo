import { LobbyLeftEventListener } from "@/content/events/lobby-left.event";
import { ImagelabService } from "@/content/features/toolbar-imagelab/imagelab.service";
import { DrawingService, type savedDrawCommands } from "@/content/services/drawing/drawing.service";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { type componentData, type componentDataFactory, ModalService } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { chooseFile } from "@/util/upload";
import { inject } from "inversify";
import {
  BehaviorSubject,
  combineLatest,
  filter,
  firstValueFrom,
  Subject,
  Subscription,
  take,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarImageLab from "./toolbar-imagelab.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import ImagelabPositionPicker from "./imagelab-position-picker.svelte";

export class ToolbarImageLabFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ImagelabService) private readonly _drawCommandsService!: ImagelabService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(PrioritizedCanvasEventsSetup) private readonly _canvasEventsSetup!: PrioritizedCanvasEventsSetup;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(GlobalSettingsService) private readonly _globalSettingsService!: GlobalSettingsService;

  public readonly name = "Image Laboratory";
  public readonly description =
    "Adds an icon to the typo toolbar to save or paste skribbl drawings (SKDs) to a lobby";
  public readonly featureId = 10;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;

  protected override get boundServices(){
    return [this._drawCommandsService];
  }

  private _customName?: string;
  public set customName(value: string | undefined){
    const val = value?.replace(/[^a-z0-9]/gi, "_").toLowerCase() ?? undefined;
    this._customName = val && val.length > 0 ? val : undefined;
  }
  public get customName(){
    return this._customName;
  }

  public clearBeforePaste = false;
  public pasteInstant = false;

  public get locked(){
    return fromObservable(this._drawingService.pasteInProgress$, false);
  }

  public get devmodeStore(){
    return this._globalSettingsService.settings.devMode.store;
  }

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    /* create icon and attach to toolbar */
    this._iconComponent = new IconButton({
      target: elements.toolbar,
      props: {
        icon: "file-img-dna-gif",
        name: "Image Laboratory",
        order: 3,
        tooltipAction: this.createTooltip,
        lockTooltip: "Y"
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {

      /* if already opened, return */
      if (this._flyoutComponent) {
        return;
      }

      /* create fly out content */
      const flyoutContent: componentData<ToolbarImageLab> = {
        componentType: ToolbarImageLab,
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
          maxWidth: "300px",
          title: "Image Laboratory",
          iconName: "file-img-dna-gif",
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

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._flyoutComponent?.$destroy();
    this._flyoutComponent = undefined;
    this._flyoutSubscription?.unsubscribe();
  }

  /**
   * Select files, parse content as draw commands json and save to draw commands store
   */
  public async addDrawCommandsFromFile() {
    const files = await chooseFile(".skd", true);
    if(files === null) return;

    // read files as json draw command array
    const commands = await Promise.all(
      [...files].map(async (file) => {
        let commands;
        try {
          const text = await file.text();
          commands = JSON.parse(text);
          if(typeof commands !== "object" || !Array.isArray(commands)){
            throw new Error("Invalid format");
          }
        }
        catch(e){
          this._logger.error("Failed to read file", file, e);
          throw e;
        }
        return {
          name: file.name,
          commands
        };
      })
    );

    /* add to store in service */
    commands.forEach(c => this._drawCommandsService.saveDrawCommands(c.name, c.commands));
  }

  /**
   * gets the draww commands of the current image and saves them to the service
   */
  public saveCurrentDrawCommands(){
    combineLatest({
        commands: this._drawingService.commands$,
        state: this._drawingService.imageState$
    }).pipe(
      take(1)
    ).subscribe(({commands,  state}) => {
      if(state === null) {
        this._logger.warn("Attempted to save commands, but state null. In a lobby?");
        throw new Error("state is null");
      }

      this._drawCommandsService.saveDrawCommands(this._customName ?? state.word.hints, commands);
    });
  }

  /**
   * Get a svelte store based on the saved draw commands from the service
   */
  public get savedDrawCommandsStore() {
    return fromObservable(this._drawCommandsService.savedDrawCommands$, []);
  }

  /**
   * Removes saved draw commands from the service
   * @param all
   * @param remove
   */
  public removeDrawCommands(all: savedDrawCommands[], remove: savedDrawCommands){
    const index = all.indexOf(remove);
    if(index === -1) {
      this._logger.warn("Tried to remove commands, but not found");
      throw new Error();
    }

    this._drawCommandsService.removeSavedDrawCommands(index);
  }

  /**
   * Start a pasting process using the drawing service
   * @param commands
   * @param pasteInstant
   */
  public async pasteDrawCommands(commands: savedDrawCommands){

    /* check if currently in a lobby */
    const lobby = await firstValueFrom(this._lobbyService.lobby$);
    if(lobby === null){
      await this._toastService.showToast("Can't paste outside of a lobby");
      return;
    }

    /* check if allowed to paste */
    if(lobby.drawerId !== lobby.meId){
      await this._toastService.showToast("You can only paste while you are drawing");
      return;
    }

    if(this.clearBeforePaste) this._drawingService.clearImage();
    await this._drawingService.pasteDrawCommands(commands.commands, !this.pasteInstant);
  }

  /**
   * Stop a paste in progress
   */
  public abortPaste(){
    this._drawingService.cancelPendingDrawCommands();
  }

  /**
   * Pick an image from the local file system and return it as a base64 string
   */
  public async pickImageFromLocal(): Promise<string | null> {
    const files = await chooseFile("image/*", false);
    if(files === null) return null;

    const file = files[0];
    const reader = new FileReader();
    const result = new BehaviorSubject<string | undefined | null>(undefined);
    reader.onload = async (e) => {
      const data = e.target?.result;
      if(typeof data !== "string") {
        this._logger.error("Failed to read file", file);
        await this._toastService.showToast("Failed to read file");
        result.next(null);
        return;
      }

      result.next(data);
    };
    reader.readAsDataURL(file);
    return await firstValueFrom(result.pipe(filter(v => v !== undefined))) as (string | null);
  }

  public async pasteImageToLocation(base64: string){
    this._logger.debug("Pasting image to location");

    const pickerComponent: componentDataFactory<ImagelabPositionPicker, "fit" | "fill" | "position" | "range"> = {
      componentType: ImagelabPositionPicker,
      propsFactory: submit => ({
        onPick: submit.bind(this),
      })
    };
    const mode = await this._modalService.showPrompt(
      pickerComponent.componentType,
      pickerComponent.propsFactory,
      "Paste Image"
    );

    this._logger.debug("Selected mode", mode);
    if(mode === undefined) return;

    let x, y, width, height;
    const canvas = (await this._elementsSetup.complete()).canvas;
    const img = new Image();
    img.src = base64;
    await new Promise(resolve => img.onload = resolve);

    /* fit centered as big as possible on the canvas */
    if(mode === "fit"){
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      width = img.width * scale;
      height = img.height * scale;
      x = (canvas.width - width) / 2;
      y = (canvas.height - height) / 2;
    }

    /* fill canvas with image, changing image ratio if necessary */
    else if(mode === "fill"){
      x = 0;
      y = 0;
      width = canvas.width;
      height = canvas.height;
    }

    /* paste the image in original size with top-left corner at position */
    else if(mode === "position"){
      const toast = await this._toastService
        .showStickyToast("Paste Image", "Click on the canvas to paste the image", true);

      let position: PointerEvent;
      try {
        position = await this.waitForCanvasClick(firstValueFrom(toast.closed$));
      }
      catch (e){
        this._logger.debug("Aborted paste image", e);
        toast.close();
        return;
      }

      x = position.offsetX;
      y = position.offsetY;
      width = img.width;
      height = img.height;

      toast.close();
    }

    /* paste the image scaled and ratio changed between two clicks */
    else if(mode === "range"){
      const toast = await this._toastService
        .showStickyToast("Paste Image", "Click on the canvas to select the top-left corner", true);

      let start: PointerEvent;
      let end: PointerEvent;
      try {
        start = await this.waitForCanvasClick(firstValueFrom(toast.closed$));
        toast.update("Paste Image", "Click on the canvas to select the bottom-right corner");
        end = await this.waitForCanvasClick(firstValueFrom(toast.closed$));
      }
      catch (e){
        this._logger.debug("Aborted paste image", e);
        toast.close();
        return;
      }

      x = Math.min(start.offsetX, end.offsetX);
      y = Math.min(start.offsetY, end.offsetY);
      width = Math.abs(start.offsetX - end.offsetX);
      height = Math.abs(start.offsetY - end.offsetY);

      toast.close();
    }

    await this._drawingService.drawImage(base64, x, y, width, height);
  }

  private async waitForCanvasClick(cancel?: Promise<void>): Promise<PointerEvent> {
    const click = new Subject<PointerEvent >();
    const listener = (e: PointerEvent) => {
      e.stopImmediatePropagation();
      click.next(e);
      return false;
    };

    cancel?.then(() => {
      click.complete();
      events.remove("pointerdown", listener);
    });

    const events = await this._canvasEventsSetup.complete();
    events.add("preDraw")("pointerdown", listener);
    const result = await firstValueFrom(click);
    events.remove("pointerdown", listener);
    return result;
  }
}