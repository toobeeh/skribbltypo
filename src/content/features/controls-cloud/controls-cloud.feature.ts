import { CloudApi, type CloudImageDto, type CloudSearchDto, type MemberDto } from "@/api";
import { FeatureTag } from "@/content/core/feature/feature-tags";
import { CloudService } from "@/content/features/controls-cloud/cloud.service";
import { ImagelabService } from "@/content/features/toolbar-imagelab/imagelab.service";
import { ImagePostService } from "@/content/features/toolbar-imagepost/image-post.service";
import { ApiService } from "@/content/services/api/api.service";
import { ImageFinishedService, type skribblImage } from "@/content/services/image-finished/image-finished.service";
import { MemberService } from "@/content/services/member/member.service";
import { type componentData, ModalService } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { downloadBlob } from "@/util/download";
import { ImageData } from "@/util/imageData";
import { fromObservable } from "@/util/store/fromObservable";
import { getCloudCommands } from "@/util/typo/getCloudCommands";
import { getCloudMeta } from "@/util/typo/getCloudMeta";
import type { IGifRendererParent, IGifRendererWorker } from "@/worker/gif-renderer/gif-renderer.worker";
import { TypedWorkerExecutor } from "@/worker/typed-worker";
import { gifRendererWorkerBase64 } from "@/worker/workers";
import { inject } from "inversify";
import { Subscription, withLatestFrom } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import ControlsSettings from "./controls-cloud.svelte";

export class ControlsCloudFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(CloudService) private readonly _cloudService!: CloudService;
  @inject(ImagePostService) private readonly _imagePostService!: ImagePostService;
  @inject(ImagelabService) private readonly _imageLabService!: ImagelabService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(ApiService) private readonly _apiService!: ApiService;
  @inject(ImageFinishedService) private readonly _imageFinishedService!: ImageFinishedService;

  public readonly name = "Typo Cloud";
  public readonly description =
    "Saves all images from your lobbies in a cloud and adds a gallery to browse them";
  public readonly tags = [
    FeatureTag.PALANTIR
  ];
  public readonly featureId = 17;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _cloudSavedSubscription?: Subscription;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    /* create icon and attach to controls */
    this._iconComponent = new IconButton({
      target: elements.controls,
      props: {
        hoverMove: false,
        size: "48px",
        icon: "file-img-cloud-gif",
        name: "Typo Cloud",
        order: 2,
        tooltipAction: this.createTooltip,
      },
    });

    /* listen for new images and combine with current member*/
    this._cloudSavedSubscription = this._imageFinishedService.imageFinished$
      .pipe(
        withLatestFrom(this._memberService.member$),
      )
      .subscribe(async ([image, member]) => {
        if(image === null || member === null || member === undefined) {
          this._logger.debug("Did not save image because either member or image not defined");
          return;
        }

        await this._cloudService.uploadToCloud(image, member, true); /* link pending awards if any */
      });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {
      const settingsComponent: componentData<ControlsSettings> = {
        componentType: ControlsSettings,
        props: {
          feature: this,
        },
      };
      this._modalService.showModal(settingsComponent.componentType, settingsComponent.props, "Typo Cloud");
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._cloudSavedSubscription?.unsubscribe();
  }

  public get memberStore() {
    return fromObservable(this._memberService.member$, undefined);
  }

  public async getImages(search: CloudSearchDto, login: number){

    if(search.authorQuery === "") search.authorQuery = undefined;
    if(search.titleQuery === "") search.titleQuery = undefined;
    if(search.createdInPrivateLobbyQuery === false) search.createdInPrivateLobbyQuery = undefined;
    if(search.isOwnQuery === false) search.isOwnQuery = undefined;
    return this._apiService.getApi(CloudApi).searchUserCloud({login, cloudSearchDto: search});
  }

  public async deleteImage(id: string, login: number){
    const toast = await this._toastService.showLoadingToast("Removing image from cloud");
    try {
      const image = await this._apiService.getApi(CloudApi).deleteImageFromUserCloud({login, id});
      toast.resolve();
      return image;
    }
    catch {
      toast.reject();
    }
  }

  public async addToImagePost(image: CloudImageDto, member: MemberDto){
    const toast = await this._toastService.showLoadingToast("Adding image to history");

    try {
      const meta = await getCloudMeta(image.metaUrl);
      const commands = await getCloudCommands(image.commandsUrl);
      const imageData = await ImageData.fromImageUrl(image.imageUrl);
      const skribblImage: skribblImage = {
        name: image.name,
        artist: image.author,
        private: meta.private,
        isOwn: meta.own,
        language: meta.language,
        player: member.userName,
        date: new Date(meta.date),
        commands,
        image: imageData
      };

      this._imagePostService.addToHistory(skribblImage);
      toast.resolve();
    }
    catch {
      toast.reject();
    }
  }

  public async saveAsPng(image: CloudImageDto){
    const toast = await this._toastService.showLoadingToast("Downloading image");
    try {
      const imageData = await ImageData.fromImageUrl(image.imageUrl);
      downloadBlob(imageData.blob, `skribbl-${image.name}-by-${image.author}.png`);
      toast.resolve();
    }
    catch(e){
      this._logger.error("Failed to download image", e);
      toast.reject();
      throw e;
    }
  }

  public async saveAsGif(image: CloudImageDto){
    const durationPrompt = await this._toastService.showPromptToast("Generate GIF", "Enter the preferred duration in seconds");
    const durationMs = await durationPrompt.result;
    if(durationMs === null) return;

    const toast = await this._toastService.showStickyToast("Rendering image GIF");
    try {
      const commands = await getCloudCommands(image.commandsUrl);

      const progressBar = (progress: number) => {
        const doneChar = "█";
        const leftChar = "░";
        const length = 10;
        const done = Math.floor(progress * length);
        const left = length - done;
        return `${doneChar.repeat(done)}${leftChar.repeat(left)}`;
      };

      const workerBlob = new Blob([atob(gifRendererWorkerBase64)], { type: "application/javascript" });
      const worker = new TypedWorkerExecutor<IGifRendererWorker, IGifRendererParent>(
        URL.createObjectURL(workerBlob),
        {
          frameRendered: (index, total) => {
            toast.update(`Rendering GIF..   ${progressBar(index / total)} (${Math.floor(index*100/total).toString().padStart(2, " ")}%)`);
          }
        }
      );
      const gif = await worker.run("renderGif", commands, parseFloat(durationMs ?? "") * 1000);
      downloadBlob(gif, `${image.name}-by-${image.author}.gif`.replaceAll(" ", "_"));

      toast.resolve("GIF rendering complete");
    }
    catch(e){
      this._logger.error("Failed to download image", e);
      toast.resolve("An error occurred");
      throw e;
    }
  }

  public async copyToClipboard(image: CloudImageDto){
    const toast = await this._toastService.showLoadingToast("Copying image link");
    try {
      await navigator.clipboard.writeText(image.imageUrl);
      toast.resolve();
    }
    catch(e){
      this._logger.error("Failed to copy image link to clipboard", e);
      toast.reject();
      throw e;
    }
  }

  public async addToImageLab(image: CloudImageDto) {
    const toast = await this._toastService.showLoadingToast("Adding image to image lab");

    try {
      const commands = await getCloudCommands(image.commandsUrl);
      this._imageLabService.saveDrawCommands(`${image.name}-by-${image.author}`, commands);
      toast.resolve();
    }
    catch {
      toast.reject("Is the image lab feature enabled?");
    }
  }
}