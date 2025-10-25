import { ExtensionCommand } from "@/app/core/commands/command";
import { NumericOptionalCommandParameter } from "@/app/core/commands/params/numeric-optional-command-parameter";
import { StringOptionalCommandParameter } from "@/app/core/commands/params/string-optional-command-parameter";
import { InterpretableError } from "@/app/core/commands/results/interpretable-error";
import { InterpretableSilentSuccess } from "@/app/core/commands/results/interpretable-silent-success";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { HotkeyAction } from "@/app/core/hotkeys/hotkey";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { WordGuessedEventListener } from "@/app/events/word-guessed.event";
import {
  type lobbyAvailableInteractions,
  LobbyInteractionsService,
} from "@/app/services/lobby-interactions/lobby-interactions.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import type { componentData } from "@/app/services/modal/modal.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { createElement } from "@/util/document/appendElement";
import type { skribblPlayer } from "@/util/skribbl/lobby";
import { fromObservable } from "@/util/store/fromObservable";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import { filter, firstValueFrom, map, type Subscription, withLatestFrom } from "rxjs";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import QuickReact from "./quick-react.svelte";

export class ChatQuickReactFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(LobbyInteractionsService) private readonly _lobbyInteractionsService!: LobbyInteractionsService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(WordGuessedEventListener) private readonly _wordGuessedListener!: WordGuessedEventListener;

  public readonly name = "Quick React";
  public readonly description =
    "Adds accessibility to kick, like, and dislike via keyboard by pressing CTRL in the chat box.";
  public readonly tags = [
    FeatureTag.GAMEPLAY
  ];
  public readonly featureId = 33;

  private readonly _likeCommand = this.useCommand(
    new ExtensionCommand("like", this, "Like", "Like the current drawing"),
  ).run(async command => {
    await this.likeCurrentPlayer();
    return new InterpretableSilentSuccess(command);
  });

  private readonly _dislikeCommand = this.useCommand(
    new ExtensionCommand("dislike", this, "Dislike", "Dislike the current drawing"),
  ).run(async command => {
    await this.dislikeCurrentPlayer();
    return new InterpretableSilentSuccess(command);
  });

  private readonly _kickCommand = this.useCommand(
    new ExtensionCommand("kick", this, "Votekick by ID", "Kick the current (default) or another player by ID"),
  ).withParameters(params => params
    .addParam(new NumericOptionalCommandParameter("Player ID", "The ID of the player to votekick, leave empty for current drawer", id => ({ id })))
    .run(async (args, command) => {
      const lobby = await firstValueFrom(this._lobbyService.lobby$);

      /* set player id to current drawer to default */
      if(args.id === undefined) args.id = lobby?.drawerId ?? undefined;

      /* check if current player is self */
      if(args.id !== undefined && args.id === lobby?.meId) {
        return new InterpretableError(command, "You can't votekick yourself :(");
      }

      /* find player by id */
      const target = lobby?.players.find(player => player.id === args.id);
      if(target === undefined && args.id !== undefined) return new InterpretableError(command, "Selected player not found");
      else if (target === undefined) return new InterpretableError(command, "No default player to votekick");

      await this.votekickPlayer(target);
      return new InterpretableSilentSuccess(command);
    })
  );

  private readonly _kickByNameCommand = this.useCommand(
    new ExtensionCommand("kick", this, "Votekick by name", "Kick the current (default) or another player by name"),
  ).withParameters(params => params
    .addParam(new StringOptionalCommandParameter("Player Name", "The name of the player to votekick", name => ({ name })))
    .run(async (args, command) => {
      const lobby = await firstValueFrom(this._lobbyService.lobby$);

      /* find player by name, or default current drawer */
      const target = args.name === undefined ? lobby?.players.find(p => p.id === lobby?.drawerId) : lobby?.players.find(player => player.name.toLowerCase() === args.name?.toLowerCase());
      if(target === undefined && args.name !== undefined) return new InterpretableError(command, "Selected player not found");
      else if (target === undefined) return new InterpretableError(command, "No default player to votekick");

      /* check if current player is self */
      if(target.id === lobby?.meId) {
        return new InterpretableError(command, "You can't votekick yourself :(");
      }

      await this.votekickPlayer(target);
      return new InterpretableSilentSuccess(command);
    })
  );

  private readonly _openQuickReactHotkey = this.useHotkey(
    new HotkeyAction(
      "open_quickreact",
      "Quick React",
      "Open the quick react menu",
      this,
      () => { return void 0;},
      true,
      ["ControlRight"],
      () => {
        this.toggleQuickReactMenu();
      },
      false
    ),
  );

  private readonly _instantLikeHotkey = this.useHotkey(
    new HotkeyAction(
      "instant_like",
      "Like Current Drawing",
      "Instantly likes the current drawing, without quick react menu access",
      this,
      () => this.likeCurrentPlayer(),
      false,
      ["ControlRight", "ArrowUp"],
    ),
  );

  private readonly _instantDislikeHotkey = this.useHotkey(
    new HotkeyAction(
      "instant_dislike",
      "Dislike Current Drawing",
      "Dislikes the current drawing, without quick react menu access",
      this,
      () => this.dislikeCurrentPlayer(),
      false,
      ["ControlRight", "ArrowDown"],
    ),
  );

  private readonly _instantVotekickHotkey = this.useHotkey(
    new HotkeyAction(
      "instant_votekick",
      "Votekick Current Drawer",
      "Votes to kick the current drawer, without quick react menu access",
      this,
      () => this.votekickPlayer(undefined),
      false,
      ["ControlRight", "ArrowLeft"],
    ),
  );

  private readonly _muteActionToastsSetting = this.useSetting(
    new BooleanExtensionSetting("mute_action_toasts", false, this)
      .withName("Mute Info Toasts")
      .withDescription("Mute the info toasts when liking/disliking/votekicking a player")
  );

  private readonly _likeAfterGuessSetting = this.useSetting(
    new BooleanExtensionSetting("like_after_guess", false, this)
      .withName("Like Drawing After Guess")
      .withDescription("Automatically likes the drawing after you have guessed the word")
  );

  private _subscription?: Subscription;
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;
  private _rateInteractionsStyle = createElement("<style>.typo-hide-rate-interactions { display: none !important }</style>");
  private _interactionUpdateSubscription?: Subscription;
  private _autoLikeSubscription?: Subscription;
  private _guessedSubscription?: Subscription;

  protected override async onActivate() {
    document.body.appendChild(this._rateInteractionsStyle);

    const elements = await this._elements.complete();
    this._interactionUpdateSubscription = this._lobbyInteractionsService.availableInteractions$.subscribe(interactions => {
      elements.gameRate.classList.toggle("typo-hide-rate-interactions", interactions?.rateAvailable !== true);
    });

    this._autoLikeSubscription = this._wordGuessedListener.events$.pipe(
      filter(event => event.data.word !== undefined), /* word is only set if own guess */
      withLatestFrom(this._likeAfterGuessSetting.changes$),
      filter(([, likeAfterGuess]) => likeAfterGuess === true),
      withLatestFrom(this._lobbyInteractionsService.availableInteractions$),
      filter(([[,], interactions]) => interactions?.rateAvailable === true),
    ).subscribe(() => {
      this._lobbyInteractionsService.likePlayer();
      this.hideGameRate();
    });
  }

  protected override async onDestroy() {
    this._subscription?.unsubscribe();
    this._subscription = undefined;

    this._flyoutSubscription?.unsubscribe();
    this._flyoutComponent?.$destroy();
    this._flyoutComponent = undefined;
    this._flyoutSubscription = undefined;

    this._interactionUpdateSubscription?.unsubscribe();
    this._interactionUpdateSubscription = undefined;
    this._rateInteractionsStyle.remove();

    this._guessedSubscription?.unsubscribe();
    this._guessedSubscription = undefined;

    this._autoLikeSubscription?.unsubscribe();
    this._autoLikeSubscription = undefined;
  }

  private async hideGameRate(){
    const elements = await this._elements.complete();
    elements.gameRate.style.display = "none";
  }

  async toggleQuickReactMenu() {
    if (this._flyoutComponent) {
      this._flyoutComponent.close();
    } else {
      const elements = await this._elements.complete();

      const flyoutContent: componentData<QuickReact> = {
        componentType: QuickReact,
        props: {
          feature: this,
        },
      };

      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          maxWidth: "300px",
          marginY: "2.5rem",
          title: "Quick React",
          closeStrategy: "implicit",
        },
      });

      this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(async () => {
        this._logger.debug("Destroyed menu");
        this._flyoutComponent?.$destroy();
        this._flyoutComponent = undefined;
        this._flyoutSubscription?.unsubscribe();
        this._flyoutSubscription = undefined;

        elements.chatInput.focus();
      });
    }
  }

  public get availableInteractionsStore() {
    return fromObservable(this._lobbyInteractionsService.availableInteractions$, undefined);
  }

  public async getCurrentInteractionPlayer(matchesAvailable?: (available: lobbyAvailableInteractions) => boolean): Promise<skribblPlayer | undefined> {
    return firstValueFrom(this._lobbyInteractionsService.availableInteractions$.pipe(map((interactions) => {
      if(interactions === undefined || matchesAvailable && !matchesAvailable(interactions)) {
        throw new Error("Interaction is not available");
      }
      return interactions.interactionTarget;
    })));
  }

  public async likeCurrentPlayer() {
    const muteToasts = await this._muteActionToastsSetting.getValue();
    const toast = muteToasts ? undefined : await this._toastService.showLoadingToast("Liking current player");
    let player: skribblPlayer;

    try {
      const availablePlayer = await this.getCurrentInteractionPlayer(interactions => interactions.rateAvailable);
      if(availablePlayer === undefined) throw new Error("No player available to rate");
      player = availablePlayer;
    }
    catch(e) {
      toast?.reject((e as Error).message);
      return;
    }

    await this._lobbyInteractionsService.likePlayer();
    await this.hideGameRate();
    toast?.resolve(`Liked the drawing of ${player.name}`);
  }

  public async dislikeCurrentPlayer() {
    const muteToasts = await this._muteActionToastsSetting.getValue();
    const toast = muteToasts ? undefined : await this._toastService.showLoadingToast("Disliking current player");
    let player: skribblPlayer;

    try {
      const availablePlayer = await this.getCurrentInteractionPlayer(interactions => interactions.rateAvailable);
      if(availablePlayer === undefined) throw new Error("No player available to rate");
      player = availablePlayer;
    }
    catch(e) {
      toast?.reject((e as Error).message);
      return;
    }

    await this._lobbyInteractionsService.dislikePlayer();
    await this.hideGameRate();
    toast?.resolve(`Disliked the drawing of ${player.name}`);
  }

  public async votekickPlayer(player: skribblPlayer | undefined) {
    const muteToasts = await this._muteActionToastsSetting.getValue();
    const toast = muteToasts ? undefined : await this._toastService.showLoadingToast(`Voting to kick ${player === undefined ? "current player" : player.name}`);

    try {
      const targetPlayer = await this.getCurrentInteractionPlayer(interactions => interactions.votekickAvailable);
      if(player === undefined) {
        if(targetPlayer === undefined) throw new Error("No default player available to votekick");
        player = targetPlayer;
      }
    }
    catch(e) {
      toast?.reject((e as Error).message);
      return;
    }

    await this._lobbyInteractionsService.votekickPlayer(player.id);
    toast?.resolve(`Voted to kick ${player.name}`);
  }
}