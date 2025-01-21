export interface anonymousPlayerIdentification { lobbyKey: string, lobbyPlayerId: number }
export interface concretePlayerIdentification { login: number }
export type typoPlayerIdentification = anonymousPlayerIdentification | concretePlayerIdentification;

export const isAnonymousPlayerIdentification = (value: object): value is anonymousPlayerIdentification => {
  return (value as anonymousPlayerIdentification).lobbyKey !== undefined && (value as anonymousPlayerIdentification).lobbyPlayerId !== undefined;
};

export const isConcretePlayerIdentification = (value: object): value is concretePlayerIdentification => {
  return (value as concretePlayerIdentification).login !== undefined;
};

/**
 * An interface for player container abstraction
 * Player containers consist of various elements, representing a player and its avatar
 * Implementations provide concrete access to manipulate these elements uniformly
 */
export interface SkribblPlayerDisplay {

  get typoId(): typoPlayerIdentification;

  /**
   * Dedicated container for the player's avatar
   */
  get avatarContainer(): HTMLElement;

  /**
   * Dedicated container for the player's background
   */
  get backgroundContainer(): HTMLElement;

  /**
   * The container that holds the player's elements
   */
  get container(): HTMLElement;

  /**
   * Container where icons of the player are displayed
   */
  get iconsContainer(): HTMLElement | null;

  /**
   * Set the background of the player's background container
   * @param value
   */
  set useBackground(value: boolean);

  /**
   * Enable a background-safe font color for the player's elements (eg on scenes)
   * @param value
   */
  set useSafeColor(value: boolean);

  /**
   * Modify the container to fit a modified avatar size (eg sprites)
   * @param value
   */
  set resizeToFitAvatar(value: boolean);

  /**
   * Toggle the visibility of the lobby player Id
   * @param value
   */
  set viewPlayerId(value: boolean);
}