import "@abraham/reflection";
import { Interceptor } from "@/app/core/interceptor/interceptor";
import { LoggingService } from "@/app/core/logger/logging.service";
import { canvasClearedEventRegistration } from "@/app/events/canvas-cleared.event";
import { chatTypedEventRegistration } from "@/app/events/chat-typed.event";
import { colorChangedEventRegistration } from "@/app/events/color-changed.event";
import { drawEventRegistration } from "@/app/events/draw.event";
import { hintsAddedEventRegistration } from "@/app/events/hints-added.event";
import { imageResetEventRegistration } from "@/app/events/image-reset.event";
import { lobbyInteractedEventRegistration } from "@/app/events/lobby-interacted.event";
import { lobbyJoinFailedEventRegistration } from "@/app/events/lobby-join-failed.event";
import { lobbyPlayerChangedEventRegistration } from "@/app/events/lobby-player-changed.event";
import { lobbyStateChangedEventRegistration } from "@/app/events/lobby-state-changed.event";
import { messageReceivedEventRegistration } from "@/app/events/message-received.event";
import { messageSentEventRegistration } from "@/app/events/message-sent.event";
import { playerPopupVisibilityChangedEventRegistration } from "@/app/events/player-popup-visible.event";
import { roundStartedEventRegistration } from "@/app/events/round-started.event";
import { scoreboardVisibilityChangedEventRegistration } from "@/app/events/scoreboard-visible.event";
import { sizeChangedEventRegistration } from "@/app/events/size-changed.event";
import { textOverlayVisibilityChangedEventRegistration } from "@/app/events/text-overlay-visible.event";
import { toolChangedEventRegistration } from "@/app/events/tool-changed.event";
import { wordGuessedEventRegistration } from "@/app/events/word-guessed.event";
import { CanvasRateIconsFeature } from "@/app/features/canvas-rate-icons/canvas-rate-icons.feature";
import { CanvasZoomFeature } from "@/app/features/canvas-zoom/canvas-zoom.feature";
import { ChatAvatarsFeature } from "@/app/features/chat-avatars/chat-avatars.feature";
import { ChatClearFeature } from "@/app/features/chat-clear/chat-clear.feature";
import { ChatCommandsFeature } from "@/app/features/chat-commands/chat-commands.feature";
import { ChatCopyFormattedFeature } from "@/app/features/chat-copy-formatted/chat-copy-formatted.feature";
import { ChatEmojisFeature } from "@/app/features/chat-emojis/chat-emojis.feature";
import { ChatFocusFeature } from "@/app/features/chat-focus/chat-focus.feature";
import { ChatMessageSplitsFeature } from "@/app/features/chat-message-splits/chat-message-splits.feature";
import { ChatPingFeature } from "@/app/features/chat-ping/chat-ping.feature";
import { ChatProfileLinkFeature } from "@/app/features/chat-profile-link/chat-profile-link.feature";
import { ChatQuickReactFeature } from "@/app/features/chat-quick-react/chat-quick-react.feature";
import { ChatRecallFeature } from "@/app/features/chat-recall/chat-recall.feature";
import { CloudService } from "@/app/features/controls-cloud/cloud.service";
import { ControlsCloudFeature } from "@/app/features/controls-cloud/controls-cloud.feature";
import { ControlsOnboardingFeature } from "@/app/features/controls-onboarding/controls-onboarding.feature";
import { ControlsProfilesFeature } from "@/app/features/controls-profiles/controls-profiles.feature";
import { ControlsSettingsFeature } from "@/app/features/controls-settings/controls-settings.feature";
import { ControlsThemesFeature } from "@/app/features/controls-themes/controls-themes.feature";
import {
  CustomizerOutfitToggleFeature
} from "@/app/features/customizer-outfit-toggle/customizer-outfit-toggle.feature";
import {
  CustomizerPracticeJoinFeature
} from "@/app/features/customizer-practice-join/customizer-practice-join.feature";
import { DrawingBrushLabFeature } from "@/app/features/drawing-brush-lab/drawing-brush-lab.feature";
import { DrawingColorPalettesFeature } from "@/app/features/drawing-color-palettes/drawing-color-palettes.feature";
import { DrawingColorToolsFeature } from "@/app/features/drawing-color-tools/drawing-color-tools.feature";
import { DrawingPressureFeature } from "@/app/features/drawing-pressure/drawing-pressure.feature";
import { DrawingSizeHotkeysFeature } from "@/app/features/drawing-size-hotkeys/drawing-size-hotkeys.feature";
import { DropsFeature } from "@/app/features/drops/drops.feature";
import { GuessCheckFeature } from "@/app/features/guess-check/guess-check.feature";
import { HotkeysFeature } from "@/app/features/hotkeys/hotkeys.feature";
import { ImageAgentFeature } from "@/app/features/image-agent/image-agent.feature";
import { LineToolFeature } from "@/app/features/line-tool/line-tool.feature";
import { LobbyStatusFeature } from "@/app/features/lobby-status/lobby-status.feature";
import { LobbyConnectionService } from "@/app/features/lobby-status/lobby-connection.service";
import { LobbyTimeVisualizerFeature } from "@/app/features/lobby-time-visualizer/lobby-time-visualizer.feature";
import { LoggingFeature } from "@/app/features/logging/logging.feature";
import { PanelCabinFeature } from "@/app/features/panel-cabin/panel-cabin.feature";
import { PanelChangelogFeature } from "@/app/features/panel-changelog/panel-changelog.feature";
import { PanelFiltersFeature } from "@/app/features/panel-filters/panel-filters.feature";
import { PanelLobbiesFeature } from "@/app/features/panel-lobbies/panel-lobbies.feature";
import { ChatMessageHighlightingFeature } from "@/app/features/chat-message-highlighting/chat-message-highlighting.feature";
import { PlayerAwardsFeature } from "@/app/features/player-awards/player-awards-feature";
import { PlayerIdsFeature } from "@/app/features/player-ids/player-ids.feature";
import { PlayerScenesFeature } from "@/app/features/player-scenes/player-scenes.feature";
import { PlayerSpritesFeature } from "@/app/features/player-sprites/player-sprites.feature";
import { ToolbarChallengesFeature } from "@/app/features/toolbar-challenges/toolbar-challenges.feature";
import { ToolbarFullscreenFeature } from "@/app/features/toolbar-fullscreen/toolbar-fullscreen.feature";
import { ToolbarImageLabFeature } from "@/app/features/toolbar-imagelab/toolbar-imagelab.feature";
import { ToolbarImagePostFeature } from "@/app/features/toolbar-imagepost/toolbar-imagepost.feature";
import { ToolbarSaveFeature } from "@/app/features/toolbar-save/toolbar-save.feature";
import { ImagelabService } from "@/app/features/toolbar-imagelab/imagelab.service";
import { TooltipsFeature } from "@/app/features/tooltips/tooltips.feature";
import { ChatService } from "@/app/services/chat/chat.service";
import { ColorsService } from "@/app/services/colors/colors.service";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import { ExtensionContainer } from "@/app/core/extension-container/extension-container";
import { GlobalSettingsService } from "@/app/services/global-settings/global-settings.service";
import { ImageFinishedService } from "@/app/services/image-finished/image-finished.service";
import { ImagePostService } from "@/app/features/toolbar-imagepost/image-post.service";
import { LobbyInteractionsService } from "@/app/services/lobby-interactions/lobby-interactions.service";
import { LobbyItemsService } from "@/app/services/lobby-items/lobby-items.service";
import { OnboardingService } from "@/app/services/onboarding/onboarding.service";
import { PlayersService } from "@/app/services/players/players.service";
import { SocketService } from "@/app/services/socket/socket.service";
import { ThemesService } from "@/app/services/themes/themes.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { ToolsService } from "@/app/services/tools/tools.service";
import { ApiDataSetup } from "@/app/setups/api-data/api-data.setup";
import { ChatControlsSetup } from "@/app/setups/chat-controls/chat-controls.setup";
import { ControlsSetup } from "@/app/setups/controls/controls.setup";
import { CssColorVarSelectorsSetup } from "@/app/setups/css-color-var-selectors/cssColorVarSelectors.setup";
import { CustomizerActionsSetup } from "@/app/setups/customizer-actions/customizer-actions.setup";
import { LandingPlayerSetup } from "@/app/setups/landing-player/landing-player.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/app/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import {
  PrioritizedChatboxEventsSetup
} from "@/app/setups/prioritized-chatbox-events/prioritized-chatbox-events.setup";
import { SkribblEmitRelaySetup } from "@/app/setups/skribbl-emit-relay/skribbl-emit-relay.setup";
import { SkribblInitializedSetup } from "@/app/setups/skribbl-initialized/skribbl-initialized.setup";
import { ToastSetup } from "@/app/setups/toast/toast.setup";
import { lobbyJoinedEventRegistration } from "./events/lobby-joined.event";
import { lobbyLeftEventRegistration } from "./events/lobby-left.event";
import { LobbyNavigationFeature } from "./features/lobby-navigation/lobby-navigation.feature";
import { LobbyService } from "./services/lobby/lobby.service";
import { UserInfoFeature } from "./features/user-info/user-info.feature";
import { PanelNewsFeature } from "@/app/features/panel-news/panel-news.feature";
import { ApiService } from "./services/api/api.service";
import { MemberService } from "./services/member/member.service";
import { ModalService } from "./services/modal/modal.service";
import { GamePatchReadySetup } from "./setups/game-patch-ready/game-patch-ready.setup";
import { GameSettingsSetup } from "./setups/game-settings/game-settings.setup";
import { PanelSetup } from "./setups/panel/panel.setup";
import { ElementsSetup } from "./setups/elements/elements.setup";

import "./app.scss";
import { SkribblMessageRelaySetup } from "./setups/skribbl-message-relay/skribbl-message-relay.setup";
import { ToolbarSetup } from "./setups/toolbar/toolbar.setup";

/**
 * Entry point for the skribbltypo extension
 * For details about architecture and design, refer to the README.md
 */

/* interceptor to patch DOM build */
const interceptor = new Interceptor(true);

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
    {type: LobbyConnectionService, scope: "singleton"},
    {type: ColorsService, scope: "singleton"},
    {type: OnboardingService, scope: "singleton"}
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
    CssColorVarSelectorsSetup,
    LandingPlayerSetup,
    CustomizerActionsSetup,
    PrioritizedChatboxEventsSetup
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
    canvasClearedEventRegistration,
    lobbyJoinFailedEventRegistration
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
    DropsFeature,
    PlayerAwardsFeature,
    ChatClearFeature,
    ChatMessageSplitsFeature,
    CustomizerPracticeJoinFeature,
    CustomizerOutfitToggleFeature,
    CanvasRateIconsFeature,
    ControlsOnboardingFeature,
    ControlsProfilesFeature,
    ChatAvatarsFeature,
    DrawingSizeHotkeysFeature,
    ChatPingFeature,
    ChatMessageHighlightingFeature,
  );

/* indicate for interceptor that content script has loaded */
interceptor.triggerPatchInjection();

