import type { GuildLobbyDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { languageIndex, LANGUAGES, type Language } from "@/util/language";

interface LobbyViewModel {
  lobbyId: string;
  currentPlayers: number,
  language: Language,
  private: boolean;
}

export interface LobbiesViewModel {
  byLanguage: {
    language: Language,
    languageIcon: string,
    players: GuildLobbyDto[],
  }[]
  byLobby: {
    lobby: LobbyViewModel,
    players: GuildLobbyDto[]
  }[]
}

export function emptyLobbiesViewModel(): LobbiesViewModel {
  return {
    byLanguage: [],
    byLobby: [],
  };
}

export function buildLobbiesViewModel(
  guildLobbies: Map<string, GuildLobbyDto[]>,
  firstLanguage: Language,
  previousViewModel: LobbiesViewModel
): LobbiesViewModel {
  const guildLobbiesFlat = Array.from(guildLobbies.values()).flat();
  const result = emptyLobbiesViewModel();

  guildLobbiesFlat.forEach(
    guildLobby => {
      updateViewModel(result, guildLobby);
    }
  );

  sortViewModelItems(result, firstLanguage, previousViewModel);

  return result;
}

function updateViewModel(viewModel: LobbiesViewModel, guildLobby: GuildLobbyDto): void {
  if (!LANGUAGES.includes(guildLobby.language as Language)) {
    return;
  }
  const lang = guildLobby.language as Language;

  // byLanguage
  let langBucket = viewModel.byLanguage.find(b => b.language === lang);

  if (!langBucket) {
    langBucket = {
      language: lang,
      languageIcon: `--file-img-flag-${lang.toLowerCase()}-gif`,
      players: [],
    };
    viewModel.byLanguage.push(langBucket);
  }

  if (!langBucket.players.some(p => p.lobbyId === guildLobby.lobbyId && p.userName === guildLobby.userName)) {
    langBucket.players.push(guildLobby);
  }

  // byLobby
  let lobbyBucket = viewModel.byLobby.find(b => b.lobby.lobbyId === guildLobby.lobbyId && b.lobby.language === guildLobby.language);

  if (!lobbyBucket) {
    lobbyBucket = {
      lobby: {
        lobbyId: guildLobby.lobbyId,
        currentPlayers: guildLobby.currentPlayers,
        language: lang,
        private: guildLobby.private,
      },
      players: [],
    };
    viewModel.byLobby.push(lobbyBucket);
  } else {
    lobbyBucket.lobby.currentPlayers = Math.min(lobbyBucket.lobby.currentPlayers, guildLobby.currentPlayers);
  }

  if (!lobbyBucket.players.some(p => p.lobbyId === guildLobby.lobbyId && p.userName === guildLobby.userName)) {
    lobbyBucket.players.push(guildLobby);
  }
}

function sortViewModelItems(
  viewModel: LobbiesViewModel,
  firstLanguage: Language,
  previousViewModel: LobbiesViewModel
): void {
  viewModel.byLanguage.sort(
    (a, b) => languageIndex(a.language, firstLanguage) - languageIndex(b.language, firstLanguage)
  );

  const prevOrder = new Map(
    previousViewModel.byLobby.map((bucket, i) => [bucket.lobby.lobbyId, i])
  );

  viewModel.byLobby.sort(
    (a, b) => {
      const aId = a.lobby.lobbyId;
      const bId = b.lobby.lobbyId;

      const aWasPresent = prevOrder.has(aId);
      const bWasPresent = prevOrder.has(bId);

      if (aWasPresent && !bWasPresent) {
        return -1;
      }

      if (!aWasPresent && bWasPresent) {
        return 1;
      }

      if (aWasPresent && bWasPresent) {
        return (prevOrder.get(aId) ?? 0) - (prevOrder.get(bId) ?? 0);
      }

      const langKey = languageIndex(a.lobby.language, firstLanguage) - languageIndex(b.lobby.language, firstLanguage);

      if (langKey !== 0) {
        return langKey;
      }

      const playerCountKey = b.players.length - a.players.length;

      if (playerCountKey !== 0) {
        return playerCountKey;
      }

      return 0;
    }
  );
}
