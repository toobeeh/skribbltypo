import { CloudApi, type CloudSearchDto } from "@/api";
import { ApiService } from "@/content/services/api/api.service";
import { MemberService } from "@/content/services/member/member.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import ControlsSettings from "./controls-cloud.svelte";

export class ControlsCloudFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ApiService) private readonly _apiService!: ApiService;

  public readonly name = "Typo Cloud";
  public readonly description =
    "Saves all images from your lobbies in a cloud and adds a gallery to browse them";
  public override readonly toggleEnabled = false;
  public readonly featureId = 16;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    /* create icon and attach to controls */
    this._iconComponent = new IconButton({
      target: elements.controls,
      props: {
        hoverMove: false,
        size: "48px",
        icon: "file-img-cloud-gif",
        name: "Typo Cloud",
        order: 2,
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      const settingsComponent: componentData<ControlsSettings> = {
        componentType: ControlsSettings,
        props: {
          feature: this,
        },
      };
      this._modalService.showModal(settingsComponent.componentType, settingsComponent.props, "Typo Cloud");
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
  }

  public get memberStore() {
    return fromObservable(this._memberService.member$, undefined);
  }

  public async getImages(search: CloudSearchDto, login: number){

    if(search.authorQuery === "") search.authorQuery = undefined;
    if(search.titleQuery === "") search.titleQuery = undefined;
    if(search.createdInPrivateLobbyQuery === false) search.createdInPrivateLobbyQuery = undefined;
    if(search.isOwnQuery === false) search.isOwnQuery = undefined;

    /*return new Promise(() => {console.log("hjkk");});*/

    return this._apiService.getApi(CloudApi).searchUserCloud({login, cloudSearchDto: search});
  }
}