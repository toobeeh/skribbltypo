import type { lobbyInteractedEvent } from "@/app/events/lobby-interacted.event";


export const parseSkribblLobbyInteractedEvent = (data: any): lobbyInteractedEvent | undefined => { // eslint-disable-line @typescript-eslint/no-explicit-any
  switch (data.id as number) {
    case 8:
      if(data.data.vote === 1) return {
        likeInteraction: {
          sourcePlayerId: data.data.id as number
        }
      };
      else return {
        dislikeInteraction: {
          sourcePlayerId: data.data.id as number
        }
      };
    case 5:
      return {
        votekickInteraction: {
          targetPlayerId: data.data[1] as number,
          sourcePlayerId: data.data[0] as number,
          totalVotes: data.data[2] as number,
          requiredVotes: data.data[3] as number
        }
      };
  }
};