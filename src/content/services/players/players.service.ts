import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { LobbyJoinedEventListener } from "@/content/events/lobby-joined.event";
import { LobbyLeftEventListener } from "@/content/events/lobby-left.event";
import { LobbyPlayerChangedEventListener } from "@/content/events/lobby-player-changed.event";
import { SkribblLandingPlayer } from "@/content/services/players/skribblLandingPlayer";
import { SkribblLobbyPlayer } from "@/content/services/players/skribblLobbyPlayer";
import { MemberService } from "@/content/services/member/member.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import type { SkribblPlayerDisplay } from "@/content/services/players/skribblPlayerDisplay.interface";
import { calculateLobbyKey } from "@/util/typo/lobbyKey";
import { inject, injectable, postConstruct } from "inversify";
import { BehaviorSubject, combineLatestWith, map, mergeWith, startWith, withLatestFrom } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

@injectable()
export class PlayersService {

  @inject(ElementsSetup) private _elementsSetup!: ElementsSetup;
  @inject(LobbyJoinedEventListener) private readonly _lobbyJoinedEvent!: LobbyJoinedEventListener;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEvent!: LobbyLeftEventListener;
  @inject(LobbyPlayerChangedEventListener) private readonly _playerChangedEvent!: LobbyPlayerChangedEventListener;
  @inject(MemberService) private readonly _memberService!: MemberService;

  private readonly _logger;
  private readonly _lobbyPlayers$ = new BehaviorSubject<SkribblLobbyPlayer[]>([]);
  private readonly _landingPlayer$ = new BehaviorSubject<SkribblLandingPlayer | undefined>(undefined);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  private postConstruct() {

    /* init landing player */
    this._memberService.member$.pipe(
      withLatestFrom(
        fromPromise(this._elementsSetup.complete())
      ),
      map(([member, elements]) => {
        if(!member) return undefined;
        return new SkribblLandingPlayer(Number(member.userLogin), elements.landingCustomizeContainer, elements.landingAvatarContainer);
      })
    ).subscribe(player => {
      this._landingPlayer$.next(player);
    });

    /* listen for player joined/left event */
    this._playerChangedEvent.events$.pipe(
      withLatestFrom(this._lobbyJoinedEvent.events$.pipe(
        map((event) => event.data.id),
        mergeWith(this._lobbyLeftEvent.events$.pipe(map(() => undefined)))
      )),
      combineLatestWith(this._memberService.member$),
    ).subscribe(([[event, lobbyId], member]) => {

      // if no lobby joined, clear all players
      if(lobbyId === undefined){
        this._lobbyPlayers$.next([]);
        return;
      }

      // if practice lobby but member not logged in, clear all players
      if(lobbyId === null && member === null || member === undefined){
        this._lobbyPlayers$.next([]);
        return;
      }

      /* add new player to players */
      if(event.data.joined){
        const current = this._lobbyPlayers$.value;

        let newPlayer: SkribblLobbyPlayer;
        try {

          /* create lobby player, identify by lobby id or login if practice lobby */
          const key = lobbyId ? calculateLobbyKey(lobbyId) : undefined;
          newPlayer = new SkribblLobbyPlayer(
            event.data.joined,
            key, key === undefined && member ? Number(member.userLogin) : undefined);
        }
        catch (e) {
          this._logger.error("Failed to create player", event.data.joined, e);
          return;
        }

        current.push(newPlayer);
        this._lobbyPlayers$.next(current);
        this._logger.info("Player joined", newPlayer);
      }

      /* remove player from players */
      if(event.data.left){

        const id = event.data.left.id;
        const left = this._lobbyPlayers$.value.find((player) => player.lobbyPlayerId === id);
        const current = this._lobbyPlayers$.value.filter((player) => player != left);
        this._lobbyPlayers$.next(current);
        this._logger.info("Player left", left);
      }
    });

    /* listen for lobby joined event and init players */
    this._lobbyJoinedEvent.events$.pipe(
      combineLatestWith(this._memberService.member$)
    ).subscribe(([event, member]) => {

      const players = event.data.players.map((player) => {
        try {
          /* create lobby player, identify by lobby id or login if practice lobby */
          const key = event.data.id ? calculateLobbyKey(event.data.id) : undefined;
          return new SkribblLobbyPlayer(
            player,
            key, key === undefined && member ? Number(member.userLogin) : undefined);
        }
        catch (e) {
          this._logger.error("Failed to create player", player, e);
          return null;
        }
      }).filter(player => player !== null);

      this._lobbyPlayers$.next(players);
      this._logger.info("Lobby joined", players);
    });

    /* reset players on lobby left */
    this._lobbyLeftEvent.events$.subscribe(() => {
      this._lobbyPlayers$.next([]);
      this._logger.info("Lobby left");
    });
  }

  public get lobbyPlayers$() {
    return this._lobbyPlayers$.asObservable();
  }

  public get landingPlayer$() {
    return this._landingPlayer$.asObservable();
  }

  public get players$() {
    return this._lobbyPlayers$.pipe(
      startWith([]),
      combineLatestWith(
        this.landingPlayer$
      ),
      map(([players, landing]) => [...players, landing]
        .filter(player => player !== undefined) as SkribblPlayerDisplay[])
    );
  }
}