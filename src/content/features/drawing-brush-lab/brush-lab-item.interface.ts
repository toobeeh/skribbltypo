import type { SettingWithInput } from "@/content/core/settings/setting";

export type labItemSetting = SettingWithInput<number> | SettingWithInput<boolean>;

export interface BrushLabItem {
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly settings: labItemSetting[];
}