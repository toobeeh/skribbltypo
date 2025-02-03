import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { MemberService } from "@/content/services/member/member.service";
import { SkribblLandingPlayer } from "@/content/services/players/skribblLandingPlayer";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject } from "inversify";
import {
  combineLatestWith,
  map,
  type Observable,
} from "rxjs";
import { Setup } from "../../core/setup/setup";

export class LandingPlayerSetup extends Setup<Observable<SkribblLandingPlayer | undefined>> {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(GlobalSettingsService) private readonly _globalSettingsService!: GlobalSettingsService;
  @inject(MemberService) private readonly _memberService!: MemberService;

  protected async runSetup(): Promise<Observable<SkribblLandingPlayer | undefined>> {
    const elements = await this._elementsSetup.complete();

    return this._memberService.member$.pipe(
      map((member) => {
        if(member === undefined || member === null || elements === undefined) return undefined;
        return new SkribblLandingPlayer(Number(member.userLogin), elements.landingCustomizeContainer, elements.landingAvatar);
      }),
      combineLatestWith(this._globalSettingsService.settings.showLandingOutfit.changes$),
      map(([player, showLandingOutfit]) => showLandingOutfit ? player : undefined),
    );
  }
}