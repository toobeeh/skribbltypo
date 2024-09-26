import { fromObservable } from "../../../util/store/fromObservable";
import { MemberService } from "../../services/member/member.service";
import UserInfo from "./user-info.svelte";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class UserInfoFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(MemberService) private readonly _memberService!: MemberService;

  private _element?: UserInfo;

  public readonly name = "User info";
  public readonly description = "Show user information beneath the avatar selection";

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

  get memberStore() {
    return fromObservable(this._memberService.member, null);
  }

  public login(){
    this._memberService.login();
  }
  public logout() {
    this._memberService.logout();
  }
}