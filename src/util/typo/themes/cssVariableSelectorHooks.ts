/**
 * Extract selectors that use color variables from a CSS stylesheet
 * @param cssText
 * @param colorVariables
 * @returns Record with a color variable as name and selectors that use it as value
 */
export const getCssVariableSelectorHooks = (cssText: string, colorVariables: string[]) => {

  // Parse the CSS text using a DOM parser
  const parser = new DOMParser();
  const css = parser.parseFromString(`<style>${cssText}</style>`, "text/html").querySelector("style");

  // Get all CSS rules from the stylesheet
  const rules = css?.sheet?.cssRules;
  if(rules === null || rules === undefined){
    throw new Error("Failed to parse css rules");
  }

  // Initialize an empty object to store selectors for each variable
  const variableSelectors: Record<string, string[]> = {};

  // Iterate through each color variable to initialize empty arrays for each one
  colorVariables.forEach((colorVariable) => {
    variableSelectors[colorVariable] = [];
  });

  // Iterate through each rule to find selectors with variables
  for (const rule of rules) {

    // Check if the rule is a CSSStyleRule (i.e., a selector with style properties)
    if (rule instanceof CSSStyleRule) {

      // Iterate through each style property to find variables
      for (const propertyName in rule.style) {
        const propertyValue = rule.style.getPropertyValue(propertyName);

        // Check if the property value contains any of the color variables
        colorVariables.forEach((colorVariable) => {
          if (propertyValue.includes(`var(${colorVariable}`)) {
            variableSelectors[colorVariable].push(rule.selectorText);
          }
        });
      }
    }
  }

  // Return an object with color variables as keys and an array of selectors where they are used as the value
  return variableSelectors;
};