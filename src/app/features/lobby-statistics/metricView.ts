import type { lobbyStatEvent } from "@/app/services/lobby-stats/lobby-stats-events.interface";
import type { Chart } from "@/util/chart/chart";
import type { chartDataset, chartPoint } from "@/util/chart/dataset.interface";
import { avatarColors } from "@/util/skribbl/avatarColors";
import type { skribblPlayer } from "@/util/skribbl/lobby";

export type eventAggregation = "single" | "cumulative" | "average";
export type eventOrdering = "time" | "minValue" | "maxValue";

export class MetricView<TEvent extends lobbyStatEvent> {

  private _events: TEvent[] = [];
  private _aggregation: eventAggregation = "single";
  private _ordering: eventOrdering = "time";
  private _metricUnit: string | undefined = undefined;
  private _metricTemporalUnit: string | undefined = undefined;

  constructor(
    public readonly name: string,
    public readonly description: string,
    private readonly _valueSelector: (event: TEvent) => number
  ) {}

  public withAggregation(aggregation: eventAggregation) {
    this._aggregation = aggregation;
    return this;
  }

  public withOrdering(ordering: eventOrdering) {
    this._ordering = ordering;
    return this;
  }

  public withMetricUnit(unit: string) {
    this._metricUnit = unit;
    return this;
  }

  public withMetricTemporalUnit(unit: string) {
    this._metricTemporalUnit = unit;
    return this;
  }

  public addEvent(event: TEvent){
    this._events.push(event);
  }

  public clearEvents() {
    this._events = [];
  }

  public drawChart(players: skribblPlayer[], chart: Chart) {
    const datasets = this.getDatasetForPlayers(players);
    if(datasets.length === 0) {
      throw new Error("No dataset found for players");
    }

    chart.setDataset(datasets, {
      title: this.name,
      description: this.description,
      xUnit: this._metricTemporalUnit,
      yUnit: this._metricUnit
    });
  }

  private getDatasetForPlayers(players: skribblPlayer[]): chartDataset[] {
    const temporalLookup = this.buildTemporalLookup();

    const datasets = players.map(player => {
      const playerEvents = this._events.filter(e => e.playerId === player.id);
      if(playerEvents.length === 0) return undefined;

      let dataPoints: chartPoint[] = [];

      if(this._aggregation === "single"){
        dataPoints = playerEvents.map(e => ({
          x: temporalLookup.get(this.buildTemporalKey(e.lobbyRound, e.turnPlayerId)) ?? 0,
          y: this._valueSelector(e)
        }));
      }

      else if(this._aggregation === "cumulative"){
        const sum = playerEvents.map(e => this._valueSelector(e)).reduce((a, b) => a + b, 0);
        dataPoints = [{
          y: sum,
          x: 0
        }];
      }

      else if(this._aggregation === "average"){
        const average = playerEvents.map(e => this._valueSelector(e)).reduce((a, b) => a + b, 0) / playerEvents.length;
        dataPoints = [{
          y: average,
          x: 0
        }];
      }

      return {
        label: player.name,
        color: avatarColors[player.avatar[0]],
        data: dataPoints
      };
    });

    const successfulDatasets = datasets.filter((d): d is chartDataset => d !== undefined && d.data.length > 0);

    if(this._aggregation !== "single") {
      if(this._ordering === "minValue"){
        return successfulDatasets.sort((a, b) => {
          const aMin = Math.min(...a.data.map(d => d.y));
          const bMin = Math.min(...b.data.map(d => d.y));
          return aMin - bMin;
        });
      }

      else if(this._ordering === "maxValue"){
        return successfulDatasets.sort((a, b) => {
          const aMax = Math.max(...a.data.map(d => d.y));
          const bMax = Math.max(...b.data.map(d => d.y));
          return bMax - aMax;
        });
      }
    }

    return successfulDatasets;
  }

  private buildTemporalLookup() {
    const allTurns = new Set<string>();
    this._events.forEach(e => allTurns.add(this.buildTemporalKey(e.lobbyRound, e.turnPlayerId)));
    const distinctTurns = Array
      .from(allTurns)
      .map(key => key.split("_"))
      .map(([round, turn]) => ({round: Number(round), turn: Number(turn)}));

    const orderedTurns = distinctTurns
      .map(event => ({round: event.round, turn: event.turn}))
      .sort((b, a) => {
        if(a.round === b.round){
          return a.turn - b.turn;
        }
        return b.round - a.round;
      })
      .map((t, i) => ({
        key: this.buildTemporalKey(t.round, t.turn),
        index: i
      }));

    const temporalLookup = new Map<string, number>();
    orderedTurns.forEach(t => temporalLookup.set(t.key, t.index));
    return temporalLookup;
  }

  private buildTemporalKey(round: number, turnId: number) {
    return `${round}_${turnId}`;
  }
}