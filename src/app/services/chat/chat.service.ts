import type { TypoFeature } from "@/app/core/feature/feature";
import { loggerFactory } from "@/app/core/logger/loggerFactory.interface";
import { MessageReceivedEventListener } from "@/app/events/message-received.event";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import {
  PrioritizedChatboxEventsSetup
} from "@/app/setups/prioritized-chatbox-events/prioritized-chatbox-events.setup";
import { SkribblMessageRelaySetup } from "@/app/setups/skribbl-message-relay/skribbl-message-relay.setup";
import type { skribblPlayer } from "@/util/skribbl/lobby";
import { inject, injectable, postConstruct } from "inversify";
import { filter, map, mergeWith, Subject, withLatestFrom } from "rxjs";
import MessageComponent from "./message.svelte";

export interface pendingMessage {
  player: skribblPlayer;
  content: string;
}

export interface pendingElement {
  title: string;
  content: string;
  element: HTMLElement;
  titleElement: HTMLElement;
  contentElement: HTMLElement;
}

export type chatboxEventFilter = "preventDefault" | "stopPropagation" | "both" | undefined;

@injectable()
export class ChatService {

  @inject(ElementsSetup) private _elementsSetup!: ElementsSetup;
  @inject(PrioritizedChatboxEventsSetup) private _chatboxEventsSetup!: PrioritizedChatboxEventsSetup;
  @inject(MessageReceivedEventListener) private _messageReceivedEventListener!: MessageReceivedEventListener;
  @inject(SkribblMessageRelaySetup) private _messageRelaySetup!: SkribblMessageRelaySetup;
  @inject(LobbyService) private lobbyService!: LobbyService;

  private readonly _logger;

  private _elementDiscovered$ = new Subject<pendingElement>();
  private _messageDiscovered$ = new Subject<pendingMessage>();
  private _playerMessageReceived$ = new Subject<pendingMessage & pendingElement>();

  private _lockedChatboxFeature: TypoFeature | null = null;
  private _cancelChatboxEventsFilter: ((e: KeyboardEvent) => chatboxEventFilter) | null = null;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  private postConstruct() {
    this._logger.debug("Initializing chat service");
    this.setupMessageObserver();
    this.setupChatboxCancelEventFilter();
  }

  private async setupChatboxCancelEventFilter() {
    const events = await this._chatboxEventsSetup.complete();

    const filter = (e: KeyboardEvent) => {
      if(this._cancelChatboxEventsFilter === null) return;
      const filter = this._cancelChatboxEventsFilter(e);
      if(filter === "preventDefault" || filter === "both") e.preventDefault();
      if(filter === "stopPropagation" || filter === "both") e.stopImmediatePropagation();
    };

    events.add("keyup", filter);
    events.add("keydown", filter);
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
      withLatestFrom(this.lobbyService.lobby$),
      map(([event, lobby]) => {
        if(lobby === null) {
          this._logger.warn("Message received but no lobby present", event.data);
          return;
        }

        const player = lobby.players.find(p => p.id === event.data.senderId);

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
        this._playerMessageReceived$.next(match);
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

  public get chatMessageAdded$() {
    return this._elementDiscovered$.asObservable();
  }

  public get playerMessageReceived$() {
    return this._playerMessageReceived$.asObservable();
  }

  /**
   * Sends a chat message over socket.io as the player
   */
  public async sendChatMessage(content: string){
    this._logger.debug("Sending chat message", content);

    const relay = await this._messageRelaySetup.complete();
    relay.insertMessage({id: 30, data: {msg: content}});
  }

  /**
   * Add a chat message to the local chat history
   * @param content
   * @param title
   * @param style
   */
  public async addChatMessage(content?: string, title?: string, style: "normal" |"info" | "success" | "warn" = "normal"){
    const elements = await this._elementsSetup.complete();

    const container = elements.chatContent;
    const isScrolledDown = container.scrollHeight - container.scrollTop - container.clientHeight < 50; // allow small margin to scroll down

    const message = new MessageComponent({
      target: container,
      props: { title: title ?? "", content, style }
    });

    const chatMessage = await message.message;
    if(isScrolledDown) container.scrollTo({ top: container.scrollHeight, behavior: "instant" });

    this._elementDiscovered$.next(chatMessage);
    return message;
  }

  public replaceChatboxContent(content: string, requestingFeature?: TypoFeature): boolean {
    if(this._lockedChatboxFeature && this._lockedChatboxFeature !== requestingFeature){
      this._logger.warn("Chatbox content replacement denied - chatbox locked by other feature", this._lockedChatboxFeature.name);
      return false;
    }

    this._elementsSetup.complete().then(elements => elements.chatInput.value = content);
    return true;
  }

  public requestChatboxLock(feature: TypoFeature, cancelEventFilter: null | ((e: KeyboardEvent) => chatboxEventFilter) = null): boolean {
    if(this._lockedChatboxFeature && this._lockedChatboxFeature !== feature){
      this._logger.warn("Chatbox lock request denied for feature - already locked by other feature", feature.name);
      return false;
    }
    this._lockedChatboxFeature = feature;
    this._cancelChatboxEventsFilter = cancelEventFilter;
    return true;
  }

  public releaseChatboxLock(feature: TypoFeature){
    if(this._lockedChatboxFeature !== feature){
      this._logger.error("Chatbox lock release denied for feature - feature does not have lock", feature.name);
      return;
    }
    this._lockedChatboxFeature = null;
    this._cancelChatboxEventsFilter = null;
  }
}