import { Observable } from "rxjs";
import { writable } from "svelte/store";

export function fromObservable<TData>(observable: Observable<TData>, initialValue: TData) {
  const store = writable(initialValue);

  const subscription = observable.subscribe({
    next: (value) => store.set(value),
    error: (err) => console.error("Error from observable:", err),
  });

  return {
    subscribe: store.subscribe,
    unsubscribe: () => subscription.unsubscribe()
  };
}