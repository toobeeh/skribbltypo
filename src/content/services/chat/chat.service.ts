import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { MessageReceivedEventListener } from "@/content/events/message-received.event";
import { PlayersService } from "@/content/services/players/players.service";
import type { SkribblLobbyPlayer } from "@/content/services/players/skribblLobbyPlayer";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject, injectable, postConstruct } from "inversify";
import { filter, map, mergeWith, Subject, withLatestFrom } from "rxjs";
import MessageComponent from "./message.svelte";

interface pendingMessage {
  player: SkribblLobbyPlayer;
  content: string;
}

interface pendingElement {
  title: string;
  content: string;
  element: HTMLElement;
  titleElement: HTMLElement;
  contentElement: HTMLElement;
}

@injectable()
export class ChatService {

  @inject(ElementsSetup) private _elementsSetup!: ElementsSetup;
  @inject(PlayersService) private _lobbyPlayersService!: PlayersService;
  @inject(MessageReceivedEventListener) private _messageReceivedEventListener!: MessageReceivedEventListener;

  private readonly _logger;

  private _elementDiscovered$ = new Subject<pendingElement>();
  private _messageDiscovered$ = new Subject<pendingMessage>();
  private _messageReceived$ = new Subject<pendingMessage & pendingElement>();

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  private postConstruct() {
    this._logger.debug("Initializing chat service");
    this.setupMessageObserver();
  }

  /**
   * Setup the message observer to link chat messages with lobby players
   * @private
   */
  private async setupMessageObserver() {

    /* listen for new message nodes to link with message event */
    const elements = await this._elementsSetup.complete();
    const elementObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          const addedNode = mutation.addedNodes[0] as HTMLElement;
          if (addedNode.tagName !== "P" || addedNode.children.length != 2) return;
          const title = addedNode.children[0];
          const content = addedNode.children[1];

          if(title.tagName !== "B" || content.tagName !== "SPAN") return;
          this._elementDiscovered$.next({
            title: title.textContent ?? "",
            content: content.textContent ?? "",
            element: addedNode,
            titleElement: addedNode.children[0] as HTMLElement,
            contentElement: addedNode.children[1] as HTMLElement
          });
        }
      });
    });
    elementObserver.observe(elements.chatContent, { childList: true, subtree: false });

    /* listen for new received messages and match with lobby player */
    this._messageReceivedEventListener.events$.pipe(
      withLatestFrom(this._lobbyPlayersService.lobbyPlayers$),
      map(([event, players]) => {
        const player = players.find(p => p.lobbyPlayerId === event.data.senderId);

        if (!player) {
          this._logger.warn("Player not found for message", event.data);
          return;
        }

        return {player, content: event.data.message};
      }),
      filter(data => data !== undefined)
    ).subscribe(data => this._messageDiscovered$.next(data));

    /* link lobby players, message content and element */
    const pendingMessages: pendingMessage[] = [];
    const pendingElements: pendingElement[] = [];

    this._messageDiscovered$.pipe(
      map(data =>pendingMessages.push(data)),
      mergeWith(this._elementDiscovered$.pipe(
        filter(element => element.content.length !== 0),
        map(data => pendingElements.push(data)))
      )
    ).subscribe(() => {
      const matches = this.findMessageMatches(pendingMessages, pendingElements);
      for(const match of matches){
        this._messageReceived$.next(match);
        this._logger.debug("Message match found", match);
      }
    });
  }

  /**
   * Find matches between recorded messages and chat elements
   * @param messages
   * @param elements
   * @private
   */
  private findMessageMatches(messages: pendingMessage[], elements: pendingElement[]){
    const matches = [];
    for(const message of messages){
      for(const element of elements){
        if(`${message.player.name}: ` === element.title && message.content === element.content){
          matches.push({...message, ...element});
          messages.splice(messages.indexOf(message), 1);
          elements.splice(elements.indexOf(element), 1);
          break;
        }
      }
    }
    return matches;
  }

  public get messageReceived$() {
    return this._messageReceived$.asObservable();
  }

  public async addChatMessage(content?: string, title?: string, style: "normal" |"info" | "success" | "warn" = "normal"){
    const elements = await this._elementsSetup.complete();

    const container = elements.chatContent;
    const isScrolledDown = container.scrollHeight - container.scrollTop - container.clientHeight < 50; // allow small margin to scroll down

    const message = new MessageComponent({
      target: container,
      props: { title: title ?? "", content, style }
    });
    
    if(isScrolledDown) container.scrollTo({ top: container.scrollHeight, behavior: "instant" });
    return message;
  }
}