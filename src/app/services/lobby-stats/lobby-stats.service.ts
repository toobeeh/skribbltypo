import { LobbyInteractedEventListener } from "@/app/events/lobby-interacted.event";
import { LobbyStateChangedEventListener } from "@/app/events/lobby-state-changed.event";
import { WordGuessedEventListener } from "@/app/events/word-guessed.event";
import type {
  drawGuessedPlayersStatEvent, drawLikesStatEvent, drawScoreStatEvent, drawTimeStatEvent,
  guessAccuracyStatEvent,
  guessCountStatEvent,
  guessMessageGapStatEvent, guessRankStatEvent,
  guessScoreStatEvent,
  guessStreakStatEvent,
  guessTimeStatEvent, lobbyStatEvent,
} from "@/app/services/lobby-stats/lobby-stats-events.interface";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import type { skribblLobby } from "@/util/skribbl/lobby";
import { inject, injectable, postConstruct } from "inversify";
import { count, filter, firstValueFrom, map, Subject, switchMap, take, takeUntil, tap, withLatestFrom } from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

@injectable()
export class LobbyStatsService {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(LobbyInteractedEventListener) private readonly _lobbyInteractedEventListener!: LobbyInteractedEventListener;
  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(WordGuessedEventListener) private readonly _wordGuessedEventListener!: WordGuessedEventListener;

  private readonly _logger;

  private _guessTimeStats$ = new Subject<guessTimeStatEvent>();
  private _guessCountStats$ = new Subject<guessCountStatEvent>();
  private _guessMessageGapStats$ = new Subject<guessMessageGapStatEvent>();
  private _guessScoreStats$ = new Subject<guessScoreStatEvent>();
  private _guessAccuracyStats$ = new Subject<guessAccuracyStatEvent>();
  private _guessStreakStats$ = new Subject<guessStreakStatEvent>();
  private _guessRankStats$ = new Subject<guessRankStatEvent>();
  private _drawTimeStats$ = new Subject<drawTimeStatEvent>();
  private _drawGuessedPlayersStats$ = new Subject<drawGuessedPlayersStatEvent>();
  private _drawScoreStats$ = new Subject<drawScoreStatEvent>();
  private _drawLikesStats$ = new Subject<drawLikesStatEvent>();

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  postConstruct() {
    this.processEvents();
  }

  private createEventSignature(lobby: skribblLobby, turnPlayerId: number, targetPlayerId: number): lobbyStatEvent {
    if(lobby.id === null) throw new Error("lobbyId must be provided");

    return {
      lobbyId: lobby.id,
      lobbyRound: lobby.round,
      playerId: targetPlayerId,
      turnPlayerId: turnPlayerId,
      timestamp: Date.now()
    };
  }

  private processEvents() {

    /* reusable current lobby data for event signature building */
    const lobbySource$ = this._lobbyService.lobby$.pipe(
      withLatestFrom(this._lobbyStateChangedEventListener.events$.pipe(
        map(event => event.data.drawingStarted?.drawerId),
        filter(id => id !== undefined)
      )),
      map(([lobby, turnPlayerId]) =>
        lobby === null || lobby.id === null ? null : ({ lobby, turnPlayerId })
      )
    );
    const lobby$ = new Subject<{lobby: skribblLobby, turnPlayerId: number} | null>();
    lobbySource$.subscribe(lobby$);

    /* drawing likes stats */
    this._lobbyStateChangedEventListener.events$.pipe(

      /* reset every time a turn starts */
      map(event => event.data.drawingStarted),
      filter(event => event !== undefined),

      /* count likes */
      switchMap(() => this._lobbyInteractedEventListener.events$.pipe(
        filter(event => event.data.likeInteraction !== undefined),

        /* until drawing ended */
        takeUntil(this._lobbyStateChangedEventListener.events$.pipe(
          filter(event => event.data.drawingRevealed !== undefined)
        )),
        count(),

        /* create event data */
        withLatestFrom(lobby$),
        filter(([, lobbyData]) => lobbyData !== null),
        map(([likes, lobbyData]) => {
          if(lobbyData === null) throw new Error("lobbyData must be provided");
          const event: drawLikesStatEvent = {
            ...this.createEventSignature(lobbyData.lobby, lobbyData.turnPlayerId, lobbyData.turnPlayerId),
            likes: likes
          };
          return event;
        }),
      ))
    ).subscribe(event => this._drawLikesStats$.next(event));

    /* drawing guessed stats */
    this._lobbyStateChangedEventListener.events$.pipe(

      /* reset every time a turn starts */
      map(event => event.data.drawingStarted),
      filter(event => event !== undefined),

      /* count guessed players */
      switchMap(() => this._wordGuessedEventListener.events$.pipe(

        /* until drawing ended */
        takeUntil(this._lobbyStateChangedEventListener.events$.pipe(
          filter(event => event.data.drawingRevealed !== undefined)
        )),
        count(),

        /* create event data */
        withLatestFrom(lobby$),
        filter(([, lobbyData]) => lobbyData !== null),
        map(([guessedPlayers, lobbyData]) => {
          if(lobbyData === null) throw new Error("lobbyData must be provided");
          const event: drawGuessedPlayersStatEvent = {
            ...this.createEventSignature(lobbyData.lobby, lobbyData.turnPlayerId, lobbyData.turnPlayerId),
            guessedPlayers: guessedPlayers
          };
          return event;
        }),
      ))
    ).subscribe(event => this._drawGuessedPlayersStats$.next(event));

    /* drawing time stats */
    this._lobbyStateChangedEventListener.events$.pipe(

      /* reset every time a turn starts */
      map(event => event.data.drawingStarted),
      filter(event => event !== undefined),
      map(() => Date.now()),

      /* measure time until drawing revealed */
      switchMap(startTimestamp => this._lobbyStateChangedEventListener.events$.pipe(
        filter(event => event.data.drawingRevealed !== undefined),
        take(1),
        map(() => Date.now() - startTimestamp)
      )),

      /* create event data */
      withLatestFrom(lobby$),
      filter(([, lobbyData]) => lobbyData !== null),
      map(([time, lobbyData]) => {
        if(lobbyData === null) throw new Error("lobbyData must be provided");
        const event: drawTimeStatEvent = {
          ...this.createEventSignature(lobbyData.lobby, lobbyData.turnPlayerId, lobbyData.turnPlayerId),
          drawTimeMs: time
        };
        return event;
      }),
    ).subscribe(event => this._drawTimeStats$.next(event));

    this._drawGuessedPlayersStats$.subscribe(event => console.log(event));
  }

}