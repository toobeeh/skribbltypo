import type { TypoFeature } from "@/content/core/feature/feature";
import { FeaturesService } from "@/content/core/feature/features.service";
import type { Type } from "@/util/types/type";
import type { Subscription } from "rxjs";

export class ServiceBinding {
  private readonly _stateSubscription: Subscription;
  private _ready = false;

  public constructor(
    featureService: FeaturesService,
    private readonly feature: Type<TypoFeature>,
    private onInit: () => void,
    private onReset: () => void) {

    if(featureService.getFeatureState(feature)) {
      this._ready = true;
      this.onInit();
    }

    this._stateSubscription = featureService.featureStates$.subscribe(state => {
      if(state.feature instanceof feature) {
        if(state.running) this.onInit();
        else this.onReset();
        this._ready = state.running;
      }
    });
  }

  public get active(){
    return this._ready;
  }

  public unbind(){
    this._stateSubscription.unsubscribe();
  }
}

export const serviceBinding = Symbol("ServiceBinding");
export type serviceBinding = (feature: Type<TypoFeature>, onInit: () => void, onReset: () => void) => ServiceBinding