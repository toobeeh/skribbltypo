import type { GuildLobbyDto } from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { languageIndex, LANGUAGES, type Language } from "@/util/language";

export interface LobbiesViewModel {
  languageBuckets: {
    language: Language;
    languageIcon: string;
    players: GuildLobbyDto[];
    lobbyBuckets: {
      lobbyId: string;
      currentPlayers: number;
      dimmed: boolean;
      players: GuildLobbyDto[];
    }[];
  }[];
}

export function emptyLobbiesViewModel(): LobbiesViewModel {
  return {
    languageBuckets: [],
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

  // collect players from lobby buckets to the language bucket
  result.languageBuckets.forEach(
    languageBucket => {
      languageBucket.players = languageBucket.lobbyBuckets.flatMap(lobbyBucket => lobbyBucket.players);
    }
  );

  return result;
}

function updateViewModel(viewModel: LobbiesViewModel, guildLobby: GuildLobbyDto): void {
  // language buckets
  if (!LANGUAGES.includes(guildLobby.language as Language)) {
    return;
  }
  const lang = guildLobby.language as Language;

  let langBucket = viewModel.languageBuckets.find(b => b.language === lang);

  if (!langBucket) {
    langBucket = {
      language: lang,
      languageIcon: `--file-img-flag-${lang.toLowerCase()}-gif`,
      players: [],
      lobbyBuckets: [],
    };
    viewModel.languageBuckets.push(langBucket);
  }

  // lobby buckets
  let lobbyBucket = langBucket.lobbyBuckets.find(b => b.lobbyId === guildLobby.lobbyId);

  if (!lobbyBucket) {
    lobbyBucket = {
      lobbyId: guildLobby.lobbyId,
      currentPlayers: guildLobby.currentPlayers,
      dimmed: !guildLobby.private && guildLobby.currentPlayers === 8,
      players: [],
    };
    langBucket.lobbyBuckets.push(lobbyBucket);
  } else {
    lobbyBucket.currentPlayers = Math.min(lobbyBucket.currentPlayers, guildLobby.currentPlayers);
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
  viewModel.languageBuckets.sort(
    (a, b) => languageIndex(a.language, firstLanguage) - languageIndex(b.language, firstLanguage)
  );

  for (const langBucket of viewModel.languageBuckets) {
    const previousLangBucket = previousViewModel.languageBuckets.find(b => b.language === langBucket.language);
    const prevLobbyBucketsOrder = new Map(
      previousLangBucket?.lobbyBuckets.map((bucket, i) => [bucket.lobbyId, i])
    );

    langBucket.lobbyBuckets.sort(
      (a, b) => {
        const aWasPresent = prevLobbyBucketsOrder.has(a.lobbyId);
        const bWasPresent = prevLobbyBucketsOrder.has(b.lobbyId);

        if (aWasPresent && !bWasPresent) {
          return -1;
        }

        if (!aWasPresent && bWasPresent) {
          return 1;
        }

        if (aWasPresent && bWasPresent) {
          return (prevLobbyBucketsOrder.get(a.lobbyId) ?? 0) - (prevLobbyBucketsOrder.get(b.lobbyId) ?? 0);
        }

        return b.players.length - a.players.length;
      }
    );
  }
}
