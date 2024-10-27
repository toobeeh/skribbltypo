import { SocketService } from "@/content/services/socket/socket.service";
import type { HubConnection } from "@microsoft/signalr";
import { inject } from "inversify";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import PanelLobbies from "./panel-lobbies.svelte";

export class PanelLobbiesFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elements!: ElementsSetup;
  @inject(SocketService) private readonly _socketService!: SocketService;

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
    /*const subscription = this._socketService.createReceiver("IGuildLobbiesReceiver").register(connection, {});*/
    await connection.start();
    console.log(await hubProxy.subscribeGuildLobbies("779435254225698827"));
    return connection;
  }
}