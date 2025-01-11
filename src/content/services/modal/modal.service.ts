import { inject, injectable } from "inversify";
import { firstValueFrom, Subject } from "rxjs";
import type { ComponentProps, SvelteComponent } from "svelte";
import type { Type } from "@/util/types/type";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";
import ModalDocument from "./modal-document.svelte";
import ModalCard from "./modal-card.svelte";

export interface componentData<TComponent extends SvelteComponent> {
  componentType: Type<TComponent>;
  props: ComponentProps<TComponent>;
}

export interface componentDataFactory<TComponent extends SvelteComponent, TResult> {
  componentType: Type<TComponent>;
  propsFactory: (submit: (result: TResult) => void) => ComponentProps<TComponent>;
  validate?: (result: TResult) => Promise<boolean> | boolean;
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
    componentType: Type<TComponent>,
    args: ComponentProps<TComponent>,
    title: string,
    style: "document" | "card" = "document"
  ) {

    const componentData: componentData<TComponent> = {componentType: componentType, props: args};
    const modal = style === "document" ? new ModalDocument({
      target: document.body,
      props: {
        componentData: componentData,
        closeHandler: () => {
          modal.$destroy();
        },
        title
      }
    }) : new ModalCard({
      target: document.body,
      props: {
        componentData: componentData,
        closeHandler: () => {
          modal.$destroy();
        },
        title
      }
    });
  }

  public async showPrompt<TComponent extends SvelteComponent, TResult>(
    componentType: Type<TComponent>,
    argsFactory: ((submit: (result: TResult) => void) => ComponentProps<TComponent>),
    title: string,
    style: "document" | "card" = "card",
    validate?: (result: TResult) => Promise<boolean> | boolean
  ): Promise<TResult | undefined> {

    const result$ = new Subject<TResult | undefined>();
    const submit = async (result: TResult) => {

      let validated = validate === undefined ? true : validate(result);
      if(validated instanceof Promise) validated = await validated;

      if(validated) result$.next(result);
    };
    const componentArgs = argsFactory(submit);

    const componentData: componentData<TComponent> = {componentType: componentType, props: componentArgs};
    const modal = style === "card" ? new ModalCard({
      target: document.body,
      props: {
        componentData: componentData,
        closeHandler: () => {
          modal.$destroy();
          result$.next(undefined);
        },
        title
      }
    }) : new ModalDocument({
      target: document.body,
      props: {
        componentData: componentData,
        closeHandler: () => {
          modal.$destroy();
          result$.next(undefined);
        },
        title
      }
    });

    const result = await firstValueFrom(result$);
    modal.$destroy();
    return result;
  }
}