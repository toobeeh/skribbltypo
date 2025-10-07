import { FeatureTag } from "@/app/core/feature/feature-tags";
import { LobbyLeftEventListener } from "@/app/events/lobby-left.event";
import { RoundStartedEventListener } from "@/app/events/round-started.event";
import { MetricView } from "@/app/features/lobby-statistics/metricView";
import type {
  guessTimeStatEvent,
  lobbyStatEvent,
  standingScoreStatEvent,
} from "@/app/services/lobby-stats/lobby-stats-events.interface";
import { LobbyStatsService } from "@/app/services/lobby-stats/lobby-stats.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { Chart } from "@/util/chart/chart";
import { inject } from "inversify";
import { filter, interval, mergeWith, type Observable, type Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";

export class LobbyStatisticsFeature extends TypoFeature {

  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(LobbyStatsService) private readonly _lobbyStatsService!: LobbyStatsService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEventListener!: LobbyLeftEventListener;
  @inject(RoundStartedEventListener) private readonly _roundStartedEventListener!: RoundStartedEventListener;

  public readonly name = "Game Stats";
  public readonly description = "Collects and visualizes competitive game statistics of lobbies.";
  public readonly tags = [
    FeatureTag.GAMEPLAY,
    FeatureTag.SOCIAL
  ];
  public readonly featureId = 55;

  private readonly _metricViews = {
    averageGuessTime: new MetricView<guessTimeStatEvent>(
      "Average Guess Time",
      "The average time a player needed to guess a word",
      event => event.guessTimeMs)
      .withMetricUnit("ms")
      .withAggregation("average")
      .withOrdering("maxValue"),
    totalScore: new MetricView<standingScoreStatEvent>(
      "Score Ranking",
      "The total ranking, progressing over time",
      event => event.score)
      .withMetricUnit("pts")
  };
  private _statsSubscriptions: Subscription[] = [];

  protected override async onActivate() {
    this.subscribeMetric(this._lobbyStatsService.guessTimeStats$, this._metricViews.averageGuessTime);
    this.subscribeMetric(this._lobbyStatsService.turnStandingScoreStats$, this._metricViews.totalScore);

    const chart = new Chart({
      width: 2000,
      height: 1000,
      chartArea: {
        x: 200,
        y: 200,
        width: 1600,
        height: 600
      },
      barPadding: 50,
      barMaxWidth: 100,
      yGridGap: 50
    });

    /*chart.setDataset([{
      label: "Player 1",
      color: "#ff0000",
      data: [{x: 0, y: 100, label: "✨"}, {x: 10, y: 200}]
    },{
      label: "Player 2",
      color: "#00ff00",
      data: [{x: 0, y: 800}, {x: 10, y: 500}]
    }], {
      title: "Average Guess Time",
      description: "The average time a player needed to guess a word",
      yUnit: "ms",
      /!*yLabels: [{y: 0, label: "0"},{y: 150, label: "100"},{y: 200, label: "200"},{y: 300, label: "300"}]*!/
    });*/
    document.body.appendChild(chart.canvas);

    interval(3000).pipe(
      withLatestFrom(this._lobbyService.lobby$)
    ).subscribe(([,lobby]) => {
      if(lobby === null) return;
      const players = lobby.players;
      this._metricViews.averageGuessTime.drawChart(players, chart);
    });

    this._lobbyLeftEventListener.events$.pipe(
      mergeWith(this._roundStartedEventListener.events$.pipe(
        filter(event => event.data === 1)
      ))
    ).subscribe(() => this.resetMetrics());

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
}