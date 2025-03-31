declare module "virtual:asset-urls" {

  /**
   * Mapping of asset sanitized file path to asset url factory (eg base64, path)
   */
  export const assets: Record<string, () => string>;
}