import { SpritesApi } from "@/api";
import { ApiService } from "@/content/services/api/api.service";
import { MemberService } from "@/content/services/member/member.service";
import { promiseAllObject } from "@/util/promiseAllObject";
import { Setup } from "../../core/setup/setup";
import { inject } from "inversify";

/**
 * Function to make dynamic return type
 */
function getData(spritesApi: SpritesApi){
  return {
    sprites: spritesApi.getAllSprites()
  };
}
export type apiData = ReturnType<typeof promiseAllObject<ReturnType<typeof getData>>>;

export class ApiDataSetup extends Setup<apiData> {
  @inject(MemberService) private _memberService!: MemberService;
  @inject(ApiService) private _apiService!: ApiService;

  protected async runSetup(): Promise<apiData> {
    return promiseAllObject(getData(this._apiService.getApi(SpritesApi)));
  }
}