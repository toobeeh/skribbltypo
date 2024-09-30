import { inject, injectable } from "inversify";
import { BehaviorSubject, filter, forkJoin, of, switchMap } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { type MemberDto, MembersApi, type MemberWebhookDto } from "../../../api";
import { ApiService } from "../api/api.service";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { TokenService } from "../token/token.service";

interface memberData {
  member: MemberDto,
  webhooks: MemberWebhookDto[]
}

@injectable()
export class MemberService {

  private readonly _logger;
  private readonly _member$ = new BehaviorSubject<MemberDto | null | undefined>(undefined);
  private readonly _memberData$ = new BehaviorSubject<memberData | null | undefined>(undefined);

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

    /* create stream for additional member data, loads when member changes */
    this._member$.pipe(
      switchMap(member => {
        if(member === null || member === undefined) {
          return of(member);
        }

        return forkJoin({
          webhooks: fromPromise(_apiService.getApi(MembersApi).getMemberGuildWebhooks({ login: Number(member.userLogin) })),
          member: of(member)
        });
      })
    ).subscribe(data => {
      this._memberData$.next(data);
    });
  }

  private async loadMember(reset = false): Promise<MemberDto | null> {

    if (reset) {
      this._member$.next(null);
      return Promise.resolve(null);
    }

    const promise = this._apiService.getApi(MembersApi).getAuthenticatedMember();
    promise.then(member => {
      this._member$.next(member);
    }).catch(() => {
      if(this._member$.value !== null) {
        this._member$.next(null);
      }
    });

    return promise;
  }

  /**
   * Observable which emits the current member.
   */
  public get member$() {
    return this._member$.asObservable();
  }

  /**
   * Observable which emits the current member and additional data.
   */
  public get memberData$() {
    return this._memberData$.asObservable();
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