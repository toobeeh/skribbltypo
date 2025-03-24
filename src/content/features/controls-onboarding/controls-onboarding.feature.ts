import { FeatureTag } from "@/content/core/feature/feature-tags";
import { FeaturesService } from "@/content/core/feature/features.service";
import { BooleanExtensionSetting } from "@/content/core/settings/setting";
import { CanvasZoomFeature } from "@/content/features/canvas-zoom/canvas-zoom.feature";
import { ChatClearFeature } from "@/content/features/chat-clear/chat-clear.feature";
import { ChatCommandsFeature } from "@/content/features/chat-commands/chat-commands.feature";
import { ChatCopyFormattedFeature } from "@/content/features/chat-copy-formatted/chat-copy-formatted.feature";
import { ChatEmojisFeature } from "@/content/features/chat-emojis/chat-emojis.feature";
import { ChatFocusFeature } from "@/content/features/chat-focus/chat-focus.feature";
import { ChatMessageSplitsFeature } from "@/content/features/chat-message-splits/chat-message-splits.feature";
import { ChatProfileLinkFeature } from "@/content/features/chat-profile-link/chat-profile-link.feature";
import { ChatQuickReactFeature } from "@/content/features/chat-quick-react/chat-quick-react.feature";
import { ChatRecallFeature } from "@/content/features/chat-recall/chat-recall.feature";
import { ControlsCloudFeature } from "@/content/features/controls-cloud/controls-cloud.feature";
import {
  CustomizerOutfitToggleFeature
} from "@/content/features/customizer-outfit-toggle/customizer-outfit-toggle.feature";
import {
  CustomizerPracticeJoinFeature
} from "@/content/features/customizer-practice-join/customizer-practice-join.feature";
import { DrawingColorPalettesFeature } from "@/content/features/drawing-color-palettes/drawing-color-palettes.feature";
import { DrawingPressureFeature } from "@/content/features/drawing-pressure/drawing-pressure.feature";
import { DropsFeature } from "@/content/features/drops/drops.feature";
import { GuessCheckFeature } from "@/content/features/guess-check/guess-check.feature";
import { HotkeysFeature } from "@/content/features/hotkeys/hotkeys.feature";
import { ImageAgentFeature } from "@/content/features/image-agent/image-agent.feature";
import { LineToolFeature } from "@/content/features/line-tool/line-tool.feature";
import { LobbyStatusFeature } from "@/content/features/lobby-status/lobby-status.feature";
import { LobbyTimeVisualizerFeature } from "@/content/features/lobby-time-visualizer/lobby-time-visualizer.feature";
import { PlayerIdsFeature } from "@/content/features/player-ids/player-ids.feature";
import { TooltipsFeature } from "@/content/features/tooltips/tooltips.feature";
import { type componentData, type modalHandle, ModalService } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import { firstValueFrom, Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
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
      await this._toastService.showToast("Scroll up and open the 'More Info' tab to complete the challenge!");
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
        ImageAgentFeature
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
      features: []
    }
  };

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _currentModal?: modalHandle;
  private _taskCompletedSubscription?: Subscription;

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