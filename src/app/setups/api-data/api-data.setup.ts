import { AnnouncementsApi, AwardsApi, EmojisApi, EventsApi, ScenesApi, SpritesApi, ThemesApi } from "@/api";
import { loggerFactory } from "@/app/core/logger/loggerFactory.interface";
import { ApiService } from "@/app/services/api/api.service";
import { ToastService } from "@/app/services/toast/toast.service";
import { promiseAllObject } from "@/util/promiseAllObject";
import { Setup } from "../../core/setup/setup";
import { inject } from "inversify";

/**
 * Function to make dynamic return type
 */
function getData(
  spritesApi: SpritesApi,
  scenesApi: ScenesApi,
  eventsApi: EventsApi,
  emojisApi: EmojisApi,
  announcementsApi: AnnouncementsApi,
  themesApi: ThemesApi,
  awardsApi: AwardsApi
) {
  return {
    sprites: spritesApi.getAllSprites(),
    scenes: scenesApi.getAllScenes(),
    emojis: emojisApi.getAllEmojisCached({ limit: 100000, animated: true, statics: true }),
    announcements: announcementsApi.getAnnouncements(),
    themes: themesApi.getAllThemes(),
    drops: eventsApi.getAllEventDrops(),
    awards: awardsApi.getAllAwards()
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
      this._apiService.getApi(EventsApi),
      this._apiService.getApi(EmojisApi),
      this._apiService.getApi(AnnouncementsApi),
      this._apiService.getApi(ThemesApi),
      this._apiService.getApi(AwardsApi)
    ));

    promise.catch((e) => {
      this._toastService.showToast("Fatal error", "Failed to fetch data from the typo servers. \nPlease ask for support on the typo discord server.");
      logger.error("Failed to fetch data from the typo servers", e);
    });

    return promise;
  }
}