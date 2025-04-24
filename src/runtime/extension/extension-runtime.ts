import type { typoReleaseDetails, TypoRuntime } from "@/runtime/typo-runtime.interface";

export default class ExtensionRuntime implements TypoRuntime {

  customEvent(event: string, detail?: unknown): CustomEvent {
    return new CustomEvent(event, {
      detail
    });
  }

  getSetting(key: string): Promise<string | null> {
    return chrome.runtime.sendMessage({ type: "get setting", key });
  }

  async writeSetting(key: string, value: string | null): Promise<void> {
    await chrome.runtime.sendMessage({ type: "set setting", key, value });
  }

  getToken(): Promise<string | null> {
    return chrome.runtime.sendMessage({ type: "get token" });
  }

  async setToken(token: string | null): Promise<void> {
    await chrome.runtime.sendMessage({ type: "set token", token });
  }

  getReleaseDetails(): typoReleaseDetails {
    const manifest = chrome.runtime.getManifest();
    return {
      version: manifest.version,
      versionName: manifest.version_name ?? manifest.version,
      runtime: "extension",
    };
  }

  getPatchUrl(): string {
    return chrome.runtime.getURL("gamePatch.js");
  }

  async createAndSwitchToProfile(profile: string): Promise<void> {
    await chrome.runtime.sendMessage({ type: "create profile", profile });
  }

  async currentProfile(): Promise<string> {
    return await chrome.runtime.sendMessage({ type: "get profile" });
  }

  async deleteProfile(profile: string): Promise<void> {
    await chrome.runtime.sendMessage({ type: "delete profile", profile });
  }

  async getProfiles(): Promise<string[]> {
    return await chrome.runtime.sendMessage({ type: "get profiles" });
  }

  async switchToProfile(profile: string): Promise<void> {
    await chrome.runtime.sendMessage({ type: "switch profile", profile });
  }

  async resetTypo(): Promise<void> {
    await chrome.runtime.sendMessage({ type: "reset" });
  }
}