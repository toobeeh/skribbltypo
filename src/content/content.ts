import "@abraham/reflection";
import { LifecycleService } from "./core/lifetime/lifecycle.service";
import { LoggerService } from "./core/logger/logger.service";
import { lobbyJoinedEventRegistration } from "./events/lobby-joined.event";
import { PlayClickedEventListener, PlayClickedEventProcessor } from "./events/playClicked.event";
import { LobbyNavigationService } from "./services/lobby-navigation/lobby-navigation.service";
import { TokenService } from "./services/token/token.service";
import { UserInfoFeature } from "./features/user-info/user-info.feature";
import { TypoNewsFeature } from "./features/typo-news/typo-news.feature";
import { ApiService } from "./services/api/api.service";
import { MemberService } from "./services/member/member.service";
import { ModalService } from "./services/modal/modal.service";
import { GameSettingsSetup } from "./setups/game-settings/game-settings.setup";
import { PanelSetup } from "./setups/panel/panel.setup";
import { ElementsSetup } from "./setups/elements/elements.setup";

import "./content.scss";

/* set log level to debug initially */
LoggerService.level = "debug";

/* start application container */
const lifecycle = new LifecycleService();

/* register services to the application */
lifecycle.registerServices(
  {type: ModalService, scope: "scoped"},
  {type: ApiService, scope: "singleton"},
  {type: MemberService, scope: "singleton"},
  {type: TokenService, scope: "singleton"},
  {type: LobbyNavigationService, scope: "singleton"}
);

/* register setup dependencies to the application */
lifecycle.registerSetups(
  PanelSetup,
  ElementsSetup,
  GameSettingsSetup
);

/* register event processors and their listeners */
lifecycle.registerEventProcessors(
  {processorType: PlayClickedEventProcessor, listenerType: PlayClickedEventListener},
  lobbyJoinedEventRegistration
);

/* register application features */
lifecycle.registerFeatures(
  UserInfoFeature,
  TypoNewsFeature
);

lifecycle.eventsWithHistory$.subscribe((event) => {

  if(event.name === "scriptStopped") {
    console.log(event);
  }

  if(event.name === "patchExecuted") {
    console.log(event);
  }
});

/* indicate for interceptor that content script has loaded */
document.body.setAttribute("typo-script-loaded", "true");
