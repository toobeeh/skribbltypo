import { FeatureTag } from "@/app/core/feature/feature-tags";
import { TokenService } from "@/app/core/token/token.service";
import { GlobalSettingsService } from "@/app/services/global-settings/global-settings.service";
import type { componentData } from "@/app/services/modal/modal.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { fromObservable } from "@/util/store/fromObservable";
import { MemberService } from "../../services/member/member.service";
import UserInfo from "./user-info.svelte";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import UserInfoManage from "./user-info-management.svelte";

export class UserInfoFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(TokenService) private readonly _tokenService!: TokenService;
  @inject(GlobalSettingsService) private readonly _globalSettingsService!: GlobalSettingsService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  public override get featureManagementComponent(): componentData<UserInfoManage> {
    return { componentType: UserInfoManage, props: { feature: this } };
  }

  private _element?: UserInfo;

  public readonly name = "User Info";
  public readonly description = "Shows information about the logged-in user beneath the avatar selection";
  public readonly tags = [
    FeatureTag.INFORMATION,
    FeatureTag.PALANTIR
  ];
  public readonly featureId = 13;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    this._element = new UserInfo({
      target: elements.avatarPanel,
      anchor: elements.playButton,
      props: {
        feature: this
      },
    });
  }

  protected override onDestroy() {
    this._element?.$destroy();
  }

  get memberStore() {
    return fromObservable(this._memberService.member$, null);
  }

  get devmodeStore() {
    return this._globalSettingsService.settings.devMode.store;
  }

  public login(){
    this._memberService.login();
  }

  public logout() {
    this._memberService.logout();
  }

  public async setToken(token: string){
    await this._tokenService.setToken(token);
    await this._toastService.showToast("Token has been set.", "If the secret was valid, you are now logged in!");
  }
}