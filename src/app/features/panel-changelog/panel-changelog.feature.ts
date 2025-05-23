import { type AnnouncementDto, AnnouncementDtoTypeEnum } from "@/api";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting, ExtensionSetting } from "@/app/core/settings/setting";
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

  private readonly _firstLoadSetting = new BooleanExtensionSetting("first_load", true, this);
  private _lastReadVersionSetting = new ExtensionSetting<string>("last_read_version", "0.0.0", this);

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

    const lastChange = changes[0];
    const currentVersion = typoRuntime.getReleaseDetails().version;
    const isFirstLoad = await this._firstLoadSetting.getValue();

    /* don't open on first load */
    if(isFirstLoad){
      await this._firstLoadSetting.setValue(false);
    }
    else if(lastChange?.affectedTypoVersion === currentVersion){
      const lastReadVersion = await this._lastReadVersionSetting.getValue();if(lastReadVersion != currentVersion){
        this.showDetailsModal(lastChange);
        await this._lastReadVersionSetting.setValue(currentVersion);
      }
    }
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }

  public get devmodeStore() {
    return this._globalSettingsService.settings.devMode.store;
  }

  public versionIsBiggerThan(version: string){
    const v1 = version.split(".").map(Number);
    const v2 = typoRuntime.getReleaseDetails().version.split(".").map(Number);

    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const a = v1[i] || 0;
      const b = v2[i] || 0;
      if (a > b) return true;
      if (a < b) return false;
    }
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