import { type MemberDto } from "@/api";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { MemberService } from "@/content/services/member/member.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { SocketService } from "@/content/services/socket/socket.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import type {
  SkribblLobbyStateDto, TypoLobbySettingsDto,
  TypoLobbyStateDto,
} from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import type { ILobbyHub } from "@/signalr/TypedSignalR.Client/tobeh.Avallone.Server.Hubs.Interfaces";
import { repeatAfterDelay } from "@/util/rxjs/repeatAfterDelay";
import type { skribblLobby } from "@/util/skribbl/lobby";
import { fromObservable } from "@/util/store/fromObservable";
import type { HubConnection } from "@microsoft/signalr";
import {
  BehaviorSubject,
  combineLatestWith,
  debounce,
  debounceTime, distinctUntilChanged,
  map,
  of,
  type Subscription,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import LobbyStatus from "./lobby-status.svelte";

interface lobbyConnectionState {
  connection: HubConnection,
  hub: ILobbyHub,
  typoLobbyState: TypoLobbyStateDto,
  member: MemberDto
}

export class LobbyStatusFeature extends TypoFeature {

  @inject(SocketService) private readonly _socketService!: SocketService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(GlobalSettingsService) private readonly _settingsService!: GlobalSettingsService;

  private _privateLobbyWhitelistEnabledSetting = new ExtensionSetting<boolean>("private_whitelist_enabled", false, this);
  private _publicLobbyWhitelistEnabledSetting = new ExtensionSetting<boolean>("public_whitelist_enabled", false, this);
  private _privateLobbyWhitelistedServersSetting = new ExtensionSetting<string[]>("private_whitelisted_servers", [], this);
  private _publicLobbyWhitelistedServersSetting = new ExtensionSetting<string[]>("public_whitelisted_servers", [], this);

  private _lobbySubscription?: Subscription;
  private _connection = new BehaviorSubject<undefined | lobbyConnectionState | "unauthorized">(undefined);
  private _abortConnecting?: () => void; /** abort the connection while it is still in setup phase and _connection is still undefined */
  private _currentBackendProcessing?: Promise<void>;
  private _existingTypoLobbyStates = new Map<string, TypoLobbyStateDto>();
  private _triggerManualRefresh$ = new BehaviorSubject(undefined);

  private _controlIcon?: IconButton;
  private _controlIconSubscription?: Subscription;
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;
  private _lobbyTypeSubscription?: Subscription;

  private get connection(): lobbyConnectionState {
    const connection = this._connection.value;
    if(connection === undefined || connection === "unauthorized") {
      this._logger.error("connection is not initialized");
      throw new Error("connection is not initialized");
    }
    return connection;
  }

  private get isConnected() {
    return this._connection.value !== undefined && this._connection.value !== "unauthorized";
  }

  public get connectionStore() {
    return fromObservable(this._connection, undefined);
  }

  public readonly name = "Lobby Status";
  public readonly description = "Lobby status description";
  public readonly featureId = 19;

  protected override async onActivate() {
    this._lobbyTypeSubscription = this._lobbyService.lobby$.pipe(
      map(lobby => lobby === null ? null : (lobby.id === null ? "practice" : (lobby.private ? "custom" : "public"))),
      distinctUntilChanged()
    ).subscribe(async type => {
      if(type === "public" || type === "custom") {
        await this.setupSettings();
      }
      else {
        this.destroySettings();
      }
    });

    this._lobbySubscription = repeatAfterDelay(this._lobbyService.lobby$.pipe(
      combineLatestWith(this._triggerManualRefresh$),
      map(([lobby]) => lobby),
    ), 30 * 1000).pipe(
      debounceTime(2000), // start connection only after player has been in the lobby for 2s to avoid spamming
      combineLatestWith(this._memberService.member$),
      debounce(() => this._currentBackendProcessing ?? of(0)) // allow only one backend processing at a time
    ).subscribe(([lobby, member]) => this._currentBackendProcessing = this.processLobbyUpdate(lobby, member));
  }

  protected override async onDestroy() {
    this._lobbySubscription?.unsubscribe();
    this._connection.next(await this.destroyConnection());
    this._existingTypoLobbyStates.clear();
    this._lobbyTypeSubscription?.unsubscribe();

    this.destroySettings();
  }

  private async setupSettings(){
    const elements = await this._elementsSetup.complete();

    this._controlIcon = new IconButton({
      target: elements.chatControls,
      props: {
        icon: "file-img-connection-gif",
        name: "Lobby Status",
        order: 2,
        size: "2rem",
        hoverMove: false,
        greyscaleInactive: true
      }
    });

    /* open settings when icon clicked */
    this._controlIconSubscription = this._controlIcon.click$.subscribe(() => {

      /* if already opened, return */
      if (this._flyoutComponent) {
        return;
      }

      /* create fly out content */
      const flyoutContent: componentData<LobbyStatus> = {
        componentType: LobbyStatus,
        props: {
          feature: this,
        },
      };

      /* open flyout and destroy when closed */
      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          maxWidth: "300px",
          title: "Lobby Status",
          closeStrategy: "explicit",
          iconName: "file-img-connection-gif",
          alignment: "top"
        },
      });

      this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(() => {
        this._logger.info("Destroyed flyout");
        this._flyoutComponent?.$destroy();
        this._flyoutSubscription?.unsubscribe();
        this._flyoutComponent = undefined;
      });
    });
  }

  private destroySettings(){
    this._controlIcon?.$destroy();
    this._controlIconSubscription?.unsubscribe();
    this._controlIcon = undefined;
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
    this._flyoutComponent = undefined;
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
      this._connection.next(undefined);
    });

    return { connection, hub };
  }

  private async destroyConnection() {
    if(this._connection.value !== undefined && this._connection.value !== "unauthorized") {
      await this._connection.value.connection.stop();
    }
    if(this._abortConnecting) {
      this._abortConnecting();
    }

    /* close the flyout when lobby left */
    this._flyoutComponent?.close();

    return undefined;
  }

  private async processLobbyUpdate(lobby: skribblLobby | null, member: MemberDto | undefined | null): Promise<void> {

    this._logger.info("processing lobby status update", lobby, member?.userName);

    /* if member is null and connection exists, disconnect */
    if(member === null || member === undefined){
      await this.destroyConnection();
      this._connection.next("unauthorized");
      return;
    }

    /* if lobby is null or practice and connection exists, disconnect */
    if(lobby === null || lobby.id === null) {
      this._connection.next(await this.destroyConnection());
      return;
    }

    /* if lobby exists, but connection null, connect */
    if(lobby && !this.isConnected) {
      const connection = this.setupConnection();
      this._abortConnecting = async () => {
        this._logger.info("Aborting connection while still in setup phase");
        await connection.connection.stop();
      };

      try {
        await connection.connection.start();
      }
      catch (e) {
        this._logger.error("Failed to setup socket connection", e);
        this._connection.next(await this.destroyConnection());
        return;
      }
      const claim = this._existingTypoLobbyStates.get(lobby.id)?.ownershipClaimToken;
      const state = await connection.hub.lobbyDiscovered({ownerClaimToken: claim, lobby: this.mapLobbyToDto(lobby), playerId: lobby.meId});
      this._logger.info("Lobby discovered", state);
      this._connection.next({...connection, typoLobbyState: state, member});
      this._abortConnecting = undefined;
      this._existingTypoLobbyStates.set(state.lobbyId, state);

      // set default settings if owner and not a reconnect (existing claim undefined)
      if(state.playerIsOwner && claim === undefined) {
        const defaults = lobby.private ?{
          whitelistEnabled: await this._privateLobbyWhitelistEnabledSetting.getValue(),
          whitelist: await this._privateLobbyWhitelistedServersSetting.getValue()
        } : {
          whitelistEnabled: await this._publicLobbyWhitelistEnabledSetting.getValue(),
          whitelist: await this._publicLobbyWhitelistedServersSetting.getValue()
        };
        try {
          await connection.hub.updateTypoLobbySettings({
            description: "",
            whitelistAllowedServers: defaults.whitelistEnabled,
            allowedServers: defaults.whitelist});
        }
        catch (e) {
          this._logger.error("Failed to set defaults", e);
        }
      }
    }

    /* if lobby exists, and connected, send update */
    if(lobby && this.isConnected) {

      /* if current lobby is different from current connection, disconnect and reconnect, then run again */
      if(lobby.id !== this.connection.typoLobbyState.lobbyId) {
        this._logger.info("Lobby changed, reconnecting");
        this._connection.next(await this.destroyConnection());
        return this.processLobbyUpdate(lobby, member);
      }

      else await this.connection.hub.updateSkribblLobbyState(this.mapLobbyToDto(lobby));
    }

    this._logger.info("Lobby status processed");
  }

  private async lobbyOwnershipResigned() {
    this._logger.info("Lobby ownership resigned, claiming now");
    await this.connection.hub.claimLobbyOwnership();
  }

  private async typoLobbySettingsUpdated(state: TypoLobbySettingsDto) {
    const savedSettings = this._existingTypoLobbyStates.get(this.connection.typoLobbyState.lobbyId);
    if(savedSettings) savedSettings.lobbySettings = state;

    this.connection.typoLobbyState.lobbySettings = state;
    this.connection.typoLobbyState.playerIsOwner = state.lobbyOwnershipClaim === this.connection.typoLobbyState.ownershipClaim;
    this._connection.next(this.connection); // notify change
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
  
  public async updateLobbySettings(description: string, whitelistAllowedServers: boolean, allowedServers: Record<string, boolean>) {
    const toast = await this._toastService.showLoadingToast("Updating lobby settings");

    /* write settings to defaults */
    this._lobbyService.lobby$.subscribe(lobby => {
      if(!lobby) return;
      if(lobby.private) {
        this._privateLobbyWhitelistEnabledSetting.setValue(whitelistAllowedServers);
        this._privateLobbyWhitelistedServersSetting.setValue(Object.keys(allowedServers).filter(key => allowedServers[key]));
      }
      else {
        this._publicLobbyWhitelistEnabledSetting.setValue(whitelistAllowedServers);
        this._publicLobbyWhitelistedServersSetting.setValue(Object.keys(allowedServers).filter(key => allowedServers[key]));
      }
    });

    try {
      await this.connection.hub.updateTypoLobbySettings({
        description,
        whitelistAllowedServers,
        allowedServers: Object.entries(allowedServers)
          .filter(([, value]) => value)
          .map(([key]) => key)
      });
      toast.resolve();
    }
    catch (e) {
      this._logger.error("Failed to update lobby settings", e);
      toast.reject();
    }
  }

  public async resetConnection(){
    this._connection.next(await this.destroyConnection());
    await this._toastService.showToast(undefined, "Connection reset; reconnecting in next update cycle");
  }

  public async triggerManualRefresh() {
    this._triggerManualRefresh$.next(undefined);
    await this._toastService.showToast(undefined, "Manual refresh triggered");
  }

  public get isDevmodeStore() {
    return this._settingsService.settings.devMode.store;
  }
}