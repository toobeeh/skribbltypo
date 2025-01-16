import type { serializable, SettingWithInput } from "@/content/core/settings/setting";

export interface BrushLabItem {
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly settings: SettingWithInput<serializable>[];
}