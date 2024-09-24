export type LifecycleEventName = "patchExecuted" | "scriptStopped";

interface LifecycleEventBase {
  name: LifecycleEventName;
  data: unknown;
}

export interface PatchExecutedLifecycleEvent extends LifecycleEventBase {
  name: "patchExecuted";
  data: {
    document: Document
  };
}

export interface ScriptStoppedLifecycleEvent extends LifecycleEventBase {
  name: "scriptStopped";
  data: {
    document: Document
  };
}

export type LifecycleEvent = PatchExecutedLifecycleEvent | ScriptStoppedLifecycleEvent;