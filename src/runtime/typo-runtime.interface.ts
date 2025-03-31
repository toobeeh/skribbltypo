export interface typoReleaseDetails {
  version: string;
  versionName: string;
  runtime: string;
}

/**
 * Abstraction of the runtime of the typo application, to work eg in extension or userscript context
 */
export interface TypoRuntime {

  /**
   * write a value to a key in the persistent storage of the runtime
   * @param key
   * @param value
   */
  writeSetting(key: string, value: string | null): Promise<void>;

  /**
   * get a value by key from the persistent storage of the runtime
   * @param key
   */
  getSetting(key: string): Promise<string | null>;

  /**
   * set the acsess token in the persistent storage of the runtime
   * @param token
   */
  setToken(token: string | null): Promise<void>;

  /**
   * get the access token from the persistent storage of the runtime
   */
  getToken(): Promise<string | null>;

  /**
   * get the release details of typo
   */
  getReleaseDetails(): typoReleaseDetails;

  /**
   * Get URL of the game patch of the runtime
   */
  getPatchUrl(): string;

  /**
   * Get the list of data profiles
   */
  getProfiles(): Promise<string[]>;

  /**
   * Get the current data profile
   */
  currentProfile(): Promise<string>;

  /**
   * Switch to a different data profile
   * @param profile
   */
  switchToProfile(profile: string): Promise<void>;

  /**
   * Create a new data profile
   * @param profile
   */
  createAndSwitchToProfile(profile: string): Promise<void>;

  /**
   * Delete a data profile
   * @param profile
   */
  deleteProfile(profile: string): Promise<void>;

  /**
   * Reset all saved data
   */
  resetTypo(): Promise<void>;
}