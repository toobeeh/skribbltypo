import { TypoFeature } from "@/content/core/feature/feature";
import type { registeredTooltip } from "@/content/core/tooltips/tooltips.service";
import { BehaviorSubject, combineLatestWith, type Subscription } from "rxjs";
import Tooltip from "./tooltip.svelte";

interface activeTooltip {
  registration: registeredTooltip,
  tooltip: Tooltip
}

export class TooltipsFeature extends TypoFeature {

  public readonly name = "Tooltips";
  public readonly description = "Show helpful information when hovering over icons and buttons";
  public readonly featureId = 35;

  private readonly _pointeroverListener = this.handlePointerover.bind(this);
  private _currentTarget = new BehaviorSubject<HTMLElement | null>(null);
  private _targetSubscription?: Subscription;
  private _activeTooltips = new Map<HTMLElement, activeTooltip>();

  protected override async onActivate() {
    this._targetSubscription = this._currentTarget.pipe(
      combineLatestWith(this._tooltipsService.tooltips$)
    ).subscribe(([target, tooltips]) => {
      this.handleTooltipChange(target, tooltips);
    });
    document.addEventListener("pointerover", this._pointeroverListener);
  }

  protected override async onDestroy() {
    this._targetSubscription?.unsubscribe();
    this._targetSubscription = undefined;
    document.removeEventListener("pointerover", this._pointeroverListener);

    this._activeTooltips.forEach(t => t.tooltip.remove());
    this._activeTooltips.clear();
  }

  /**
   * handle a DOM pointerover event and refresh the current target
   * @param event
   * @private
   */
  private handlePointerover(event: PointerEvent) {
    this._logger.debug("Pointerover", event.target);
    const target = event.target;

    if(target instanceof HTMLElement){
      const targets = this._tooltipsService.getTooltipsUntilElement(target);

      if(targets.length >= 1){
        const target = targets[0];
        if(target !== this._currentTarget.value) {
          this._logger.info("Found new target", targets);
          this._currentTarget.next(target);
        }
      }
      else if(this._currentTarget.value !== null) {
        this._logger.info("Removed tooltip target", targets);
        this._currentTarget.next(null);
      }
    }
    else this._currentTarget.next(null);
  }

  /**
   * Refresh the currently displayed tooltips, after the target or registered tooltips changed
   * @param target
   * @param tooltips
   * @private
   */
  private handleTooltipChange(target: HTMLElement | null, tooltips: registeredTooltip[]){
    this._logger.info("Tooltip change", target, tooltips);

    /* remove inactive tooltips */
    this._activeTooltips.forEach(t => {
      if(t.registration.target !== target) {
        this._activeTooltips.delete(t.registration.target);
        t.tooltip.$destroy();
      }
    });

    /* create new if not present */
    if(target !== null && !this._activeTooltips.has(target)) {
      const registration = tooltips.find(t => t.target === target);
      if(!registration) return;

      const tooltip = this.buildTooltip(registration);
      this._activeTooltips.set(target, {registration, tooltip: tooltip});
    }
  }

  /**
   * Build a tooltip element and attach it to the DOM
   * @param tooltip
   * @private
   */
  private buildTooltip(tooltip: registeredTooltip): Tooltip {

    /* get direction with most space to viewport bounds */
    const coordinates = this.getVisibleDimensionsAndCoordinates(tooltip.target);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceTop = coordinates.top;
    const spaceBottom = viewportHeight - coordinates.top - coordinates.height;
    const spaceLeft = coordinates.left;
    const spaceRight = viewportWidth - coordinates.left - coordinates.width;

    /* set defaults, with respect of axis lock */
    let direction: "N" | "S" | "E" | "W" = tooltip.lock !== "Y" ? "E" : "N";
    let anchorX = tooltip.lock !== "Y" ? coordinates.left + coordinates.width : coordinates.left + coordinates.width / 2;
    let anchorY = tooltip.lock !== "Y" ? coordinates.top + coordinates.height / 2 : coordinates.top;

    /* check if another orientation is better, with respect to axis lock */
    if (tooltip.lock !== "X" && spaceTop > spaceBottom && (spaceTop > spaceLeft && spaceTop > spaceRight || tooltip.lock === "Y")) {
      direction = "N";
      anchorX = coordinates.left + coordinates.width / 2;
      anchorY = coordinates.top;
    } else if (tooltip.lock !== "X" && spaceBottom > spaceTop && (spaceBottom > spaceLeft && spaceBottom > spaceRight || tooltip.lock === "Y")) {
      direction = "S";
      anchorX = coordinates.left + coordinates.width / 2;
      anchorY = coordinates.top + coordinates.height;
    } else if (tooltip.lock !== "Y" && spaceLeft > spaceRight) {
      direction = "W";
      anchorX = coordinates.left;
      anchorY = coordinates.top + coordinates.height / 2;
    }

    const element = new Tooltip({
      target: document.body,
      props: {
        title: tooltip.title,
        anchorX,
        anchorY,
        direction
      }
    });
    return element;
  }

  /**
   * Get the visible dimensions and coordinates of an element, considering overflow
   * Caution: Chatgpt
   * Prompt:
   * write me a ts function that gets the dimensions and coordinates of the visible area of an element.
   * consider that elements can be scrollable (higher than visible), may not be the element that produces the overflow (clientHeight/Width does not directly work), and that there may be multiple ensted scrollable containers.
   * if there is anything else that should be considered, do so.
   * @param element
   */
  getVisibleDimensionsAndCoordinates(element: HTMLElement): {
    width: number;
    height: number;
    top: number;
    left: number;
  } {
    const elementRect = element.getBoundingClientRect();
    const visibleRect = {
      top: elementRect.top,
      left: elementRect.left,
      width: elementRect.width,
      height: elementRect.height,
    };

    let currentElement: HTMLElement | null = element;

    while (currentElement !== null) {
      const parent: HTMLElement | null = currentElement.parentElement;

      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const parentStyle = getComputedStyle(parent);

        if (parentStyle.overflow !== "visible") {
          visibleRect.top = Math.max(visibleRect.top, parentRect.top);
          visibleRect.left = Math.max(visibleRect.left, parentRect.left);
          visibleRect.width = Math.min(
            visibleRect.width,
            parentRect.right - visibleRect.left
          );
          visibleRect.height = Math.min(
            visibleRect.height,
            parentRect.bottom - visibleRect.top
          );
        }
      }

      currentElement = parent;
    }

    // Clip the visibleRect dimensions to fit within the viewport
    visibleRect.width = Math.min(visibleRect.width, window.innerWidth - visibleRect.left);
    visibleRect.height = Math.min(visibleRect.height, window.innerHeight - visibleRect.top);
    visibleRect.top = Math.max(visibleRect.top, 0);
    visibleRect.left = Math.max(visibleRect.left, 0);

    return {
      width: Math.max(0, visibleRect.width),
      height: Math.max(0, visibleRect.height),
      top: visibleRect.top,
      left: visibleRect.left,
    };
  }
}