import { BehaviorSubject, filter, firstValueFrom, forkJoin, map } from "rxjs";

export class Interceptor {

  private readonly _originalGameStopped$ = new BehaviorSubject<boolean>(false);
  private readonly _contentScriptLoaded$ = new BehaviorSubject<boolean>(false);
  private readonly _tokenProcessed$ = new BehaviorSubject<boolean>(false);
  private readonly _patchLoaded$ = new BehaviorSubject<boolean>(false);

  private readonly _patchLoaded = firstValueFrom(this._patchLoaded$.pipe(
    filter(v => v),
    map(() => void 0)
  ));

  constructor() {
    forkJoin([
      this._originalGameStopped$, this._contentScriptLoaded$, this._tokenProcessed$])
      .subscribe(() => {
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

  public triggerPatchInjection(){
    if(this._contentScriptLoaded$.closed) throw new Error("Already triggered patch injection");

    this._contentScriptLoaded$.next(true);
    this._contentScriptLoaded$.complete();
  }

  public get patchLoaded() {
    return this._patchLoaded;
  }
}