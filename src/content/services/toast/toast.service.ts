import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject, injectable } from "inversify";
import { type Observable, Subject } from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import Toast from "./toast.svelte";

export interface loadingToastHandle {
  close: () => void;
  resolve: (message?: string, timeout?: number) => void;
  reject: (message?: string, title?: string, timeout?: number) => void;
}

export interface stickyToastHandle {
  close: () => void;
  update: (title?: string, content?: string) => void;
  closed$: Observable<void>;
  resolve: (message?: string, timeout?: number) => void;
}

@injectable()
export class ToastService {

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(ElementsSetup) private readonly _elementsSetup: ElementsSetup
  ) {
    this._logger = loggerFactory(this);
  }

  /**
   * Show a toast with a title and message for a timespan
   * @param title
   * @param content
   * @param timeout
   */
  public async showToast(title?: string, content?: string, timeout?: number) {
    const elements = await this._elementsSetup.complete();
    const toast = new Toast({
      target: elements.toastContainer,
      props: {
        closeHandler: () => {
          toast.$destroy();
        },
        title,
        content,
        showLoading: false
      }
    });

    setTimeout(() => toast.close(), timeout ?? 3000);
  }

  /**
   * Show a sticky toast with a title and message
   * Will be kept open until manually closed
   * @param title
   * @param content
   * @param allowClose
   */
  public async showStickyToast(title?: string, content?: string, allowClose?: boolean): Promise<stickyToastHandle> {
    const elements = await this._elementsSetup.complete();
    const closed = new Subject<void>();
    const toast = new Toast({
      target: elements.toastContainer,
      props: {
        closeHandler: () => {
          toast.$destroy();
          closed.next();
        },
        title,
        content,
        showLoading: false,
        allowClose: allowClose === undefined ? false : allowClose
      }
    });


    return {
      close: () => toast.close(),
      update: (title?: string, content?: string) => {
        toast.$set({title, content});
      },
      closed$: closed.asObservable(),
      resolve: (message?: string, timeout?: number) => {
        toast.$set({showLoading: false, title: message ?? "Done"});
        setTimeout(() => toast.close(), timeout ?? 3000);
      }
    };
  }

  /**
   * Show a toast with a loading spinner and message
   * Returns a handler object which can be used to resolve the toast to a normal toast
   * with title/content, or an error toast with title/content, or defaults for error/success.
   * @param content
   */
  public async showLoadingToast(content: string): Promise<loadingToastHandle> {
    const elements = await this._elementsSetup.complete();
    const toast = new Toast({
      target: elements.toastContainer,
      props: {
        closeHandler: () => {
          toast.$destroy();
        },
        title: undefined as string | undefined,
        content,
        showLoading: true
      }
    });

    return {
      close: () => toast.close(),
      resolve: (message?: string, timeout?: number) => {
        toast.$set({showLoading: false, title: message ?? "Done"});
        setTimeout(() => toast.close(), timeout ?? 3000);
      },
      reject: (message?: string, title?: string, timeout?: number) => {
        toast.$set({showLoading: false, title: title ?? "Error"});
        if(message !== undefined) toast.$set({content: message});
        setTimeout(() => toast.close(), timeout ?? 3000);
      }
    };
  }
}