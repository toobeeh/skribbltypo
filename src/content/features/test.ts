import { inject, injectable, named } from "inversify";
import { LoggerService } from "../core/logger/logger.service";
import { EventListener } from "../core/events/event-listener";
import { PlayClickedEvent } from "../core/events/processors/playClicked.event";

@injectable()
export class TestFeature {

  constructor(
    @inject(LoggerService) private readonly _logger: LoggerService,
    @inject(EventListener) @named(PlayClickedEvent) private readonly _eventListener: EventListener<PlayClickedEvent>
  ) {
    this._logger.bindTo(this);

    this._eventListener.events$.subscribe((event) => {
      this._logger.debug(`PlayClickedEvent: ${event}`);
    });
  }
}