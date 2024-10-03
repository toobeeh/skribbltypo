import type { featureBinding } from "@/content/core/feature/featureBinding";
import { convertOldSkd } from "@/util/skribbl/skd";
import { inject, injectable } from "inversify";
import { BehaviorSubject } from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

export interface savedDrawCommands {
  name: string;
  commands: number[][]
}

@injectable()
export class ImagelabService implements featureBinding {

  private readonly _logger;
  private _savedDrawCommands$?: BehaviorSubject<savedDrawCommands[]>;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  async onFeatureDestroy() {
    this._savedDrawCommands$ = undefined;
  }

  async onFeatureActivate() {
    this._savedDrawCommands$ = new BehaviorSubject<savedDrawCommands[]>([]);
  }

  public get savedDrawCommands$() {
    if (!this._savedDrawCommands$) {
      this._logger.error("Tried to access saved draw commands without initializing the service first. Imagelab feature enabled?");
      throw new Error("illegal state");
    }
    return this._savedDrawCommands$;
  }

  public saveDrawCommands(name: string, commands: number[][] | number[][][]) {
    if (!this._savedDrawCommands$) {
      this._logger.warn("Tried to save draw commands without initializing the service first. Imagelab feature enabled?");
      throw new Error("illegal state");
    }

    if(commands[0] && Array.isArray(commands[0]) && Array.isArray(commands[0][0])) {
      commands = convertOldSkd(commands as number[][][]);
    }
    else commands = commands as number[][];

    this._savedDrawCommands$.next([...this.savedDrawCommands$.value, { name, commands }]);
  }

  /**
   * Remove draw commands from saved commands
   * @param index
   */
  public removeSavedDrawCommands(index: number) {
    if (!this._savedDrawCommands$) {
      this._logger.warn("Tried to save draw commands without initializing the service first. Imagelab feature enabled?");
      throw new Error("illegal state");
    }
    this._savedDrawCommands$.next(this._savedDrawCommands$.value.filter((item, i) => i !== index));
  }
}