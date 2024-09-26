import { inject, injectable } from "inversify";
import { BehaviorSubject, filter } from "rxjs";
import { type MemberDto, MembersApi } from "../../../api";
import { ApiService } from "../api/api.service";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { TokenService } from "../../events/token/token.service";

@injectable()
export class MemberService {

  private readonly _logger;
  private readonly _member = new BehaviorSubject<MemberDto | null | undefined>(undefined);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(ApiService) private readonly _apiService: ApiService,
    @inject(TokenService) private readonly _tokenService: TokenService
  ) {
    this._logger = loggerFactory(this);
    this._tokenService.token
      .pipe(
        filter(token => token !== undefined), // only when token is loaded
      )
      .subscribe(token => this.loadMember(token === null));
  }

  private async loadMember(reset = false): Promise<MemberDto | null> {

    if (reset) {
      this._member.next(null);
      return Promise.resolve(null);
    }

    const promise = this._apiService.getApi(MembersApi).getAuthenticatedMember();
    promise.then(member => {
      this._member.next(member);
    }).catch(() => {
      if(this._member.value !== null) {
        this._member.next(null);
      }
    });

    return promise;
  }

  /**
   * Observable which emits the current member.
   */
  public get member() {
    return this._member.asObservable();
  }

  /**
   * Redirects the user to the login page.
   */
  public login() {
    window.location.href = "https://www.typo.rip/auth?redirect=" + encodeURI(window.location.href);
  }

  /**
   * Removes the token from the storage and the service.
   */
  public async logout() {
    await this._tokenService.removeToken();
  }

  public async refreshMember() {
    return this.loadMember();
  }
}