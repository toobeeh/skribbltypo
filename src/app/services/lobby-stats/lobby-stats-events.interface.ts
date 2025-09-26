export interface lobbyStatEvent {
  lobbyId: string;
  lobbyRound: number;
  turnPlayerId: number;
  timestamp: number;
  playerId: number;
}

export interface guessTimeStatEvent extends lobbyStatEvent {
  word: string;
  guessTimeMs: number;
}

export interface guessCountStatEvent extends lobbyStatEvent {
  guessCount: number;
}

export interface guessMessageGapStatEvent extends lobbyStatEvent {
  gapTimeMs: number;
  message: string;
}

export interface guessScoreStatEvent extends lobbyStatEvent {
  score: number;
}

export interface guessAccuracyStatEvent extends lobbyStatEvent {
  accuracy: number;
  message: string;
  hint: string;
}

export interface guessStreakStatEvent extends lobbyStatEvent {
  streak: number;
}

export interface guessRankStatEvent extends lobbyStatEvent {
  rank: number;
}

export interface drawTimeStatEvent extends lobbyStatEvent {
  drawTimeMs: number;
}

export interface drawGuessedPlayersStatEvent extends lobbyStatEvent {
  guessedPlayers: number;
}

export interface drawScoreStatEvent extends lobbyStatEvent {
  score: number;
}

export interface drawLikesStatEvent extends lobbyStatEvent {
  likes: number;
}

