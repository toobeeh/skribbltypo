export interface skribblLobby {
  settings: {
    language: string, // [0]
    players: number, // [1]
    drawTime: number, // [2]
    rounds: number, // [3]
  },
  id: string | null, // null if practice
  private: boolean,
  meId: number,
  ownerId: number | null,
  drawerId: number | null,
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

export const parseSkribblLobbyDataEvent = (data: any, languages: Map<number, string>): skribblLobby => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    id: data.id ?? null,
    private: data.type === 1,
    meId: data.me,
    ownerId: data.owner == -1 ? null : data.owner,
    drawerId: null,
    round: data.round + 1,
    settings: {
      language: languages.get(data.settings[0]) ?? "Unknown",
      players: data.settings[1],
      drawTime: data.settings[2],
      rounds: data.settings[3]
    },
    players: data.users as never
  };
};