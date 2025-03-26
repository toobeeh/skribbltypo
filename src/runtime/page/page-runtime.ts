import type { typoReleaseDetails, TypoRuntime } from "@/runtime/typo-runtime.interface";
import { type IDBPDatabase, openDB } from "idb";
import { pageReleaseDetails } from "virtual:page-release-details";

import gamePatch from "@/../assets/gamePatch.js?raw";

export default class PageRuntime implements TypoRuntime {
  private readonly _db: Promise<IDBPDatabase>;

  constructor() {
    this._db = openDB("skribbltypo", 1, {
      upgrade: (database) => {
        database.createObjectStore("settings");
        database.createObjectStore("token");
      },
    });
  }

  async getSetting(key: string): Promise<string | null> {
    return (await this._db).get("settings", key);
  }

  async writeSetting(key: string, value: string | null): Promise<void> {
    await (await this._db).put("settings", value, key);
  }

  async getToken(): Promise<string | null> {
    return (await this._db).get("token", "token");
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
}