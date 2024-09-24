export const elements = (sourceElement: HTMLElement, position: InsertPosition, parentElement: HTMLElement) => {
  parentElement.insertAdjacentElement(position, sourceElement);
  return sourceElement;
};

export const createElement = (htmlString: string) => {
  const template = document.createElement("template");
  template.innerHTML = htmlString.trim();
  return template.content.firstChild as HTMLElement;
};