import { PluginOption } from "vite";

export type TypoBuildPlugin = (
  version: "stable" | "beta" | "alpha",
  buildCommit: string | undefined
) => PluginOption[];