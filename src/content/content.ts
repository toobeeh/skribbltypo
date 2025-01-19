import "@abraham/reflection";
import { Interceptor } from "@/content/core/interceptor/interceptor";
import { LoggingService } from "@/content/core/logger/logging.service";
import { canvasClearedEventRegistration } from "@/content/events/canvas-cleared.event";
import { chatTypedEventRegistration } from "@/content/events/chat-typed.event";
import { colorChangedEventRegistration } from "@/content/events/color-changed.event";
import { drawEventRegistration } from "@/content/events/draw.event";
import { hintsAddedEventRegistration } from "@/content/events/hints-added.event";
import { imageResetEventRegistration } from "@/content/events/image-reset.event";
import { lobbyInteractedEventRegistration } from "@/content/events/lobby-interacted.event";
import { lobbyPlayerChangedEventRegistration } from "@/content/events/lobby-player-changed.event";
import { lobbyStateChangedEventRegistration } from "@/content/events/lobby-state-changed.event";
import { messageReceivedEventRegistration } from "@/content/events/message-received.event";
import { messageSentEventRegistration } from "@/content/events/message-sent.event";
import { playerPopupVisibilityChangedEventRegistration } from "@/content/events/player-popup-visible.event";
import { roundStartedEventRegistration } from "@/content/events/round-started.event";
import { scoreboardVisibilityChangedEventRegistration } from "@/content/events/scoreboard-visible.event";
import { sizeChangedEventRegistration } from "@/content/events/size-changed.event";
import { textOverlayVisibilityChangedEventRegistration } from "@/content/events/text-overlay-visible.event";
import { toolChangedEventRegistration } from "@/content/events/tool-changed.event";
import { wordGuessedEventRegistration } from "@/content/events/word-guessed.event";
import { CanvasZoomFeature } from "@/content/features/canvas-zoom/canvas-zoom.feature";
import { ChatCommandsFeature } from "@/content/features/chat-commands/chat-commands.feature";
import { ChatCopyFormattedFeature } from "@/content/features/chat-copy-formatted/chat-copy-formatted.feature";
import { ChatEmojisFeature } from "@/content/features/chat-emojis/chat-emojis.feature";
import { ChatFocusFeature } from "@/content/features/chat-focus/chat-focus.feature";
import { ChatProfileLinkFeature } from "@/content/features/chat-profile-link/chat-profile-link.feature";
import { ChatQuickReactFeature } from "@/content/features/chat-quick-react/chat-quick-react.feature";
import { ChatRecallFeature } from "@/content/features/chat-recall/chat-recall.feature";
import { CloudService } from "@/content/features/controls-cloud/cloud.service";
import { ControlsCloudFeature } from "@/content/features/controls-cloud/controls-cloud.feature";
import { ControlsSettingsFeature } from "@/content/features/controls-settings/controls-settings.feature";
import { ControlsThemesFeature } from "@/content/features/controls-themes/controls-themes.feature";
import { DrawingBrushLabFeature } from "@/content/features/drawing-brush-lab/drawing-brush-lab.feature";
import { DrawingColorPalettesFeature } from "@/content/features/drawing-color-palettes/drawing-color-palettes.feature";
import { DrawingColorToolsFeature } from "@/content/features/drawing-color-tools/drawing-color-tools.feature";
import { DrawingPressureFeature } from "@/content/features/drawing-pressure/drawing-pressure.feature";
import { DropsFeature } from "@/content/features/drops/drops.feature";
import { GuessCheckFeature } from "@/content/features/guess-check/guess-check.feature";
import { HotkeysFeature } from "@/content/features/hotkeys/hotkeys.feature";
import { ImageAgentFeature } from "@/content/features/image-agent/image-agent.feature";
import { LineToolFeature } from "@/content/features/line-tool/line-tool.feature";
import { LobbyStatusFeature } from "@/content/features/lobby-status/lobby-status.feature";
import { LobbyStatusService } from "@/content/features/lobby-status/lobby-status.service";
import { LobbyTimeVisualizerFeature } from "@/content/features/lobby-time-visualizer/lobby-time-visualizer.feature";
import { LoggingFeature } from "@/content/features/logging/logging.feature";
import { PanelCabinFeature } from "@/content/features/panel-cabin/panel-cabin.feature";
import { PanelChangelogFeature } from "@/content/features/panel-changelog/panel-changelog.feature";
import { PanelFiltersFeature } from "@/content/features/panel-filters/panel-filters.feature";
import { PanelLobbiesFeature } from "@/content/features/panel-lobbies/panel-lobbies.feature";
import { PlayerIdsFeature } from "@/content/features/player-ids/player-ids.feature";
import { PlayerScenesFeature } from "@/content/features/player-scenes/player-scenes.feature";
import { PlayerSpritesFeature } from "@/content/features/player-sprites/player-sprites.feature";
import { ToolbarChallengesFeature } from "@/content/features/toolbar-challenges/toolbar-challenges.feature";
import { ToolbarFullscreenFeature } from "@/content/features/toolbar-fullscreen/toolbar-fullscreen.feature";
import { ToolbarImageLabFeature } from "@/content/features/toolbar-imagelab/toolbar-imagelab.feature";
import { ToolbarImagePostFeature } from "@/content/features/toolbar-imagepost/toolbar-imagepost.feature";
import { ToolbarSaveFeature } from "@/content/features/toolbar-save/toolbar-save.feature";
import { ImagelabService } from "@/content/features/toolbar-imagelab/imagelab.service";
import { TooltipsFeature } from "@/content/features/tooltips/tooltips.feature";
import { ChatService } from "@/content/services/chat/chat.service";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { ExtensionContainer } from "@/content/core/extension-container/extension-container";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { ImageFinishedService } from "@/content/services/image-finished/image-finished.service";
import { ImagePostService } from "@/content/features/toolbar-imagepost/image-post.service";
import { LobbyInteractionsService } from "@/content/services/lobby-interactions/lobby-interactions.service";
import { LobbyItemsService } from "@/content/services/lobby-items/lobby-items.service";
import { PlayersService } from "@/content/services/players/players.service";
import { SocketService } from "@/content/services/socket/socket.service";
import { ThemesService } from "@/content/services/themes/themes.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ToolsService } from "@/content/services/tools/tools.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { ChatControlsSetup } from "@/content/setups/chat-controls/chat-controls.setup";
import { ControlsSetup } from "@/content/setups/controls/controls.setup";
import { CssColorVarSelectorsSetup } from "@/content/setups/css-color-var-selectors/cssColorVarSelectors.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { SkribblEmitRelaySetup } from "@/content/setups/skribbl-emit-relay/skribbl-emit-relay.setup";
import { SkribblInitializedSetup } from "@/content/setups/skribbl-initialized/skribbl-initialized.setup";
import { ToastSetup } from "@/content/setups/toast/toast.setup";
import { lobbyJoinedEventRegistration } from "./events/lobby-joined.event";
import { lobbyLeftEventRegistration } from "./events/lobby-left.event";
import { LobbyNavigationFeature } from "./features/lobby-navigation/lobby-navigation.feature";
import { LobbyService } from "./services/lobby/lobby.service";
import { UserInfoFeature } from "./features/user-info/user-info.feature";
import { PanelNewsFeature } from "@/content/features/panel-news/panel-news.feature";
import { ApiService } from "./services/api/api.service";
import { MemberService } from "./services/member/member.service";
import { ModalService } from "./services/modal/modal.service";
import { GamePatchReadySetup } from "./setups/game-patch-ready/game-patch-ready.setup";
import { GameSettingsSetup } from "./setups/game-settings/game-settings.setup";
import { PanelSetup } from "./setups/panel/panel.setup";
import { ElementsSetup } from "./setups/elements/elements.setup";

import "./content.scss";
import { SkribblMessageRelaySetup } from "./setups/skribbl-message-relay/skribbl-message-relay.setup";
import { ToolbarSetup } from "./setups/toolbar/toolbar.setup";

/**
 * Entry point for the skribbltypo extension
 * For details about architecture and design, refer to the README.md
 */

/* interceptor to patch DOM build */
const interceptor = new Interceptor();

/* set initial log level */
LoggingService.defaultLogLevel = "warn";

/* start application container */
new ExtensionContainer(interceptor)
  .registerServices( /* register services to the application */
    {type: ModalService, scope: "scoped"},
    {type: ApiService, scope: "singleton"},
    {type: MemberService, scope: "singleton"},
    {type: LobbyService, scope: "singleton"},
    {type: DrawingService, scope: "singleton"},
    {type: ToolsService, scope: "singleton"},
    {type: GlobalSettingsService, scope: "singleton"},
    {type: ImageFinishedService, scope: "singleton"},
    {type: ImagelabService, scope: "singleton"},
    {type: ImagePostService, scope: "singleton"},
    {type: CloudService, scope: "singleton"},
    {type: ToastService, scope: "scoped"},
    {type: SocketService, scope: "scoped"},
    {type: LobbyItemsService, scope: "singleton"},
    {type: PlayersService, scope: "singleton"},
    {type: ChatService, scope: "singleton"},
    {type: LobbyInteractionsService, scope: "singleton"},
    {type: ThemesService, scope: "singleton"},
    {type: LobbyStatusService, scope: "singleton"}
  )
  .registerSetups( /* register setup dependencies to the application */
    PanelSetup,
    ElementsSetup,
    GameSettingsSetup,
    GamePatchReadySetup,
    SkribblMessageRelaySetup,
    ToolbarSetup,
    SkribblEmitRelaySetup,
    ControlsSetup,
    SkribblInitializedSetup,
    ApiDataSetup,
    ToastSetup,
    ChatControlsSetup,
    PrioritizedCanvasEventsSetup,
    CssColorVarSelectorsSetup
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
    messageReceivedEventRegistration,
    chatTypedEventRegistration,
    toolChangedEventRegistration,
    sizeChangedEventRegistration,
    colorChangedEventRegistration,
    scoreboardVisibilityChangedEventRegistration,
    playerPopupVisibilityChangedEventRegistration,
    textOverlayVisibilityChangedEventRegistration,
    lobbyInteractedEventRegistration,
    canvasClearedEventRegistration
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
    ImageAgentFeature,
    ControlsCloudFeature,
    GuessCheckFeature,
    LobbyStatusFeature,
    PlayerSpritesFeature,
    PlayerScenesFeature,
    ChatEmojisFeature,
    ChatProfileLinkFeature,
    LoggingFeature,
    HotkeysFeature,
    CanvasZoomFeature,
    LineToolFeature,
    ChatFocusFeature,
    PlayerIdsFeature,
    LobbyTimeVisualizerFeature,
    DrawingColorToolsFeature,
    DrawingColorPalettesFeature,
    ChatQuickReactFeature,
    ControlsThemesFeature,
    TooltipsFeature,
    ChatCopyFormattedFeature,
    DrawingPressureFeature,
    ChatCommandsFeature,
    DrawingBrushLabFeature,
    DropsFeature
  );

/* indicate for interceptor that content script has loaded */
interceptor.triggerPatchInjection();

