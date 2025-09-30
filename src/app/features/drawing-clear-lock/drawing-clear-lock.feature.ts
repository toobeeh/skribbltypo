import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { DomEventSubscription } from "@/util/rxjs/domEventSubscription";
import { inject } from "inversify";
import { combineLatestWith, filter, type Subscription, switchMap, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";

export class DrawingClearLockFeature extends TypoFeature {

  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  public readonly name = "Lock Clear";
  public readonly description = "Asks for confirmation before clearing the canvas in practice mode, and optionally in lobbies.";
  public readonly tags = [
    FeatureTag.DRAWING
  ];
  public readonly featureId = 53;

  private _onlyPracticeLobbies = this.useSetting(
    new BooleanExtensionSetting("ping_suggestions", true, this)
      .withName("Lock only for practice lobbies")
      .withDescription("Clearing in public/private lobbies will be enabled."),
  );

  private _clearButtonSubscription?: DomEventSubscription<"click">;
  private _clearLockedSubscription?: Subscription;

  protected override async onActivate() {

    const elements = await this._elementsSetup.complete();
    this._clearButtonSubscription = new DomEventSubscription(elements.clearButton, "click");

    this._clearLockedSubscription = this._onlyPracticeLobbies.changes$.pipe(
      combineLatestWith(this._lobbyService.lobby$)
    ).subscribe(([onlyPractice, lobby]) => {
      if(lobby === null) {
        this._drawingService.lockManualClear(false);
        return;
      }

      if(onlyPractice) {
        this._drawingService.lockManualClear(lobby.id === null);
      }
      else {
        this._drawingService.lockManualClear(true);
      }
    });

    this._clearButtonSubscription.events$.pipe(
      withLatestFrom(this._drawingService.manualClearLocked$),
      filter(([, locked]) => locked === true),
      switchMap(async () => {
        const toast = this._toastService.showConfirmToast("Clear drawing?", "Clearing the drawing cannot be undone.",10000);
        return (await toast).result;
      }),
      filter(result => result === true)
    ).subscribe(() => this._drawingService.clearImage());
  }

  protected override async onDestroy() {
    this._drawingService.lockManualClear(false);
    this._clearButtonSubscription?.unsubscribe();
    this._clearButtonSubscription = undefined;
    this._clearLockedSubscription?.unsubscribe();
    this._clearLockedSubscription = undefined;
  }
}