/**
 * Generate a string by a key, that is hashed by its own value. Can be used to identify a public group token (the hash)
 * @param {String} key The key that is hashed against itself
 * @returns A hash that can be used for match check
 */
export const calculateLobbyKey = (key: string) => {
  const sum = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hashed = [...key].map(char => String.fromCharCode(char.charCodeAt(0) + sum));
  const newKey = hashed.join("");
  return newKey;
};