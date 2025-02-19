import { ExtensionContainer } from "@/content/core/extension-container/extension-container";
import type { LoggerService } from "@/content/core/logger/logger.service";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { ColorChangedEventListener } from "@/content/events/color-changed.event";
import { SizeChangedEventListener } from "@/content/events/size-changed.event";
import { skribblTool, ToolChangedEventListener } from "@/content/events/tool-changed.event";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { ConstantDrawMod } from "@/content/services/tools/constant-draw-mod";
import { CoordinateListener } from "@/content/services/tools/coordinateListener";
import { TypoDrawMod, type drawModLine } from "@/content/services/tools/draw-mod";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { Color } from "@/util/color";
import type { Type } from "@/util/types/type";
import { inject, injectable, postConstruct } from "inversify";
import {
  BehaviorSubject, combineLatestWith, filter,
  map, mergeWith, switchMap,
  withLatestFrom,
} from "rxjs";

export type drawCoordinateEvent = [number, number, number?];
export interface brushStyle {

  /**
   * the original skribbl color code, or typo encoded hex
   */
  color: number;
  size: number;
}

@injectable()
export class ToolsService {

  @inject(PrioritizedCanvasEventsSetup) private readonly _prioritizedCanvasEventsSetup!: PrioritizedCanvasEventsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ToolChangedEventListener) private readonly _toolChangedListener!: ToolChangedEventListener;
  @inject(ExtensionContainer) private readonly _extensionContainer!: ExtensionContainer;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(SizeChangedEventListener) private readonly _sizeChangedListener!: SizeChangedEventListener;
  @inject(ColorChangedEventListener) private readonly _colorChangedListener!: ColorChangedEventListener;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  private readonly _logger: LoggerService;
  private readonly _activeTool$ = new BehaviorSubject<TypoDrawTool | skribblTool>(skribblTool.brush);
  private readonly _activeMods$ = new BehaviorSubject<TypoDrawMod[]>([]);
  private readonly _activeBrushStyle$ = new BehaviorSubject<brushStyle>({ color: Color.fromHex("#000000").skribblCode, size: 1 });
  private readonly _lastPointerDownPosition$ = new BehaviorSubject<PointerEvent | null>(null);
  private readonly _canvasCursorStyle = document.createElement("style");

  constructor(@inject(loggerFactory) loggerFactory: loggerFactory) {
    this._logger = loggerFactory(this);
  }

  @postConstruct()
  private postConstruct() {
    this._logger.debug("Post construct");
    this.initListeners();
  }

  private async initListeners(){
    const elements = await this._elementsSetup.complete();
    const listeners = await this._prioritizedCanvasEventsSetup.complete();

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

    /* set up brush style subscription */
    this._sizeChangedListener.events$.pipe(
      combineLatestWith(this._colorChangedListener.events$),
      map(([size, color]) => ({ size: size.data, color: color.data.skribblCode }))
    ).subscribe(style => this._activeBrushStyle$.next(style));

    /* set up events for custom stroke listener */
    const coordinateListener = new CoordinateListener(elements.canvas);
    listeners.add("draw")("pointerdown", coordinateListener.onCanvasPointerDown.bind(coordinateListener));
    listeners.add("draw")("pointermove", coordinateListener.onCanvasPointerMove.bind(coordinateListener));
    document.addEventListener("pointerup", coordinateListener.onDocumentPointerUp.bind(coordinateListener));

    /* current tools and draw style */
    const drawingMeta$ = this._activeTool$.pipe(
      combineLatestWith(this._activeMods$, this._activeBrushStyle$),
      map(([tool, mods, style]) => {
        const typoMods = tool instanceof TypoDrawTool ? [tool, ...mods] : mods;
        const typoTool = tool instanceof TypoDrawTool ? tool : undefined;
        return [style, typoTool, typoMods] as const;
      })
    );

    /* disable cursor updates while drawing with mods */
    this._activeMods$.pipe(
      combineLatestWith(this._activeTool$),
      filter(([mods, tool]) => tool instanceof TypoDrawTool || mods.length > 0),
      switchMap(() => coordinateListener.pointerDown$.pipe(
        map(() => true),
        mergeWith(coordinateListener.pointerUp$.pipe(map(() => false)))
      ))
    ).subscribe((isDrawing) => {
      this._drawingService.disableCursorUpdates(isDrawing);
    });

    /* listen for strokes and create typo tool commands */
    coordinateListener.strokes$.pipe(
      withLatestFrom(drawingMeta$)
    ).subscribe(([stroke, [style, tool, mods]]) => {
      this.processDrawCoordinates(stroke.from, stroke.to, tool, mods, style, stroke.stroke);
    });

    /* update last pointer down */
    coordinateListener.pointerDown$.subscribe((position) => this._lastPointerDownPosition$.next(position));

    /* set listening state of coordinate listener */
    this._lobbyService.lobby$.pipe(
      map(lobby => lobby?.meId === lobby?.drawerId),
      combineLatestWith(this._activeTool$, this._activeMods$),
      map(([isDrawer, tool, mods]) => isDrawer && (tool instanceof TypoDrawTool || tool === skribblTool.brush && mods.length > 0)),
    ).subscribe((enabled) => {
      coordinateListener.enabled = enabled;
    });
  }

  private async processDrawCoordinates(start: drawCoordinateEvent, end: drawCoordinateEvent, tool: TypoDrawTool | undefined, mods: TypoDrawMod[], style: brushStyle, strokeId: number) {
    this._logger.debug("Activating tool and applying mods", start, end);

    /* generate a shared id for every line created from the origin line */
    const eventId = Date.now();
    let lines: drawModLine[] = [{from: [start[0], start[1]], to: [end[0], end[1]]}];

    /* copy to avoid reference issues */
    let modStyle = structuredClone(style);
    const pressure = end[2];

    /* apply mods and wait for result */
    for (const mod of mods) {

      /* for each line - mods may append or skip lines */
      const modLines: drawModLine[] = [];
      for(const line of lines) {
        const effect = await mod.applyEffect(line, pressure, line.styleOverride ?? modStyle, eventId, strokeId);
        modLines.push(...effect.lines);
        modStyle = effect.style;
        this._logger.debug("Mod applied", mod);
      }
      lines = modLines;
    }

    /* update brush size in skribbl if changed by mods */
    /* disabled for now because of efficiency reasons - size only affects current event */
    /*if(modStyle.size !== style.size) {
      this._logger.debug("Brush size changed by mods", modStyle.size);
      this._drawingService.setSize(modStyle.size);
    }*/

    /* update brush color if changed by mods */
    if(modStyle.color !== style.color) {
      this._logger.debug("Brush color changed by mods", modStyle.color);
      this._drawingService.setColor(modStyle.color);
    }

    /* create draw commands from tool based on processed lines and style */
    const commands: number[][] = [];
    if(tool !== undefined) {
      for(let line of lines) {

        /* make sure line is safe - decimal places should not be submitted to skribbl */
        line = {from: [Math.floor(line.from[0]), Math.floor(line.from[1])], to: [Math.floor(line.to[0]), Math.floor(line.to[1])]};

        const lineCommands = await tool.createCommands(line, pressure, line.styleOverride ?? modStyle, eventId, strokeId);
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
        const lineCommand = this._drawingService.createLineCommand(
          [...line.from, ...line.to],
          line.styleOverride?.color ?? modStyle.color,
          line.styleOverride?.size ?? modStyle.size,
          false
        );
        if(lineCommand !== undefined) commands.push(lineCommand);
      }
    }

    /* paste commands */
    this._logger.info("Pasting draw commands", commands);
    await this._drawingService.pasteDrawCommands(commands, false);
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

    /* dry-run tool to trigger early settings load */
    if(tool instanceof TypoDrawMod) tool.applyEffect({from: [0,0], to: [0,0]}, undefined, {color: Color.fromHex("#000000").skribblCode, size: 1}, 0, 0);
    if(tool instanceof TypoDrawTool) tool.createCommands({from: [0,0], to: [0,0]}, undefined, {color: Color.fromHex("#000000").skribblCode, size: 1}, 0, 0);
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

  public get activeBrushStyle$() {
    return this._activeBrushStyle$.asObservable();
  }

  public get lastPointerDownPosition$() {
    return this._lastPointerDownPosition$.asObservable();
  }

  public resolveModOrTool<TMod>(tool: Type<TMod>){
    return this._extensionContainer.resolveService(tool);
  }
}
