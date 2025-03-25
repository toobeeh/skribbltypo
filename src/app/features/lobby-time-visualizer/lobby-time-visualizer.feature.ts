import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting, HexColorExtensionSetting } from "@/app/core/settings/setting";
import { LobbyJoinedEventListener } from "@/app/events/lobby-joined.event";
import { LobbyLeftEventListener } from "@/app/events/lobby-left.event";
import { LobbyStateChangedEventListener } from "@/app/events/lobby-state-changed.event";
import type { componentData } from "@/app/services/modal/modal.service";
import {
  combineLatestWith,
  delay,
  firstValueFrom,
  map,
  mergeWith,
  of,
  pairwise, startWith,
  type Subscription,
  withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import LobbyTimeVisualizerInfo from "./lobby-time-visualizer-info.svelte";

export class LobbyTimeVisualizerFeature extends TypoFeature {

  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(LobbyJoinedEventListener) private readonly _lobbyJoinedEventListener!: LobbyJoinedEventListener;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEventListener!: LobbyLeftEventListener;

  public readonly name = "Time Visualizer";
  public readonly description = "Shows a visual representation of time left to draw/choose";
  public readonly tags = [
    FeatureTag.INFORMATION,
    FeatureTag.GAMEPLAY
  ];
  public readonly featureId = 30;

  public override get featureInfoComponent(): componentData<LobbyTimeVisualizerInfo>{
    return { componentType: LobbyTimeVisualizerInfo, props: {}};
  }

  private readonly _colorStartSetting = this.useSetting(new HexColorExtensionSetting("visualizer_color_start", "#46d536", this)
    .withName("Color Start")
    .withDescription("Start color of the visualizer bar"));

  private readonly _colorEndSetting = this.useSetting(new HexColorExtensionSetting("visualizer_color_end", "#fa2b08", this)
    .withName("Color End")
    .withDescription("End color of the visualizer bar"));

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

    this._lobbyJoinedEventListener.events$.pipe(
      mergeWith(this._lobbyLeftEventListener.events$),
      map(event => event.data),

      combineLatestWith(this._lobbyStateChangedEventListener.events$),
      withLatestFrom(
        this._enableDrawVisualizer.changes$,
        this._enableGuessVisualizer.changes$,
        this._enableChooseVisualizer.changes$
      ),

      map(([[lobby, event], draw, guess, choose]) => event.data.timerSet?.time !== 0 && lobby !== null &&
        (draw && event.data.drawingStarted?.drawerId === lobby.meId ||
          (guess && event.data.drawingStarted !== undefined && event.data.drawingStarted.drawerId !== lobby.meId) ||
          (choose && event.data.drawerChoosingWord !== undefined)
        ) ? { event, lobby } : (event.data.timerSet ? {override: event.data.timerSet.time} : undefined)
      ),

      map(data => {
        if(data === undefined) return undefined;
        if(data.override) return {override: data.override};

        const {event, lobby} = data;

        if(event?.data.drawingStarted) return {max: lobby.settings.drawTime, time: event.data.drawingStarted.maxTime};
        if(event?.data.drawerChoosingWord) return {max: event.data.drawerChoosingWord.maxTime, time: event.data.drawerChoosingWord.maxTime};

        return undefined;
      }),

      startWith(undefined),
      pairwise(),

      map(([prev, current]) => {

        if(current === undefined) return undefined;

        if(current.override && prev?.max) return {time: current.override, max: prev.max};
        return current.time && current.max ? {time: current.time, max: current.max} : undefined;
      })
    ).subscribe((data) => {
      this.visualizeEvent(data);
    });
  }

  protected override async onDestroy() {
    this.visualizerEventSubscription?.unsubscribe();
    this.visualizerEventSubscription = undefined;
    document.adoptedStyleSheets = document.adoptedStyleSheets.filter(sheet => sheet !== this._visualizerStyle);
  }

  private async visualizeEvent(data: {time: number, max: number} | undefined) {
    this._logger.debug("Visualize event", data);

    if(this._visualizerStyle === undefined) {
      this._logger.error("Visualizer style not set");
      return;
    }

    /* reset styles*/
    await this._visualizerStyle.replace("");
    if(data === undefined) return;
    const {time, max} = data;

    /* delay to separate animations.. */
    await firstValueFrom(of(1).pipe(delay(10)));

    const startColor = await this._colorStartSetting.getValue();
    const endColor = await this._colorEndSetting.getValue();

    /* add current visualizer */
    await this._visualizerStyle.replace(`  
      @keyframes countdown {
        0% { width: ${ Math.floor(time * 100 / max) }%; background-color: ${startColor}; }
        50% { width: ${ Math.floor(time * 50 / max) }%; background-color: ${startColor}; }
        100% { width: 0%; background-color: ${endColor}; }
      }
    
      #game-canvas:after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: .3rem;
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