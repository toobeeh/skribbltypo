import { EventProcessorImplementationType } from "./event-processor";

const applictionEventProcessorSymbol = Symbol("applictionEventprocessorSymbol");

export const ApplicationEventProcessor = (eventTypeInjectionSymbol: symbol) => {
  function decorate(target: EventProcessorImplementationType) {
    Reflect.defineMetadata(applictionEventProcessorSymbol, eventTypeInjectionSymbol, target);
  }
  return decorate;
};

export const getApplicationEventTypeInjectionSymbol = (target: EventProcessorImplementationType) => {
  const symbol = Reflect.getMetadata(applictionEventProcessorSymbol, target);
  if(symbol === undefined || symbol === null) {
    throw new Error("No event processor symbol found");
  }

  return symbol as symbol;
};
