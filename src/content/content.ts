import "@abraham/reflection";
import { LifecycleService } from "./core/lifetime/lifecycle.service";
import { LoggerService } from "./core/logger/logger.service";
import { PlayClickedEventListener, PlayClickedEventProcessor } from "./core/events/processors/playClicked.event";
import { UserInfoFeature } from "./features/user-info/user-info.feature";
import { TypoNewsFeature } from "./features/typo-news/typo-news.feature";
import { PanelSetup } from "./setups/panel/panel.setup";
import { ElementsSetup } from "./setups/elements/elements.setup";

import "./content.scss";

LoggerService.level = "debug";
const lifecycle = new LifecycleService();

lifecycle.registerSetups(PanelSetup, ElementsSetup);
lifecycle.registerFeatures(UserInfoFeature, TypoNewsFeature);

lifecycle.eventsWithHistory$.subscribe((event) => {

  if(event.name === "scriptStopped") {
    console.log(event);

    lifecycle.registerEventProcessors({processorType: PlayClickedEventProcessor, listenerType: PlayClickedEventListener});
  }

  if(event.name === "patchExecuted") {
    console.log(event);
  }

});

document.body.setAttribute("typo-script-loaded", "true");
