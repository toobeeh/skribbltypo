export interface skribblLobby {
  settings: {
    language: string, // [0]
    players: number, // [1]
    drawTime: number, // [2]
    rounds: number, // [3]
  },
  id: string,
  private: boolean,
  meId: number,
  ownerId: number | null,
  players: skribblPlayer[],
  round: number,
  /*state: {
    id: number,
    time: number,
    data: unknown
  }*/
}

export interface skribblPlayer {
  id: number,
  name: string,
  avatar: [number, number, number, number],
  score: number,
  guessed: boolean,
  flags: number
}

export const parseSkribblLobbyDataEvent = (event: CustomEvent, languages: Map<number, string>): skribblLobby => {
  return {
    id: event.detail.id,
    private: event.detail.type === 1,
    meId: event.detail.me,
    ownerId: event.detail.owner == -1 ? null : event.detail.owner,
    round: event.detail.round,
    settings: {
      language: languages.get(event.detail.settings[0]) ?? "",
      players: event.detail.settings[1],
      drawTime: event.detail.settings[2],
      rounds: event.detail.settings[3]
    },
    players: event.detail.users as never
  };
};