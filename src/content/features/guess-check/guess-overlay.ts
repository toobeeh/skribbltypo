const BLANK = "_";
const FILLER = "‎";
const DIACRITICS: { [key: string]: string } = {
  "ä": "a",
  "ö": "o",
  "ü": "u",
  "à": "a",
  "â": "a",
  "ç": "c",
  "é": "e",
  "è": "e",
  "ê": "e",
  "ë": "e",
  "î": "i",
  "ï": "i",
  "ô": "o",
  "û": "u",
  "ù": "u",
  "ÿ": "y",
  "ñ": "n",
  "á": "a",
  "í": "i",
  "ó": "o",
  "ú": "u",
  "ą": "a",
  "ć": "c",
  "ę": "e",
  "ń": "n",
  "ś": "s",
  "ż": "z",
  "ź": "z",
};

function isTheSameLetter(char: string, otherChar: string): boolean {
  char = char.toLowerCase();
  otherChar = otherChar.toLowerCase();

  char = DIACRITICS[char] ?? char;
  otherChar = DIACRITICS[otherChar] ?? otherChar;

  return char === otherChar;
}

/**
 * Fills the guess to the same length as the word/hint
 */
export function getOverlayContent(guess: string, hints: string): string {
    guess = guess.replaceAll(" ", "").replaceAll("-", "")

    let result = "";
    let guessIndex = 0;

    for (let hintIndex = 0; hintIndex < hints.length; hintIndex++) {
      let guessChar = guess.charAt(guessIndex);
      let hintChar = hints.charAt(hintIndex);

      if (hintChar === " " || hintChar === "-") {
        result = result.concat(hintChar);
      } else if (isTheSameLetter(guessChar, hintChar)) {
        result = result.concat(hintChar);
        guessIndex++;
      } else if (guessChar === "") {
        result = result.concat(FILLER);
      } else {
        result = result.concat(guessChar);
        guessIndex++;
      }
    }

    return result;
}

/**
 * Whether the character matches a revealed hint or blank or is a filler character
 */
export function guessMatchesHint(character: string, index: number, hints: string): boolean {
    return hints[index] === character || character === FILLER || hints[index] === BLANK;
}

/**
 * Whether the character exactly matches a revealed hint
 */
export function guessCorrectHint(character: string, index: number, hints: string): boolean {
    return hints[index] === character && hints[index] !== BLANK;
}
