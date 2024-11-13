import { Observable } from "rxjs";
import { writable } from "svelte/store";

export function fromObservable<TData>(observable: Observable<TData>, initialValue: TData, onWrite?: (value: TData) => void, allowWriteBeforeEmit = true) {
  const store = writable(initialValue);

  /**
   * Allow writing back to source only when the observable has emitted at least once,
   * to prevent writing back a placeholder default value
   */
  let hasEmitted = allowWriteBeforeEmit;

  const subscription = observable.subscribe({
    next: (value) => {
      store.set(value);
      hasEmitted = true;
    },
    error: (err) => console.error("Error from observable:", err),
  });

  return {
    subscribe: store.subscribe,
    unsubscribe: () => subscription.unsubscribe(),
    set: (value: TData) => {
      store.set(value);
      if(hasEmitted) onWrite?.(value);
    },
  };
}