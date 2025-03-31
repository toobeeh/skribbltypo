import { inject, injectable } from "inversify";
import { BehaviorSubject } from "rxjs";
import { loggerFactory } from "../logger/loggerFactory.interface";
import { typoRuntime } from "../../../runtime/runtime";

@injectable()
export class TokenService {

  private readonly _logger;
  private readonly _token = new BehaviorSubject<string | null | undefined>(undefined);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
    this.initToken();
  }

  private async initToken() {
    const token = await typoRuntime.getToken();
    this._logger.info("Authenticated", token);
    this._token.next(token);
  }

  /**
   * Observable which emits the current token.
   */
  public get token() {
    return this._token.asObservable();
  }

  public async removeToken(){
    await typoRuntime.setToken(null);
    this._token.next(null);
  }
}