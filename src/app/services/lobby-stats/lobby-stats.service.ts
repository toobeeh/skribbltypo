import { LobbyInteractedEventListener } from "@/app/events/lobby-interacted.event";
import { LobbyJoinedEventListener } from "@/app/events/lobby-joined.event";
import { LobbyStateChangedEvent, LobbyStateChangedEventListener } from "@/app/events/lobby-state-changed.event";
import { WordGuessedEventListener } from "@/app/events/word-guessed.event";
import { getGuessAccuracy } from "@/app/features/guess-check/guess-overlay";
import { ChatService } from "@/app/services/chat/chat.service";
import { DrawingService } from "@/app/services/drawing/drawing.service";
import type {
  completionTimeStatEvent,
  drawDislikesStatEvent,
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
import {
  count, delay,
  filter, from,
  map, mergeWith, reduce,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  withLatestFrom,
} from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

@injectable()
export class LobbyStatsService {

  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(LobbyInteractedEventListener) private readonly _lobbyInteractedEventListener!: LobbyInteractedEventListener;
  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(WordGuessedEventListener) private readonly _wordGuessedEventListener!: WordGuessedEventListener;
  @inject(ChatService) private readonly _chatService!: ChatService;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(LobbyJoinedEventListener) private readonly _lobbyJoinedEventListener!: LobbyJoinedEventListener;

  private readonly _logger;

  private _guessTimeStats$ = new Subject<guessTimeStatEvent>();
  private _completionTimeStats$ = new Subject<completionTimeStatEvent>();
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
  private _drawDislikesStats$ = new Subject<drawDislikesStatEvent>();
  private _turnStandingScoreStats$ = new Subject<standingScoreStatEvent>();

  public get guessTimeStats$() { return this._guessTimeStats$.asObservable(); }
  public get completionTimeStats$() { return this._completionTimeStats$.asObservable(); }
  public get guessCountStats$() { return this._guessCountStats$.asObservable(); }
  public get guessMessageGapStats$() { return this._guessMessageGapStats$.asObservable(); }
  public get guessScoreStats$() { return this._guessScoreStats$.asObservable(); }
  public get guessAccuracyStats$() { return this._guessAccuracyStats$.asObservable(); }
  public get guessStreakStats$() { return this._guessStreakStats$.asObservable(); }
  public get guessRankStats$() { return this._guessRankStats$.asObservable(); }
  public get drawTimeStats$() { return this._drawTimeStats$.asObservable(); }
  public get drawGuessedPlayersStats$() { return this._drawGuessedPlayersStats$.asObservable(); }
  public get drawScoreStats$() { return this._drawScoreStats$.asObservable(); }
  public get drawLikesStats$() { return this._drawLikesStats$.asObservable(); }
  public get drawDislikesStats$() { return this._drawDislikesStats$.asObservable(); }
  public get turnStandingScoreStats$() { return this._turnStandingScoreStats$.asObservable(); }

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
    const turnStarted$ = new Subject<NonNullable<LobbyStateChangedEvent["data"]["drawingStarted"]>>();
    roundStartedSource$.subscribe(turnStarted$);

    /* drawing likes stats */
    turnStarted$.pipe(

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

    /* drawing dislikes stats */
    turnStarted$.pipe(

      /* count likes */
      switchMap(() => this._lobbyInteractedEventListener.events$.pipe(
        filter(event => event.data.dislikeInteraction !== undefined),

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
          const event: drawDislikesStatEvent = {
            ...this.createEventSignature(lobbyData.lobby, lobbyData.turnPlayerId, lobbyData.turnPlayerId),
            dislikes: likes
          };
          return event;
        }),
      ))
    ).subscribe(event => this._drawDislikesStats$.next(event));

    /* drawing guessed amount stats */
    turnStarted$.pipe(

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
    turnStarted$.pipe(

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
    turnStarted$.pipe(

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
    turnStarted$.pipe(

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

        mergeWith(this._lobbyStateChangedEventListener.events$.pipe(
          filter(event => event.data.drawingRevealed !== undefined),
          take(1),
          switchMap(event => {
            const guessTimeMs = Date.now() - startTimestamp;
            const notGuessedPlayers = event.data.drawingRevealed?.scores
              .filter(score => score.rewarded === 0)
              .map(score => ({ playerId: score.playerId, guessTimeMs }))
            ?? [];
            return from(notGuessedPlayers);
          })
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
    this._wordGuessedEventListener.events$.pipe(
      withLatestFrom(turnStarted$.pipe(
        map(() => new Map<number, number>()),

        /* count messages of players that did not guess yet */
        switchMap((guessCounts) => {
          return this._chatService.playerMessageReceived$.pipe(
            filter(msg => !msg.player.guessed),
            tap(msg => {
              const count = guessCounts.get(msg.player.id) ?? 0;
              guessCounts.set(msg.player.id, count + 1);
            }),
            map(() => guessCounts)
          );
        }))
      ),
      map(([guessEvent, guessCounts]) => ({
        playerId: guessEvent.data.playerId,
        count: (guessCounts.get(guessEvent.data.playerId) ?? 0) + 1 // include current guess
      })),

      /* map in lobby details */
      withLatestFrom(lobby$),
      filter(([, lobbyData]) => lobbyData !== null)
    ).subscribe(([guessData, lobby]) => {
      if(lobby === null) throw new Error("lobby must be provided");

      const event: guessCountStatEvent = {
        ...this.createEventSignature(lobby.lobby, lobby.turnPlayerId, guessData.playerId),
        guessCount: guessData.count
      };

      this._guessCountStats$.next(event);
    });

    /* guess gap and accuracy stats */
    this._chatService.playerMessageReceived$.pipe(

      /* merge chat messages and actual guesses */
      filter(msg => !msg.player.guessed),
      map(msg => ({message: msg.content, playerId: msg.player.id})),
      mergeWith(this._wordGuessedEventListener.events$.pipe(
          map(guessed => ({message: undefined, playerId: guessed.data.playerId})
        ))
      ),

      /* create new last-msg map per turn */
      withLatestFrom(turnStarted$.pipe(
        map(() => ({ guesses: new Map<number, number>(), turnStart: Date.now() })),
      ), this._lobbyService.lobby$, this._lobbyStateChangedEventListener.events$.pipe(
        filter(event => event.data.timerSet === undefined) /* filter out timer set events which disrupt state */
      )),
      filter(([, , , state]) => state.data.drawingStarted !== undefined), /* only while drawing: last state update was start drawing */

      map(([msgData, turnData]) => {
        const lastGuess = turnData.guesses.get(msgData.playerId) ?? turnData.turnStart;
        turnData.guesses.set(msgData.playerId, Date.now());
        return {
          playerId: msgData.playerId,
          gapTimeMs: Date.now() - lastGuess,
          message: msgData.message
        };
      }),

      /* map in lobby details, filter out drawing user messages*/
      withLatestFrom(lobby$, this._drawingService.imageState$),
      filter(([gap, lobbyData]) => lobbyData !== null && lobbyData.turnPlayerId !== gap.playerId)
    ).subscribe(([gap, lobby, drawing]) => {
      if(lobby === null) throw new Error("lobby must be provided");
      if(drawing === null || drawing.word === undefined) throw new Error("drawing must be provided");

      const gapEvent: guessMessageGapStatEvent = {
        ...this.createEventSignature(lobby.lobby, lobby.turnPlayerId, gap.playerId),
        gapTimeMs: gap.gapTimeMs,
        message: gap.message,
        hints: drawing.word.hints
      };
      this._guessMessageGapStats$.next(gapEvent);

      /* accuracy based only on length, because hints might appear differently for others after guessing the word */
      const accuracy = gap.message === undefined ? 1 : getGuessAccuracy(gap.message, drawing.word.hints, true);
      const accuracyEvent: guessAccuracyStatEvent = {
        ...this.createEventSignature(lobby.lobby, lobby.turnPlayerId, gap.playerId),
        accuracy: accuracy,
        message: gap.message,
        hints: drawing.word.hints
      };
      this._guessAccuracyStats$.next(accuracyEvent);
    });

    /* streak stats */
    this._lobbyStateChangedEventListener.events$.pipe(

      /* init empty map every game */
      filter(event => event.data.gameEnded !== undefined),
      mergeWith(this._lobbyJoinedEventListener.events$),
      map(() => new Map<number, number>()),

      /* update map each guess */
      switchMap((streakMap) => {
        return this._wordGuessedEventListener.events$.pipe(

          /* guesses increase streak */
          map(event => {
            const currentStreak = streakMap.get(event.data.playerId) ?? 0;
            streakMap.set(event.data.playerId, currentStreak + 1);
            return { streak: currentStreak + 1, playerId: event.data.playerId };
          }),

          /* score 0 resets streak for non-drawers */
          mergeWith(this._lobbyStateChangedEventListener.events$.pipe(
            withLatestFrom(this._lobbyService.lobby$),
            switchMap(([event, lobby]) => {
              const events: {streak: number, playerId: number}[] = [];
              event.data.drawingRevealed?.scores.forEach(score => {
                if(score.rewarded === 0 && score.playerId !== lobby?.drawerId) {
                  streakMap.set(score.playerId, 0);
                  events.push({ streak: 0, playerId: score.playerId });
                }
              });
              return from(events);
            })
          ))
        );
      }),

      /* map in lobby details */
      withLatestFrom(lobby$),
      filter(([, lobbyData]) => lobbyData !== null)
    ).subscribe(([event, lobby]) => {
      if(lobby === null) throw new Error("lobby must be provided");
      const streakEvent: guessStreakStatEvent = {
        ...this.createEventSignature(lobby.lobby, lobby.turnPlayerId, event.playerId),
        streak: event.streak
      };
      this._guessStreakStats$.next(streakEvent);
    });
    
    /* combine average guess time and draw time events to completion time stats */
    turnStarted$.pipe(

      /* average guess time for drawer */
      switchMap(() => this._guessTimeStats$.pipe(
        takeUntil(this._lobbyStateChangedEventListener.events$.pipe(
            filter(event => event.data.drawingRevealed !== undefined),
            delay(50) /* delay to let non-guess-time events come in (timed also by lobbystatechange event) */
        )),
        map(event => event.guessTimeMs),
        reduce((acc, value) => ({ sum: acc.sum + value, count: acc.count + 1 }), { sum: 0, count: 0 }),
        map(acc => acc.count === 0 ? 0 : acc.sum / acc.count),
        withLatestFrom(lobby$),
        map(([avg, lobby]) => {
          if(lobby === null) throw new Error("lobby must be provided");
          const event: completionTimeStatEvent = {
            ...this.createEventSignature(lobby.lobby, lobby.turnPlayerId, lobby.turnPlayerId),
            completionTimeMs: avg
          };
          return event;
        })
      )),

      /* guess times for guessers */
      mergeWith(this._guessTimeStats$.pipe(
        map(event => ({...event, completionTimeMs: event.guessTimeMs} as completionTimeStatEvent))
      ))
    ).subscribe(event => this._completionTimeStats$.next(event));
  }

}