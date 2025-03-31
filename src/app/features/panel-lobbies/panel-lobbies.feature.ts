import type { MemberDto } from "@/api";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { MemberService } from "@/app/services/member/member.service";
import { SocketService } from "@/app/services/socket/socket.service";
import { ToastService } from "@/app/services/toast/toast.service";
import type { GuildLobbiesUpdatedDto, GuildLobbyDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import type { IGuildLobbiesHub } from "@/signalr/TypedSignalR.Client/tobeh.Avallone.Server.Hubs.Interfaces";
import { fromObservable } from "@/util/store/fromObservable";
import type { HubConnection } from "@microsoft/signalr";
import { inject } from "inversify";
import { BehaviorSubject, map, type Subscription, tap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import PanelLobbies from "./panel-lobbies.svelte";

export class PanelLobbiesFeature extends TypoFeature {
  
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(SocketService) private readonly _socketService!: SocketService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(ToastService) private readonly _toastService!: ToastService;

  private _showDiscoveredLobbiesSetting = this.useSetting(
    new BooleanExtensionSetting("show_discovered", true, this)
      .withName("Show discovered lobbies")
      .withDescription("Shows a list of lobbies that you were in before")
  );
  
  private _lobbies$ = new BehaviorSubject<Map<string, GuildLobbyDto[]> | null | undefined>(undefined);
  private _component?: PanelLobbies;
  private _connection?: HubConnection;
  private _memberSubscription?: Subscription;

  public readonly name = "Lobby List";
  public readonly description =
    "Displays online players from your connected discord servers on the start page";
  public readonly tags = [
    FeatureTag.SOCIAL,
    FeatureTag.PALANTIR
  ];
  public readonly featureId = 6;

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelLobbies({
      target: elements.lobbiesTab,
      props: {
        feature: this,
      },
    });

    this._memberSubscription = this._memberService.member$.subscribe(member => this.processMemberChange(member));
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
    this._connection?.stop();
    this._memberSubscription?.unsubscribe();
    this._memberSubscription = undefined;
  }

  public get lobbiesStore(){
    return fromObservable(this._lobbies$.pipe(
      map(lobbies => lobbies === null || lobbies === undefined ? lobbies : this.mapLobbiesToPlayerList(lobbies)),
      tap(lobbies => this._logger.info("Lobbies updated", lobbies))
    ), []);
  }

  public get discoveredLobbiesStore(){
    return fromObservable(this._lobbyService.discoveredLobbies$, []);
  }

  public get showDiscoveredLobbiesStore(){
    return this._showDiscoveredLobbiesSetting.store;
  }

  /**
   * Subscribe to guild lobbies of a member
   * @param member
   * @private
   */
  private async processMemberChange(member: MemberDto | null | undefined){
    this._logger.debug("Member changed", member);

    /*stop existing connection*/
    this._connection?.stop();

    /* if no member logged in, exit setup */
    if(member === null || member === undefined){
      this._lobbies$.next(member);
      return;
    }

    /* init with empty map */
    this._lobbies$.next(new Map());

    const initConnection = async () => {

      /* connect to server */
      const {connection, hubProxy} = await this.setupConnection();
      this._connection = connection;

      /* subscribe to all guilds of the member */
      await this.subscribeToLobbies(member, hubProxy);
      return connection;
    };

    const connection = await initConnection();
    this._socketService.reconnectOnUserInteraction(connection, () => initConnection());
  }

  /**
   * Connect to the guild lobby hub to receive updates
   * @private
   */
  private async setupConnection(){
    const connection = this._socketService.createConnection("IGuildLobbiesHub");
    const hubProxy = this._socketService.createHub("IGuildLobbiesHub").createHubProxy(connection);
    this._socketService.createReceiver("IGuildLobbiesReceiver").register(connection, {
      guildLobbiesUpdated: this.onGuildLobbiesUpdated.bind(this)
    });
    await connection.start();
    return { connection, hubProxy };
  }

  public async subscribeToLobbies(member: MemberDto, hub: IGuildLobbiesHub){

    /* subscribe to all guilds of the member */
    const promises = member.guilds.map(async guild => {
      const currentLobbies = await hub.subscribeGuildLobbies(guild.guildID);

      /* set initial guild lobbies */
      await this.onGuildLobbiesUpdated(currentLobbies);
    });
    await Promise.all(promises);
  }
  
  private async onGuildLobbiesUpdated(lobbies: GuildLobbiesUpdatedDto){
    this._logger.info("Received guild lobbies for guild", lobbies.guildId);

    const lastValue = this._lobbies$.value;
    if(lastValue === null || lastValue === undefined){
      this._logger.warn("Received guild lobbies but lobbies are not initialized yet", lobbies);
      return;
    }

    /* no issue with concurrency because reference and distinct write index */
    lastValue.set(lobbies.guildId, lobbies.lobbies);
    this._lobbies$.next(lastValue);
  }

  private mapLobbiesToPlayerList(lobbies: Map<string, GuildLobbyDto[]>){
    const distinct: GuildLobbyDto[] = [];
    const list = Array.from(lobbies.values()).flat();

    list.forEach(lobby => {
      if(!distinct.some(l => l.lobbyId === lobby.lobbyId && l.userName === lobby.userName)){
        distinct.push(lobby);
      }
    });

    return distinct;
  }

  public buildButtonTooltip(lobby: GuildLobbyDto){
    return `🔑  ${lobby.private ? "Custom" : "Public"}\n👥 ${lobby.currentPlayers} Players\n🏳️ ${lobby.language}`;
  }

  public async joinLobby(id: string, targetName?: string){
    const result = await this._lobbyService.joinLobby(id);
    if(result) await this._toastService.showToast(targetName ? `Joined the lobby of ${targetName}` : "Joined discovered lobby");
    else await this._toastService.showToast(targetName ? `Failed to join the lobby of ${targetName}` : "Failed to join discovered lobby");
  }
}