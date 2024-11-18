import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import type { componentData } from "@/content/services/modal/modal.service";
import { filter, type Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import ChatFocusInfo from "./chat-focus-info.svelte";
import ChatFocusSettings from "./chat-focus-settings.svelte";

export class ChatFocusFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly elementsSetup!: ElementsSetup;
  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;

  public readonly name = "Chat Focus";
  public readonly description = "Quickly focus the chat input with a hotkey or when someone starts drawing";
  public readonly featureId = 28;

  public override get featureInfoComponent(): componentData<ChatFocusInfo>{
    return { componentType: ChatFocusInfo, props: {}};
  }

  public override get featureSettingsComponent(): componentData<ChatFocusSettings>{
    return { componentType: ChatFocusSettings, props: { feature: this }};
  }

  private readonly _chatFocusHotkey = this.useHotkey(new HotkeyAction(
    "chat_focus",
    "Chat Focus",
    "Focus the chat input",
    this,
    async () => (await this.elementsSetup.complete()).chatInput.focus(),
    true,
    ["Tab"],
  ));

  private _autoFocusChatInputSetting = new ExtensionSetting<boolean>("auto_focus_chat_input", true, this)
    .withName("Auto Focus Chat Input")
    .withDescription("Automatically focus the chat input when someone else starts drawing");

  private _autoFocusSubscription?: Subscription;


  protected override async onActivate() {
    this._autoFocusSubscription = this._lobbyStateChangedEventListener.events$.pipe(
      filter(event => event.data.drawingStarted !== undefined && event.data.drawingStarted.word === undefined),
      withLatestFrom(this._autoFocusChatInputSetting.changes$, this.elementsSetup.complete()),
      filter(([, enabled]) => enabled)
    ).subscribe(([, ,elements]) => elements.chatInput.focus());
  }

  protected override async onDestroy() {
    this._autoFocusSubscription?.unsubscribe();
    this._autoFocusSubscription = undefined;
  }

  public get chatAutoFocusStore() {
    return this._autoFocusChatInputSetting.store;
  }
}