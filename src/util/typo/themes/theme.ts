import type { serializable } from "@/app/core/settings/setting";
import type { Mutable } from "@/util/types/mutable";
import { themeColors } from "@/util/typo/themes/colors";

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface serializableTheme extends typoTheme {
  [key: string]: serializable; /* needed to pass as serializable */
}

export interface savedTheme {
  [key: string]: serializable; /* needed to pass as serializable */
  theme: serializableTheme;
  savedAt: number;
  publicTheme?: {
    publicId: string;
    localVersion: number
  },
  enableManage?: boolean;
}

export interface typoTheme {
  colors: Mutable<typeof themeColors>;
  hooks: Record<string, string>;
  images: {
    urlLogo?: string;
    urlBackground?: string;
    urlBackgroundGame?: string;
    backgroundRepeat?: boolean;
    containerImages?: string;
    backgroundTint?: string;
  },
  misc: {
    fontStyle?: string;
    hideFooter?: boolean,
    hideAvatarLogo?: boolean,
    hideInGameLogo?: boolean,
    hideSkribblPanels?: boolean,
    themeCssUrl?: string,
    cssText?: string,
    htmlText?: string
  },
  meta: {
    author: string,
    created: number,
    id: number,
    name: string,
    type: "theme"
  }
}

export const createEmptyTheme: (author: string, name?: string, id?: number) => typoTheme = (author, name, id) => {
  const date = new Date();
  const theme: typoTheme = {
    meta: {
      author,
      created: date.getTime(),
      id: id === undefined ? date.getTime() : id,
      name: name ?? `Untitled Theme ${date.getTime()}`,
      type: "theme"
    },
    colors: structuredClone(themeColors),
    hooks: {} as Record<keyof typeof themeColors, string>,
    images: {},
    misc: {}
  };

  return theme;
};