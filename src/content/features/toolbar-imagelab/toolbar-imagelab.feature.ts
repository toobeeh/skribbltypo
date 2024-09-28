import { DrawingService, type savedDrawCommands } from "@/content/services/drawing/drawing.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { combineLatest, Subscription, take } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarImageLab from "./toolbar-imagelab.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";

export class ToolbarImageLabFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;

  public readonly name = "Image Laboratory";
  public readonly description =
    "Adds an icon to the typo toolbar to save or paste skribbl drawings (SKDs) to a lobby";
  public readonly featureId = 10;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;

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

  public addDrawCommandsFromFile() {
    console.log("hii");
  }

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

      this._drawingService.addDrawCommands(state.word.hints, commands);
    });
  }

  public get savedDrawCommandsStore() {
    return fromObservable(this._drawingService.savedDrawCommands$, []);
  }

  public removeDrawCommands(all: savedDrawCommands[], remove: savedDrawCommands){
    const index = all.indexOf(remove);
    if(index === -1) {
      this._logger.warn("Tried to remove commands, but not found");
      throw new Error();
    }

    this._drawingService.removeSavedDrawCommands(index);
  }
}