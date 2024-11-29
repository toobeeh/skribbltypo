import { TypoFeature } from "@/content/core/feature/feature";
import type { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { distinctUntilChanged, forkJoin, map, of, Subject, type Subscription, tap } from "rxjs";

export class HotkeysFeature extends TypoFeature {

  public readonly name = "Hotkeys";
  public readonly description = "Activate actions of features with key combinations";
  public readonly featureId = 25;

  private _pressedKeys = new Set<string>();
  private _releaseCandidates = new Set<HotkeyAction>();
  private _keysReleased$ = new Subject<string[]>();
  private _keysPressed$ = new Subject<string[]>();
  private _pressedSubscription?: Subscription;
  private _releasedSubscription?: Subscription;

  private readonly keydownListener = this.handleKeydown.bind(this);
  private readonly keyupListener = this.handleKeyup.bind(this);

  protected override async onActivate() {
    document.addEventListener("keydown", this.keydownListener);
    document.addEventListener("keyup", this.keyupListener);

    /* when keys pressed, execute hotkeys that are not currently down */
    this._pressedSubscription = this._keysPressed$.pipe(
      tap(keys => this._logger.debug("Keys pressed", keys)),
      distinctUntilChanged((a, b) => a.length === b.length && a.every((v, i) => v === b[i]))
    ).subscribe(keys => {
      this._logger.info("Keys pressed event", keys);
      const hotkeys = this._hotkeysService.registeredHotkeys;
      forkJoin(hotkeys.map(h => this._releaseCandidates.has(h) ?
        of({ executed:false, hotkey: h }) :
        h.executeIfMatches(keys).pipe(
          tap(executed => {
            if(executed) {
              this._releaseCandidates.add(h);
            }
          }),
          map(executed => ({ hotkey: h, executed }))
      ))).subscribe(result => {
        const executed = result.filter(r => r.executed);
        if(executed.length > 0) this._logger.info("Executed hotkeys", executed.map(r => r.hotkey.name));
      });
    });

    /* when keys released, test release for pressed hotkeys */
    this._releasedSubscription = this._keysReleased$.subscribe(keys => {
      this._logger.info("Keys released", keys);
      this._releaseCandidates.forEach(hotkey => {
        hotkey.releaseIfNotMatches(keys).subscribe(released => {
          if(released) {
            this._releaseCandidates.delete(hotkey);
            this._logger.info("Released hotkey", hotkey.name);
          }
        });
      });
    });
  }

  protected override async onDestroy() {
    document.removeEventListener("keydown", this.keydownListener);
    document.removeEventListener("keyup", this.keyupListener);
    this._pressedSubscription?.unsubscribe();
    this._pressedSubscription = undefined;
    this._releasedSubscription?.unsubscribe();
    this._releasedSubscription = undefined;
  }

  private handleKeydown(event: KeyboardEvent) {
    this._logger.debug("Keydown", event.code);
    this._pressedKeys.add(event.code);
    this._keysPressed$.next([...this._pressedKeys]);
  }

  private handleKeyup(event: KeyboardEvent) {
    this._logger.debug("Keyup", event.code);
    this._pressedKeys.delete(event.code);
    this._keysReleased$.next([...this._pressedKeys]);

    // because pressed filters out repeated events, needs change to detect same real down event again
    this._keysPressed$.next([...this._pressedKeys]);
  }
}