import { MetricView } from "@/app/features/lobby-statistics/metricView";
import type {
  drawDislikesStatEvent, drawGuessedPlayersStatEvent,
  drawLikesStatEvent,
  drawScoreStatEvent,
  drawTimeStatEvent,
  guessAccuracyStatEvent,
  guessCountStatEvent, guessMessageGapStatEvent, guessRankStatEvent, guessScoreStatEvent, guessStreakStatEvent,
  guessTimeStatEvent,
  standingScoreStatEvent,
} from "@/app/services/lobby-stats/lobby-stats-events.interface";

const millisAsSeconds = (ms: number) => Math.round(ms / 100) / 10;

export const createMetricViews = () => Object.freeze({
  averageGuessTime: new MetricView<guessTimeStatEvent>(
    "Average Guess Time",
    "The average time a player needed to guess a word",
    event => millisAsSeconds(event.guessTimeMs))
    .withMetricUnit("s")
    .withAggregation("average")
    .withOrdering("minValue"),

  totalScore: new MetricView<standingScoreStatEvent>(
    "Score Ranking",
    "The total ranking, progressing over time",
    event => event.score)
    .withMetricUnit("pts"),

  finalStandings: new MetricView<standingScoreStatEvent>(
    "Final Score Ranking",
    "The final ranking",
    event => event.score)
    .withMetricUnit("pts")
    .withAggregation("ranking")
    .withOrdering("maxValue"),


  averageNeededGuesses: new MetricView<guessCountStatEvent>(
    "Average Guesses Needed",
    "The average number of guesses a player needed to guess a word",
    event => event.guessCount)
    .withAggregation("average")
    .withOrdering("minValue"),

  averageGuessSpeed: new MetricView<guessMessageGapStatEvent>(
    "Average Guess Speed",
    "The average time between guesses a player sent",
    event => millisAsSeconds(event.gapTimeMs))
    .withMetricUnit("s")
    .withAggregation("average"),

  fastestGuess: new MetricView<guessTimeStatEvent>(
    "Fastest Guess",
    "The fastest correct guess for a word",
    event => millisAsSeconds(event.guessTimeMs))
    .withMetricUnit("s")
    .withAggregation("ranking")
    .withOrdering("minValue"),

  averageGuessScore: new MetricView<guessScoreStatEvent>(
    "Average Guess Score",
    "The average score a player got per correct guess",
    event => event.score)
    .withMetricUnit("pts")
    .withAggregation("average")
    .withOrdering("maxValue"),

  averageGuessAccuracy: new MetricView<guessAccuracyStatEvent>(
    "Average Guess Accuracy",
    "The average letter count accuracy of player guesses",
    event => event.accuracy * 100)
    .withAggregation("average")
    .withOrdering("maxValue"),

  longestGuessStreak: new MetricView<guessStreakStatEvent>(
    "Longest Guess Streak",
    "The longest streak of correct guesses in a row",
    event => event.streak)
    .withAggregation("ranking")
    .withOrdering("maxValue"),

  averageGuessRank: new MetricView<guessRankStatEvent>(
    "Average Guess Rank",
    "The average rank of player's correct guess",
    event => event.rank)
    .withAggregation("average")
    .withOrdering("minValue"),

  averageDrawTime: new MetricView<drawTimeStatEvent>(
    "Average Draw Time",
    "The average draw time of a player",
    event => millisAsSeconds(event.drawTimeMs))
    .withMetricUnit("s")
    .withAggregation("average")
    .withOrdering("minValue"),

  averageGuessedPlayers: new MetricView<drawGuessedPlayersStatEvent>(
    "Average Guessed Players",
    "The average amount of players that guessed a player's drawing",
    event => event.guessedPlayers)
    .withAggregation("average")
    .withOrdering("maxValue"),

  fastestDrawTime: new MetricView<drawTimeStatEvent>(
    "Fastest Draw Time",
    "The fastest draw time of a player",
    event => millisAsSeconds(event.drawTimeMs))
    .withMetricUnit("s")
    .withAggregation("ranking")
    .withOrdering("minValue"),

  averageDrawScore: new MetricView<drawScoreStatEvent>(
    "Average Draw Score",
    "The average score for a player's drawing",
    event => event.score)
    .withAggregation("average")
    .withOrdering("maxValue")
    .withMetricUnit("pts"),

  averageDrawLikes: new MetricView<drawLikesStatEvent>(
    "Average Draw Likes",
    "The average likes for player drawings",
    event => event.likes)
    .withAggregation("average")
    .withOrdering("maxValue"),

  mostDrawDislikes: new MetricView<drawDislikesStatEvent>(
    "Most Draw Dislikes",
    "The most dislikes a player received for a drawing",
    event => event.dislikes)
    .withAggregation("ranking")
    .withOrdering("maxValue"),
});