export const replaceOrAddCssRule = (styleSheet: HTMLStyleElement, cssText: string | undefined, index: number | undefined) => {
  if (cssText === undefined) {
    if (index !== undefined) {
      const rule = styleSheet.sheet?.cssRules[index];
      if(rule) {
        styleSheet.sheet?.deleteRule(index);
        styleSheet.sheet?.insertRule(".placeholder-empty-rule:not(*) {color: unset;}", index);
      }
    }
    return index;
  }

  if (index !== undefined) {
    const rule = styleSheet.sheet?.cssRules[index];
    if(rule) {
      styleSheet.sheet?.deleteRule(index);
      styleSheet.sheet?.insertRule(cssText, index);
    }
    return index;
  }

  return styleSheet.sheet?.insertRule(cssText, styleSheet.sheet?.cssRules.length);
};