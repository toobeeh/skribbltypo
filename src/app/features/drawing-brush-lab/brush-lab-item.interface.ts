import type { serializable, SettingWithInput } from "@/app/core/settings/setting";

export interface BrushLabItem {
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly settings: SettingWithInput<serializable>[];
}