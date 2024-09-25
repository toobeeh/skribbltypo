import { inject, injectable } from "inversify";
import { BehaviorSubject } from "rxjs";
import type { ComponentProps, ComponentType, SvelteComponent } from "svelte";
import type { Type } from "../../../util/types/type";
import { loggerFactory } from "../logger/loggerFactory.interface";
import Modal from "./modal.svelte";

export interface componentData<TComponent extends SvelteComponent> {
  componentType: Type<TComponent>;
  props: ComponentProps<TComponent>;
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
    componentType: Type<TComponent>, args: ComponentProps<TComponent>): void {
    const componentData: componentData<TComponent> = {componentType: componentType, props: args};
    const modal = new Modal({
      target: document.body,
      anchor: document.body.firstElementChild!,
      props: {
        componentData: componentData,
        closeHandler: () => {
          modal.$destroy();
        },
        title: "Modal Title"
      }
    });
  }
}