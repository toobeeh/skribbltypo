export interface stylesheetHandle {
  remove(): void;
  sheet: CSSStyleSheet;
  clear(): void;
  replace(cssText: string): void;
}

/**
 * workaround since content scripts cant use adopted stylesheet in ff
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1770592
 */
export const createStylesheet: () => stylesheetHandle = () => {
  const style = document.createElement("style");
  document.head.append(style);
  if(style.sheet === null) {
    style.remove();
    throw new Error("Unable to create stylesheet");
  }

  const handle: stylesheetHandle = {
    sheet: style.sheet,
    remove: style.remove.bind(style),
    clear: () => {
      style.innerText = "";
    },
    replace: (cssText: string) => {
      style.innerText = cssText;
    },
  };
  return handle;
};