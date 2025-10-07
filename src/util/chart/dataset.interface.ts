export interface chartDataset {
  label: string;
  color: string;
  data: {x: number, y: number, label?: string}[]
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
  yLabels?: {y: number, label: string}[];
  xLabels?: {x: number, label: string}[];
  title: string;
  description: string;
}

export interface chartLayout {
  width: number;
  height: number;
  chartArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  barPadding: number;
  barMaxWidth: number;
  yGridGap: number;
}