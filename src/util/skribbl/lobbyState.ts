import { arrayChunk } from "@/util/arrayChunk";

export interface lobbyStateUpdate {
  drawingRevealed?: {
    reason: "outOfTime" | "allGuessed",
    word: string,
    scores: {score: number, rewarded: number, playerId: number}[],
  },
  drawingStarted?: {
    word?: string,
    characters: number,
    maxTime: number,
    drawerId: number,
  },
  hintsUpdated?: {
    newHints:[string, number][],
  }


}

export const parseLobbyStateUpdate = (data: any): lobbyStateUpdate | undefined => { // eslint-disable-line  @typescript-eslint/no-explicit-any
  switch (data.id as number) {

    /* new drawing has started */
    case 4: {
      return {
        drawingStarted: {
          word: typeof data.data.word === "string" ? data.data.word as string : undefined,
          characters: typeof data.data.word === "string" ? data.data.word.length : data.data.word[0] as number,
          maxTime: data.time as number,
          drawerId: data.data.id as number
        },
        hintsUpdated: {
          newHints: data.data.hints as [string, number][]
        }
      };
    }

    /* drawing has been revealed */
    case 5: {
      return {
        drawingRevealed: {
          reason: data.data.reason === 1 ? "outOfTime" : "allGuessed",
          word: data.data.word as string,
          scores: arrayChunk(data.data.scores as number[], 3).map(([playerId, score, rewarded]) => ({playerId, score, rewarded}))
        }
      };
    }

    /* new hints added */
    case 13: {
      return {
        hintsUpdated: {
          newHints: data.data.hints as [string, number][]
        }
      };
    }

    default: {
      return undefined;
    }
  } 
};