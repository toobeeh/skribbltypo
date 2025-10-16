import type { chartConfig, chartDataProperties, chartDataset, chartLayout } from "@/util/chart/dataset.interface";

interface canvasTransforms {
  scale: number;
  panX: number;
  panY: number;
};

export class Chart {

  private readonly _canvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;
  private readonly _chartArea: {x: number, y: number, width: number, height: number};

  public get canvas() {
    return this._canvas;
  }

  constructor(
    private readonly _chartLayout: chartLayout,
    _canvas?: HTMLCanvasElement
  ) {
    this._canvas = _canvas ?? document.createElement("canvas");
    this._canvas.width = this._chartLayout.width;
    this._canvas.height = this._chartLayout.height;
    this._chartArea = this._chartLayout.chartArea;
    const context = this._canvas.getContext("2d");
    if(!context) throw new Error("Could not get 2D context from canvas");
    this._context = context;

    this._canvas.style.imageRendering = "auto";
    this._canvas.style.width = "100%";

    this.clear();
  }

  /**
   * Sets the dataset and config for the chart and draws it.
   * @param data
   * @param config
   */
  public setDataset(data: chartDataset[], config: chartConfig, transform: canvasTransforms) {
    this.clear();
    this.setCanvasTransform(transform);

    const properties = this.getChartDataProperties(data);

    this.drawTitle(config.title);
    this.drawDescription(config.description);
    this.drawGridlines(properties, config);

    if(config.mode === "bar") this.drawBars(data, properties, config);
    else if (config.mode === "line") this.drawLines(data, properties, config);

    this.drawAxis();
    this.drawAxisLabels(properties, config);
    this.drawLegend(data);
  }

  private getChartDataProperties(data: chartDataset[]): chartDataProperties {
    const flatX = data.flatMap(d => d.data.map(p => p.x));
    const flatY = data.flatMap(d => d.data.map(p => p.y));
    return {
      minX: Math.min(...flatX),
      maxX: Math.max(...flatX),
      minY: Math.min(...flatY),
      maxY: Math.max(...flatY),
      datasets: data.length
    };
  }

  /** sets transform properties of the canvas (zoom, pan) */
  private setCanvasTransform(tf: canvasTransforms) {
    // From MDN
    // - e and f control the horizontal and vertical translation of the context.
    // - When b and c are 0, a and d control the horizontal and vertical scaling of the context.
    this._context.setTransform({
      a: tf.scale,
      b: 0,
      c: 0,
      d: tf.scale,
      e: tf.panX,
      f: tf.panY
    });
  }

  /**
   * Clears the canvas.
   * @private
   */
  public clear() {
    this._context.save();
    this._context.reset();
    this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._context.fillStyle = "#FFF";
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    this._context.restore();
  }

  /**
   * Draws a title at the top center of the canvas.
   * @param title
   * @private
   */
  private drawTitle(title: string) {
    this._context.font = "bold 40px Nunito, monospace";
    this._context.fillStyle = "#000";
    this._context.textBaseline = "top";
    this._context.textAlign = "center";

    this._context.fillText(title, this._chartLayout.width / 2, 30);
  }

  /**
   * Draws a description below the title.
   * @param description
   * @private
   */
  private drawDescription(description: string) {
    this._context.font = "25px Nunito, monospace";
    this._context.fillStyle = "#000";
    this._context.textBaseline = "top";
    this._context.textAlign = "center";

    this._context.fillText(description, this._chartLayout.width / 2, 80);
  }

  /**
   * Draws a typo icon at the top right corner of the canvas.
   * @private
   */
  private drawTypoIcon() {
    return;
  }

  /**
   * Draws the X and Y axis based on the chart area.
   * @private
   */
  private drawAxis() {
    this._context.strokeStyle = "#000";
    this._context.lineWidth = 2;
    this._context.beginPath();
    this._context.moveTo(this._chartArea.x, this._chartArea.y);
    this._context.lineTo(this._chartArea.x, this._chartArea.y + this._chartArea.height);
    this._context.lineTo(this._chartArea.x + this._chartArea.width, this._chartArea.y + this._chartArea.height);
    this._context.stroke();

    return;
  }

  /**
   * Draws gridlines based on the chart area and layout.
   * If yLabels are provided in the config, draws horizontal lines at those y values.
   * If xLabels are provided in the config, draws vertical lines at those x values.
   * @param properties
   * @param config
   * @private
   */
  private drawGridlines(properties: chartDataProperties, config: chartConfig) {
    const yLines = Math.floor(this._chartArea.height / this._chartLayout.yGridGap);
    this._context.strokeStyle = "#0002";
    this._context.lineWidth = 1;
    this._context.beginPath();

    if(config.yLabels){
      config.yLabels(properties).forEach(label => {
        const y = this.chartToCanvasY(label.y, properties);
        this._context.moveTo(this._chartArea.x, y);
        this._context.lineTo(this._chartArea.x + this._chartArea.width, y);
      });
    }
    else {
      for(let i = 0; i <= yLines; i++){
        const y = this._chartArea.y + i * this._chartLayout.yGridGap;
        this._context.moveTo(this._chartArea.x, y);
        this._context.lineTo(this._chartArea.x + this._chartArea.width, y);
      }
    }

    if(config.xLabels) {
      config.xLabels(properties).forEach(label => {
        const x = this.chartToCanvasX(label.x, properties);
        this._context.moveTo(x, this._chartArea.y);
        this._context.lineTo(x, this._chartArea.y + this._chartArea.height);
      });
    }

    this._context.stroke();

    return;
  }

  /***
  * Draws the axis labels based on the chart area and layout.
  * If yLabels are provided in the config, uses those, otherwise calculates them based on yGridGap.
  * @param properties
  * @param config
  * @private
  */
  private drawAxisLabels(properties: chartDataProperties, config: chartConfig) {
    if(config.yLabels){
      this._context.font = "20px Nunito, monospace";
      this._context.fillStyle = "#000";
      this._context.textBaseline = "middle";
      this._context.textAlign = "right";

      config.yLabels(properties).forEach(label => {
        const y = this.chartToCanvasY(label.y, properties);
        this._context.fillText(label.label, this._chartArea.x - 10, y);
      });
    }
    else {
      const yLines = Math.floor(this._chartArea.height / this._chartLayout.yGridGap);
      const yStep = (properties.maxY) / yLines;
      this._context.font = "20px Nunito, monospace";
      this._context.fillStyle = "#000";
      this._context.textBaseline = "middle";
      this._context.textAlign = "right";

      const decimals = (properties.maxY / yLines) < 10 ? 1 : 0;
      for(let i = 0; i <= yLines; i++) {
        const yValue = i * yStep;
        const y = this._chartArea.y + this._chartArea.height - i * this._chartLayout.yGridGap;
        this._context.fillText(yValue.toFixed(decimals) + (config.yUnit ?? ""), this._chartArea.x - 10, y);
      }
    }

    if(config.xLabels){
      this._context.font = "20px Nunito, monospace";
      this._context.fillStyle = "#000";
      this._context.textBaseline = "top";
      this._context.textAlign = "center";

      config.xLabels(properties).forEach(label => {
        const x = this.chartToCanvasX(label.x, properties);
        this._context.fillText(label.label, x, this._chartArea.y + this._chartArea.height + 10);
      });
    }

    return;
  }

  /**
   * Draws bars for each dataset, ignoring x values and aligning bars evenly within the chart area.
   * Bars have a max width of 50 px and are spaced evenly within the chart area
   * @param data
   * @param properties
   * @param config
   * @private
   */
  private drawBars(data: chartDataset[], properties: chartDataProperties, config: chartConfig) {

    /* calculate bar width - spacing at sides and between bars, 50 px max width*/
    const padding = this._chartLayout.barPadding;
    const totalBarSpace = this._chartArea.width - padding * 2;
    const barWidth = Math.min(50, totalBarSpace / data.length + (data.length - 1) * padding);

    /* draw bars with dataset color border and slightly opacity in fill - ignore x and align bars */
    data.forEach((dataset, datasetIndex) => {
      this._context.fillStyle = dataset.color + "80";
      this._context.strokeStyle = dataset.color;
      this._context.lineWidth = 2;

      // only consider first dataset entry for bar mode
      if(dataset.data.length === 0) throw new Error("Dataset has no data points");
      dataset.data.slice(0,1).forEach(point => {
        const x = this._chartArea.x + padding + datasetIndex * (barWidth + padding);
        const y = this.chartToCanvasY(point.y, properties);
        const height = this._chartArea.y + this._chartArea.height - y;

        this._context.fillRect(x, y, barWidth, height);
        this._context.strokeRect(x, y, barWidth, height);

        if(point.label) {
          this._context.font = "15px Nunito, monospace";
          this._context.fillStyle = "#000";
          this._context.textBaseline = "bottom";
          this._context.textAlign = "center";
          this._context.fillText(point.label, x + barWidth / 2, y - 5);
        }

        // write dataset label and value above bar
        else {
          this._context.font = "15px Nunito, monospace";
          this._context.fillStyle = "#000";
          this._context.textBaseline = "bottom";
          this._context.textAlign = "center";
          this._context.fillText(`${dataset.label}`, x + barWidth / 2, y - 30);
          const decimals = point.y < 10 ? 2 : point.y < 100 ? 1 : 0;
          this._context.fillText(`${point.y.toFixed(decimals)}${config.yUnit ?? ""}`, x + barWidth / 2, y - 5);
        }
      });
    });

  }

  /**
   * Draws lines for each dataset, connecting points based on their x and y values.
   * @param data
   * @param properties
   * @param config
   * @private
   */
  private drawLines(data: chartDataset[], properties: chartDataProperties, config: chartConfig) {
    data.forEach(dataset => {
      this._context.strokeStyle = dataset.color;
      this._context.lineWidth = 3;
      this._context.beginPath();

      // draw lines connecting all points in dataset
      dataset.data.forEach((point, index) => {
        const x = this.chartToCanvasX(point.x, properties);
        const y = this.chartToCanvasY(point.y, properties);
        if(index === 0) this._context.moveTo(x, y);
        else this._context.lineTo(x, y);

        if(point.label) {
          this._context.font = "15px Nunito, monospace";
          this._context.fillStyle = "#000";
          this._context.textBaseline = "bottom";
          this._context.textAlign = (index === 0 || index != dataset.data.length - 1) ? "left" : "center";
          this._context.fillText(point.label, x, y - 5);
        }

        /* write ending value label, if above 0 (avoid drawing over each other) */
        else if(index === dataset.data.length - 1 && point.y > 0) {
          this._context.font = "15px Nunito, monospace";
          this._context.fillStyle = "#000";
          this._context.textBaseline = "bottom";
          this._context.textAlign = index === 0 ? "left" : "center";
          const decimals = point.y < 10 ? 2 : point.y < 100 ? 1 : 0;
          this._context.fillText(`${dataset.label} (${point.y.toFixed(decimals)}${config.yUnit})`, x + 5, y - 5);
        }
      });

      this._context.stroke();

      // draw points where each data point is
      dataset.data.forEach(point => {
        if(point.y === 0) return; // skip zero points

        const x = this.chartToCanvasX(point.x, properties);
        const y = this.chartToCanvasY(point.y, properties);
        this._context.fillStyle = dataset.color;
        this._context.beginPath();
        this._context.arc(x, y, 4, 0, Math.PI * 2);
        this._context.fill();
      });
    });
  }

  /**
   * Draws a legend at the bottom of the canvas, with colored circles and dataset labels.
   * @param data
   * @private
   */
  private drawLegend(data: chartDataset[]) {
    /* draw circles with color and dataset name at bottom of canvas, in a row left to right */
    let nextX = this._chartArea.x;
    for(const dataset of data){
      const x = nextX;
      const y = this._chartLayout.height - 50;

      this._context.fillStyle = dataset.color;
      this._context.beginPath();
      this._context.arc(x, y, 10, 0, Math.PI * 2);
      this._context.fill();

      this._context.font = "20px Nunito, monospace";
      this._context.fillStyle = "#000";
      this._context.textBaseline = "middle";
      this._context.textAlign = "left";
      this._context.fillText(dataset.label, x + 20, y);

      const textWidth = this._context.measureText(dataset.label).width;
      nextX += 60 + textWidth;
    }
  }

  /**
   * Converts a chart x value to a canvas x value based on the chart area and data properties.
   * @param x
   * @param properties
   * @private
   */
  private chartToCanvasX(x: number, properties: chartDataProperties) {

    // if all x are 0, return point at axis
    if(properties.maxX === 0) return this._chartArea.x;

    return this._chartArea.x + (x / properties.maxX) * this._chartArea.width;
  }

  /**
   * Converts a chart y value to a canvas y value based on the chart area and data properties.
   * @param y
   * @param properties
   * @private
   */
  private chartToCanvasY(y: number, properties: chartDataProperties) {
    return this._chartArea.y + this._chartArea.height - (y / properties.maxY) * this._chartArea.height;
  }

}