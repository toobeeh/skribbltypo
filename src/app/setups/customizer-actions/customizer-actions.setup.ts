import { requireElement } from "@/util/document/requiredQuerySelector";
import { Setup } from "../../core/setup/setup";
import CustomizerIcons from "./customizer-actions.svelte";

export class CustomizerActionsSetup extends Setup<HTMLElement> {

  protected async runSetup(): Promise<HTMLElement> {

    const component = new CustomizerIcons({
      target: requireElement(".avatar-customizer"),
    });

    return await component.element;
  }
}