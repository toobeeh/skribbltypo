import { ExtensionContainer } from "@/content/core/extension-container/extension-container";
import type { LoggerService } from "@/content/core/logger/logger.service";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ColorChangedEventListener } from "@/content/events/color-changed.event";
import { SizeChangedEventListener } from "@/content/events/size-changed.event";
import { skribblTool, ToolChangedEventListener } from "@/content/events/tool-changed.event";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { ConstantDrawMod } from "@/content/services/tools/constant-draw-mod";
import type { drawModLine, TypoDrawMod } from "@/content/services/tools/draw-mod";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { Color } from "@/util/color";
import type { Type } from "@/util/types/type";
import { inject, injectable, postConstruct } from "inversify";
import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged,
  filter,
  map,
  pairwise,
  switchMap,
  withLatestFrom,
} from "rxjs";

export type drawCoordinateEvent = [number, number, number?];
export interface brushStyle {
  color: Color;
  size: number;
}

@injectable()
export class ToolsService {

  @inject(PrioritizedCanvasEventsSetup) private readonly _prioritizedCanvasEventsSetup!: PrioritizedCanvasEventsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ToolChangedEventListener) private readonly _toolChangedListener!: ToolChangedEventListener;
  @inject(ExtensionContainer) private readonly _extensionContainer!: ExtensionContainer;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(SizeChangedEventListener) private readonly _sizeChangedListener!: SizeChangedEventListener;
  @inject(ColorChangedEventListener) private readonly _colorChangedListener!: ColorChangedEventListener;

  private readonly _logger: LoggerService;
  private readonly _activeTool$ = new BehaviorSubject<TypoDrawTool | skribblTool>(skribblTool.brush);
  private readonly _activeMods$ = new BehaviorSubject<TypoDrawMod[]>([]);
  private readonly _activeBrushStyle$ = new BehaviorSubject<brushStyle>({ color: Color.fromHex("#000000"), size: 1 });

  private readonly _currentPointerDown$ = new BehaviorSubject<boolean>(false);
  private readonly _currentPointerDownPosition$ = new BehaviorSubject<PointerEvent | null>(null);
  private readonly _lastPointerDownPosition$ = new BehaviorSubject<PointerEvent | null>(null);
  private readonly _canvasCursorStyle = document.createElement("style");

  constructor(@inject(loggerFactory) loggerFactory: loggerFactory) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  private postConstruct() {
    this._logger.debug("Post construct");

    /* change tool when skribbl tool changed */
    this._toolChangedListener.events$.subscribe(event => {
      if(event.data !== skribblTool.deselected && event.data !== this._activeTool$.value){
        this._logger.debug("Tool changed event", event.data);
        this._activeTool$.next(event.data);
      }
    });

    /* change cursor when skribbltool active */
    this._activeTool$.pipe(
      combineLatestWith(this._activeBrushStyle$)
    ).subscribe(async ([tool, style]) => {
      if(tool instanceof TypoDrawTool) {
        if(!this._canvasCursorStyle.parentNode) document.body.appendChild(this._canvasCursorStyle);
        const cursor = tool.createCursor(style);
        this._canvasCursorStyle.innerText = `#game-canvas canvas { cursor: ${cursor.source} ${cursor.x} ${cursor.y}, auto !important; }`;
      }
      else {
        this._canvasCursorStyle.remove();
      }
    });

    /* set up listeners */
    this._prioritizedCanvasEventsSetup.complete().then(({add}) => {
      add("pointerdown", this.onCanvasDown.bind(this));
      add("pointermove", this.onCanvasMove.bind(this));
      document.addEventListener("pointerup", this.onDocumentUp.bind(this));
    });

    this.drawCoordinates$.pipe(
      withLatestFrom(this._activeTool$, this._activeMods$, this._activeBrushStyle$),
    ).subscribe(async ([[start, end], tool, mods, style]) => {
      this._logger.debug("Activating tool and applying mods", start, end);

      /* return if no mods or tool selected - else create draw commands through typo */
      if(mods.length === 0 && !(tool instanceof TypoDrawTool)) return;

      /* generate a shared id for every line created from the origin line */
      const eventId = Date.now();

      /* if tool is a typotool, apply effects from it as well */
      const allMods = [...mods, ...(tool instanceof TypoDrawTool ? [tool] : [])];

      let lines: drawModLine[] = [{from: [start[0], start[1]], to: [end[0], end[1]]}];
      let modStyle = structuredClone(style);
      const pressure = end[2];

      /* apply mods and wait for result */
      for (const mod of allMods) {

        /* for each line - mods may append or skip lines */
        const modLines: drawModLine[] = [];
        for(const line of lines) {
          const effect = await mod.applyEffect(line, pressure, style, eventId);
          modLines.push(...effect.lines);
          modStyle = effect.style;
          this._logger.debug("Mod applied", mod);
        }
        lines = modLines;
      }

      /* update brush style in skribbl if changed by mods */
      if(modStyle.size !== style.size) {
        this._logger.debug("Brush size changed by mods", modStyle.size);
        this._drawingService.setSize(modStyle.size);
      }

      /* update brush color if changed by mods */
      if(modStyle.color.typoCode !== style.color.typoCode) {
        this._logger.debug("Brush color changed by mods", modStyle.color);
        this._drawingService.setColor(modStyle.color);
      }

      /* create draw commands from tool based on processed lines and style */
      const commands: number[][] = [];
      if(tool instanceof TypoDrawTool) {
        for(const line of lines) {
          const lineCommands = await tool.createCommands(line, pressure, style, eventId);
          if(lineCommands.length > 0) {
            commands.push(...lineCommands);
            this._logger.debug("Adding commands created by tool", tool, commands);
          }
          else {
            this._logger.debug("No draw commands created from tool", tool);
          }
        }
      }

      /* create default draw commands as lines */
      else {
        for(const line of lines) {
          commands.push(this._drawingService.createLineCommands([...line.from, ...line.to], style.color.skribblCode, style.size));
        }
      }

      /* paste commands */
      await this._drawingService.pasteDrawCommands(commands);
    });

    /* set up brush style subscription */
    this._sizeChangedListener.events$.pipe(
      combineLatestWith(this._colorChangedListener.events$),
      map(([size, color]) => ({ size: size.data, color: color.data }))
    ).subscribe(style => this._activeBrushStyle$.next(style));
  }

  private onCanvasDown(event: PointerEvent) {

    /* process event through tools pipeline when typotool or skribbl brush + mods active */
    if(
      this._activeMods$.value.length > 0 && this._activeTool$.value === skribblTool.brush
      || this._activeTool$.value instanceof TypoDrawTool
    ) {
      event.stopImmediatePropagation();

      this._currentPointerDown$.next(true);
      this._currentPointerDownPosition$.next(event);
      this._lastPointerDownPosition$.next(event);
    }
  }

  private onCanvasMove(event: PointerEvent) {

    /* process event through tools pipeline when typotool or skribbl brush + mods active */
    if(
      this._activeMods$.value.length > 0 && this._activeTool$.value === skribblTool.brush
      || this._activeTool$.value instanceof TypoDrawTool
    ) {
      event.stopImmediatePropagation();

      if (this._currentPointerDown$.value) {
        this._currentPointerDownPosition$.next(event);
      }
    }
  }

  private onDocumentUp() {
    this._currentPointerDown$.next(false);
    this._currentPointerDownPosition$.next(null);
    this._lastPointerDownPosition$.next(null);
  }

  private get drawCoordinates$() {
    return this._currentPointerDown$.pipe(
      distinctUntilChanged(),
      filter(down => down),
      switchMap(() => this._currentPointerDownPosition$.pipe(
        map(event => event !== null ? this.mapPointerEventToDrawCoordinate(event) : null)
      )),
      pairwise(),
      map(([prev, curr]) => prev === null && curr !== null ? [curr, curr] : [prev, curr]),  /* if pointer down, make dot at start pos */
      filter(([prev, curr]) => prev !== null && curr !== null),
      map(([prev, curr]) => [prev, curr] as [drawCoordinateEvent, drawCoordinateEvent])
    );
  }

  /**
   * Map a pointer event to draw coordinates
   * @param event
   * @private
   */
  private mapPointerEventToDrawCoordinate(event: PointerEvent): drawCoordinateEvent {
    const canvas = event.currentTarget as HTMLCanvasElement;

    /* calculate canvas pixel position from canvas dimensions and actual rendered rectangle */
    const rect = canvas.getBoundingClientRect();
    const canvasX = event.offsetX * canvas.width / rect.width;
    const canvasY = event.offsetY * canvas.height / rect.height;

    return [canvasX, canvasY, event.pointerType === "pen" ? event.pressure : undefined];
  }

  /**
   * Set the selected skribbl tool id in the game patch
   * @param tool
   * @private
   */
  private setSkribblTool(tool: skribblTool) {
    this._logger.debug("Setting skribbl tool", tool);
    document.dispatchEvent(new CustomEvent("selectSkribblTool", { detail: tool }));
  }

  public activateTool(tool: TypoDrawTool | skribblTool) {
    this._logger.debug("Activating tool", tool);

    if(tool === this._activeTool$.value) {
      this._logger.debug("Tool already active", tool);
      return;
    }

    /* if typo tool, disable skribbl tool in game patch */
    if (tool instanceof TypoDrawTool) {
      this.setSkribblTool(skribblTool.deselected);
    }

    /* else select native skribbl tool */
    else {
      this.setSkribblTool(tool);
    }

    /* broadcast active tool */
    this._activeTool$.next(tool);
  }

  public activateMod(mod: TypoDrawMod) {
    this._logger.debug("Activating mod", mod);

    /* if mod is not constant, deactivate all other non-constant mods */
    let mods = this._activeMods$.value;
    if(!(mod instanceof ConstantDrawMod)) {
      mods = mods.filter(m => m instanceof ConstantDrawMod);
    }

    this._activeMods$.next([...mods, mod]);
  }

  public removeMod(mod: TypoDrawMod) {
    this._logger.debug("Removing mod", mod);
    this._activeMods$.next(this._activeMods$.value.filter(m => m !== mod));
  }

  public get activeTool$() {
    return this._activeTool$.asObservable();
  }

  public get activeMods$() {
    return this._activeMods$.asObservable();
  }

  public get lastPointerDownPosition$() {
    return this._lastPointerDownPosition$.asObservable();
  }

  public resolveModOrTool<TMod>(tool: Type<TMod>){
    return this._extensionContainer.resolveService(tool);
  }
}
