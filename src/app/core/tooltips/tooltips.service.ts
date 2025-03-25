import type { TypoFeature } from "@/app/core/feature/feature";
import { loggerFactory } from "@/app/core/logger/loggerFactory.interface";
import { inject, injectable } from "inversify";
import { map, startWith, Subject } from "rxjs";

export interface tooltipParams {
  title: string;
  lock?: "X" | "Y";
}

export interface registeredTooltip extends tooltipParams {
  target: HTMLElement;
  feature: TypoFeature
}

@injectable()
export class TooltipsService {

  private readonly _logger;
  private _registeredTooltips: Map<HTMLElement,registeredTooltip> = new Map<HTMLElement, registeredTooltip>();
  private _changes = new Subject<void>();
  private readonly _tooltipClass = "typo-tooltip-registered";

  /**
   * When elements are removed from the DOM, check if they or their children were registered as tooltips, and remove them
   * @private
   */
  private _observer = new MutationObserver(mutations => {
    let removed = false;

    mutations.forEach(mutation => {
      if(mutation.type === "childList") {
        mutation.removedNodes.forEach(node => {
          if(node instanceof HTMLElement) {

            const tooltips = this.getTooltipsOfElement(node);
            tooltips.forEach(element => {
              if(element instanceof HTMLElement) {
                this._logger.debug("Removing tooltip from element", element);
                this._registeredTooltips.delete(element);
                removed = true;
              }
            });
          }
        });
      }
    });

    if(removed) this._changes.next();
  });

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
    this._observer.observe(document.body, {childList: true, subtree: true});
  }

  /**
   * Register a tooltip for an element
   * If this element has already a tooltip registered, it will be overwritten
   * @param element
   * @param params
   * @param feature
   */
  public registerTooltip(element: HTMLElement, params: tooltipParams, feature: TypoFeature) {
    if(this._registeredTooltips.has(element)) {
      this._logger.debug("Overriding tooltip for element", element, params, feature);
    }

    const tooltip: registeredTooltip = {target: element, ...params, feature: feature};
    this._registeredTooltips.set(element, tooltip);
    element.classList.toggle(this._tooltipClass, true);

    this._changes.next();
    this._logger.debug("Registered tooltip", tooltip);
  }

  public get tooltips$() {
    return this._changes.pipe(
      startWith(null),
      map(() => Array.from(this._registeredTooltips.values()))
    );
  }

  /**
   * Searches for tooltips in the given element and its children
   * @param element
   */
  public getTooltipsOfElement(element: HTMLElement): HTMLElement[] {
    const isTooltip = element.classList.contains(this._tooltipClass);
    const childTooltips = [...element.querySelectorAll(`.${this._tooltipClass}`)].filter(e => e instanceof HTMLElement);

    return isTooltip ? [element, ...childTooltips] : childTooltips;
  }


  /**
   * Searches for tooltips in the given element and its parents
   * @param element
   */
  public getTooltipsUntilElement(element: HTMLElement): HTMLElement[] {
    const tooltips = [];

    let currentTooltip: HTMLElement | null = element.closest(`.${this._tooltipClass}`);
    while(currentTooltip != null && currentTooltip.parentElement instanceof HTMLElement){
      tooltips.push(currentTooltip);
      currentTooltip = currentTooltip.parentElement.closest(`.${this._tooltipClass}`);
    }

    return tooltips;
  }
}