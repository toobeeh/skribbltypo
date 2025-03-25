import type { TypoRuntime } from "@/content/core/runtime/typo-runtime.interface";

export default class ExtensionRuntime implements TypoRuntime {
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
}