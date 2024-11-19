import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { LobbyJoinedEventListener } from "@/content/events/lobby-joined.event";
import { LobbyStateChangedEvent, LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import type { componentData } from "@/content/services/modal/modal.service";
import { delay, firstValueFrom, map, of, type Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import LobbyTimeVisualizerInfo from "./lobby-time-visualizer-info.svelte";

export class LobbyTimeVisualizerFeature extends TypoFeature {

  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(LobbyJoinedEventListener) private readonly _lobbyJoinedEventListener!: LobbyJoinedEventListener;

  public readonly name = "Time Visualizer";
  public readonly description = "Shows a visual representation of time left to draw/choose";
  public readonly featureId = 30;

  public override get featureInfoComponent(): componentData<LobbyTimeVisualizerInfo>{
    return { componentType: LobbyTimeVisualizerInfo, props: {}};
  }

  private _enableChooseVisualizer = this.useSetting(new BooleanExtensionSetting("choose_visualizer", true, this)
    .withName("Choose Visualizer")
    .withDescription("Show a visualizer of the remaining time to choose words"));

  private _enableDrawVisualizer = this.useSetting(new BooleanExtensionSetting("draw_visualizer", true, this)
    .withName("Draw Visualizer")
    .withDescription("Show a visualizer of the remaining time to draw a word"));

  private _enableGuessVisualizer = this.useSetting(new BooleanExtensionSetting("guess_visualizer", true, this)
    .withName("Guess Visualizer")
    .withDescription("Show a visualizer of the remaining time to guess a word"));

  private visualizerEventSubscription?: Subscription;
  private _visualizerStyle?: CSSStyleSheet;

  protected override async onActivate() {

    this._visualizerStyle = new CSSStyleSheet();
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, this._visualizerStyle];

    this.visualizerEventSubscription = this._lobbyStateChangedEventListener.events$.pipe(
      withLatestFrom(
        this._enableDrawVisualizer.changes$,
        this._enableGuessVisualizer.changes$,
        this._enableChooseVisualizer.changes$,
        this._lobbyJoinedEventListener.events$
      ),
      map(([event, draw, guess, choose, lobby]) => lobby && (
        (draw && event.data.drawingStarted?.drawerId === lobby.data.meId ||
        (guess && event.data.drawingStarted !== undefined && event.data.drawingStarted.drawerId !== lobby.data.meId) ||
        (choose && event.data.drawerChoosingWord !== undefined) ? event : undefined
        ))
      )
    ).subscribe((event) => {
      this.visualizeEvent(event);
    });
  }

  protected override async onDestroy() {
    this.visualizerEventSubscription?.unsubscribe();
    this.visualizerEventSubscription = undefined;
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(sheet => sheet !== this._visualizerStyle);
  }

  private async visualizeEvent(event?: LobbyStateChangedEvent){
    this._logger.debug("Visualize event", event);

    if(this._visualizerStyle === undefined) {
      this._logger.error("Visualizer style not set");
      return;
    }

    /* reset styles*/
    await this._visualizerStyle.replace("");
    if(event === undefined) return;

    const time = event.data.drawingStarted?.maxTime ?? event.data.drawerChoosingWord?.maxTime;
    if(time === undefined) {
      this._logger.error("No time set for visualizer", event);
      return;
    }

    /* delay to separate animations.. */
    await firstValueFrom(of(1).pipe(delay(10)));

    /* add current visualizer */
    await this._visualizerStyle.replace(`  
      @keyframes countdown {
        from { width: 100%; }
        to { width: 0%; }
      }
    
      #game-canvas:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: .3rem;
        background-color: LightGreen;
        animation: countdown ${time * 1000}ms linear;
      }
    `);
  }

  public get enableChooseVisualizerStore() {
    return this._enableChooseVisualizer.store;
  }

  public get enableDrawVisualizerStore() {
    return this._enableDrawVisualizer.store;
  }

  public get enableGuessVisualizerStore() {
    return this._enableGuessVisualizer.store;
  }
}