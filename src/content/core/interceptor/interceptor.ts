import { requireElement } from "@/util/document/requiredQuerySelector";
import { BehaviorSubject, filter, firstValueFrom, forkJoin, map } from "rxjs";

export interface prioritizedCanvasEvents {
  add: HTMLCanvasElement["addEventListener"],
  remove: HTMLCanvasElement["removeEventListener"]
}

export class Interceptor {

  private readonly _originalGameStopped$ = new BehaviorSubject<boolean>(false);
  private readonly _contentScriptLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _tokenProcessed$ = new BehaviorSubject<boolean>(false);
  private readonly _patchLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _canvasPrioritizedEventsReady$ = new BehaviorSubject<prioritizedCanvasEvents | undefined>(undefined);

  private readonly _canvasEventTarget = document.createElement("canvas");
  private readonly _canvasEventListener = new Map<string, Set<(e: Event) => (undefined | boolean)>>();

  private readonly _patchLoaded = firstValueFrom(this._patchLoaded$.pipe(
    filter(v => v),
    map(() => void 0)
  ));

  private readonly _canvasPrioritizedEventsReady = firstValueFrom(this._canvasPrioritizedEventsReady$.pipe(
    filter(v => v !== undefined)
  ));

  constructor() {
    forkJoin([
      this._originalGameStopped$, this._contentScriptLoaded$, this._tokenProcessed$])
      .subscribe(() => {
        this.listenPrioritizedCanvasElements();
        this.injectPatch();
      });

    this.processToken();
    this.stopOriginalGame();
  }

  private injectPatch() {
    const patch = document.createElement("script");
    patch.src = chrome.runtime.getURL("gamePatch.js");
    patch.onload = async () => {

      /* signalize patched game is ready */
      this._patchLoaded$.next(true);
      this._patchLoaded$.complete();
    };
    document.body.appendChild(patch);
  }

  private async processToken(){
    const url = new URL(window.location.href);
    const tokenParam = url.searchParams.get("accessToken");
    if(tokenParam !== null) {
      await chrome.runtime.sendMessage({ type: "set token", token: tokenParam });
      url.searchParams.delete("accessToken");
      window.history.replaceState({}, "", url.toString());
    }

    this._tokenProcessed$.next(true);
    this._tokenProcessed$.complete();
  }

  private stopOriginalGame(){

    /* observe changes in child list */
    const scriptObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if(mutation.type === "childList") {

          /* if game.js script element is found */
          const target = [...mutation.addedNodes].find(n => n.nodeName === "SCRIPT" && (n as HTMLScriptElement).src.includes("game.js"));
          if(target){
            const script = target as HTMLScriptElement;
            script.type = "javascript/blocked"; // block for chrome
            script.addEventListener("beforescriptexecute", e => e.preventDefault(), { once: true }); // block for firefox
            script.remove();
            scriptObserver.disconnect();
            this._originalGameStopped$.next(true);
            this._originalGameStopped$.complete();
          }
        }
      });
    });

    scriptObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private listenPrioritizedCanvasElements() {
    this._canvasEventTarget.addEventListener = (type: string, listener: (e: Event) => (undefined | boolean)) => {
      if(!this._canvasEventListener.has(type)) this._canvasEventListener.set(type, new Set());
      this._canvasEventListener.get(type)?.add(listener);
    };

    this._canvasEventTarget.removeEventListener = (type: string, listener: (e: Event) => (undefined | boolean)) => {
      if(this._canvasEventListener.has(type)) this._canvasEventListener.get(type)?.delete(listener);
    };

    const canvas = requireElement("#game-canvas > canvas");
    console.log(canvas);

    /* listen all events, execute prioritized listeners first */
    for (const key in canvas) {
      if(/^on/.test(key)) {
        const eventType = key.slice(2);
        canvas.addEventListener(eventType, event => {
          const eventListeners = this._canvasEventListener.get(eventType);
          if(eventListeners === undefined) return;

          for(const listener of eventListeners){

            /* if listener returns false, cancel event */
            if(listener(event) === false) {
              event.stopImmediatePropagation();
              return;
            }
          }
        });
      }
    }

    this._canvasPrioritizedEventsReady$.next({
      add: this._canvasEventTarget.addEventListener,
      remove: this._canvasEventTarget.removeEventListener
    });
  }

  public triggerPatchInjection(){
    if(this._contentScriptLoaded$.closed) throw new Error("Already triggered patch injection");

    this._contentScriptLoaded$.next(true);
    this._contentScriptLoaded$.complete();
  }

  public get patchLoaded() {
    return this._patchLoaded;
  }

  public get canvasPrioritizedEventsReady() {
    return this._canvasPrioritizedEventsReady;
  }
}