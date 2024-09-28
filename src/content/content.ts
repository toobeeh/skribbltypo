import "@abraham/reflection";
import { drawEventRegistration } from "@/content/events/draw.event";
import { hintsAddedEventRegistration } from "@/content/events/hints-added.event";
import { imageResetEventRegistration } from "@/content/events/image-reset.event";
import { lobbyPlayerChangedEventRegistration } from "@/content/events/lobby-player-changed.event";
import { lobbyStateChangedEventRegistration } from "@/content/events/lobby-state-changed.event";
import { messageReceivedEventRegistration } from "@/content/events/message-received.event";
import { messageSentEventRegistration } from "@/content/events/message-sent.event";
import { roundStartedEventRegistration } from "@/content/events/round-started.event";
import { wordGuessedEventRegistration } from "@/content/events/word-guessed.event";
import { ChatRecallFeature } from "@/content/features/chat-recall/chat-recall.feature";
import { ControlsSettingsFeature } from "@/content/features/controls-settings/controls-settings.feature";
import { DeveloperModeFeature } from "@/content/features/developer-mode/developer-mode.feature";
import { PanelCabinFeature } from "@/content/features/panel-cabin/panel-cabin.feature";
import { PanelChangelogFeature } from "@/content/features/panel-changelog/panel-changelog.feature";
import { PanelFiltersFeature } from "@/content/features/panel-filters/panel-filters.feature";
import { PanelLobbiesFeature } from "@/content/features/panel-lobbies/panel-lobbies.feature";
import { ToolbarChallengesFeature } from "@/content/features/toolbar-challenges/toolbar-challenges.feature";
import { ToolbarFullscreenFeature } from "@/content/features/toolbar-fullscreen/toolbar-fullscreen.feature";
import { ToolbarImageLabFeature } from "@/content/features/toolbar-imagelab/toolbar-imagelab.feature";
import { ToolbarImagePostFeature } from "@/content/features/toolbar-imagepost/toolbar-imagepost.feature";
import { ToolbarSaveFeature } from "@/content/features/toolbar-save/toolbar-save.feature";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { ExtensionContainer } from "@/content/core/extension-container/extension-container";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { ControlsSetup } from "@/content/setups/controls/controls.setup";
import { SkribblEmitRelaySetup } from "@/content/setups/skribbl-emit-relay/skribbl-emit-relay.setup";
import { LoggerService } from "./core/logger/logger.service";
import { lobbyJoinedEventRegistration } from "./events/lobby-joined.event";
import { lobbyLeftEventRegistration } from "./events/lobby-left.event";
import { LobbyNavigationFeature } from "./features/lobby-navigation/lobby-navigation.feature";
import { LobbyService } from "./services/lobby/lobby.service";
import { TokenService } from "./services/token/token.service";
import { UserInfoFeature } from "./features/user-info/user-info.feature";
import { PanelNewsFeature } from "@/content/features/panel-news/panel-news.feature";
import { ApiService } from "./services/api/api.service";
import { MemberService } from "./services/member/member.service";
import { ModalService } from "./services/modal/modal.service";
import { GamePatchReadySetup } from "./setups/game-patch-ready/game-patch.setup";
import { GameSettingsSetup } from "./setups/game-settings/game-settings.setup";
import { PanelSetup } from "./setups/panel/panel.setup";
import { ElementsSetup } from "./setups/elements/elements.setup";

import "./content.scss";
import { SkribblMessageRelaySetup } from "./setups/skribbl-message-relay/skribbl-message-relay.setup";
import { ToolbarSetup } from "./setups/toolbar/toolbar.setup";

/* set log level to debug initially */
LoggerService.level = "debug";

/* start application container */
new ExtensionContainer()
  .registerServices( /* register services to the application */
    {type: ModalService, scope: "scoped"},
    {type: ApiService, scope: "singleton"},
    {type: MemberService, scope: "singleton"},
    {type: TokenService, scope: "singleton"},
    {type: LobbyService, scope: "singleton"},
    {type: DrawingService, scope: "singleton"},
    {type: GlobalSettingsService, scope: "singleton"}
  )
  .registerSetups( /* register setup dependencies to the application */
    PanelSetup,
    ElementsSetup,
    GameSettingsSetup,
    GamePatchReadySetup,
    SkribblMessageRelaySetup,
    ToolbarSetup,
    SkribblEmitRelaySetup,
    ControlsSetup
  )
  .registerEventProcessors( /* register event processors and their listeners */
    lobbyJoinedEventRegistration,
    lobbyLeftEventRegistration,
    lobbyStateChangedEventRegistration,
    hintsAddedEventRegistration,
    lobbyPlayerChangedEventRegistration,
    roundStartedEventRegistration,
    wordGuessedEventRegistration,
    drawEventRegistration,
    imageResetEventRegistration,
    messageSentEventRegistration,
    messageReceivedEventRegistration
  )
  .registerFeatures( /* register application features */
    UserInfoFeature,
    PanelNewsFeature,
    LobbyNavigationFeature,
    ToolbarSaveFeature,
    ToolbarImagePostFeature,
    ToolbarChallengesFeature,
    ToolbarFullscreenFeature,
    ToolbarImageLabFeature,
    ControlsSettingsFeature,
    PanelChangelogFeature,
    PanelLobbiesFeature,
    PanelCabinFeature,
    PanelFiltersFeature,
    ChatRecallFeature,
    DeveloperModeFeature
);

/* indicate for interceptor that content script has loaded */
document.body.setAttribute("typo-script-loaded", "true");
