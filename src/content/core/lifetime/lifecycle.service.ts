import { Container } from "inversify";
import { ApiService } from "../api/api.service";
import { LoggerService } from "../logger/logger.service";
import { EventsService } from "../events/events.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { MemberService } from "../member/member.service";
import { ModalService } from "../modal/modal.service";
import { TokenService } from "../token/token.service";
import type { LifecycleEvent } from "./lifecycleEvents.interface";
import type { EventProcessorImplementationType } from "../events/eventProcessor";
import { EventListener } from "../events/eventListener";
import { ApplicationEvent } from "../events/applicationEvent";
import { loggerFactory } from "../logger/loggerFactory.interface";
import type { Type } from "../../../util/types/type";
import { TypoFeature } from "../feature/feature";
import { Setup } from "../setup/setup";

/**
 * Data interface for the event registration
 */
interface EventRegistration<TData, TEvent extends ApplicationEvent<TData>> {
   processorType: EventProcessorImplementationType<TData>;
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

   private readonly _features: Type<TypoFeature<LifecycleEvent>>[] = [];

   public constructor() {
      this.bindCoreServices();

      this._logger = this._diContainer.get<loggerFactory>(loggerFactory)(this);
      this._events = this._diContainer.get(EventsService);

      this._logger.debug("LifecycleService initialized");

      this.setupEvents();
      this.setupFeatureLifecycle();
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

   private setupFeatureLifecycle() {
      this._events$.subscribe((event) => {
         this._features.forEach(featureType => {
            const feature = this._diContainer.get(featureType);
            if(feature.canActivateWithEvent(event)) {
               feature.activate(event);
            }
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
      this._diContainer.bind(TokenService).toSelf().inSingletonScope();
      this._diContainer.bind(ApiService).toSelf().inSingletonScope();
      this._diContainer.bind(EventsService).toSelf().inSingletonScope();
      this._diContainer.bind(MemberService).toSelf().inSingletonScope();
      this._diContainer.bind(ModalService).toSelf();
   }

   public registerEventProcessors<T extends ApplicationEvent<unknown>>(...events: EventRegistration<unknown, T>[]) {
      events.forEach((event) => {

         /* add processor to container as singleton */
         this._diContainer.bind(event.processorType).toSelf().inSingletonScope();

         /* bind respective event listener */
         this._diContainer.bind(event.listenerType).toSelf().inRequestScope();
      });
   }

   public registerFeatures<T extends LifecycleEvent>(...features: Type<TypoFeature<T>>[]){
      features.forEach((feature) => {
         this._diContainer.bind(feature).toSelf().inSingletonScope();
         this._features.push(feature as unknown as Type<TypoFeature<LifecycleEvent>>);
      });
   }

   public registerSetups(...setups: Type<Setup<unknown>>[]){
      setups.forEach((setup) => {
         this._diContainer.bind(setup).toSelf().inSingletonScope();
      });
   }
}