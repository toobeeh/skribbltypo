import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { SocketService } from "@/content/services/socket/socket.service";
import type { OnlineItemDto, OnlineItemsUpdatedDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { inject, injectable, postConstruct } from "inversify";
import { BehaviorSubject } from "rxjs";

@injectable()
export class LobbyItemsService {

  @inject(SocketService) private readonly _socketService!: SocketService;

  private readonly _logger;
  private readonly _onlineItems$ = new BehaviorSubject<OnlineItemDto[]>([]);

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  private postConstruct() {
    this.setupConnection();
  }

  private async setupConnection(){
    const connection = this._socketService.createConnection("IOnlineItemsHub");
    this._socketService.createReceiver("IOnlineItemsReceiver").register(connection, {
      onlineItemsUpdated: this.onOnlineItemsUpdated.bind(this)
    });
    await connection.start();
  }

  async onOnlineItemsUpdated(update: OnlineItemsUpdatedDto) {
    this._logger.info("Online items updated", update);
    this._onlineItems$.next(update.items);
  }

  public get onlineItems$() {
    return this._onlineItems$.asObservable();
  }
}