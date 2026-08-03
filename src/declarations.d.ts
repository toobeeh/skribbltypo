export {};

declare module "*?raw"
{
  const content: string;
  export default content;
}

declare global {
  interface Window {
    cloneInto?: <T>(obj: T, scope: Window) => T;
  }
}
