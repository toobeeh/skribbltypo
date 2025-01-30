import type { drawCoordinateEvent } from "@/content/services/tools/tools.service";
import { Subject } from "rxjs";

interface stroke {
  lastSampleDate: number;
  pointerDownId: number;
  canvasRect: DOMRect;
  lastCoordinates: drawCoordinateEvent;
}

interface strokeCoordinates {
  from: drawCoordinateEvent,
  to: drawCoordinateEvent,
  stroke: number;
}

export class CoordinateListener {
  private _enabled = false;
  private _sampleRate = 1000 / 60;
  private _currentStroke?: stroke = undefined;

  private _strokes$ = new Subject<strokeCoordinates>();
  private _pointerDown$ = new Subject<PointerEvent>();
  private _pointerUp$ = new Subject<PointerEvent>();

  constructor(private readonly _canvas: HTMLCanvasElement) {}

  public set enabled(enabled: boolean) {
    this._enabled = enabled;
  }

  public set fps(fps: number) {
    this._sampleRate = 1000 / fps;
  }

  public get strokes$() {
    return this._strokes$.asObservable();
  }

  public get pointerDown$() {
    return this._pointerDown$.asObservable();
  }

  public get pointerUp$() {
    return this._pointerUp$.asObservable();
  }

  public onCanvasPointerDown(event: PointerEvent) {
    if (!this._enabled) return;

    event.stopImmediatePropagation();

    this._canvas.setPointerCapture(event.pointerId);
    const rect = this._canvas.getBoundingClientRect();


    const coords = this.mapPointerEventToDrawCoordinate(
      event,
      this._canvas,
      rect,
    );

    this._currentStroke = {
      canvasRect: rect,
      lastSampleDate: Date.now(),
      pointerDownId: event.pointerId,
      lastCoordinates: coords,
    };

    this._strokes$.next({from: coords, to: coords, stroke: this._currentStroke.pointerDownId});
    this._pointerDown$.next(event);

    /*document.body.dataset["bypassCommandRate"] = "true";*/
  }

  public onCanvasPointerMove(event: PointerEvent) {
    const now = Date.now();
    if (this._currentStroke === undefined || now - this._currentStroke.lastSampleDate < this._sampleRate) {
      return;
    }

    event.stopImmediatePropagation();

    this._currentStroke.lastSampleDate = now;
    const coords = this.mapPointerEventToDrawCoordinate(
      event,
      this._canvas,
      this._currentStroke.canvasRect,
    );

    this._strokes$.next({from: this._currentStroke.lastCoordinates, to: coords, stroke: this._currentStroke.pointerDownId});
    this._currentStroke.lastCoordinates = coords;
  }

  public onDocumentPointerUp(event: PointerEvent) {
    if (this._currentStroke === undefined) return;

    const coords = this.mapPointerEventToDrawCoordinate(
      event,
      this._canvas,
      this._currentStroke.canvasRect,
    );
    this._strokes$.next({from: this._currentStroke.lastCoordinates, to: coords, stroke: this._currentStroke.pointerDownId});
    this._pointerUp$.next(event);
    this._currentStroke = undefined;

    /*document.body.dataset["bypassCommandRate"] = "true";*/
  }

  private mapPointerEventToDrawCoordinate(
    event: PointerEvent,
    canvas: HTMLCanvasElement,
    canvasRect: DOMRect,
  ): drawCoordinateEvent {
    const canvasX = (event.offsetX * canvas.width) / canvasRect.width;
    const canvasY = (event.offsetY * canvas.height) / canvasRect.height;
    return [canvasX, canvasY, event.pointerType === "pen" ? event.pressure : undefined];
  }
}