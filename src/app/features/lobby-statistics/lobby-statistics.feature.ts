import { ExtensionCommand } from "@/app/core/commands/command";
import { StringOptionalCommandParameter } from "@/app/core/commands/params/string-optional-command-parameter";
import { InterpretableError } from "@/app/core/commands/results/interpretable-error";
import { InterpretableSilentSuccess } from "@/app/core/commands/results/interpretable-silent-success";
import { InterpretableSuccess } from "@/app/core/commands/results/interpretable-success";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { ExtensionSetting } from "@/app/core/settings/setting";
import { LobbyLeftEventListener } from "@/app/events/lobby-left.event";
import { LobbyStateChangedEventListener } from "@/app/events/lobby-state-changed.event";
import { RoundStartedEventListener } from "@/app/events/round-started.event";
import { MetricView } from "@/app/features/lobby-statistics/metricView";
import { createMetricViews } from "@/app/features/lobby-statistics/viewsFactory";
import type {
  lobbyStatEvent,
} from "@/app/services/lobby-stats/lobby-stats-events.interface";
import { LobbyStatsService } from "@/app/services/lobby-stats/lobby-stats.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { type componentData, ModalService } from "@/app/services/modal/modal.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { Chart } from "@/util/chart/chart";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {
  BehaviorSubject, combineLatestWith, debounceTime,
  filter,
  mergeWith,
  type Observable,
  type Subscription,
  withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ChartsComponent from "./charts.svelte";

export class LobbyStatisticsFeature extends TypoFeature {

  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(LobbyStatsService) private readonly _lobbyStatsService!: LobbyStatsService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEventListener!: LobbyLeftEventListener;
  @inject(RoundStartedEventListener) private readonly _roundStartedEventListener!: RoundStartedEventListener;
  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;

  public readonly name = "Game Stats";
  public readonly description = "Collects and visualizes competitive game statistics of lobbies.";
  public readonly tags = [
    FeatureTag.GAMEPLAY,
    FeatureTag.SOCIAL
  ];
  public readonly featureId = 55;

  private readonly _metricViews = createMetricViews();
  private _statsSubscriptions: Subscription[] = [];
  private _statArchive = new BehaviorSubject<Map<string, string>>(new Map());

  private readonly _switchStatCommand = this.useCommand(
    new ExtensionCommand("stats", this, "Show game stats", "Show a stat screen above the lobby chat"),
  ).withParameters(params => params
    .addParam(new StringOptionalCommandParameter("Category Name", "The name of the category to show", category => ({ category })))
    .run(async (args, command) => {
      const categories = Object.keys(this._metricViews);
      if(args.category !== undefined && !categories.includes(args.category)){
        return new InterpretableError(command, `Unknown category '${args.category}'. Use the stat list command to list available categories.`);
      }

      await this._statViewSetting.setValue(args.category);
      return new InterpretableSuccess(command, `Showing stats for category ${args.category ?? "none (hides stats)"}.`);
    })
  );

  private readonly _statListCommand = this.useCommand(
    new ExtensionCommand("statls", this, "List game stat categories", "Show a list of available categories for the stats command"),
  ).run(async command => {
    const categories = Object.entries(this._metricViews).map(([key, view]) => `- [${key}] ${view.name}: ${view.description}`).join("\n");
    if(categories.length === 0) return new InterpretableError(command, "No stat categories available.");
    return new InterpretableSuccess(command, categories);
  });

  private readonly _statViewCommand = this.useCommand(
    new ExtensionCommand("statvw", this, "View stats in popup", "Opens a popup with detailed statistics"),
  ).run(async command => {
    const popupComponent: componentData<ChartsComponent> = {
      componentType: ChartsComponent,
      props: {
        feature: this
      }
    };

    this._modalService.showModal(popupComponent.componentType, popupComponent.props, "Lobby Statistics", "card");
    return new InterpretableSilentSuccess(command);
  });

  private readonly _statViewSetting = new ExtensionSetting<string | undefined>("stat_view", undefined, this);

  protected override async onActivate() {

    /* subscribe metrics and pipe them to views */
    this.subscribeMetric(this._lobbyStatsService.guessTimeStats$, this._metricViews.averageGuessTime);
    this.subscribeMetric(this._lobbyStatsService.turnStandingScoreStats$, this._metricViews.totalScore);
    this.subscribeMetric(this._lobbyStatsService.guessCountStats$, this._metricViews.averageNeededGuesses);
    this.subscribeMetric(this._lobbyStatsService.guessMessageGapStats$, this._metricViews.averageGuessSpeed);
    this.subscribeMetric(this._lobbyStatsService.guessTimeStats$, this._metricViews.fastestGuess);
    this.subscribeMetric(this._lobbyStatsService.guessScoreStats$, this._metricViews.averageGuessScore);
    this.subscribeMetric(this._lobbyStatsService.guessAccuracyStats$, this._metricViews.averageGuessAccuracy);
    this.subscribeMetric(this._lobbyStatsService.guessStreakStats$, this._metricViews.longestGuessStreak);
    this.subscribeMetric(this._lobbyStatsService.guessRankStats$, this._metricViews.averageGuessRank);
    this.subscribeMetric(this._lobbyStatsService.drawTimeStats$, this._metricViews.averageDrawTime);
    this.subscribeMetric(this._lobbyStatsService.drawTimeStats$, this._metricViews.fastestDrawTime);
    this.subscribeMetric(this._lobbyStatsService.drawScoreStats$, this._metricViews.averageDrawScore);
    this.subscribeMetric(this._lobbyStatsService.drawGuessedPlayersStats$, this._metricViews.averageGuessedPlayers);
    this.subscribeMetric(this._lobbyStatsService.drawLikesStats$, this._metricViews.averageDrawLikes);
    this.subscribeMetric(this._lobbyStatsService.drawDislikesStats$, this._metricViews.mostDrawDislikes);

    /* create a chart */
    const chart = new Chart({
      width: 2000,
      height: 1000,
      chartArea: {
        x: 200,
        y: 200,
        width: 1600,
        height: 700
      },
      barPadding: 30,
      barMaxWidth: 100,
      yGridGap: 50
    });
    const elements = await this._elementsSetup.complete();

    /* update demo chart */
    const chartUpdateSub = this._lobbyService.lobby$.pipe(
      debounceTime(1000),
      combineLatestWith(this._statViewSetting.changes$)
    ).subscribe(([lobby, stat]) => {
      if(lobby === null) return;
      const players = lobby.players;

      let chartVisible = false;
      const matchingStat = stat ? Object.entries(this._metricViews)
        .find(([key]) => key === stat) : undefined;
      if(matchingStat === undefined) chart.clear();
      else {
        try {
          matchingStat[1].drawChart(players, chart);
          chartVisible = true;
        }
        catch(e) {
          this._logger.warn("could not plot chart", e);
          chart.clear();
        }
      }

      if(chartVisible && chart.canvas.parentElement === null){
        elements.chatArea.insertAdjacentElement("afterbegin", chart.canvas);
      }
      if(!chartVisible && chart.canvas.parentElement !== null){
        chart.canvas.remove();
      }
    });

    /* clear recorded metrics on lobby leave and round start */
    const metricResetSub = this._lobbyLeftEventListener.events$.pipe(
      mergeWith(this._roundStartedEventListener.events$.pipe(
        filter(event => event.data === 1)
      ))
    ).subscribe(() => this.resetMetrics());

    /* archive lobby metrics when round ended */
    const metricArchiveSub = this._lobbyStateChangedEventListener.events$.pipe(
      filter(event => event.data.gameEnded !== undefined),
      withLatestFrom(this._lobbyService.lobby$, this._statArchive),
    ).subscribe(([,lobby, archive]) => {
      if(lobby === null) return;

      const date = new Date().toISOString();
      const key = `${lobby.id}-${Date.now()}`;
      Object.values(this._metricViews).forEach((metricView) => metricView.archiveEvents(key));
      archive.set(key, date);
      this._statArchive.next(archive);
    });

    this._statsSubscriptions.push(metricResetSub, metricArchiveSub, chartUpdateSub);
  }

  protected override async onDestroy() {
    this._statsSubscriptions.forEach((subscriber) => subscriber.unsubscribe());
    this._statsSubscriptions = [];

    this.resetMetrics();
  }

  private subscribeMetric<TEvent extends lobbyStatEvent>(source: Observable<TEvent>, metricView: MetricView<TEvent>){
    const sub = source.subscribe(entry => metricView.addEvent(entry));
    this._statsSubscriptions.push(sub);
  }

  private resetMetrics() {
    Object.values(this._metricViews).forEach((metricView) => metricView.clearEvents());
  }

  public createChart(canvas: HTMLCanvasElement){
    const chart = new Chart({
      width: 2000,
      height: 1000,
      chartArea: {
        x: 200,
        y: 200,
        width: 1600,
        height: 700
      },
      barPadding: 30,
      barMaxWidth: 100,
      yGridGap: 50
    }, canvas);
    return chart;
  }

  public getViews() {
    return Object.values(this._metricViews);
  }

  public get lobbyStore() {
    return fromObservable(this._lobbyService.lobby$, null);
  }

  public get archiveStore() {
    return fromObservable(this._statArchive.asObservable(), new Map());
  }
}