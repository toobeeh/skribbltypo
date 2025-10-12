import type { chartDataProperties } from "@/util/chart/dataset.interface";
import { MetricView } from "@/util/chart/metricView";
import type {
  completionTimeStatEvent,
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

export const yLabelSteps = (steps: number, unit?: string) => {
  return (props: chartDataProperties) => {
    const stepSize = props.maxY / steps;
    const labels = [];
    for (let i = 0; i <= steps; i++) {
      labels.push({ y: i * stepSize, label: (i * stepSize).toFixed(1) + (unit ? ` ${unit}` : "") });
    }
  };
};

export const yLabelIncrements = (increment: number, unit?: string) => {
  return (props: chartDataProperties) => {
    const labels = [];
    for (let y = 0; y <= props.maxY; y += increment) {
      const decimals = increment < 1 ? 1 : 0;
      labels.push({ y, label: y.toFixed(decimals) + (unit ? ` ${unit}` : "") });
    }
    return labels;
  };
};

export const createMetricViews = () => Object.freeze({

  totalScore: new MetricView<standingScoreStatEvent>(
    "Score Ranking",
    "The total ranking, progressing over time",
    event => event.score)
    .withYLabels(yLabelIncrements(500, "pts"))
    .withMetricUnit("pts")
    .withOrdering("maxValue"),

  finalStandings: new MetricView<standingScoreStatEvent>(
    "Final Score Ranking",
    "The final ranking of the lobby leaderboard",
    event => event.score)
    .withYLabels(yLabelIncrements(500, "pts"))
    .withMetricUnit("pts")
    .withAggregation("ranking")
    .withOrdering("maxValue"),

  averageCompletionTime: new MetricView<completionTimeStatEvent>(
    "Average Completion Time",
    "The average time a player needed to guess the word, or until everyone guessed the drawing",
    event => millisAsSeconds(event.completionTimeMs))
    .withYLabels(yLabelIncrements(10, "s"))
    .withMetricUnit("s")
    .withAggregation("average")
    .withOrdering("minValue"),

  completionTime: new MetricView<completionTimeStatEvent>(
    "Completion Time",
    "The time a player needed to guess the word, or until everyone guessed the drawing, progressing over time",
    event => millisAsSeconds(event.completionTimeMs))
    .withYLabels(yLabelIncrements(10, "s"))
    .withMetricUnit("s")
    .withOrdering("minValue")
    .withAggregation("single"),

  averageGuessTime: new MetricView<guessTimeStatEvent>(
    "Average Guess Time",
    "The average time a player needed to guess a word",
    event => millisAsSeconds(event.guessTimeMs))
    .withYLabels(yLabelIncrements(2, "s"))
    .withMetricUnit("s")
    .withAggregation("average")
    .withOrdering("minValue"),

  averageGuessScore: new MetricView<guessScoreStatEvent>(
    "Average Guess Score",
    "The average score a player got per correct guess",
    event => event.score)
    .withYLabels(yLabelIncrements(50, "pts"))
    .withMetricUnit("pts")
    .withAggregation("average")
    .withOrdering("maxValue"),

  averageGuessSpeed: new MetricView<guessMessageGapStatEvent>(
    "Average Guess Speed",
    "The average time between guesses a player sent",
    event => millisAsSeconds(event.gapTimeMs))
    .withYLabels(yLabelIncrements(5, "s"))
    .withMetricUnit("s")
    .withAggregation("average")
    .withOrdering("minValue"),

  averageNeededGuesses: new MetricView<guessCountStatEvent>(
    "Average Guesses Needed",
    "The average number of guesses a player needed to guess a word",
    event => event.guessCount)
    .withYLabels(yLabelIncrements(1))
    .withAggregation("average")
    .withOrdering("minValue"),

  fastestGuess: new MetricView<guessTimeStatEvent>(
    "Fastest Guess",
    "The fastest correct guess for a word",
    event => millisAsSeconds(event.guessTimeMs))
    .withYLabels(yLabelIncrements(2, "s"))
    .withMetricUnit("s")
    .withAggregation("ranking")
    .withOrdering("minValue"),

  longestGuessStreak: new MetricView<guessStreakStatEvent>(
    "Longest Guess Streak",
    "The longest streak of correct guesses in a row",
    event => event.streak)
    .withYLabels(yLabelIncrements(1))
    .withAggregation("ranking")
    .withOrdering("maxValue"),

  averageGuessAccuracy: new MetricView<guessAccuracyStatEvent>(
    "Average Guess Accuracy",
    "The average letter count accuracy of player guesses",
    event => event.accuracy * 100)
    .withYLabels(yLabelIncrements(10))
    .withAggregation("average")
    .withOrdering("maxValue"),

  averageGuessRank: new MetricView<guessRankStatEvent>(
    "Average Guess Rank",
    "The average rank of player's correct guess",
    event => event.rank)
    .withYLabels(yLabelIncrements(1))
    .withAggregation("average")
    .withOrdering("minValue"),

  averageDrawTime: new MetricView<drawTimeStatEvent>(
    "Average Draw Time",
    "The average draw time of a player",
    event => millisAsSeconds(event.drawTimeMs))
    .withMetricUnit("s")
    .withAggregation("average")
    .withYLabels(yLabelIncrements(5, "s"))
    .withOrdering("minValue"),

  fastestDrawTime: new MetricView<drawTimeStatEvent>(
    "Fastest Draw Time",
    "The fastest draw time of a player",
    event => millisAsSeconds(event.drawTimeMs))
    .withYLabels(yLabelIncrements(2, "s"))
    .withMetricUnit("s")
    .withAggregation("ranking")
    .withOrdering("minValue"),

  averageGuessedPlayers: new MetricView<drawGuessedPlayersStatEvent>(
    "Average Guessed Players",
    "The average amount of players that guessed a player's drawing",
    event => event.guessedPlayers)
    .withYLabels(yLabelIncrements(1))
    .withAggregation("average")
    .withOrdering("maxValue"),

  averageDrawScore: new MetricView<drawScoreStatEvent>(
    "Average Draw Score",
    "The average score for a player's drawing",
    event => event.score)
    .withYLabels(yLabelIncrements(500, "pts"))
    .withAggregation("average")
    .withOrdering("maxValue")
    .withMetricUnit("pts"),

  averageDrawLikes: new MetricView<drawLikesStatEvent>(
    "Average Draw Likes",
    "The average likes for player drawings",
    event => event.likes)
    .withYLabels(yLabelIncrements(1))
    .withAggregation("average")
    .withOrdering("maxValue"),

  mostDrawDislikes: new MetricView<drawDislikesStatEvent>(
    "Most Draw Dislikes",
    "The most dislikes a player received for a drawing",
    event => event.dislikes)
    .withYLabels(yLabelIncrements(1))
    .withAggregation("ranking")
    .withOrdering("maxValue"),
});