import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { inject, injectable } from "inversify";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import Toast from "./toast.svelte";

export interface loadingToastHandle {
  close: () => void;
  resolve: (message?: string, timeout?: number) => void;
  reject: (message?: string, title?: string, timeout?: number) => void;
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

  public async showToast(title: string, content: string, timeout?: number) {
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

  public async showLoadingToast(content: string): Promise<loadingToastHandle> {
    const elements = await this._elementsSetup.complete();
    const toast = new Toast({
      target: elements.toastContainer,
      props: {
        closeHandler: () => {
          toast.$destroy();
        },
        title: undefined,
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