export interface SkribblPlayerDisplay {
  get avatarContainer(): HTMLElement;
  get backgroundContainer(): HTMLElement;
  get container(): HTMLElement;

  set useBackground(value: boolean);
  set useSafeColor(value: boolean);
  set resizeToFitAvatar(value: boolean);
}