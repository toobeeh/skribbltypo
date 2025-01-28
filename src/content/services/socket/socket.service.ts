import { TokenService } from "@/content/core/token/token.service";
import { getHubProxyFactory, getReceiverRegister } from "@/signalr/TypedSignalR.Client";
import { HubConnectionBuilder, type IHttpConnectionOptions, LogLevel } from "@microsoft/signalr";
import { inject, injectable } from "inversify";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

const hubTypeMap = {
  IGuildLobbiesHub: {
    url: "guildLobbies"
  },
  ILobbyHub: {
    url: "lobby"
  },
  IOnlineItemsHub: {
    url: "onlineItems"
  }
};

@injectable()
export class SocketService {

  private readonly _logger;

  private _baseUrl = /*"http://localhost:5001";*/ "https://sockets.typo.rip";
  private _token = "";

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(TokenService) tokenService: TokenService
  ) {
    this._logger = loggerFactory(this);
    tokenService.token.subscribe(token => this._token = token ?? "");
  }

  /**
   * creates a new signalr config based on set options
   * @private
   */
  private createSignalRConfig(): IHttpConnectionOptions {
    return {
      withCredentials: false,
      accessTokenFactory: () => this._token
    };
  }

  /**
   * create a new signalr client of given type
   * @returns
   * @param hubType
   * @param queryParams
   */
  createConnection<THub extends keyof typeof hubTypeMap>(hubType: THub) {

    const connection = new HubConnectionBuilder()
      .withUrl(`${this._baseUrl}/${hubTypeMap[hubType].url}`, this.createSignalRConfig())
      .configureLogging({ log: (logLevel: LogLevel, message: string) => {
          if(logLevel == LogLevel.Trace || logLevel == LogLevel.Debug) this._logger.debug(message);
          if(logLevel == LogLevel.Information || logLevel == LogLevel.Warning) this._logger.info(message);
          if(logLevel == LogLevel.Critical) this._logger.warn(message);
          if(logLevel == LogLevel.Error) this._logger.error(message);
        }
      })
      .build();
    return connection;
  }

  createHub = getHubProxyFactory;
  createReceiver = getReceiverRegister;

  /**
   * Set the base url which will be used for api calls
   * @param url
   */
  public set baseUrl(url: string) {
    this._baseUrl = url;
  }
}