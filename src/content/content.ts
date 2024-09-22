import "@abraham/reflection";
import { LifecycleService } from "./core/lifetime/lifecycle.service";
import { LoggerService } from "./core/logger/logger.service";
import { PlayClickedEventProcessor } from "./core/events/processors/playClicked.event";

LoggerService.level = "debug";
const lifecycle = new LifecycleService();

lifecycle.eventsWithHistory$.subscribe((event) => {

  if(event.name === "docStart") {
    console.log(event);

    lifecycle.registerEventProcessors(PlayClickedEventProcessor);
  }

  if(event.name === "domLoaded") {
    console.log(event);
  }

  /*if(event.name === "nodeAdded") {
    console.log(event);
  }*/

});
