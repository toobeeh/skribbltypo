import { ExtensionContainer } from "@/content/core/extension-container/extension-container";
import { FeatureTag } from "@/content/core/feature/feature-tags";
import { ExtensionSetting } from "@/content/core/settings/setting";
import type { TypoChallenge } from "@/content/features/toolbar-challenges/challenge";
import { BlindGuessChallenge } from "@/content/features/toolbar-challenges/challenges/blind-guess-challenge";
import { DeafGuessChallenge } from "@/content/features/toolbar-challenges/challenges/deaf-guess-challenge";
import { DontClearChallenge } from "@/content/features/toolbar-challenges/challenges/dont-clear-challenge";
import { DrunkVisionChallenge } from "@/content/features/toolbar-challenges/challenges/drunk-vision-challenge";
import { MonochromeChallenge } from "@/content/features/toolbar-challenges/challenges/monochrome-challenge";
import { OneShotChallenge } from "@/content/features/toolbar-challenges/challenges/one-shot-challenge";
import type { componentData } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import type { Type } from "@/util/types/type";
import { inject } from "inversify";
import { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarPost from "./toolbar-challenges.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";

export class ToolbarChallengesFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ExtensionContainer) private readonly _container!: ExtensionContainer;

  public readonly name = "Challenges";
  public readonly description =
    "Adds the option to enable game modifications to make the game more challenging";
  public readonly tags = [
    FeatureTag.GAMEPLAY
  ];
  public readonly featureId = 8;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _challengeStatesSubscription?: Subscription;

  private readonly _challengeStates = new Map<
    number,
    {
      challenge: TypoChallenge<unknown>;
      destroy?: VoidFunction;
    }
  >();

  private readonly _activatedChallenges = new ExtensionSetting<number[]>("activated_challenges", [], this);
  private readonly _challenges: { challenge: Type<TypoChallenge<unknown>>; id: number }[] = [
    { challenge: BlindGuessChallenge, id: 1 },
    { challenge: DrunkVisionChallenge, id: 2 },
    { challenge: DeafGuessChallenge, id: 3 },
    { challenge: OneShotChallenge, id: 4 },
    { challenge: DontClearChallenge, id: 5 },
    { challenge: MonochromeChallenge, id: 6 },
  ];

  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    /* create challenges */
    for (const challenge of this._challenges) {
      const instance = await this.resolveChallenge(challenge.challenge);
      this._challengeStates.set(challenge.id, { challenge: instance });
    }

    /* subscribe to states */
    this._challengeStatesSubscription = this.listenChallengeStates();

    /* create icon and attach to toolbar */
    this._iconComponent = new IconButton({
      target: elements.toolbar,
      props: {
        icon: "file-img-challenge-gif",
        name: "Challenges",
        order: 4,
        tooltipAction: this.createTooltip,
        lockTooltip: "Y",
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      /* if already opened, return */
      if (this._flyoutComponent) {
        return;
      }

      /* create fly out content */
      const flyoutContent: componentData<ToolbarPost> = {
        componentType: ToolbarPost,
        props: {
          feature: this,
        },
      };

      /* open flyout and destroy when clicked out */
      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          maxWidth: "300px",
          title: "Challenges",
          iconName: "file-img-nochallenge-gif",
        },
      });
      this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(() => {
        this._logger.info("Destroyed flyout");
        this._flyoutComponent?.$destroy();
        this._flyoutSubscription?.unsubscribe();
        this._flyoutComponent = undefined;
      });
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
    this._flyoutSubscription = undefined;
    this._challengeStates.clear();
    this._challengeStatesSubscription?.unsubscribe();
    this._challengeStatesSubscription = undefined;
  }

  public get activatedChallengesSettingStore(){
    return this._activatedChallenges.store;
  }

  public get challenges(){
    const cs = [...this._challengeStates.entries().map(([id, {challenge}]) => ({id, challenge}))];
    this._logger.debug(cs);
    return cs;
  }

  /**
   * Listen to active challenges and destroy/activate them accordingly
   * @private
   */
  private listenChallengeStates(): Subscription {
    return this._activatedChallenges.changes$.subscribe(async ids => {

      /* activate challenges that are not yet activated */
      ids.forEach(id => {
        const challenge = this._challengeStates.get(id);
        if(!challenge) {
          this._logger.warn(`Challenge with id ${id} not resolved`);
          return;
        }

        if(!challenge.destroy) {
          this._logger.debug(`Activating challenge ${challenge.challenge.name}`);
          challenge.destroy = this.activateChallenge(challenge.challenge);
        }
      });

      /* destroy challenges that are not anymore active */
      this._challengeStates.forEach((state, id) => {
        if(!ids.includes(id) && state.destroy) {
          this._logger.debug(`Deactivating challenge ${state.challenge.name}`);
          state.destroy();
          state.destroy = undefined;
        }
      });

      /* update icon */
      this._iconComponent?.$set({icon: ids.length > 0 ? "file-img-challenge-gif" : "file-img-nochallenge-gif"});
    });
  }

  /**
   * Get an instance for a challenge type, resolves DI without being registered
   * @param challenge
   * @private
   */
  private async resolveChallenge<TTrigger>(challenge: Type<TypoChallenge<TTrigger>>) {
    const instance = this._container.resolveService(challenge);
    this._logger.debug(`Resolved challenge: ${instance.name}`);

    return instance;
  }

  /**
   * Activate a challenge and return a function to destroy it
   * @param challenge
   * @private
   */
  private activateChallenge(challenge: TypoChallenge<unknown>): VoidFunction {
    this._logger.debug(`Activating challenge ${challenge.name}`);

    /* setup challenge */
    const triggerSubject = challenge.createTriggerObservable();
    const subscription = triggerSubject.subscribe(async (trigger) => {
      this._logger.debug(`Challenge trigger: ${trigger}`);
      try {
        await challenge.apply(trigger);
      } catch (error) {
        this._logger.error(`Error applying challenge: ${error}`);
      }
    });

    /* function to destroy challenge */
    return () => {
      this._logger.debug(`Destroying challenge ${challenge.name}`);
      subscription.unsubscribe();

      try {
        challenge.destroy();
      } catch (error) {
        this._logger.error(`Error destroying challenge: ${error}`);
      }
    };
  }
}