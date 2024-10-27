import { LobbyService } from "@/content/services/lobby/lobby.service";
import { SocketService } from "@/content/services/socket/socket.service";
import type {
  SkribblLobbyStateDto, TypoLobbySettingsDto,
  TypoLobbyStateDto,
} from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import type { ILobbyHub } from "@/signalr/TypedSignalR.Client/tobeh.Avallone.Server.Hubs.Interfaces";
import { repeatAfterDelay } from "@/util/rxjs/repeatAfterDelay";
import type { skribblLobby } from "@/util/skribbl/lobby";
import type { HubConnection } from "@microsoft/signalr";
import { debounceTime, type Subscription } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";

interface lobbyConnectionState {
  connection: HubConnection,
  hub: ILobbyHub,
  typoLobbyState: TypoLobbyStateDto
}

export class LobbyStatusFeature extends TypoFeature {

  @inject(SocketService) private readonly _socketService!: SocketService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;

  private _lobbySubscription?: Subscription;
  private _connection?: lobbyConnectionState;
  private _abortConnecting?: () => void; /** abort the connection while it is still in setup phase and _connection is still undefined */
  private _existingTypoLobbyStates = new Map<string, TypoLobbyStateDto>();

  private get connection() {
    if(this._connection === undefined) {
      this._logger.error("connection is not initialized");
      throw new Error("connection is not initialized");
    }
    return this._connection;
  }

  private get isConnected() {
    return this._connection !== undefined;
  }

  public readonly name = "Lobby Status";
  public readonly description = "Lobby status description";
  public readonly featureId = 19;

  protected override async onActivate() {
    this._lobbySubscription = repeatAfterDelay(this._lobbyService.lobby$, 30 * 1000).pipe(
      debounceTime(2000) // start connection only after player has been in the lobby for 2s to avoid spamming
    )
      .subscribe(lobby => this.processLobbyUpdate(lobby));
  }

  protected override async onDestroy() {
    this._lobbySubscription?.unsubscribe();
    this._connection = this.destroyConnection();
    this._existingTypoLobbyStates.clear();
  }

  private setupConnection(){
    const connection = this._socketService.createConnection("ILobbyHub");
    const hub = this._socketService.createHub("ILobbyHub").createHubProxy(connection);
    this._socketService.createReceiver("ILobbyReceiver").register(connection, {
      lobbyOwnershipResigned: this.lobbyOwnershipResigned.bind(this),
      typoLobbySettingsUpdated: this.typoLobbySettingsUpdated.bind(this),
    });
    connection.onclose(async (error) => {
      this._logger.debug("SignalR Connection closed", error);
      this._connection = undefined;
    });

    setTimeout(async () => {
      await hub.updateTypoLobbySettings({description: "hi", whitelistAllowedServers: false, allowedServers: []});
    }, 50000);

    return { connection, hub };
  }

  private destroyConnection() {
    if(this._connection) {
      this._connection.connection.stop(); // do not wait to free up connection as fast as possible
    }
    if(this._abortConnecting) {
      this._abortConnecting();
    }
    return undefined;
  }

  private async processLobbyUpdate(lobby: skribblLobby | null) {

    this._logger.info("processing lobby status update", lobby);

    /* if lobby is null or practice and connection exists, disconnect */
    if(lobby === null || lobby.id === null) {
      this._connection = this.destroyConnection();
      return;
    }

    /* if lobby exists, but connection null, connect */
    if(lobby && !this.isConnected) {
      const connection = this.setupConnection();
      this._abortConnecting = async () => {
        this._logger.info("Aborting connection while still in  setup phase");
        await connection.connection.stop();
      };

      try {
        await connection.connection.start();
      }
      catch (e) {
        this._logger.error("Failed to setup socket connection", e);
        this._connection = this.destroyConnection();
        return;
      }

      const claim = this._existingTypoLobbyStates.get(lobby.id)?.ownershipClaimToken;
      const state = await connection.hub.lobbyDiscovered({ownerClaimToken: claim, lobby: this.mapLobbyToDto(lobby), playerId: lobby.meId});
      this._logger.info("Lobby discovered", state);

      this._connection = {...connection, typoLobbyState: state};
      this._abortConnecting = undefined;
      this._existingTypoLobbyStates.set(state.lobbyId, state);
    }

    /* if lobby exists, and connected, send update */
    if(lobby && this.isConnected) {
      await this.connection.hub.updateSkribblLobbyState(this.mapLobbyToDto(lobby));
    }
  }

  private async lobbyOwnershipResigned() {
    this._logger.info("Lobby ownership resigned, claiming now");
    await this.connection.hub.claimLobbyOwnership();
  }

  private async typoLobbySettingsUpdated(state: TypoLobbySettingsDto) {
    this.connection.typoLobbyState.lobbySettings = state;
    this.connection.typoLobbyState.playerIsOwner = state.lobbyOwnershipClaim === this.connection.typoLobbyState.ownershipClaim;
    this._logger.info("Lobby state updated", this.connection.typoLobbyState);
  }

  private mapLobbyToDto(lobby: skribblLobby): SkribblLobbyStateDto {
    if(lobby.id === null) throw new Error("cannot map practice lobby to state dto");

    return {
      link: lobby.id,
      ownerId: lobby.ownerId ?? undefined,
      round: lobby.round,
      players: lobby.players.map(player => ({ name: player.name, isDrawing: false, score: player.score, playerId: player.id, hasGuessed: player.guessed })),
      settings: {
        language: lobby.settings.language,
        players: lobby.settings.players,
        rounds: lobby.settings.rounds,
        drawTime: lobby.settings.drawTime
      }
    };
  }
}