import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { LobbyJoinedEventListener } from "@/content/events/lobby-joined.event";
import { LobbyLeftEventListener } from "@/content/events/lobby-left.event";
import { LobbyPlayerChangedEventListener } from "@/content/events/lobby-player-changed.event";
import { LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { PlayerPopupVisibilityChangedEventListener } from "@/content/events/player-popup-visible.event";
import { ScoreboardVisibilityChangedEventListener } from "@/content/events/scoreboard-visible.event";
import { TextOverlayVisibilityChangedEventListener } from "@/content/events/text-overlay-visible.event";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { SkribblLandingPlayer } from "@/content/services/players/skribblLandingPlayer";
import { SkribblLobbyPlayer } from "@/content/services/players/skribblLobbyPlayer";
import { MemberService } from "@/content/services/member/member.service";
import { SkribblOverlayPlayer } from "@/content/services/players/skribblOverlayPlayer";
import { SkribblPopupPlayer } from "@/content/services/players/skribblPopupPlayer";
import { SkribblScoreboardPodiumPlayer } from "@/content/services/players/skribblScoreboardPodiumPlayer";
import { SkribblScoreboardRegularPlayer } from "@/content/services/players/skribblScoreboardRegularPlayer";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import type { SkribblPlayerDisplay } from "@/content/services/players/skribblPlayerDisplay.interface";
import { LandingPlayerSetup } from "@/content/setups/landing-player/landing-player.setup";
import { element } from "@/util/document/requiredQuerySelector";
import type { skribblPlayer } from "@/util/skribbl/lobby";
import { calculateLobbyKey } from "@/util/typo/lobbyKey";
import { inject, injectable, postConstruct } from "inversify";
import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged, filter, from,
  map,
  mergeWith, of,
  startWith, switchMap,
  withLatestFrom,
} from "rxjs";

@injectable()
export class PlayersService {

  @inject(ElementsSetup) private _elementsSetup!: ElementsSetup;
  @inject(LobbyJoinedEventListener) private readonly _lobbyJoinedEvent!: LobbyJoinedEventListener;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEvent!: LobbyLeftEventListener;
  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEvent!: LobbyStateChangedEventListener;
  @inject(LobbyPlayerChangedEventListener) private readonly _playerChangedEvent!: LobbyPlayerChangedEventListener;
  @inject(ScoreboardVisibilityChangedEventListener) private readonly _scoreboardVisibleEvent!: ScoreboardVisibilityChangedEventListener;
  @inject(TextOverlayVisibilityChangedEventListener) private readonly _textOverlayVisibleEvent!: TextOverlayVisibilityChangedEventListener;
  @inject(PlayerPopupVisibilityChangedEventListener) private readonly _popupVisibleEvent!: PlayerPopupVisibilityChangedEventListener;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(LandingPlayerSetup) private readonly _landingPlayerSetup!: LandingPlayerSetup;

  private readonly _logger;
  private readonly _lobbyPlayers$ = new BehaviorSubject<SkribblLobbyPlayer[]>([]);
  private readonly _landingPlayer$ = new BehaviorSubject<SkribblLandingPlayer | undefined>(undefined);
  private readonly _scoreboardPlayers$ = new BehaviorSubject<SkribblPlayerDisplay[]>([]);
  private readonly _popupPlayer$ = new BehaviorSubject<SkribblPlayerDisplay | undefined>(undefined);
  private readonly _overlayPlayer$ = new BehaviorSubject<SkribblPlayerDisplay | undefined>(undefined);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  private postConstruct() {
    this.setupLandingPlayer();
    this.setupLobbyPlayers();
    this.setupScoreboardPlayers();
    this.setupPopupPlayer();
    this.setupOverlayPlayer();
  }

  private setupLandingPlayer(){
    of(undefined).pipe(
      mergeWith(from(this._landingPlayerSetup.complete()).pipe(
        switchMap(player => player)
      ))
    ).subscribe(player => this._landingPlayer$.next(player));
  }

  private setupLobbyPlayers() {

    /* create on lobby join */
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

    /* update on player change event */
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

    /* reset players on lobby left */
    this._lobbyLeftEvent.events$.subscribe(() => {
      this._lobbyPlayers$.next([]);
      this._logger.info("Lobby left");
    });
  }

  private setupScoreboardPlayers() {
    this._lobbyStateChangedEvent.events$.pipe(
      combineLatestWith(this._lobbyService.lobby$, this._scoreboardVisibleEvent.events$),
      filter(data => data[2].data === true),  /* wait until scoreboard visible */
      map((data) => data[1] === null || data[0].data.gameEnded === undefined ? undefined : data),
      distinctUntilChanged(),
    ).subscribe(data => {
      const event = data?.[0].data?.gameEnded;
      const lobby = data?.[1] ?? undefined;
      const lobbyId = lobby?.id ?? null;
      if(event === undefined || lobby === undefined || lobbyId === null) {
        this._logger.info("Lobby changed, no scoreboard data");
        this._scoreboardPlayers$.next([]);
        return;
      }

      const players = event.ranking
        .map((player) => ({ player: lobby.players.find(p => p.id === player.playerId), rank: player.rank }))
        .filter(player => player.player !== undefined)
        .map(player => player.rank < 3 ?
          new SkribblScoreboardPodiumPlayer(player.player as skribblPlayer, calculateLobbyKey(lobbyId)) :
          new SkribblScoreboardRegularPlayer(player.player as skribblPlayer, calculateLobbyKey(lobbyId))
        );

      this._logger.info("Scoreboard visible, scoreboard data", players);
      this._scoreboardPlayers$.next(players);
    });
  }

  private setupPopupPlayer() {
    this._popupVisibleEvent.events$.pipe(
      withLatestFrom(this._memberService.member$, this._lobbyService.lobby$, this._elementsSetup.complete()),
    ).subscribe(([visible, member, lobby, elements]) => {
      if(!visible || lobby === null){
        this._logger.info("Popup player hidden");
        this._popupPlayer$.next(undefined);
        return;
      }

      const playerId = element(".player", elements.playerPopup)?.getAttribute("playerid") ?? undefined;
      if(playerId === undefined) {
        this._logger.error("No player id in popup");
        this._popupPlayer$.next(undefined);
        return;
      }

      const player = lobby.players.find(p => p.id === Number(playerId));
      if(player === undefined){
        this._logger.error("Player not found in lobby", playerId);
        this._popupPlayer$.next(undefined);
        return;
      }

      const lobbyKey = lobby.id ? calculateLobbyKey(lobby.id) : undefined;
      const playerDisplay = new SkribblPopupPlayer(player, elements.playerPopup, lobbyKey, lobbyKey === undefined && member ? Number(member.userLogin) : undefined);
      this._popupPlayer$.next(playerDisplay);
      this._logger.info("Popup player visible", playerDisplay);
    });
  }

  private setupOverlayPlayer() {

    this._textOverlayVisibleEvent.events$.pipe(
      withLatestFrom(this._lobbyService.lobby$, this._elementsSetup.complete()),
    ).subscribe(([visible, lobby, elements]) => {
      if(!visible || lobby === null || lobby.id === null){
        this._logger.info("Overlay player hidden");
        this._overlayPlayer$.next(undefined);
        return;
      }

      const playerId = elements.textOverlay.getAttribute("playerid") ?? undefined;
      if(element(".avatar", elements.textOverlay) === undefined || playerId === undefined) {
        this._logger.info("No player or playerid in overlay, probably not a choosing info");
        this._popupPlayer$.next(undefined);
        return;
      }

      const player = lobby.players.find(p => p.id === Number(playerId));
      if(player === undefined){
        this._logger.error("Player not found in lobby", playerId);
        this._popupPlayer$.next(undefined);
        return;
      }

      const lobbyKey = calculateLobbyKey(lobby.id);
      const playerDisplay = new SkribblOverlayPlayer(player, lobbyKey,elements.textOverlay);
      this._popupPlayer$.next(playerDisplay);
      this._logger.info("Overlay player visible", playerDisplay);
    });
  }

  public get lobbyPlayers$() {
    return this._lobbyPlayers$.asObservable();
  }

  public get landingPlayer$() {
    return this._landingPlayer$.asObservable();
  }

  public get scoreboardPlayers$() {
    return this._scoreboardPlayers$.asObservable();
  }

  public get popupPlayer$() {
    return this._popupPlayer$.asObservable();
  }

  public get overlayPlayer$() {
    return this._overlayPlayer$.asObservable();
  }

  public get players$() {
    return this._lobbyPlayers$.pipe(
      startWith([]),
      combineLatestWith(
        this.landingPlayer$,
        this.scoreboardPlayers$,
        this.popupPlayer$,
        this.overlayPlayer$
      ),
      map(([players, landing, scoreboard, popup, overlay]) => [
        ...players,
        landing,
        ...scoreboard,
        popup,
        overlay
      ]
        .filter(player => player !== undefined) as SkribblPlayerDisplay[])
    );
  }
}