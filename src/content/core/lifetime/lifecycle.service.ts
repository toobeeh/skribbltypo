import { Container } from "inversify";
import { LoggerService } from "../logger/logger.service";
import { EventsService } from "../event/events.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { isEarlySetup } from "../setup/earlySetup.decorator";
import type { LifecycleEvent } from "./lifecycleEvents.interface";
import { EventProcessor} from "../event/eventProcessor";
import { EventListener } from "../event/eventListener";
import { ApplicationEvent } from "../event/applicationEvent";
import { loggerFactory } from "../logger/loggerFactory.interface";
import type { Type } from "../../../util/types/type";
import { TypoFeature } from "../feature/feature";
import { Setup } from "../setup/setup";

/**
 * Data interface for the event registration
 */
export interface EventRegistration<TData, TEvent extends ApplicationEvent<TData>> {
   processorType: Type<EventProcessor<TData, TEvent>>;
   listenerType: Type<EventListener<TData, TEvent>>;
}

export class LifecycleService {

   /**
    * Root dependency injection container.
    * @private
    */
   private readonly _diContainer = new Container();

   private readonly _events$ = new Subject<LifecycleEvent>;
   private readonly _eventsWithHistory$ = new ReplaySubject<LifecycleEvent>();

   private readonly _logger;
   private readonly _events;

   private readonly _features: Type<TypoFeature>[] = [];

   public constructor() {
      this.bindCoreServices();

      this._logger = this._diContainer.get<loggerFactory>(loggerFactory)(this);
      this._events = this._diContainer.get(EventsService);

      this._logger.debug("LifecycleService initialized");
      this.setupEvents();
   }

   /**
    * Observable which emits lifecycle events as they happen.
    */
   public get events$(): Observable<LifecycleEvent> {
      return this._events$;
   }

   /**
    * Observable which emits lifecycle events, inclusive all events that happened before.
    */
   public get eventsWithHistory$(): Observable<LifecycleEvent> {
      return this._eventsWithHistory$;
   }

   /**
    * Sets up the lifecycle events subjects
    * @private
    */
   private setupEvents() {

      /* emit to history when event happened */
      this._events$.subscribe((event) => {
         this._eventsWithHistory$.next(event);
      });

      /* listen for dom load or dispatch immediately if already laoded */
      document.addEventListener("patchExecuted", () => {
         this._logger.debug("patchExecuted event fired");
         this._events$.next({
            name: "patchExecuted",
            data: { document }
         });
      });

      /* listen for dom load or dispatch immediately if already laoded */
      document.addEventListener("scriptStopped", () => {

         this._logger.debug("scriptStopped event fired");
         this._events$.next({
            name: "scriptStopped",
            data: { document }
         });
      });
   }

   /**
    * Binds core services to the dependency injection container.
    * @private
    */
   private bindCoreServices() {
      this._diContainer.bind(LoggerService).toSelf();
      this._diContainer.bind<loggerFactory>(loggerFactory).toFactory<LoggerService, [object]>((context) => {
          return (loggerContext: object) => {
              return context.container.get(LoggerService).bindTo(loggerContext);
          };
      });
      this._diContainer.bind(EventsService).toSelf().inSingletonScope();
   }

   public registerEventProcessors(...events: EventRegistration<unknown, ApplicationEvent<unknown>>[]) {
      events.forEach((event) => {

         /* add processor to container as singleton */
         this._diContainer.bind(event.processorType).toSelf().inSingletonScope();

         /* bind respective event listener */
         this._diContainer.bind(event.listenerType).toSelf().inRequestScope();
      });
   }

   public registerFeatures(...features: Type<TypoFeature>[]){
      features.forEach((feature) => {

         /* add feature to container */
         this._diContainer.bind(feature).toSelf().inSingletonScope();
         this._features.push(feature);

         /* activate feature; feature can delay activation by expressing dependencies via setups */
         const featureInstance = this._diContainer.get(feature);
         featureInstance.activate();
      });
   }

   public registerSetups(...setups: Type<Setup<unknown>>[]){
      setups.forEach((setup) => {
         this._diContainer.bind(setup).toSelf().inSingletonScope();

         /* if setup is marked as early, run immediately */
         if(isEarlySetup(setup)) {
            this._diContainer.get(setup).complete();
         }
      });
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
   }
}