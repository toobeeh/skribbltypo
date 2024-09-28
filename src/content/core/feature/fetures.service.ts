import type { TypoFeature } from "@/content/core/feature/feature";
import { inject, injectable } from "inversify";
import { loggerFactory } from "../../core/logger/loggerFactory.interface";

@injectable()
export class FeaturesService {

  private readonly _logger;
  private _features: TypoFeature[] = [];

  constructor(
    @inject(loggerFactory) loggerFactory: loggerFactory,
  ) {
    this._logger = loggerFactory(this);
  }

  public async registerFeature(feature: TypoFeature) {
    this._features.push(feature);
    await feature.activate(); // TODO load from settings
  }

  public get features() {
    return [...this._features];
  }

  public async destroyFeature(feature: TypoFeature) {
    if(!this.features.includes(feature)) {
      this._logger.warn("Attempted to destroy a non-registered feature");
      throw new Error("Feature not registered");
    }

    if(feature.state === "destroyed") {
      this._logger.warn("Attempted to destroy an already destroyed feature");
      throw new Error("Feature already destroyed");
    }

    await feature.destroy();
  }

  public async activateFeature(feature: TypoFeature) {
    if(!this.features.includes(feature)) {
      this._logger.warn("Attempted to activate a non-registered feature");
      throw new Error("Feature not registered");
    }

    if(feature.state !== "destroyed") {
      this._logger.warn("Attempted to activate an already activated feature");
      throw new Error("Feature already activated");
    }

    await feature.activate();
  }
}