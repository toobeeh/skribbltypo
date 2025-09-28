import { LobbyInteractedEventListener } from "@/app/events/lobby-interacted.event";
import { LobbyStateChangedEvent, LobbyStateChangedEventListener } from "@/app/events/lobby-state-changed.event";
import { WordGuessedEventListener } from "@/app/events/word-guessed.event";
import type {
  drawGuessedPlayersStatEvent, drawLikesStatEvent, drawScoreStatEvent, drawTimeStatEvent,
  guessAccuracyStatEvent,
  guessCountStatEvent,
  guessMessageGapStatEvent, guessRankStatEvent,
  guessScoreStatEvent,
  guessStreakStatEvent,
  guessTimeStatEvent, lobbyStatEvent, standingScoreStatEvent,
} from "@/app/services/lobby-stats/lobby-stats-events.interface";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import type { skribblLobby } from "@/util/skribbl/lobby";
import { inject, injectable, postConstruct } from "inversify";
import { count, filter, map, Subject, switchMap, take, takeUntil, withLatestFrom } from "rxjs";
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
  private _turnStandingScoreStats$ = new Subject<standingScoreStatEvent>();

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  postConstruct() {
    this.processEvents();
  }

  /**
   * Create the common part of a lobby stat event
   * @param lobby
   * @param turnPlayerId
   * @param targetPlayerId
   * @private
   */
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

  /**
   * Process events from various sources to produce lobby stats events
   * this processes events nevertheless if features subscribe or not
   * this could be changed by exposing the observables directly
   * would have the downside that multiple subscribers would cause multiple processing
   * @private
   */
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

    /* reusable round started event */
    const roundStartedSource$ = this._lobbyStateChangedEventListener.events$.pipe(
      map(event => event.data.drawingStarted),
      filter(event => event !== undefined)
    );
    const roundStarted$ = new Subject<NonNullable<LobbyStateChangedEvent["data"]["drawingStarted"]>>();
    roundStartedSource$.subscribe(roundStarted$);

    /* drawing likes stats */
    roundStarted$.pipe(

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

    /* drawing likes stats */
    roundStarted$.pipe(

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

    /* drawing likes stats */
    roundStarted$.pipe(

      /* record draw start time */
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

    /* standing, drawing and guess score stats */
    roundStarted$.pipe(

      /* get score of next reveal */
      switchMap(() => this._lobbyStateChangedEventListener.events$.pipe(
        map(event => event.data.drawingRevealed),
        filter(event => event !== undefined),
        take(1),

        /* map in lobby details */
        withLatestFrom(lobby$),
        filter(([, lobbyData]) => lobbyData !== null)
      ))
    ).subscribe(([reveal, lobby]) => {
      if(lobby === null) throw new Error("lobby must be provided");

      /* create events for each score result and emit to corresponding subject */
      for(const score of reveal.scores) {
        const event: guessScoreStatEvent | drawScoreStatEvent = {
          ...this.createEventSignature(lobby.lobby, lobby.turnPlayerId, score.playerId),
          score: score.rewarded
        };

        if(score.playerId === lobby.turnPlayerId) {
          this._drawScoreStats$.next(event);
        }
        else {
          this._guessScoreStats$.next(event);
        }

        /* emit event for total score */
        const standingEvent: standingScoreStatEvent = {
          ...this.createEventSignature(lobby.lobby, lobby.turnPlayerId, score.playerId),
          score: score.score
        };
        this._turnStandingScoreStats$.next(standingEvent);
      }
    });

    /* guess time stats */
    roundStarted$.pipe(

      /* record start time */
      map(() => Date.now()),

      switchMap(startTimestamp => this._wordGuessedEventListener.events$.pipe(

        /* measure time until each guess */
        map(event => ({
          playerId: event.data.playerId,
          guessTimeMs: Date.now() - startTimestamp
        })),

        /* until drawing ended */
        takeUntil(this._lobbyStateChangedEventListener.events$.pipe(
          filter(event => event.data.drawingRevealed !== undefined)
        )),

        /* create event data */
        withLatestFrom(lobby$),
        filter(([, lobbyData]) => lobbyData !== null),
        map(([guessData, lobbyData]) => {
          if(lobbyData === null) throw new Error("lobbyData must be provided");
          const event: guessTimeStatEvent = {
            ...this.createEventSignature(lobbyData.lobby, lobbyData.turnPlayerId, guessData.playerId),
            guessTimeMs: guessData.guessTimeMs
          };
          return event;
        }),
      ))
    ).subscribe(event => this._guessTimeStats$.next(event));

    /* guess rank stats */
    this._lobbyStateChangedEventListener.events$.pipe(
      map(event => event.data.drawingRevealed),
      filter(event => event !== undefined),
      take(1),

      /* map in lobby details */
      withLatestFrom(lobby$),
      filter(([, lobbyData]) => lobbyData !== null)
    ).subscribe(([reveal, lobby]) => {
      if(lobby === null) throw new Error("lobby must be provided");

      const players = reveal.scores
        .filter(score => score.playerId !== lobby.turnPlayerId)
        .sort((a, b) => b.rewarded - a.rewarded)
        .map(score => score.playerId);

      for(const score of reveal.scores) {
        const index = players.indexOf(score.playerId);
        if(index === -1) continue;

        const eventSignature = this.createEventSignature(lobby.lobby, lobby.turnPlayerId, score.playerId);
        const event: guessRankStatEvent = {
          ...eventSignature,
          rank: index + 1
        };
        this._guessRankStats$.next(event);
      }
    });

    /* guess count stats */
    

    this._guessRankStats$.subscribe(event => console.log(event));
  }

}