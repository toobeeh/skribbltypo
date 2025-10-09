import type { lobbyStatEvent } from "@/app/services/lobby-stats/lobby-stats-events.interface";
import type { Chart } from "@/util/chart/chart";
import type { chartDataset, chartPoint } from "@/util/chart/dataset.interface";
import { avatarColors } from "@/util/skribbl/avatarColors";
import type { skribblPlayer } from "@/util/skribbl/lobby";

export type eventAggregation = "single" | "cumulative" | "average" | "ranking";
export type eventOrdering = "time" | "minValue" | "maxValue";

export class MetricView<TEvent extends lobbyStatEvent> {

  private _events: TEvent[] = [];
  private _archive = new Map<string, TEvent[]>();
  private _aggregation: eventAggregation = "single";
  private _ordering: eventOrdering = "time";
  private _metricUnit: string | undefined = undefined;
  private _metricTemporalUnit: string | undefined = undefined;

  private get datasetMode() {
    return this._aggregation === "single" ? "line" : "bar";
  }

  public get name(){
    return this._name;
  }

  public get description(){
    return this._description;
  }

  constructor(
    public readonly _name: string,
    public readonly _description: string,
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

  public archiveEvents(key: string) {
    this._archive.set(key, this._events);
    this._events = [];
  }

  public clearEvents(clearArchive = false) {
    this._events = [];
    if(clearArchive) {
      this._archive.clear();
    }
  }

  public drawChart(players: skribblPlayer[], chart: Chart, archiveKey?: string) {
    const events = archiveKey ? (this._archive.get(archiveKey) ?? []) : this._events;
    const datasets = this.getDatasetForPlayers(players, events);
    if(datasets.length === 0) {
      throw new Error("No dataset found for players");
    }

    chart.setDataset(datasets, {
      title: this._name,
      description: this._description,
      xUnit: this._metricTemporalUnit,
      yUnit: this._metricUnit,
      mode: this.datasetMode
    });
  }

  /**
   * TODO actually improve usability of exported data
   * @param players
   * @param archiveKey
   */
  public generateCsv(players: skribblPlayer[], archiveKey?: string): string {
    const events = archiveKey ? (this._archive.get(archiveKey) ?? []) : this._events;
    const datasets = this.getDatasetForPlayers(players, events);
    if(datasets.length === 0) {
      throw new Error("No dataset found for players");
    }

    const header = ["Player", this._aggregation === "single" ? "Time" : this._aggregation === "cumulative" ? "Total" : "Average"];
    const rows = datasets.map(dataset => {
      return dataset.data.map(point => [
        dataset.label,
        point.y.toString()
      ].join(",")).join("\n");
    }).join("\n");

    return [header.join(","), rows].join("\n");
  }

  private getDatasetForPlayers(players: skribblPlayer[], events: TEvent[]): chartDataset[] {
    const temporalLookup = this.buildTemporalLookup(events);

    const datasets = players.map(player => {
      const playerEvents = events.filter(e => e.playerId === player.id);
      if(playerEvents.length === 0) return undefined;

      let dataPoints: chartPoint[] = [];

      /* select the whole time series of a player dataset */
      if(this._aggregation === "single"){
        dataPoints = playerEvents.map(e => ({
          x: temporalLookup.get(this.buildTemporalKey(e.lobbyRound, e.turnPlayerId)) ?? 0,
          y: this._valueSelector(e)
        }));
      }

      /* calculate the sum of a players dataset */
      else if(this._aggregation === "cumulative"){
        const sum = playerEvents.map(e => this._valueSelector(e)).reduce((a, b) => a + b, 0);
        dataPoints = [{
          y: sum,
          x: 0
        }];
      }

      /* calculate the average of a players dataset */
      else if(this._aggregation === "average"){
        const average = playerEvents.map(e => this._valueSelector(e)).reduce((a, b) => a + b, 0) / playerEvents.length;
        dataPoints = [{
          y: average,
          x: 0
        }];
      }

      /* select only the min/max values of a player's dataset */
      else if(this._aggregation === "ranking"){
        if(this._ordering === "minValue"){
          const minEvent = playerEvents.reduce((prev, curr) => this._valueSelector(prev) < this._valueSelector(curr) ? prev : curr);
          dataPoints = [{
            y: this._valueSelector(minEvent),
            x: 0
          }];
        }
        else if(this._ordering === "maxValue"){
          const maxEvent = playerEvents.reduce((prev, curr) => this._valueSelector(prev) > this._valueSelector(curr) ? prev : curr);
          dataPoints = [{
            y: this._valueSelector(maxEvent),
            x: 0
          }];
        }
      }

      return {
        label: player.name,
        color: avatarColors[player.avatar[0]],
        data: dataPoints
      };
    });

    const successfulDatasets = datasets.filter((d): d is chartDataset => d !== undefined && d.data.length > 0);

    /* if events are a time series but ordering is selected, only choose the min/max value */
    if(this._aggregation === "single") {
      return successfulDatasets;
    }

    /* sort datasets by ranking*/
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

    return successfulDatasets;
  }

  private buildTemporalLookup(events: TEvent[]) {
    const allTurns = new Set<string>();
    events.forEach(e => allTurns.add(this.buildTemporalKey(e.lobbyRound, e.turnPlayerId)));
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