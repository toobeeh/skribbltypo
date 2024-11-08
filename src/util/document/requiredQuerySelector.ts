export const requireElement = (selector: string, root: HTMLElement | undefined = undefined): HTMLElement => {
  const element = (root ?? document).querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Required element not found for selector: ${selector}`);
  }
  return element;
};

export const requireElements = (selector: string, root: HTMLElement | undefined = undefined): HTMLElement[] => {
  const elements = Array.from((root ?? document).querySelectorAll<HTMLElement>(selector));
  if (elements.length === 0) {
    throw new Error(`Required elements not found for selector: ${selector}`);
  }
  return elements;
};

export const element = (selector: string, root: HTMLElement | undefined = undefined): HTMLElement | null => {
  return (root ?? document).querySelector(selector);
};

export const elements = (selector: string, root: HTMLElement | undefined = undefined): HTMLElement[] => {
  return Array.from((root ?? document).querySelectorAll(selector));
};