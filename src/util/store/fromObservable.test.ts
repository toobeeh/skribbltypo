import { fromObservable } from "@/util/store/fromObservable";
import { BehaviorSubject, Subject } from "rxjs";
import { describe, expect, it } from "vitest";

describe("fromObservable", () => {

  const setupStoreFromSubject = (allowWriteBeforeEmit = true) => {
    const initialValue = "typo";
    const observable = new Subject<string>();
    const writtenValues = new BehaviorSubject<string | null>(null);
    const store = fromObservable(observable, initialValue, val => writtenValues.next(val), allowWriteBeforeEmit);
    return { store, observable, initialValue, writtenValues };
  };

  const setupStoreFromBehaviorSubject = (allowWriteBeforeEmit = true) => {
    const initialValue = "typo";
    const actualValue = "skribbltypo";
    const observable = new BehaviorSubject<string>(actualValue);
    const writtenValues = new BehaviorSubject<string | null>(null);
    const store = fromObservable(observable, initialValue, val => writtenValues.next(val), allowWriteBeforeEmit);
    return { store, observable, initialValue, actualValue, writtenValues };
  };

  it("should contain the initial value from the factory", () => {
    const { store, initialValue } = setupStoreFromSubject();

    return new Promise<void>((resolve) => {
      store.subscribe(val => expect(val).toBe(initialValue));
      resolve();
    });
  });

  it("should contain the initial value from a behaviorsubject", () => {
    const { store, actualValue } = setupStoreFromBehaviorSubject();

    return new Promise<void>((resolve) => {
      store.subscribe(val => expect(val).toBe(actualValue));
      resolve();
    });
  });

  it("should write back values to a behaviorsubject", () => {
    const { store, writtenValues } = setupStoreFromBehaviorSubject();

    const update = "hello there";
    store.set(update);
    expect(writtenValues.value).toBe(update);
  });

  it("should write back values to a behaviorsubject only after first emit, if sepecified", () => {
    const { store, writtenValues, observable } = setupStoreFromSubject(false);

    const update = "hello there";
    store.set(update);
    expect(writtenValues.value).not.toBe(update);
    observable.next("first emit");
    store.set(update);
    expect(writtenValues.value).toBe(update);
  });

});

