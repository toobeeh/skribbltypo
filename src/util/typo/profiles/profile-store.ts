import type { IDBPDatabase } from "idb";

export interface savedProfile {
  token: string | null;
  settings: [string, unknown][];
}

export class TypoProfileStore {
  private readonly _db: Promise<IDBPDatabase>;

  constructor(
    db: Promise<IDBPDatabase>,
    private readonly _profileListStore: string,
    private readonly _currentProfileStore: string,
    private readonly _settingsStore: string,
    private readonly _tokenStore: string
  ) {
    this._db = this.init(db);
  }

  private async init(db: Promise<IDBPDatabase>): Promise<IDBPDatabase> {
    /* make sure a default profile exists */
    const profile = await (await db).get(this._currentProfileStore, "current_profile");
    if (profile === undefined) {
      await (await db).put(this._currentProfileStore, "Default", "current_profile");
    }

    const profiles = await (await db).getAllKeys(this._profileListStore);
    if (profiles.length === 0) {
      await (await db).put(this._profileListStore, {}, "Default");
    }

    return db;
  }

  public async getProfiles(): Promise<string[]> {
    return (await (await this._db).getAllKeys(this._profileListStore)).map(key => key.toString());
  }

  public async getCurrentProfile(): Promise<string> {
    return (await (await this._db).get(this._currentProfileStore, "current_profile"));
  }

  public async createAndActivateProfile(profile: string): Promise<void> {

    /* save current data to saved profiles */
    const currentProfile = await this.getCurrentProfile();
    const currentProfileData = await this.exportCurrentProfile();
    await this.setSavedProfile(currentProfile, currentProfileData);

    /* change current profile name and clear data */
    await (await this._db).put(this._currentProfileStore, profile, "current_profile");
    await this.setSavedProfile(profile, { token: null, settings: [] });
    await this.loadProfile({ token: null, settings: [] });
  }

  public async switchToProfile(profile: string): Promise<void> {

    /* save current data to saved profiles */
    const currentProfile = await this.getCurrentProfile();
    const currentProfileData = await this.exportCurrentProfile();
    await this.setSavedProfile(currentProfile, currentProfileData);

    await this.loadProfile(await this.getSavedProfile(profile));
    await (await this._db).put(this._currentProfileStore, profile, "current_profile");
  }

  public async deleteProfile(profile: string): Promise<void> {
    const currentProfile = await this.getCurrentProfile();
    if (currentProfile === profile) {
      throw new Error("Cannot delete current profile");
    }
    await (await this._db).delete(this._profileListStore, profile);
  }

  private async getSavedProfile(profile: string): Promise<savedProfile> {
    const result =  (await (await this._db).get(this._profileListStore, profile));
    return result ?? { token: null, settings: {} };
  }

  private async setSavedProfile(profile: string, savedProfile: savedProfile): Promise<void> {
    await (await this._db).put(this._profileListStore, savedProfile, profile);
  }

  private async exportCurrentProfile(): Promise<savedProfile> {
    const settingKeys = await (await this._db).getAllKeys(this._settingsStore);
    const settings = new Map<string, unknown>();
    for (const key of settingKeys.map(k => k.toString())) {
      const value = await (await this._db).get(this._settingsStore, key);
      settings.set(key, value);
    }

    return {
      token: await (await this._db).get(this._tokenStore, "token"),
      settings: Array.from(settings.entries())
    };
  }

  private async loadProfile(savedProfile: savedProfile): Promise<void> {
    await (await this._db).clear(this._settingsStore);
    await (await this._db).put(this._tokenStore, savedProfile.token, "token");
    for (const [key, value] of savedProfile.settings) {
      await (await this._db).put(this._settingsStore, value, key);
    }
  }

}