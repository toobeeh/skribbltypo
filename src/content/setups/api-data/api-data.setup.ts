import { AnnouncementsApi, EmojisApi, ScenesApi, SpritesApi, ThemesApi } from "@/api";
import { ApiService } from "@/content/services/api/api.service";
import { promiseAllObject } from "@/util/promiseAllObject";
import { Setup } from "../../core/setup/setup";
import { inject } from "inversify";

/**
 * Function to make dynamic return type
 */
function getData(
  spritesApi: SpritesApi,
  scenesApi: ScenesApi,
  emojisApi: EmojisApi,
  announcementsApi: AnnouncementsApi,
  themesApi: ThemesApi
) {
  return {
    sprites: spritesApi.getAllSprites(),
    scenes: scenesApi.getAllScenes(),
    emojis: emojisApi.getAllEmojisCached({ limit: 100000, animated: true, statics: true }),
    announcements: announcementsApi.getAnnouncements(),
    themes: themesApi.getAllThemes()
  };
}
export type apiData = ReturnType<typeof promiseAllObject<ReturnType<typeof getData>>>;

/**
 * Setup to fetch common resources from the API
 */
export class ApiDataSetup extends Setup<apiData> {
  @inject(ApiService) private _apiService!: ApiService;

  protected async runSetup(): Promise<apiData> {
    return promiseAllObject(getData(
      this._apiService.getApi(SpritesApi),
      this._apiService.getApi(ScenesApi),
      this._apiService.getApi(EmojisApi),
      this._apiService.getApi(AnnouncementsApi),
      this._apiService.getApi(ThemesApi)
    ));
  }
}