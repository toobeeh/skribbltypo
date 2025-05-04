import { type AnnouncementDto, AnnouncementDtoTypeEnum } from "@/api";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { GlobalSettingsService } from "@/app/services/global-settings/global-settings.service";
import { type componentData, ModalService } from "@/app/services/modal/modal.service";
import { ApiDataSetup } from "@/app/setups/api-data/api-data.setup";
import { typoRuntime } from "@/runtime/runtime";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelChangelog from "./panel-changelog.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import PanelChangelogDetails from "./panel-changelog-details.svelte";

export class PanelChangelogFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(GlobalSettingsService) private readonly _globalSettingsService!: GlobalSettingsService;
  @inject(ModalService) private readonly _modalService!: ModalService;

  private _component?: PanelChangelog;

  public readonly name = "Changelog";
  public readonly description = "Displays a list of changes since the last updates on the start page";
  public readonly tags = [
    FeatureTag.INFORMATION
  ];
  public readonly featureId = 4;

  protected override async onActivate() {
    const elements = await this._elements.complete();

    this._component = new PanelChangelog({
      target: elements.changelogTab,
      props: {
        feature: this,
      }
    });

    const data = await this._apiDataSetup.complete();
    const changes = data.announcements
      .filter(announcement => announcement.type === AnnouncementDtoTypeEnum.Changelog)
      .sort((a, b) => Number(b.date) - Number(a.date));
    this._component.$set({ changes });
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }

  public get devmodeStore() {
    return this._globalSettingsService.settings.devMode.store;
  }

  public getVersion(){
    return typoRuntime.getReleaseDetails().versionName;
  }

  public showDetailsModal(change: AnnouncementDto){
    if(change.details === undefined){
      this._logger.warn("Change does not have details");
      throw new Error("Change does not have details");
    }

    const modalComponent: componentData<PanelChangelogDetails> = {
      componentType: PanelChangelogDetails,
      props: {
        change
      },
    };

    this._modalService.showModal(modalComponent.componentType, modalComponent.props, change.title, "card");
  }

  public readonly changelog = "I am the changelog :)";
}