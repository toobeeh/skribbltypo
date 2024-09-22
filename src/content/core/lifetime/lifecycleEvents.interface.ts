export type LifecycleEventName = "docStart" | "domLoaded" | "nodeAdded";

interface LifecycleEventBase {
  name: LifecycleEventName;
  data: unknown;
}

export interface DomLoadedLifecycleEvent extends LifecycleEventBase {
  name: "domLoaded";
  data: {
    document: Document
  };
}

export interface DocStartLifecycleEvent extends LifecycleEventBase {
  name: "docStart";
  data: {
    document: Document
  };
}

export interface NodeAddedLifecycleEvent extends LifecycleEventBase {
  name: "nodeAdded";
  data: {
    node: HTMLElement;
  };
}

export type LifecycleEvent = DomLoadedLifecycleEvent | DocStartLifecycleEvent | NodeAddedLifecycleEvent;