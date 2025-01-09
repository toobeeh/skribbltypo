import { inject, injectable } from "inversify";
import { firstValueFrom, Subject } from "rxjs";
import type { ComponentProps, SvelteComponent } from "svelte";
import type { Type } from "@/util/types/type";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import Modal from "./modal.svelte";

export interface componentData<TComponent extends SvelteComponent> {
  componentType: Type<TComponent>;
  props: ComponentProps<TComponent>;
}

export interface modalHandle {
  close: () => void;
  closed: Promise<void>;
}

@injectable()
export class ModalService {

  private readonly _logger;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  public showModal<TComponent extends SvelteComponent>(
    componentType: Type<TComponent>, args: ComponentProps<TComponent>, title: string): modalHandle {

    const closed = new Subject<void>();

    const componentData: componentData<TComponent> = {componentType: componentType, props: args};
    const modal = new Modal({
      target: document.body,
      props: {
        componentData: componentData,
        closeHandler: () => {
          modal.$destroy();
          closed.next();
        },
        title
      }
    });

    const handle: modalHandle = {
      close: () => {
        modal.$destroy();
        closed.next();
      },
      closed: firstValueFrom(closed),
    };

    return handle;
  }
}