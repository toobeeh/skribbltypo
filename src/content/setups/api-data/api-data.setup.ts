import { AnnouncementsApi, EmojisApi, ScenesApi, SpritesApi, ThemesApi } from "@/api";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ApiService } from "@/content/services/api/api.service";
import { ToastService } from "@/content/services/toast/toast.service";
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
  @inject(ToastService) private _toastService!: ToastService;
  @inject(loggerFactory) private _loggerFactory!: loggerFactory;

  protected async runSetup(): Promise<apiData> {
    const logger = this._loggerFactory(this);

    const promise = promiseAllObject(getData(
      this._apiService.getApi(SpritesApi),
      this._apiService.getApi(ScenesApi),
      this._apiService.getApi(EmojisApi),
      this._apiService.getApi(AnnouncementsApi),
      this._apiService.getApi(ThemesApi)
    ));

    promise.catch((e) => {
      this._toastService.showToast("Fatal error", "Failed to fetch data from the typo servers. \nPlease ask for support on the typo discord server.");
      logger.error("Failed to fetch data from the typo servers", e);
    });

    return promise;
  }
}