import { ImagelabService } from "@/content/features/toolbar-imagelab/imagelab.service";
import { DrawingService, type savedDrawCommands } from "@/content/services/drawing/drawing.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { chooseFile } from "@/util/upload";
import { inject } from "inversify";
import { BehaviorSubject, combineLatest, Subscription, take } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarImageLab from "./toolbar-imagelab.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";

export class ToolbarImageLabFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ImagelabService) private readonly _drawCommandsService!: ImagelabService;

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

  private _pasteInProgress = new BehaviorSubject<boolean>(false);
  public get locked(){
    return fromObservable(this._pasteInProgress, false);
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
   */
  public async pasteDrawCommands(commands: savedDrawCommands){
    if(this.clearBeforePaste) this._drawingService.clearImage();
    this._pasteInProgress.next(true);
    await this._drawingService.pasteDrawCommands(commands.commands, () => !this._pasteInProgress.value);
    this._pasteInProgress.next(false);
  }

  /**
   * Stop a paste in progress
   */
  public abortPaste(){
    this._pasteInProgress.next(false);
  }
}