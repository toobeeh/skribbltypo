import { ServiceBinding, serviceBinding } from "@/content/core/feature/service-binding";
import { ToolbarImageLabFeature } from "@/content/features/toolbar-imagelab/toolbar-imagelab.feature";
import { convertOldSkd } from "@/util/skribbl/skd";
import { inject, injectable } from "inversify";
import { BehaviorSubject } from "rxjs";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

export interface savedDrawCommands {
  name: string;
  commands: number[][]
}

@injectable()
export class DrawCommandsService {

  private readonly _logger;
  private _savedDrawCommands$?: BehaviorSubject<savedDrawCommands[]>;
  private _serviceBinding: ServiceBinding;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
    @inject(serviceBinding) serviceBinding: serviceBinding
  ) {
    this._logger = loggerFactory(this);
    this._serviceBinding = serviceBinding(ToolbarImageLabFeature, this.init.bind(this), this.reset.bind(this));
  }

  public get enabled() {
    return this._serviceBinding.active;
  }

  public get savedDrawCommands$() {
    if (!this._savedDrawCommands$) {
      this._logger.error("Tried to access saved draw commands without initializing the service first. Imagelab feature enabled?");
      throw new Error("illegal state");
    }
    return this._savedDrawCommands$;
  }

  private reset() {
    this._savedDrawCommands$ = undefined;
  }

  private init() {
    this._savedDrawCommands$ = new BehaviorSubject<savedDrawCommands[]>([]);
  }

  public saveDrawCommands(name: string, commands: number[][] | number[][][]) {
    if (!this._savedDrawCommands$) {
      this._logger.warn("Tried to save draw commands without initializing the service first. Imagelab feature enabled?");
      return;
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
      return;
    }
    this._savedDrawCommands$.next(this._savedDrawCommands$.value.filter((item, i) => i !== index));
  }
}