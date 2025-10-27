export const LANGUAGES = [
  "English",
  "German",
  "Bulgarian",
  "Czech",
  "Danish",
  "Dutch",
  "Finnish",
  "French",
  "Estonian",
  "Greek",
  "Hebrew",
  "Hungarian",
  "Italian",
  "Japanese",
  "Korean",
  "Latvian",
  "Macedonian",
  "Norwegian",
  "Portuguese",
  "Polish",
  "Romanian",
  "Russian",
  "Serbian",
  "Slovakian",
  "Spanish",
  "Swedish",
  "Tagalog",
  "Turkish",
] as const;

export type Language = typeof LANGUAGES[number];

export const LANGUAGE_CHOICES = LANGUAGES.map(
  lang => (
    {
      choice: lang,
      name: lang,
    }
  )
);

export function languageIndex(language: Language, firstLanguage: Language = "English"): number {
  if (language === firstLanguage) {
    return 0;
  }

  return LANGUAGES.indexOf(language) + 1;
}
