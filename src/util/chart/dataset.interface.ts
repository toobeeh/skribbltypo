import type { lobbyStatEvent } from "@/app/services/lobby-stats/lobby-stats-events.interface";

export interface chartPoint {
  x: number;
  y: number;
  label?: string;
  originalEvent?: lobbyStatEvent
}

export interface chartDataset {
  label: string;
  color: string;
  data: chartPoint[]
}

export interface chartDataProperties {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  datasets: number;
}

export interface chartConfig {
  xUnit?: string;
  yUnit?: string;
  yLabels?: (props: chartDataProperties) => ({y: number, label: string}[]);
  xLabels?: (props: chartDataProperties) => ({x: number, label: string}[]);
  title: string;
  description: string;
  mode: "bar" | "line";
}

export interface chartLayout {
  width: number;
  height: number;
  chartArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  barPadding: number;
  barMaxWidth: number;
  yGridGap: number;
}

export interface datasetSummaryEntry {result: number, unit: string, player: string}