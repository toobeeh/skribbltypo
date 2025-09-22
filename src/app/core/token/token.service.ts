import { OidcLogin } from "@/util/oidcLogin";
import { inject, injectable } from "inversify";
import { BehaviorSubject } from "rxjs";
import { loggerFactory } from "../logger/loggerFactory.interface";
import { typoRuntime } from "@/runtime/runtime";

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
    let token = await typoRuntime.getToken();

    // not logged in, start oauth exchange if code in url
    if(token === null){
      const oidc = new OidcLogin();
      if(oidc.hasRedirectCallback()){
        this._logger.error("Handling OIDC redirect callback");
        try {
          token = await oidc.exchangeAuthCode();
          await typoRuntime.setToken(token);
        }
        catch {
          oidc.clearUrlParams();
        }
      }
    }

    // if logged in and 64 chars, trade legacy token
    if(token && token.length === 64){
      this._logger.info("Exchanging legacy token for OIDC token");
      try {
        const oidc = new OidcLogin();
        token = await oidc.exchangeLegacyToken(token);
        await typoRuntime.setToken(token);
      }
      catch {
        this._logger.warn("Failed to exchange legacy token, removing it");
      }
    }

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