import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { MemberService } from "@/content/services/member/member.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import type { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";

export class CustomizerOutfitToggleFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(GlobalSettingsService) private readonly _globalSettingsService!: GlobalSettingsService;
  @inject(MemberService) private readonly _memberService!: MemberService;

  public readonly name = "Outfit Toggle";
  public readonly description = "Add a toggle to the customizer to show or hide your typo outfit";
  public readonly featureId = 45;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _memberSubscription?: Subscription;

  protected override async onActivate() {
    this._memberSubscription = this._memberService.member$.subscribe(async (member) => {
      await this.setIconEnabled(member !== undefined && member !== null);
    });
  }

  protected override async onDestroy() {
    await this.setIconEnabled(false);
    this._memberSubscription?.unsubscribe();
    this._memberSubscription = undefined;
  }

  private async setIconEnabled(enabled: boolean) {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._iconComponent = undefined;
    this._iconClickSubscription = undefined;

    if(enabled) {

      const elements = await this._elementsSetup.complete();

      /* create icon and attach */
      this._iconComponent = new IconButton({
        target: elements.customizerActions,
        props: {
          hoverMove: false,
          greyscaleInactive: true,
          size: "30px",
          icon: "file-img-mask-gif",
          name: "Toggle Outfit",
          order: 2,
          tooltipAction: this.createTooltip,
          lockTooltip: "Y"
        },
      });

      /* listen for click on icon */
      this._iconClickSubscription = this._iconComponent.click$.subscribe(async () => {
        const outfitEnabled = await this._globalSettingsService.settings.showLandingOutfit.getValue();
        await this._globalSettingsService.settings.showLandingOutfit.setValue(!outfitEnabled);
      });
    }
  }
}