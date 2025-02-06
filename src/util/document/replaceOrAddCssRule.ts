export const replaceOrAddCssRule = (styleSheet: HTMLStyleElement, cssText: string | undefined, index: number | undefined) => {
  if (cssText === undefined) {
    if (index !== undefined) {
      const rule = styleSheet.sheet?.cssRules[index];
      if(rule) rule.cssText = ".placeholder-empty-rule:not(*) {color: unset;}";
    }
    return undefined;
  }

  if (index !== undefined) {
    const rule = styleSheet.sheet?.cssRules[index];
    if(rule) rule.cssText = cssText;
    return index;
  }

  return styleSheet.sheet?.insertRule(cssText);
};