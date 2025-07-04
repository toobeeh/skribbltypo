import type { typoReleaseDetails, TypoRuntime } from "@/runtime/typo-runtime.interface";
import { TypoProfileStore } from "@/util/typo/profiles/profile-store";
import { type IDBPDatabase, openDB } from "idb";
import { pageReleaseDetails } from "virtual:page-release-details";

import gamePatch from "@/../assets/gamePatch.js?raw";

export default class PageRuntime implements TypoRuntime {
  private readonly _db: Promise<IDBPDatabase>;
  private readonly _profileStore: TypoProfileStore;

  constructor() {
    this._db = openDB("skribbl_typo", 1, {
      upgrade: (database) => {
        database.createObjectStore("settings");
        database.createObjectStore("token");
        database.createObjectStore("current_profile");
        database.createObjectStore("profiles");
      },
    });

    this._profileStore = new TypoProfileStore(
      this._db,
      "profiles",
      "current_profile",
      "settings",
      "token",
    );

    window.addEventListener("click", () => console.log(this));
  }

  async getSetting(key: string): Promise<string | null> {
    return (await this._db).get("settings", key);
  }

  async writeSetting(key: string, value: string | null): Promise<void> {
    await (await this._db).put("settings", value, key);
  }

  async getToken(): Promise<string | null> {
    const tokenPromise = (await this._db).get("token", "token");
    return (await tokenPromise) ?? null;
  }

  async setToken(token: string | null): Promise<void> {
    await (await this._db).put("token", token, "token");
  }

  getReleaseDetails(): typoReleaseDetails {
    return pageReleaseDetails;
  }

  getPatchUrl(): string {
    return URL.createObjectURL(new Blob([gamePatch], { type: "application/javascript" }));
  }

  createAndSwitchToProfile(profile: string): Promise<void> {
    return this._profileStore.createAndActivateProfile(profile);
  }

  currentProfile(): Promise<string> {
    return this._profileStore.getCurrentProfile();
  }

  deleteProfile(profile: string): Promise<void> {
    return this._profileStore.deleteProfile(profile);
  }

  getProfiles(): Promise<string[]> {
    return this._profileStore.getProfiles();
  }

  switchToProfile(profile: string): Promise<void> {
    return this._profileStore.switchToProfile(profile);
  }

  async resetTypo(): Promise<void> {
    await (await this._db).clear("settings");
    await (await this._db).clear("token");
    await (await this._db).clear("current_profile");
    await (await this._db).clear("profiles");
  }
}