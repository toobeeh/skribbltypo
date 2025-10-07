import type { lobbyStatEvent } from "@/app/services/lobby-stats/lobby-stats-events.interface";

export type eventAggregation = "single" | "cumulative" | "average";
export type eventOrdering = "time" | "minValue" | "maxValue";

export class MetricView<TEvent extends lobbyStatEvent> {

  private _events: TEvent[] = [];
  private _aggregation: eventAggregation = "single";
  private _ordering: eventOrdering = "time";

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

  public addEvent(event: TEvent){
    this._events.push(event);
  }

  public getDatasetForPlayers() {
    return null;
  }

  public clearEvents() {
    this._events = [];
  }
}