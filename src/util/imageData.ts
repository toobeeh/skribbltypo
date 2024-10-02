export class ImageData {

  public static async fromImageUrl(url: string): Promise<ImageData> {
    const blob = await (await fetch(url)).blob();
    return ImageData.fromBlob(blob);
  }

  public static async fromBlob(blob: Blob): Promise<ImageData> {
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve, reject) => {
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(new ImageData(base64, blob));
      };
      reader.onerror = () => reject();
    });
  }

  public static async fromBase64(base64: string): Promise<ImageData> {
    const blob = await (await fetch(base64)).blob();
    return new ImageData(base64, blob);
  }

  private constructor(private _base64Full: string, private _blob: Blob) { }

  public get base64Full(): string {
    return this._base64Full;
  }

  public get blob(): Blob {
    return this._blob;
  }

  public get base64ApiTruncated(): string {
    return this._base64Full.split(",")[1].replace("==", "");
  }

  public getBase64(){
    return this._base64Full;
  }
}