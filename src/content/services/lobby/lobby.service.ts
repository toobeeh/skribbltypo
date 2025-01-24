import {
  LobbyPlayerChangedEvent,
  LobbyPlayerChangedEventListener,
} from "@/content/events/lobby-player-changed.event";
import { LobbyStateChangedEvent, LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { RoundStartedEvent, RoundStartedEventListener } from "@/content/events/round-started.event";
import { WordGuessedEvent, WordGuessedEventListener } from "@/content/events/word-guessed.event";
import { inject, injectable } from "inversify";
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, merge, withLatestFrom } from "rxjs";
import type { skribblLobby } from "@/util/skribbl/lobby";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import { LobbyJoinedEvent, LobbyJoinedEventListener } from "../../events/lobby-joined.event";
import { LobbyLeftEvent, LobbyLeftEventListener } from "../../events/lobby-left.event";
import { ElementsSetup } from "../../setups/elements/elements.setup";

@injectable()
export class LobbyService {

  private readonly _logger;

  private _currentLobby$ = new BehaviorSubject<skribblLobby | null>(null);
  private _discoveredLobbies$ = new BehaviorSubject<Map<string, skribblLobby & {seenAt: number}>>(new Map());

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(LobbyJoinedEventListener) private readonly lobbyJoined: LobbyJoinedEventListener,
    @inject(LobbyLeftEventListener) private readonly lobbyLeft: LobbyLeftEventListener,
    @inject(LobbyPlayerChangedEventListener) private readonly lobbyPlayerChanged: LobbyPlayerChangedEventListener,
    @inject(LobbyStateChangedEventListener) private readonly lobbyStateChanged: LobbyStateChangedEventListener,
    @inject(RoundStartedEventListener) private readonly roundStarted: RoundStartedEventListener,
    @inject(WordGuessedEventListener) private readonly wordGuessed: WordGuessedEventListener,
    @inject(ElementsSetup) private readonly elementsSetup: ElementsSetup
  ) {
    this._logger = loggerFactory(this);

    /* combine updates and calculate updated lobby state */
    merge(
      lobbyLeft.events$,
      lobbyJoined.events$,
      lobbyPlayerChanged.events$,
      lobbyStateChanged.events$,
      roundStarted.events$,
      wordGuessed.events$
    ).pipe(
      withLatestFrom(this._currentLobby$), /* compare updates with current lobby */
      map(data => ({update: data[0], currentLobby: data[1]})),
      map(({update, currentLobby}) => {
        this._logger.debug("Lobby update", update, currentLobby);

        /* prevent reference issues */
        currentLobby = currentLobby === null ? null : structuredClone(currentLobby);

        /* lobby left, reset lobby */
        if(update instanceof LobbyLeftEvent) {
          currentLobby = null;
        }

        /* lobby joined, set new lobby */
        else if(update instanceof LobbyJoinedEvent) {
          currentLobby = update.data;
        }

        /* round ended, update round */
        else if(currentLobby !== null && update instanceof RoundStartedEvent) {
          currentLobby.round = update.data;
        }

        /* word guessed, update players */
        else if(currentLobby !== null && update instanceof WordGuessedEvent) {
          const guessed = update.data;
          currentLobby.players.forEach(player => {
            if(player.id === guessed.playerId) {
              player.guessed = true;
            }
          });
        }

        /* lobby state updated */
        else if (currentLobby !== null && update instanceof LobbyStateChangedEvent) {
          const data = update.data;
          if(data.drawingRevealed) {
            const scores = new Map<number, number>(data.drawingRevealed.scores.map(score => [score.playerId, score.score]));
            currentLobby.players.forEach((player) => {
              player.guessed = false;
              player.score = scores.get(player.id) ?? player.score;
            });
            currentLobby.drawerId = null;
          }

          if(data.drawingStarted !== undefined) {
            currentLobby.drawerId = data.drawingStarted.drawerId;
          }
        }

        /* player changed, update list */
        else if(currentLobby !== null && update instanceof LobbyPlayerChangedEvent) {
          const data = update.data;
          if(data.left) {
            const left = data.left;
            currentLobby.players = currentLobby.players.filter(user => user.id !== left.id);
          }
          else if(data.joined) {
            currentLobby.players.push(data.joined);
          }
        }

        /* emit updated lobby */
        this._logger.debug("Lobby update processed", currentLobby);
        return currentLobby;
      }),
      debounceTime(100), /* debounce to prevent spamming */
      distinctUntilChanged((curr, prev) => JSON.stringify(curr) === JSON.stringify(prev)) /* if join-leave spam debounced, take only changes */
    ).subscribe(data => this._currentLobby$.next(data));

    this.lobby$.subscribe(data => {
      this._logger.info("Lobby changed", data);
      const map = this._discoveredLobbies$.value;
      if(data !== null && data.id !== null) map.set(data.id, { ...data, seenAt: Date.now() });
      this._discoveredLobbies$.next(map);
    });
  }

  public async joinLobby(id?: string){

    if(this._currentLobby$.value !== null) {
      this._logger.warn("Attempted to join a lobby while already in one");
      throw new Error("Already in a lobby");
    }

    /* show loading */
    const elements = await this.elementsSetup.complete();
    elements.load.style.display = "block";
    elements.home.style.display = "none";

    document.dispatchEvent(new CustomEvent("joinLobby", {detail: id}));
  }

  public leaveLobby(){
    if(this._currentLobby$.value === null) {
      this._logger.warn("Attempted to leave a lobby while not in one");
      throw new Error("Not in a lobby");
    }
    document.dispatchEvent(new CustomEvent("leaveLobby"));
  }

  public get lobby$(){
    return this._currentLobby$.asObservable();
  }

  public get discoveredLobbies$(){
    return this._discoveredLobbies$.pipe(
      map(map => Array.from(map.values()))
    );
  }
}