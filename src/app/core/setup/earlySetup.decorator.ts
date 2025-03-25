import type { Type } from "@/util/types/type";
import type { Setup } from "./setup";

const decoratorSymbol = Symbol("earlySetup");

/* type decorator that sets metadata to define a setup that runs immediately without dependency */
export function earlySetup() {
  return function(target: Type<Setup<unknown>>) {
    Reflect.defineMetadata(decoratorSymbol, true, target);
  };
}

/* check if a setup is an early setup */
export function isEarlySetup(target: Type<Setup<unknown>>) {
  return Reflect.getMetadata(decoratorSymbol, target);
}

