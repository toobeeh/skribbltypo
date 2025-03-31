import { inject, injectable } from "inversify";
import { loggerFactory } from "../logger/loggerFactory.interface";
import { LoggerService } from "../logger/logger.service";

@injectable()
export abstract class Setup<TData>{

  protected readonly _logger: LoggerService;
  private _setupPromise: Promise<TData> | undefined;

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory
  ) {
    this._logger = loggerFactory(this);
  }

  protected abstract runSetup(): Promise<TData>;

  public complete() {
    if(this._setupPromise === undefined){
      this._logger.info("Running setup");
      this._setupPromise = this.runSetup();
      this._setupPromise.then(() => {
        this._logger.info("Setup completed");
      });
    }

    return this._setupPromise;
  }
}