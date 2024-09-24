import { inject, injectable, named } from "inversify";
import { LoggerService } from "../core/logger/logger.service";
import { EventListener } from "../core/events/event-listener";
import { PlayClickedEvent } from "../core/events/processors/playClicked.event";
import { loggerFactory } from "../core/logger/loggerFactory.interface";

@injectable()
export class TestFeature {

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(EventListener) @named(PlayClickedEvent) private readonly _eventListener: EventListener<PlayClickedEvent>
  ) {
    this._logger = loggerFactory(this);

    this._eventListener.events$.subscribe((event) => {
      this._logger.debug(`PlayClickedEvent: ${event}`);
    });
  }
}