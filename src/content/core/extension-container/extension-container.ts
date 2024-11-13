import { FeaturesService } from "@/content/core/feature/features.service";
import { LoggingService } from "@/content/core/logger/logging.service";
import { TokenService } from "@/content/core/token/token.service";
import { Container } from "inversify";
import { LoggerService } from "../logger/logger.service";
import { EventsService } from "../event/events.service";
import { isEarlySetup } from "../setup/earlySetup.decorator";
import { EventProcessor} from "../event/eventProcessor";
import { EventListener } from "../event/eventListener";
import { ApplicationEvent } from "../event/applicationEvent";
import { loggerFactory } from "../logger/loggerFactory.interface";
import type { Type } from "@/util/types/type";
import { TypoFeature } from "../feature/feature";
import { Setup } from "../setup/setup";

/**
 * Data interface for the event registration
 */
export interface EventRegistration<TData, TEvent extends ApplicationEvent<TData>> {
   processorType: Type<EventProcessor<TData, TEvent>>;
   listenerType: Type<EventListener<TData, TEvent>>;
}

export class ExtensionContainer {

   /**
    * Root dependency injection container.
    * @private
    */
   private readonly _diContainer = new Container();

   private readonly _logging;
   private readonly _logger;
   private readonly _events;
   private readonly _features;

   public constructor() {
      this.bindCoreServices();

      this._logging = this._diContainer.get(LoggingService);
      this._logger = this._diContainer.get<loggerFactory>(loggerFactory)(this);
      this._events = this._diContainer.get(EventsService);
      this._features = this._diContainer.get(FeaturesService);

      this._logger.debug("Extension container initialized");
   }

   /**
    * Binds core services to the dependency injection container.
    * @private
    */
   private bindCoreServices() {
      this._diContainer.bind(ExtensionContainer).toConstantValue(this);
      this._diContainer.bind(LoggingService).toSelf().inSingletonScope();
      const logging = this._diContainer.get(LoggingService);

      this._diContainer.bind(LoggerService).toSelf();
      this._diContainer.bind<loggerFactory>(loggerFactory).toFactory<LoggerService, [object]>((context) => {
          return (loggerContext: object) => {
             const logger = context.container.get(LoggerService).bindTo(loggerContext);
             logging.trackLoggerInstance(logger);
             return logger;
          };
      });
      this._diContainer.bind(EventsService).toSelf().inSingletonScope();
      this._diContainer.bind(TokenService).toSelf().inSingletonScope();
      this._diContainer.bind(FeaturesService).toSelf().inSingletonScope();
   }

   public registerEventProcessors(...events: EventRegistration<unknown, ApplicationEvent<unknown>>[]) {
      events.forEach((event) => {

         /* add processor to container as singleton */
         this._diContainer.bind(event.processorType).toSelf().inSingletonScope();

         /* bind respective event listener */
         this._diContainer.bind(event.listenerType).toSelf().inRequestScope();
      });
      return this;
   }

   public registerFeatures(...features: Type<TypoFeature>[]){
      features.forEach((feature) => {

         /* add feature to container */
         this._diContainer.bind(feature).toSelf().inSingletonScope();
         const featureInstance = this._diContainer.get(feature);
         this._features.registerFeature(featureInstance);
      });
      return this;
   }

   public registerSetups(...setups: Type<Setup<unknown>>[]){
      setups.forEach((setup) => {
         this._diContainer.bind(setup).toSelf().inSingletonScope();

         /* if setup is marked as early, run immediately */
         if(isEarlySetup(setup)) {
            this._diContainer.get(setup).complete();
         }
      });
      return this;
   }

   public registerServices(...services: { type: Type<unknown>, scope: "singleton" | "scoped" }[]) {
      services.forEach((service) => {
         if(service.scope === "singleton") {
            this._diContainer.bind(service.type).toSelf().inSingletonScope();
         }
         else {
            this._diContainer.bind(service.type).toSelf();
         }
      });
      return this;
   }
}