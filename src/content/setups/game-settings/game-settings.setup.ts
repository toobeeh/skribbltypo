import { Setup } from "../../core/setup/setup";
import { requireElements } from "../../../util/document/requiredQuerySelector";

function getElements(){
  return {
    languageSettings: new Map(requireElements("#home .container-name-lang > select option")
      .map(item => ([Number((item as HTMLOptionElement).value), (item.textContent ?? "")]))),
  };
}
export type typoElements = ReturnType<typeof getElements>;

export class GameSettingsSetup extends Setup<typoElements> {
  protected async runSetup(): Promise<ReturnType<typeof getElements>> {
    return getElements();
  }
}