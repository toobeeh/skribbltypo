import { ExtensionContainer } from "@/content/core/extension-container/extension-container";
import type { LoggerService } from "@/content/core/logger/logger.service";
import { loggerFactory } from "@/content/core/logger/loggerFactory.interface";
import { skribblTool, ToolChangedEventListener } from "@/content/events/tool-changed.event";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import type { TypoDrawMod } from "@/content/services/tools/draw-mod";
import { TypoDrawTool } from "@/content/services/tools/draw-tool";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import {
  PrioritizedCanvasEventsSetup
} from "@/content/setups/prioritized-canvas-events/prioritized-canvas-events.setup";
import { replaceOrAddCssRule } from "@/util/document/replaceOrAddCssRule";
import type { Type } from "@/util/types/type";
import { inject, injectable, postConstruct } from "inversify";
import { BehaviorSubject, distinctUntilChanged, filter, map, pairwise, switchMap, withLatestFrom } from "rxjs";

export type drawCoordinateEvent = [number, number, number?];

@injectable()
export class ToolsService {

  @inject(PrioritizedCanvasEventsSetup) private readonly _prioritizedCanvasEventsSetup!: PrioritizedCanvasEventsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(ToolChangedEventListener) private readonly _toolChangedListener!: ToolChangedEventListener;
  @inject(ExtensionContainer) private readonly _extensionContainer!: ExtensionContainer;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;

  private readonly _logger: LoggerService;
  private readonly _activeTool$ = new BehaviorSubject<TypoDrawTool | skribblTool>(skribblTool.brush);
  private readonly _activeMods$ = new BehaviorSubject<TypoDrawMod[]>([]);

  private readonly _currentPointerDown$ = new BehaviorSubject<boolean>(false);
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
    this._activeTool$.subscribe(async tool => {
      if(tool instanceof TypoDrawTool) {
        if(!this._canvasCursorStyle.parentNode) document.body.appendChild(this._canvasCursorStyle);
        this._canvasCursorStyle.innerText = `#game-canvas canvas { cursor: ${tool.cursor.source} ${tool.cursor.x} ${tool.cursor.y}, auto !important; }`;
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
      withLatestFrom(this._activeTool$, this._activeMods$),
    ).subscribe(async ([[start, end], tool, mods]) => {
      this._logger.debug("Activating tool and applying mods", start, end);

      /* if tool is a typotool, apply effects from it as well */
      const allMods = [...mods, ...(tool instanceof TypoDrawTool ? [tool] : [])];

      /* apply mods and wait for result */
      for (const mod of allMods) {
        const modResult = mod.applyEffect([start[0], start[1]], [end[0], end[1]], end[2]);
        await modResult;
        this._logger.debug("Mod applied", mod);
      }

      /* create draw commands from tool */
      if(tool instanceof TypoDrawTool) {
        const commands = await tool.createCommands([start[0], start[1]], [end[0], end[1]], end[2]);
        if(commands.length > 0) {
          await this._drawingService.pasteDrawCommands(commands);
          this._logger.debug("Draw commands created by tool", tool, commands);
        }
        else {
          this._logger.debug("No draw commands created from tool", tool);
        }
      }
    });
  }

  private onCanvasDown(event: PointerEvent) {
    this._currentPointerDown$.next(true);
    this._lastPointerDownPosition$.next(event);
  }

  private onCanvasMove(event: PointerEvent) {
    if (this._currentPointerDown$.value) {
      this._lastPointerDownPosition$.next(event);
    }
  }

  private onDocumentUp() {
    this._currentPointerDown$.next(false);
    this._lastPointerDownPosition$.next(null);
  }

  private get drawCoordinates$() {
    return this._currentPointerDown$.pipe(
      distinctUntilChanged(),
      filter(down => down),
      switchMap(() => this._lastPointerDownPosition$.pipe(
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
    this._activeMods$.next([...this._activeMods$.value, mod]);
  }

  public removeMod(mod: TypoDrawMod) {
    this._logger.debug("Removing mod", mod);
    this._activeMods$.next(this._activeMods$.value.filter(m => m !== mod));
  }

  public get activeTool$() {
    return this._activeTool$.asObservable();
  }

  public resolveModOrTool<TMod>(tool: Type<TMod>){
    return this._extensionContainer.resolveService(tool);
  }
}
