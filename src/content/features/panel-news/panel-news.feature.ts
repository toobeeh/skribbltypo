import { AnnouncementDtoTypeEnum } from "@/api";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import PanelNews from "./panel-news.svelte";
import { ElementsSetup } from "../../setups/elements/elements.setup";

export class PanelNewsFeature extends TypoFeature {

  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;

  private _component?: PanelNews;

  public readonly name = "Typo News";
  public readonly description = "Displays updates and typo hints on the start page";
  public readonly featureId = 7;

  protected override async onActivate() {
    const elements = await this._elements.complete();
    const data = await this._apiDataSetup.complete();
    const version = chrome.runtime.getManifest().version;
    const announcements = data.announcements
      .filter(announcement => announcement.type === AnnouncementDtoTypeEnum.Announcement &&
        (announcement.affectedTypoVersion === version || announcement.affectedTypoVersion === undefined)
      ).sort((a, b) => Number(b.date) - Number(a.date));
    this._component = new PanelNews({
      target: elements.newsTab,
      props: {
        feature: this,
        announcements
      }
    });
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
  }

  public readonly news = "Hello there ❤️✏️\n" +
    "This is the new typo, holy shit!\n" +
    "Typescript, Svelte, dependency injection and a crazy architecture - i dont have to be ashamed of myself anymore :)";
}