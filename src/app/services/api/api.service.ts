import { TokenService } from "@/app/core/token/token.service";
import { inject, injectable } from "inversify";
import { BaseAPI, Configuration } from "../../../api";
import type { Type } from "../../../util/types/type";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

@injectable()
export class ApiService {

  private readonly _logger;

  private _baseUrl = "https://api.typo.rip";
  private _token = "";
  private instances = new Map<Type<BaseAPI>, BaseAPI>();

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(TokenService) tokenService: TokenService
  ) {
    this._logger = loggerFactory(this);
    tokenService.token.subscribe(token => this._token = token ?? "");
  }

  /**
   * creates a new api config based on set options
   * @private
   */
  private createApiConfig() {
    return new Configuration({
      basePath: this._baseUrl,
      accessToken: () => this._token
    });
  }

  /**
   * create a new api client of given type
   * @param apiClass
   * @returns
   */
  getApi<TApi extends BaseAPI>(apiClass: Type<TApi>): TApi {
    let instance = this.instances.get(apiClass) as TApi | undefined;
    if(instance === undefined){
      instance = new apiClass(this.createApiConfig());
      this.instances.set(apiClass, instance);
    }
    return instance;
  }

  /**
   * Set the base url which will be used for api calls
   * @param url
   */
  public set baseUrl(url: string) {
    this._baseUrl = url;
  }
}