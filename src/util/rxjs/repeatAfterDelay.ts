import { type Observable, repeat, takeUntil, timeout, timer } from "rxjs";

export function repeatAfterDelay<T>(source$: Observable<T>, delayMs: number): Observable<T> {
  return source$.pipe(
    // If no new value is emitted within the delay period, restart with the last emitted value
    timeout({each: delayMs, with: () => source$.pipe(takeUntil(timer(delayMs)))}),
    // Repeat when a timeout occurs
    repeat({delay: () => timer(delayMs)})
  );
}