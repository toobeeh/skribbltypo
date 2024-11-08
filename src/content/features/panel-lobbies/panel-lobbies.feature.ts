import { MemberService } from "@/content/services/member/member.service";
import { SocketService } from "@/content/services/socket/socket.service";
import type { GuildLobbiesUpdatedDto, GuildLobbyDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { fromObservable } from "@/util/store/fromObservable";
import type { HubConnection } from "@microsoft/signalr";
import { inject } from "inversify";
import { BehaviorSubject, combineLatestWith, map, tap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import PanelLobbies from "./panel-lobbies.svelte";

export class PanelLobbiesFeature extends TypoFeature {
  
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(SocketService) private readonly _socketService!: SocketService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  
  private _lobbies$ = new BehaviorSubject<Map<string, GuildLobbyDto[]>>(new Map<string, GuildLobbyDto[]>());

  private _component?: PanelLobbies;
  private _connection?: HubConnection;

  public readonly name = "Lobby List";
  public readonly description =
    "Displays online players from your connected discord servers on the start page";
  public readonly featureId = 6;

  protected override async onActivate() {
    const elements = await this._elements.complete();
    this._component = new PanelLobbies({
      target: elements.lobbiesTab,
      props: {
        feature: this,
      },
    });

    try {
     this._connection = await this.setupConnection();
    }
    catch (e) {
      this._logger.error("Failed to setup socket connection", e);
    }
  }

  protected override onDestroy(): void {
    this._component?.$destroy();
    this._connection?.stop();
  }

  private async setupConnection(){
    const connection = this._socketService.createConnection("IGuildLobbiesHub");
    const hubProxy = this._socketService.createHub("IGuildLobbiesHub").createHubProxy(connection);
    this._socketService.createReceiver("IGuildLobbiesReceiver").register(connection, {
      guildLobbiesUpdated: this.onGuildLobbiesUpdated.bind(this)
    });
    await connection.start();
    await this.onGuildLobbiesUpdated(await hubProxy.subscribeGuildLobbies("779435254225698827")); // todo for member guilds
    return connection;
  }
  
  private async onGuildLobbiesUpdated(lobbies: GuildLobbiesUpdatedDto){
    this._logger.info("Received guild lobbies for guild", lobbies.guildId);

    const current = structuredClone(this._lobbies$.value);
    current.set(lobbies.guildId, lobbies.lobbies);
    this._lobbies$.next(current);
  }

  public get lobbiesStore(){
    return fromObservable(this._lobbies$.pipe(
      map(lobbies => Array.from(lobbies.values()).flat()),
      combineLatestWith(this._memberService.member$),
      map(([lobbies, member]) => member === null || member === undefined ? "unauthorized" as const : lobbies),
      tap(lobbies => this._logger.info("Lobbies updated", lobbies))
    ), []);
  }
}