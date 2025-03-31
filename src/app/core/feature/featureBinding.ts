export interface featureBinding {
  onFeatureActivate: () => Promise<void>;
  onFeatureDestroy: () => Promise<void>;
}