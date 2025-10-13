// eslint-disable-next-line
export type TypedWorkerDefinition = Record<string, (...args: any[]) => any>;

export class TypedWorkerExecutor<TWorker extends TypedWorkerDefinition, TParentDefinition extends TypedWorkerDefinition>{

  private _worker: Worker;

  constructor(workerUrl: string, private _parent: TParentDefinition){
    this._worker = new Worker(workerUrl, { type: "module" });

    this._worker.addEventListener("message", (event) => {
      const { type, methodName, args } = event.data;
      if(type === "notification"){
        this._parent[methodName](...args);
      }
    });
  }

  public async run<T extends keyof TWorker>(methodName: T, ...args: Parameters<TWorker[T]>): Promise<ReturnType<TWorker[T]> | Error>{
    return new Promise((resolve) => {
      const messageId = Math.random().toString(36).slice(10);
      this._worker.addEventListener("message", (event) => {
        if(event.data.messageId === messageId && event.data.type === "result"){
          resolve(event.data.result);
        }
        else if(event.data.messageId === messageId && event.data.type === "error"){
          resolve(new Error(event.data.error));
        }
      });
      this._worker.postMessage({ methodName, args, messageId });
    });
  }
}

export class TypedWorker<TWorkerDefinition extends TypedWorkerDefinition, TParentDefinition extends TypedWorkerDefinition>{
  constructor(private worker: TWorkerDefinition){
    addEventListener("message", async (event) => {
      const { methodName, args, messageId } = event.data;
      try {
        const result = await this.worker[methodName](...args);
        postMessage({ type: "result", messageId, result });
      }
      catch (error) {
        postMessage({ type: "error", messageId, error: error instanceof Error ? error.message : String(error) });
      }
    });
  }

  send<T extends keyof TParentDefinition>(methodName: T, ...args: Parameters<TParentDefinition[T]>): void{
    postMessage({ type: "notification", methodName, args });
  }
}