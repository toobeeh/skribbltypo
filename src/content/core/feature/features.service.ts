import type { TypoFeature } from "@/content/core/feature/feature";
import type { Type } from "@/util/types/type";
import { inject, injectable } from "inversify";
import { Subject } from "rxjs";
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

  private _featureStates = new Subject<{feature: TypoFeature, running: boolean}>();

  public async registerFeature(feature: TypoFeature) {
    if(this.features.some(f => f.featureId === feature.featureId)) {
      this._logger.error("Attempted to register a feature with a duplicate ID");
      throw new Error("Duplicate feature ID");
    }
    this._features.push(feature);
    feature.activated$.subscribe(state => this._featureStates.next({ feature: feature, running: state }));
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

  getFeatureState(feature: Type<TypoFeature>){
    const state =  this._features.find(f => f instanceof feature)?.state === "running";
    return state ?? false;
  }

  public get featureStates$(){
    return this._featureStates.asObservable();
  }
}