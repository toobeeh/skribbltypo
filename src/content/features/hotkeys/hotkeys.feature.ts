import { TypoFeature } from "@/content/core/feature/feature";
import { Subject, type Subscription } from "rxjs";

export class HotkeysFeature extends TypoFeature {

  public readonly name = "Hotkeys";
  public readonly description = "Activate actions of features with key combinations";
  public readonly featureId = 25;

  private _pressedKeys = new Set<string>();
  private _keysPressed$ = new Subject<string[]>();
  private _subscription?: Subscription;

  private readonly keydownListener = this.handleKeydown.bind(this);
  private readonly keyupListener = this.handleKeyup.bind(this);

  protected override async onActivate() {
    document.addEventListener("keydown", this.keydownListener);
    document.addEventListener("keyup", this.keyupListener);

    this._subscription = this._keysPressed$.subscribe(keys => {
      this._logger.debug("Keys pressed", keys);
      this._hotkeysService.executeHotkeys(keys).subscribe(result => {
        const executed = result.filter(r => r.executed);
        if(executed.length > 0) this._logger.info("Executed hotkeys", executed.map(r => r.hotkey.name));
      });
    });
  }

  protected override async onDestroy() {
    document.removeEventListener("keydown", this.keydownListener);
    document.removeEventListener("keyup", this.keyupListener);
    this._subscription?.unsubscribe();
  }

  private handleKeydown(event: KeyboardEvent) {
    this._logger.debug("Keydown", event.code);
    this._pressedKeys.add(event.code);
    this._keysPressed$.next([...this._pressedKeys]);
  }

  private handleKeyup(event: KeyboardEvent) {
    this._logger.debug("Keyup", event.code);
    this._pressedKeys.delete(event.code);
  }
}