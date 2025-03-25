import { injectable } from "inversify";
import type { Observable } from "rxjs";

@injectable()
export abstract class TypoChallenge<TTrigger> {

  public abstract get name(): string;
  public abstract get description(): string;

  /**
   * Create a new observable that emits when trigger data changed,
   * indicating an update in the challenge state.
   */
  public abstract createTriggerObservable(): Observable<TTrigger>;

  /**
   * Apply the current game state to the challenge state.
   * @param trigger
   */
  public abstract apply(trigger: TTrigger): void | Promise<void>;

  /**
   * Destroy the challenge and clean up current state.
   * No subsequent calls to apply will be made to this instance,
   * until createTriggerObservable is called again.
   */
  public abstract destroy(): void | Promise<void>;
}