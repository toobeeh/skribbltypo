import { FeatureTag } from "@/app/core/feature/feature-tags";
import { FeaturesService } from "@/app/core/feature/features.service";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { CanvasRateIconsFeature } from "@/app/features/canvas-rate-icons/canvas-rate-icons.feature";
import { CanvasZoomFeature } from "@/app/features/canvas-zoom/canvas-zoom.feature";
import { ChatClearFeature } from "@/app/features/chat-clear/chat-clear.feature";
import { ChatCommandsFeature } from "@/app/features/chat-commands/chat-commands.feature";
import { ChatCopyFormattedFeature } from "@/app/features/chat-copy-formatted/chat-copy-formatted.feature";
import { ChatEmojisFeature } from "@/app/features/chat-emojis/chat-emojis.feature";
import { ChatFocusFeature } from "@/app/features/chat-focus/chat-focus.feature";
import { ChatMessageSplitsFeature } from "@/app/features/chat-message-splits/chat-message-splits.feature";
import { ChatProfileLinkFeature } from "@/app/features/chat-profile-link/chat-profile-link.feature";
import { ChatQuickReactFeature } from "@/app/features/chat-quick-react/chat-quick-react.feature";
import { ChatRecallFeature } from "@/app/features/chat-recall/chat-recall.feature";
import { ControlsCloudFeature } from "@/app/features/controls-cloud/controls-cloud.feature";
import { ControlsThemesFeature } from "@/app/features/controls-themes/controls-themes.feature";
import {
  CustomizerOutfitToggleFeature
} from "@/app/features/customizer-outfit-toggle/customizer-outfit-toggle.feature";
import {
  CustomizerPracticeJoinFeature
} from "@/app/features/customizer-practice-join/customizer-practice-join.feature";
import { DrawingColorPalettesFeature } from "@/app/features/drawing-color-palettes/drawing-color-palettes.feature";
import { DrawingColorToolsFeature } from "@/app/features/drawing-color-tools/drawing-color-tools.feature";
import { DrawingPressureFeature } from "@/app/features/drawing-pressure/drawing-pressure.feature";
import { DropsFeature } from "@/app/features/drops/drops.feature";
import { GuessCheckFeature } from "@/app/features/guess-check/guess-check.feature";
import { HotkeysFeature } from "@/app/features/hotkeys/hotkeys.feature";
import { ImageAgentFeature } from "@/app/features/image-agent/image-agent.feature";
import { LineToolFeature } from "@/app/features/line-tool/line-tool.feature";
import { LobbyStatusFeature } from "@/app/features/lobby-status/lobby-status.feature";
import { LobbyTimeVisualizerFeature } from "@/app/features/lobby-time-visualizer/lobby-time-visualizer.feature";
import { PanelCabinFeature } from "@/app/features/panel-cabin/panel-cabin.feature";
import { PanelChangelogFeature } from "@/app/features/panel-changelog/panel-changelog.feature";
import { PanelLobbiesFeature } from "@/app/features/panel-lobbies/panel-lobbies.feature";
import { PanelNewsFeature } from "@/app/features/panel-news/panel-news.feature";
import { PlayerIdsFeature } from "@/app/features/player-ids/player-ids.feature";
import { TooltipsFeature } from "@/app/features/tooltips/tooltips.feature";
import { UserInfoFeature } from "@/app/features/user-info/user-info.feature";
import { type componentData, type modalHandle, ModalService } from "@/app/services/modal/modal.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { firstValueFrom, Subject, Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { ChatPingFeature } from "../chat-ping/chat-ping.feature";
import { DrawingClearLockFeature } from "../drawing-clear-lock/drawing-clear-lock.feature";
import { LobbyStatisticsFeature } from "../lobby-statistics/lobby-statistics.feature";
import ControlsOnboarding from "./controls-onboarding.svelte";

export class ControlsOnboardingFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(FeaturesService) private readonly _featuresService!: FeaturesService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  public readonly name = "Get Started";
  public readonly description =
    "Quickly set up typo to your likes";
  public readonly tags = [
    FeatureTag.INTERFACE,
    FeatureTag.INFORMATION
  ];
  public readonly featureId = 47;

  private readonly _firstLoadSetting = new BooleanExtensionSetting("first_load", true, this);
  private readonly _finishOnboardingTask = this.useOnboardingTask({
    key: "finalize_onboarding",
    name: "Finish Onboarding",
    description: "Choose whether to disable 'Get Started'. This should be your last task! ;)",
    start: () => this.finalizeOnboarding(),
    priority: Number.MAX_SAFE_INTEGER
  });

  private readonly _viewInfoTask = this.useOnboardingTask({
    key: "info_opened",
    name: "Read about the new typo",
    description: "Open the 'more info' tab to read an intro and changes of the new typo.",
    start: async () => {
      this._tabFocusRequests$.next("extras");
      return false;
    },
    priority: 1
  });

  private readonly _featurePresets = {
    recommended: {
      mode: "blacklist",
      features: [
        PlayerIdsFeature,
        DrawingColorPalettesFeature,
        ImageAgentFeature,
        LobbyStatisticsFeature,
        DrawingClearLockFeature,
        ChatPingFeature
      ]
    },
    minimal: {
      mode: "whitelist",
      features: [
        ChatRecallFeature,
        GuessCheckFeature,
        LobbyStatusFeature,
        ControlsCloudFeature,
        ChatEmojisFeature,
        ChatProfileLinkFeature,
        HotkeysFeature,
        CanvasZoomFeature,
        LineToolFeature,
        ChatFocusFeature,
        PlayerIdsFeature,
        LobbyTimeVisualizerFeature,
        DrawingColorPalettesFeature,
        ChatQuickReactFeature,
        ChatCopyFormattedFeature,
        DrawingPressureFeature,
        ChatCommandsFeature,
        DropsFeature,
        ChatClearFeature,
        ChatMessageSplitsFeature,
        CustomizerPracticeJoinFeature,
        CustomizerOutfitToggleFeature,
        ControlsOnboardingFeature,
        TooltipsFeature
      ]
    },
    none: {
      mode: "whitelist",
      features: []
    },
    all: {
      mode: "blacklist",
      features: []
    },
    mobile: {
      mode: "whitelist",
      features: [
        LobbyStatusFeature,
        ChatEmojisFeature,
        ChatProfileLinkFeature,
        LobbyTimeVisualizerFeature,
        DrawingPressureFeature,
        ChatClearFeature,
        CustomizerPracticeJoinFeature,
        CustomizerOutfitToggleFeature,
        ControlsOnboardingFeature,
        TooltipsFeature,
        ControlsThemesFeature,
        UserInfoFeature,
        PanelLobbiesFeature,
        PanelCabinFeature,
        PanelNewsFeature,
        PanelChangelogFeature,
        DrawingColorToolsFeature,
        CanvasRateIconsFeature
      ]
    }
  };

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _currentModal?: modalHandle;
  private _taskCompletedSubscription?: Subscription;
  private _tabFocusRequests$ = new Subject<"presets" | "tasks" | "extras" | undefined>();

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    /* create icon and attach to controls */
    this._iconComponent = new IconButton({
      target: elements.controls,
      props: {
        hoverMove: false,
        size: "48px",
        icon: "file-img-tasks-gif",
        name: "Get Started",
        order: 4,
        tooltipAction: this.createTooltip
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      this.showOnboarding();
    });

    const firstLoad = await this._firstLoadSetting.getValue();
    if(firstLoad){
      this.showOnboarding(true);
      await this._firstLoadSetting.setValue(false);
    }

    this._taskCompletedSubscription = this._onboardingService.taskCompleted$.subscribe(task => {
      this._toastService.showToast("🎉 Congrats!", `You have completed the onboarding task "${task.name}"!`);
    });
  }

  protected override async onDestroy(): Promise<void> {
    this._iconComponent?.$destroy();
    this._iconClickSubscription?.unsubscribe();
    this._iconClickSubscription = undefined;
    this._taskCompletedSubscription?.unsubscribe();
    this._taskCompletedSubscription = undefined;
  }

  public get tabFocusRequestsStore(){
    return fromObservable(this._tabFocusRequests$, undefined);
  }

  private showOnboarding(firstLoad = false) {
    this._currentModal?.close();

    const onboardingComponent: componentData<ControlsOnboarding> = {
      componentType: ControlsOnboarding,
      props: {
        feature: this,
        firstLoad
      },
    };
    this._currentModal = this._modalService.showModal(onboardingComponent.componentType, onboardingComponent.props, firstLoad ? "" : "Get Started");
  }

  public async activateFeaturePreset(preset: keyof typeof ControlsOnboardingFeature.prototype._featurePresets) {
    this._logger.debug("Activating preset", preset);

    const toast = await this._toastService.showLoadingToast("Activating preset...");

    const presetData = this._featurePresets[preset];
    const availableFeatures = this._featuresService.features;
    const presetFeatures = presetData.mode === "blacklist"
      ? availableFeatures.filter(f => !f.toggleEnabled || !presetData.features.some(disabled => f instanceof disabled))
      : availableFeatures.filter(f => !f.toggleEnabled || presetData.features.some(disabled => f instanceof disabled));

    const toggles = availableFeatures.map(async feature => {
      const enabled = await firstValueFrom(feature.activated$);
      const presetEnabled = presetFeatures.includes(feature);
      if(enabled && !presetEnabled) {
        await feature.destroy();
      }
      if(!enabled && presetEnabled) {
        await feature.activate();
      }
    });

    try {
      await Promise.all(toggles);
      toast.resolve("Preset activated");
    }
    catch(e) {
      this._logger.error("Failed to activate preset", e);
      toast.reject("Failed to activate preset");
      return;
    }
  }

  public async getChecklist(){
    return this._onboardingService.getOnboardingTasks();
  }

  public closeOnboardingIfOpen(){
    this._currentModal?.close();
  }

  public async finalizeOnboarding() {
    const task = await this._finishOnboardingTask;
    const tasks = await this._onboardingService.getOnboardingTasks();
    const allOtherCompleted = tasks.every(t => t.completed || t.key === task.task.key);

    const title = allOtherCompleted ? "✨ You have completed all onboarding tasks!" : "Not all tasks completed yet!";
    const description = allOtherCompleted ?
      "Do you want to remove the onboarding icon?\nYou can always enable it again in the settings to read guides or select presets." :
      "You have not completed all onboarding tasks yet.\nDo you still want to disable onboarding?\nYou can always enable it again in the settings to read guides or select presets.";
    const confirm = await this._toastService.showConfirmToast(title, description, 30000, {confirm: "Disable onboarding", cancel: "Keep enabled"});
    const result = await confirm.result;

    if(allOtherCompleted){
      task.complete();
    }
    if(result) {
      this.destroy();
    }

    return false;
  }

  public async completeInfoTask(){
    (await this._viewInfoTask).complete();
  }
}