import { typoRuntime } from "@/runtime/runtime";
import { element, requireElement } from "@/util/document/requiredQuerySelector";
import { BehaviorSubject, combineLatestWith, filter, firstValueFrom, map, type Observable, tap } from "rxjs";

export interface prioritizedCanvasEvents {
  add: (priority: listenerPriority) => HTMLCanvasElement["addEventListener"],
  remove: HTMLCanvasElement["removeEventListener"]
}

export interface prioritizedChatboxEvents {
  add: HTMLInputElement["addEventListener"],
  remove: HTMLInputElement["removeEventListener"]
}

export type listenerPriority = "preDraw" | "draw" | "postDraw";

export class Interceptor {

  private readonly _typoBodyLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _canvasFound$ = new BehaviorSubject<boolean>(false);
  private readonly _chatboxFound$ = new BehaviorSubject<boolean>(false);
  private readonly _contentScriptLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _patchLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _canvasPrioritizedEventsReady$ = new BehaviorSubject<prioritizedCanvasEvents | undefined>(undefined);
  private readonly _chatboxPrioritizedEventsReady$ = new BehaviorSubject<prioritizedChatboxEvents | undefined>(undefined);

  private readonly _canvasEventListener = new Map<string, Map<listenerPriority, Set<{priority: listenerPriority, handler: (e: Event) => (undefined | boolean)}>>>();
  private readonly _chatboxEventListener = new Map<string, Set<(e: Event) => (undefined | boolean)>>();

  private readonly _canvasPrioritizedEventsReady = firstValueFrom(this._canvasPrioritizedEventsReady$.pipe(
    filter(v => v !== undefined)
  ));
  private readonly _chatboxPrioritizedEventsReady = firstValueFrom(this._chatboxPrioritizedEventsReady$.pipe(
    filter(v => v !== undefined)
  ));

  constructor(private _debuggingEnabled = false) {
    this._typoBodyLoaded$.pipe(

      /* wait until typo loaded body manually - see loader.ts */
      filter((loaded) => loaded),

      /* trigger listeners that have to run on typo loaded body */
      tap(() => this.listenForCanvas()),
      tap(() => this.listenForChatbox()),

      /* wait for all prerequisites */
      combineLatestWith(this._canvasFound$, this._chatboxFound$, this._contentScriptLoaded$),
      filter(([, canvas, content]) => canvas && content)
    ).subscribe(() => {
      this.debug("All prerequisites executed, injecting patch and listening to events");
      this.listenPrioritizedCanvasEvents();
      this.listenPrioritizedChatboxEvents();
      this.injectPatch();
    });

    this.debug("Interceptor initialized, starting listeners for token and game.js");
    this.waitForTypoLoadedBody();

    this.patchLoaded$.subscribe(() => {
      document.body.dataset["typo_loaded"] = "true";
    });
  }

  private debug(...args: unknown[]){
    if(!this._debuggingEnabled) return;
    console.log("[INTERCEPTOR DEBUG]", ...args);
  }

  private injectPatch() {
    this.debug("Injecting game patch");

    const patch = document.createElement("script");
    patch.src = typoRuntime.getPatchUrl();
    patch.onload = async () => {

      /* signalize patched game is ready */
      this.debug("Game patch loaded");
      this._patchLoaded$.next(true);
      this._patchLoaded$.complete();
    };
    document.body.appendChild(patch);
  }

  private waitForTypoLoadedBody(){
    this.debug("Listening for body from typo loader");

    /* check if body is already added */
    if(document.body.dataset["typo_loader"] === "true") {
      this.debug("Body already loaded");
      this._typoBodyLoaded$.next(true);
      this._typoBodyLoaded$.complete();
      return;
    }

    /* observe changes in child list */
    const bodyObserver = new MutationObserver(() => {

      /* if body is not from typo loader, skip */
      if(document.body.dataset["typo_loader"] === "true") {
        this.debug("Typo body loaded");
        this._typoBodyLoaded$.next(true);
        this._typoBodyLoaded$.complete();
        bodyObserver.disconnect();
      }
    });

    bodyObserver.observe(document, {
      childList: true,
      subtree: true
    });
  }

  private listenForChatbox(){
    this.debug("Listening for chatbox");

    /* check if chatbox is already added */
    if(element("#game-chat .chat-form > input")) {
      this.debug("Chatbox already present");
      this._chatboxFound$.next(true);
      this._chatboxFound$.complete();
      return;
    }

    /* observe changes in child list */
    const chatboxObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if(mutation.type === "childList") {

          /* if chatbox element is found */
          const target = [...mutation.addedNodes].find(n => n.nodeName === "INPUT"
            && (n as HTMLInputElement).parentElement?.classList.contains("chat-form")
            && (n as HTMLInputElement).parentElement?.parentElement?.id === "game-chat"
          );
          if(target){
            this.debug("Chatbox found");
            this._chatboxFound$.next(true);
            this._chatboxFound$.complete();
          }
        }
      });
    });

    chatboxObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private listenPrioritizedChatboxEvents() {
    const chatbox = requireElement("#game-chat .chat-form > input") as HTMLInputElement;

    const addListener = (type: string, listener: (e: Event) => (undefined | boolean)) => {
      const listeners = this._chatboxEventListener.get(type);
      if(listeners === undefined) {
        this._chatboxEventListener.set(type, new Set([listener]));
      }
      else {
        listeners.add(listener);
      }
    };

    const removeListener = (type: string, listener: (e: Event) => (undefined | boolean)) => {
      const listeners = this._chatboxEventListener.get(type);
      if(listeners === undefined) return;
      listeners.delete(listener);
    };

    /* listen all events, execute prioritized listeners first */
    for (const key in chatbox) {
      if(/^on/.test(key)) {
        const eventType = key.slice(2);
        chatbox.addEventListener(eventType, event => {
          const eventListeners = this._chatboxEventListener.get(eventType);
          if(eventListeners === undefined) return;

          for(const listener of eventListeners){

            /* if listener returns false, cancel event and do not process any other listeners */
            if(listener(event) === false) {
              event.stopImmediatePropagation();
              return;
            }
          }
        });
      }
    }

    this._chatboxPrioritizedEventsReady$.next({
      add: addListener,
      remove: removeListener
    });
  }

  private listenForCanvas(){
    this.debug("Listening on DOM buildup until canvas element is added");

    /* check if canvas is already added */
    if(element("#game-canvas > canvas")) {
      this.debug("Canvas already present");
      this._canvasFound$.next(true);
      this._canvasFound$.complete();
      return;
    }

    /* observe changes in child list */
    const scriptObserver = new MutationObserver((mutations) => {

      mutations.forEach((mutation) => {
        if(mutation.type === "childList") {

          /* if canvas element is found */
          const target = [...mutation.addedNodes].find(n => n.nodeName === "CANVAS" && (n as HTMLCanvasElement).parentElement?.id === "game-canvas");
          if(target){
            this.debug("Canvas found");
            this._canvasFound$.next(true);
            this._canvasFound$.complete();
          }
        }
      });
    });

    scriptObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Listen to all events on the canvas and execute prioritized listeners first
   * Makes it possible to override skribbl event bindings on the canvas
   * @private
   */
  private listenPrioritizedCanvasEvents() {
    const addListener = (priority: listenerPriority) => {
      return (type: string, listener: (e: Event) => (undefined | boolean)) => {
        const listeners = this._canvasEventListener.get(type);
        if(listeners === undefined) {
          this._canvasEventListener.set(type, new Map([[priority, new Set([{priority, handler: listener}])]]));
        } else {
          const priorityListeners = listeners.get(priority);
          if(priorityListeners === undefined) {
            listeners.set(priority, new Set([{priority, handler: listener}]));
          } else {
            priorityListeners.add({priority, handler: listener});
          }
        }
      };
    };

    const removeListener = (type: string, listener: (e: Event) => (undefined | boolean)) => {
      const listeners = this._canvasEventListener.get(type);
      if(listeners === undefined) return;

      for(const priorityListeners of listeners.values()){
        for(const priorityListener of priorityListeners){
          if(priorityListener.handler === listener) {
            priorityListeners.delete(priorityListener);
          }
        }
      }
    };

    const canvas = requireElement("#game-canvas > canvas");

    /* listen all events, execute prioritized listeners first */
    for (const key in canvas) {
      if(/^on/.test(key)) {
        const eventType = key.slice(2);
        canvas.addEventListener(eventType, event => {
          const eventListeners = this._canvasEventListener.get(eventType);
          if(eventListeners === undefined) return;

          const listeners = [
            ...eventListeners.get("preDraw") ?? [],
            ...eventListeners.get("draw") ?? [],
            ...eventListeners.get("postDraw") ?? []
          ];

          for(const listener of listeners){

            /* if listener returns false, cancel event and do not process any other listeners */
            if(listener.handler(event) === false) {
              event.stopImmediatePropagation();
              return;
            }
          }
        });
      }
    }

    this._canvasPrioritizedEventsReady$.next({
      add: addListener,
      remove: removeListener
    });
  }

  public triggerPatchInjection(){
    if(this._contentScriptLoaded$.closed) throw new Error("Already triggered patch injection");

    this.debug("Content script loaded, triggering patch injection");
    this._contentScriptLoaded$.next(true);
    this._contentScriptLoaded$.complete();
  }

  public enableDebugging(){
    this._debuggingEnabled = true;
  }

  public get patchLoaded$(): Observable<void> {
    return this._patchLoaded$.pipe(
      filter(v => v),
      map(() => void 0)
    );
  }

  public get canvasPrioritizedEventsReady() {
    return this._canvasPrioritizedEventsReady;
  }

  public get chatboxPrioritizedEventsReady() {
    return this._chatboxPrioritizedEventsReady;
  }
}