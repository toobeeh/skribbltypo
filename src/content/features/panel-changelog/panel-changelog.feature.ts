import { AnnouncementDtoTypeEnum } from "@/api";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelChangelog from "./panel-changelog.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class PanelChangelogFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;

  private _component?: PanelChangelog;

  public readonly name = "Changelog";
  public readonly description = "Displays a list of changes since the last updates on the start page";
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

  public readonly changelog = "I am the changelog :)";
}