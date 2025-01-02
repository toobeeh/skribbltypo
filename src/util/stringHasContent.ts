export const stringHasContent = (str: string | undefined): str is string => {
  return str !== undefined && str.trim().length > 0;
};