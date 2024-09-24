import { inject, injectable } from "inversify";
import { PlayClickedEventListener } from "../core/events/processors/playClicked.event";
import { loggerFactory } from "../core/logger/loggerFactory.interface";

@injectable()
export class TestFeature {

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(PlayClickedEventListener) private readonly _eventListener: PlayClickedEventListener
  ) {
    this._logger = loggerFactory(this);

    this._eventListener.events$.subscribe((event) => {
      this._logger.debug("test got event", event);
    });
  }
}