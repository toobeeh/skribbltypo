import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import type { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";

export class CustomizerPracticeJoinFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  public readonly name = "Practice Lobby";
  public readonly description = "Add an option to draw on your own without time limit";
  public readonly featureId = 44;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

  protected override async onActivate() {

    const elements = await this._elementsSetup.complete();

    /* create icon and attach */
    this._iconComponent = new IconButton({
      target: elements.customizerActions,
      props: {
        hoverMove: false,
        greyscaleInactive: true,
        size: "30px",
        icon: "file-img-palette-gif",
        name: "Enter\nPractice Lobby",
        order: 1,
        tooltipAction: this.createTooltip,
        lockTooltip: "Y"
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      document.dispatchEvent(new CustomEvent("joinPractice"));
    });
  }

  protected override async onDestroy() {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._iconComponent = undefined;
    this._iconClickSubscription = undefined;
  }
}