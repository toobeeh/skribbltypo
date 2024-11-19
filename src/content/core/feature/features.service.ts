import type { TypoFeature } from "@/content/core/feature/feature";
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
      this._logger.error("Attempted to register a feature with a duplicate ID", feature.name);
      throw new Error("Duplicate feature ID");
    }
    this._features.push(feature);
    feature.activated$.subscribe(state => this._featureStates.next({ feature: feature, running: state }));
  }

  public get features() {
    return [...this._features];
  }
}