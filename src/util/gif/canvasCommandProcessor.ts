import { Color } from "@/util/color";

export class CanvasCommandProcessor {

  private readonly _width: number;
  private readonly _height: number;
  private readonly _thicknessMin = 4;
  private readonly _thicknessMax = 40;

  constructor(private readonly _canvasContext: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D) {
    this._width = _canvasContext.canvas.width;
    this._height = _canvasContext.canvas.height;

    this._canvasContext.fillStyle = "white";
    this._canvasContext.fillRect(0, 0, this._width, this._height);
  }

  /**
   * Skribbl comamnd interface
   * @param command
   * brush: [0, colorCode, size, x1, y1, x2, y2]
   * fill: [1, colorCode, x, y]
   *
   */
  public processDrawCommand(command: number[]){
    if(command.length < 2){
      throw new Error("Invalid command length smaller than 2");
    }

    switch(command[0]){
      case 0:
        if(command.length < 7){
          throw new Error("Invalid brush command length smaller than 7");
        }
        this.drawLine(command[3], command[4], command[5], command[6], command[1], command[2]);
        break;
      case 1:
        if(command.length < 4){
          throw new Error("Invalid fill command length smaller than 4");
        }
        this.floodFill(command[2], command[3], command[1]);
        break;
    }
  }

  public clear(){
    this._canvasContext.clearRect(0, 0, this._width, this._height);
  }

  /**
   * Exports current image as uint8clampedarray
   */
  public exportImage(){
    return this._canvasContext.getImageData(0, 0, this._width, this._height).data;
  }

  private drawLine(x1: number, y1: number, x2: number, y2: number, color: number, size: number){

    /*  ensure integer and in bounds */
    size = (size < this._thicknessMin) ? this._thicknessMin : (size > this._thicknessMax) ? this._thicknessMax : Math.floor(size);

    const rgb = Color.fromSkribblCode(color).rgb;
    const radius = Math.ceil(size / 2);
    const radiusSquared = radius * radius;

    /* process coordinates just as skribbl */
    let startX = this.clamp(Math.floor(x1), -radius, this._width + radius);
    let startY = this.clamp(Math.floor(y1), -radius, this._height + radius);
    let endX = this.clamp(Math.floor(x2), -radius, this._width + radius);
    let endY = this.clamp(Math.floor(y2), -radius, this._height + radius);

    const minX = Math.min(startX, endX) - radius;
    const minY = Math.min(startY, endY) - radius;
    const maxX = Math.max(startX, endX) + radius;
    const maxY = Math.max(startY, endY) + radius;

    startX -= minX;
    startY -= minY;
    endX -= minX;
    endY -= minY;

    const imageData = this._canvasContext.getImageData(minX, minY, maxX - minX, maxY - minY);

    const applyBrush = (x: number, y: number) => {
      for (let offsetX = -radius; offsetX <= radius; offsetX++) {
        for (let offsetY = -radius; offsetY <= radius; offsetY++) {
          if (offsetX * offsetX + offsetY * offsetY < radiusSquared) {
            const pixelIndex = 4 * ((y + offsetY) * imageData.width + x + offsetX);
            this.setPixel(imageData, pixelIndex, rgb.r, rgb.g, rgb.b);
          }
        }
      }
    };

    if (startX === endX && startY === endY) {
      applyBrush(startX, startY);
    } else {
      applyBrush(startX, startY);
      applyBrush(endX, endY);

      const deltaX = Math.abs(endX - startX);
      const deltaY = Math.abs(endY - startY);
      const stepX = startX < endX ? 1 : -1;
      const stepY = startY < endY ? 1 : -1;
      let error = deltaX - deltaY;

      while (startX !== endX || startY !== endY) {
        const doubleError = error * 2;
        if (doubleError > -deltaY) {
          error -= deltaY;
          startX += stepX;
        }
        if (doubleError < deltaX) {
          error += deltaX;
          startY += stepY;
        }
        applyBrush(startX, startY);
      }
    }

    this._canvasContext.putImageData(imageData, minX, minY);
  }

  private floodFill(x: number, y: number, color: number){
    const imageData = this._canvasContext.getImageData(0, 0, this._width, this._height);
    x = this.clamp(Math.floor(x), 0, this._width);
    y = this.clamp(Math.floor(y), 0, this._height);
    const fill = Color.fromSkribblCode(color).rgb;

    const pixelStack = [[x, y]];
    const targetColor = this.getPixel(imageData, x, y);

    if (fill.r !== targetColor[0] || fill.g !== targetColor[1] || fill.b !== targetColor[2]) {
      const isMatchingColor = (pixelIndex: number) => {
        const r = imageData.data[pixelIndex];
        const g = imageData.data[pixelIndex + 1];
        const b = imageData.data[pixelIndex + 2];
        return r === targetColor[0] && g === targetColor[1] && b === targetColor[2];
      };

      const width = imageData.width;
      const height = imageData.height;

      while (pixelStack.length > 0) {
        // eslint-disable-next-line prefer-const
        let [x, y] = pixelStack.pop() ??[-1,-1];
        let pixelIndex = 4 * (y * width + x);

        // Go up
        while (y >= 0 && isMatchingColor(pixelIndex)) {
          pixelIndex -= 4 * width;
          y--;
        }

        // Go down
        pixelIndex += 4 * width;
        y++;
        let leftSideFilled = false;
        let rightSideFilled = false;

        while (y < height && isMatchingColor(pixelIndex)) {
          this.setPixel(imageData, pixelIndex, fill.r, fill.g, fill.b);

          if (x > 0 && isMatchingColor(pixelIndex - 4)) {
            if (!leftSideFilled) {
              pixelStack.push([x - 1, y]);
              leftSideFilled = true;
            }
          } else if (leftSideFilled) {
            leftSideFilled = false;
          }

          if (x < width - 1 && isMatchingColor(pixelIndex + 4)) {
            if (!rightSideFilled) {
              pixelStack.push([x + 1, y]);
              rightSideFilled = true;
            }
          } else if (rightSideFilled) {
            rightSideFilled = false;
          }

          pixelIndex += 4 * width;
          y++;
        }
      }

      this._canvasContext.putImageData(imageData, 0, 0);
    }
  }

  private getPixel(imageData: ImageData, x: number, y: number){
    const pixelIndex = 4 * (y * imageData.width + x);
    if(pixelIndex < 0 || pixelIndex >= imageData.data.length) {
      return [0, 0, 0];
    }
    return [imageData.data[pixelIndex], imageData.data[pixelIndex + 1], imageData.data[pixelIndex + 2]];
  }

  private setPixel(imageData: ImageData, index: number, r: number, g: number, b: number){
    if(index < 0 || index >= imageData.data.length) return;
    imageData.data[index] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = 255;
  }

  private clamp(value: number, min: number, max: number){
    return Math.min(Math.max(value, min), max);
  }

}