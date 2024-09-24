export const requireElement = (selector: string): HTMLElement => {
  const element = document.querySelector<HTMLElement>(selector);
  if (!element) {
    throw new Error(`Required element not found for selector: ${selector}`);
  }
  return element;
};

export const requireElements = (selector: string): HTMLElement[] => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (elements.length === 0) {
    throw new Error(`Required elements not found for selector: ${selector}`);
  }
  return elements;
};

export const element = (selector: string): HTMLElement | null => {
  return document.querySelector(selector);
};

export const elements = (selector: string): HTMLElement[] => {
  return Array.from(document.querySelectorAll(selector));
};