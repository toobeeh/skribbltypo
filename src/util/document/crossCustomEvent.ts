declare function cloneInto<T>(obj: T, targetScope: object, options?: object): T;

export function createCrossCustomEvent<T>(type: string, detail?: CustomEventInit<T>): CustomEvent<T> {
  if(cloneInto !== undefined && document.defaultView !== null){
    /* if cloneInto available (FF), use to access through content/page context*/
    const safeDetail = cloneInto ? cloneInto(detail, document.defaultView) : detail; /* if cloneInto available (FF), use to access through content/page context*/
    return new document.defaultView.CustomEvent(type, safeDetail);
  }
  return new CustomEvent(type, detail);
}