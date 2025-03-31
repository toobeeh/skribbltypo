import type { MemberDto } from "@/api";
import type { featureBinding } from "@/app/core/feature/featureBinding";
import { loggerFactory } from "@/app/core/logger/loggerFactory.interface";
import { SocketService } from "@/app/services/socket/socket.service";
import type {
  AwardGiftedDto,
  DropAnnouncementDto,
  DropClaimResultDto, DropClearDto, SkribblLobbyStateDto, TypoLobbySettingsDto,
  TypoLobbyStateDto,
} from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import type { ILobbyHub } from "@/signalr/TypedSignalR.Client/tobeh.Avallone.Server.Hubs.Interfaces";
import type { HubConnection } from "@microsoft/signalr";
import { inject, injectable } from "inversify";
import { BehaviorSubject, Subject } from "rxjs";

interface lobbyConnectionState {
  connection: HubConnection,
  hub: ILobbyHub,
  typoLobbyState: TypoLobbyStateDto,
  member: MemberDto
}

@injectable()
export class LobbyConnectionService implements featureBinding {
  @inject(SocketService) private readonly _socketService!: SocketService;

  private readonly _logger;

  private _connection$ = new BehaviorSubject<undefined | lobbyConnectionState | "unauthorized">(undefined);
  private _existingTypoLobbyStates = new Map<string, TypoLobbyStateDto>();
  private _abortConnecting?: () => void; /** abort the connection while it is still in setup phase and _connection is still undefined */

  private _dropAnnounced$ = new Subject<DropAnnouncementDto>();
  private _dropClaimed$ = new Subject<DropClaimResultDto>();
  private _dropCleared$ = new Subject<DropClearDto>();
  private _awardGifted$ = new Subject<AwardGiftedDto>();

  constructor(@inject(loggerFactory) loggerFactory: loggerFactory) {
    this._logger = loggerFactory(this);
  }

  onFeatureActivate(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async onFeatureDestroy(): Promise<void> {
    await this.destroyConnection();
    this._existingTypoLobbyStates.clear();
  }

  public get dropAnnounced$() { return this._dropAnnounced$.asObservable(); }
  public get dropClaimed$() { return this._dropClaimed$.asObservable(); }
  public get awardGifted$() { return this._awardGifted$.asObservable(); }
  public get dropCleared$() { return this._dropCleared$.asObservable(); }

  /**
   * The current connection state
   * Throws if not connected
   * @private
   */
  public get connection(): lobbyConnectionState {
    const connection = this._connection$.value;
    if(connection === undefined || connection === "unauthorized") {
      this._logger.error("connection is not initialized");
      throw new Error("connection is not initialized");
    }
    return connection;
  }

  /**
   * Observable containing the current connection, emits when connection changed or settings updated
   */
  public get connection$(){
    return this._connection$.asObservable();
  }

  /**
   * Whether the current connection is established
   * @private
   */
  public get isConnected() {
    return this._connection$.value !== undefined && this._connection$.value !== "unauthorized";
  }

  /**
   * Sets up the connection to the lobby hub and initializes the receiver
   * @private
   */
  public async setupConnection(lobbyId: string, lobby: SkribblLobbyStateDto, playerId: number, member: MemberDto){
    const claim = this._existingTypoLobbyStates.get(lobbyId)?.ownershipClaimToken;
    const connection = this._socketService.createConnection("ILobbyHub");
    const hub = this._socketService.createHub("ILobbyHub").createHubProxy(connection);
    this._socketService.createReceiver("ILobbyReceiver").register(connection, {
      lobbyOwnershipResigned: this.lobbyOwnershipResigned.bind(this),
      typoLobbySettingsUpdated: this.typoLobbySettingsUpdated.bind(this),
      dropAnnounced: async drop => this._dropAnnounced$.next(drop),
      dropClaimed: async result => this._dropClaimed$.next(result),
      awardGifted: async award => this._awardGifted$.next(award),
      dropCleared: async clear => this._dropCleared$.next(clear)
    });

    connection.onclose(async (error) => {
      this._logger.debug("SignalR Connection closed", error);
      this._connection$.next(undefined);
    });

    this._abortConnecting = async () => {
      this._logger.info("Aborting connection while still in setup phase");
      await connection.stop();
    };

    try {
      await connection.start();
    }
    catch (e) {
      this._logger.error("Failed to setup socket connection", e);
      await this.destroyConnection();
      this._connection$.next(undefined);
      return "failed";
    }

    const state = await hub.lobbyDiscovered({ownerClaimToken: claim, lobby, playerId});
    this._logger.info("Lobby discovered", state);
    this._connection$.next({connection, hub, typoLobbyState: state, member});
    this._existingTypoLobbyStates.set(state.lobbyId, state);
    this._abortConnecting = undefined;

    return claim ? "reconnected" : "connected";
  }

  /**
   * Destroys the current connection if it exists, aborts a current connection setup if it is in progress,
   * and closes the flyout if opened
   * @private
   */
  public async destroyConnection(setUnauthorizedStatus = false) {
    if(this._connection$.value !== undefined && this._connection$.value !== "unauthorized") {
      await this._connection$.value.connection.stop();
    }
    if(this._abortConnecting) {
      this._abortConnecting();
    }

    if(setUnauthorizedStatus) this._connection$.next("unauthorized");
    else this._connection$.next(undefined);
  }

  /**
   * Signalr event handler when typo lobby settings have been updated
   * Saves new properties to current connection info
   * @param state
   * @private
   */
  private async typoLobbySettingsUpdated(state: TypoLobbySettingsDto) {
    const savedSettings = this._existingTypoLobbyStates.get(this.connection.typoLobbyState.lobbyId);
    if(savedSettings) savedSettings.lobbySettings = state;

    this.connection.typoLobbyState.lobbySettings = state;
    this.connection.typoLobbyState.playerIsOwner = state.lobbyOwnershipClaim === this.connection.typoLobbyState.ownershipClaim;
    this._connection$.next(this.connection); // notify change

    this._logger.info("Lobby state updated", this.connection.typoLobbyState);
  }

  /**
   * Signalr event handler when lobby ownership has been resigned
   * Attempts to claim the lobby ownership as a reaction
   * @private
   */
  private async lobbyOwnershipResigned() {
    this._logger.info("Lobby ownership resigned, claiming now");
    await this.connection.hub.claimLobbyOwnership();
  }

}