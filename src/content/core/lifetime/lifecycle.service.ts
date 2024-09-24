import { Container } from "inversify";
import { LoggerService } from "../logger/logger.service";
import { EventsService } from "../events/events.service";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { LifecycleEvent } from "./lifecycleEvents.interface";
import { EventProcessor, EventProcessorImplementationType } from "../events/event-processor";
import { EventListener } from "../events/event-listener";
import { getApplicationEventTypeInjectionSymbol } from "../events/applicationEvent.decorator";
import { TestFeature } from "../../features/test";
import { ApplicationEvent } from "../events/applicationEvent.interface";
import { loggerFactory } from "../logger/loggerFactory.interface";

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

   public constructor() {
      this.bindCoreServices();

      this._logger = this._diContainer.get(LoggerService).bindTo(this);
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

      /* initially fire page load event */
      this._logger.debug("docStart event fired");
      this._events$.next({
         name: "docStart",
         data: { document }
      });

      /* listen for dom load */
      document.addEventListener("DOMContentLoaded", () => {
         this._logger.debug("domLoaded event fired");
         this._events$.next({
            name: "domLoaded",
            data: { document }
         });
      });

      /* create a mutation observer and emit events */
      const observer = new MutationObserver((mutations) => {
         mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
               if(node instanceof HTMLElement) {
                  this._events$.next({
                     name: "nodeAdded",
                     data: { node }
                  });
               }
            });
         });
      });
      observer.observe(document.body, { childList: true, subtree: true });
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

   public registerEventProcessors(...processors: EventProcessorImplementationType[]) {
      processors.forEach((processor) => {

         const injectionSymbol = getApplicationEventTypeInjectionSymbol(processor);

         /* add processor to container as singleton, needs a named (with injection symbol for type) parent to inject this specific implementation */
         this._diContainer.bind<EventProcessor<ApplicationEvent>>(EventProcessor).to(processor).inSingletonScope().whenParentNamed(injectionSymbol);

         /* bind respective event listener with this injection symbol for listener type */
         this._diContainer.bind(EventListener).toSelf().inRequestScope().whenTargetNamed(injectionSymbol);
         this._logger.info(injectionSymbol);
      });

      /* TODO remove test */
      this._diContainer.bind(TestFeature).toSelf();
      this._diContainer.get(TestFeature);
   }
}