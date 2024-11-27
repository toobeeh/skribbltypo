import { themeColors } from "@/util/typo/themes/colors";

export interface typoTheme {
  colors: typeof themeColors;
  hooks: Record<keyof typeof themeColors, string>;
  images: {
    urlLogo?: string;
    urlBackground?: string;
    backgroundRepeat?: boolean;
    containerImages?: string;
    backgroundTint?: string;
  },
  misc: {
    fontStyle?: string;
    hideFooter?: boolean,
    hideTypoInfo?: boolean,
    hideTypoPanels?: boolean,
    hideAvatarLogo?: boolean,
    hideInGameLogo?: boolean,
    hideAvatarSprites?: boolean,
    useOldNav?: boolean,
    themeCssUrl?: string,
    themeCss?: string,
    hideMeta?: false,
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