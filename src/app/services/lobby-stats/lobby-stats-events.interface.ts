export interface lobbyStatEvent {
  lobbyId: string;
  lobbyRound: number;
  turnPlayerId: number;
  timestamp: number;
  playerId: number;
}

export interface guessTimeStatEvent extends lobbyStatEvent {
  guessTimeMs: number;
}

export interface guessCountStatEvent extends lobbyStatEvent {
  guessCount: number;
}

export interface guessMessageGapStatEvent extends lobbyStatEvent {
  gapTimeMs: number;

  /**
   * undefined if message guessed the word
   */
  message?: string;
  hints: string;
}

export interface guessScoreStatEvent extends lobbyStatEvent {
  score: number;
}

export interface guessAccuracyStatEvent extends lobbyStatEvent {
  accuracy: number;

  /**
   * undefined if message guessed the word
   */
  message?: string;
  hints: string;
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

export interface drawDislikesStatEvent extends lobbyStatEvent {
  dislikes: number;
}

export interface standingScoreStatEvent extends lobbyStatEvent {
  score: number;
}

