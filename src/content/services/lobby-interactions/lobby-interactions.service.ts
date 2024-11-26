import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { LobbyInteractedEventListener } from "@/content/events/lobby-interacted.event";
import { LobbyStateChangedEventListener } from "@/content/events/lobby-state-changed.event";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { SkribblMessageRelaySetup } from "@/content/setups/skribbl-message-relay/skribbl-message-relay.setup";
import type { skribblPlayer } from "@/util/skribbl/lobby";
import { inject, injectable, postConstruct } from "inversify";
import {
  BehaviorSubject, distinctUntilChanged,
  filter,
  map,
  pairwise,
  withLatestFrom,
} from "rxjs";

export interface lobbyAvailableInteractions {
  rateAvailable: boolean;
  votekickAvailable: boolean;
  interactionTarget: skribblPlayer | undefined;
}

@injectable()
export class LobbyInteractionsService {

  @inject(LobbyService) private _lobbyService!: LobbyService;
  @inject(LobbyInteractedEventListener) private _lobbyInteractedEvent!: LobbyInteractedEventListener;
  @inject(LobbyStateChangedEventListener) private _lobbyStateChangedEvent!: LobbyStateChangedEventListener;
  @inject(SkribblMessageRelaySetup) private _skribblMessageRelaySetup!: SkribblMessageRelaySetup;

  private _availableInteractions$ = new BehaviorSubject<lobbyAvailableInteractions | undefined>(undefined);

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);

  }

  @postConstruct()
  private postConstruct() {
    this._logger.debug("Initializing lobby interactions service");
    this.setupAvailableInteractions();
  }

  private setupAvailableInteractions(){

    /* reset state on lobby join, left */
    this._lobbyService.lobby$.pipe(
      distinctUntilChanged(),
      pairwise(),
      map(([last, current]) => {
        if(last === null && current === null || last !== null && current === null) return undefined;
        if(last === null && current !== null) return {
          rateAvailable: true,
          votekickAvailable: true,
          interactionTarget: current.players.find(p => p.id === current.drawerId && p.id !== current.meId)
        };
        return null;
      })
    ).subscribe(update => {
      if(update !== null) {
        this._logger.info("Interactions reset on lobby join", update);
        this._availableInteractions$.next(update);
      }
    });

    /*reset on drawing start*/
    this._lobbyStateChangedEvent.events$.pipe(
      map(evt => evt.data.drawingStarted),
      filter(started => started !== undefined),
      withLatestFrom(this._availableInteractions$, this._lobbyService.lobby$),
      filter(([, state, lobby]) => state !== undefined && lobby !== null),
    ).subscribe(([drawer, state, lobby]) => {
      if(lobby === null || state === undefined) return;
      state.rateAvailable = true;
      state.votekickAvailable = true;
      state.interactionTarget = lobby.players.find(p => p.id === drawer.drawerId && p.id !== lobby.meId);

      this._logger.info("Interactions update on lobby change", state);
      this._availableInteractions$.next(state);
    });

    /* modify state on interaction */
    this._lobbyInteractedEvent.events$.pipe(
      withLatestFrom(this._availableInteractions$, this._lobbyService.lobby$),
      filter(([, state, lobby]) => state !== undefined && lobby !== null),
    ).subscribe(([event, state, lobby]) => {
      if(lobby === null || state === undefined) return;

      const {likeInteraction, dislikeInteraction, votekickInteraction} = event.data;
      if(likeInteraction?.sourcePlayerId === lobby.meId || lobby.drawerId === null) state.rateAvailable = false;
      if(dislikeInteraction?.sourcePlayerId === lobby.meId || lobby.drawerId === null) state.rateAvailable = false;
      if(votekickInteraction?.sourcePlayerId === lobby.meId) state.votekickAvailable = false;

      this._logger.info("Interactions update on interaction", state);
      this._availableInteractions$.next(state);
    });

    this._availableInteractions$.subscribe(state => this._logger.info("Available interactions", state));
  }

  public get availableInteractions$() {
    return this._availableInteractions$.asObservable();
  }

  public async likePlayer(){
    const relay = await this._skribblMessageRelaySetup.complete();
    relay.insertMessage({data: 1, id: 8});
  }

  public async dislikePlayer(){
    const relay = await this._skribblMessageRelaySetup.complete();
    relay.insertMessage({data: 0, id: 8});
  }

  public async votekickPlayer(id: number){
    const relay = await this._skribblMessageRelaySetup.complete();
    relay.insertMessage({data: id, id: 5});
  }

}