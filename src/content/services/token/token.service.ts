import { inject, injectable } from "inversify";
import { BehaviorSubject } from "rxjs";
import { ApiService } from "../api/api.service";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

@injectable()
export class TokenService {

  private readonly _logger;
  private readonly _token = new BehaviorSubject<string | null | undefined>(undefined);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(ApiService) private readonly _apiService: ApiService
  ) {
    this._logger = loggerFactory(this);
    this.initToken();
  }

  private async initToken() {
    const token = await chrome.runtime.sendMessage({ type: "get token" });
    this._logger.info("Authenticated", token);
    this._apiService.accessToken = token ?? "";
    this._token.next(token);
  }

  /**
   * Observable which emits the current token.
   */
  public get token() {
    return this._token.asObservable();
  }

  public async removeToken(){
    await chrome.runtime.sendMessage({ type: "set token", token: null });
    this._token.next(null);
  }
}