import { ExtensionCommand } from "@/content/core/commands/command";
import { StringOptionalCommandParameter } from "@/content/core/commands/params/string-optional-command-parameter";
import { InterpretableSilentSuccess } from "@/content/core/commands/results/interpretable-silent-success";
import { FeatureTag } from "@/content/core/feature/feature-tags";
import { HotkeyAction } from "@/content/core/hotkeys/hotkey";
import { CloudService } from "@/content/features/controls-cloud/cloud.service";
import { DrawingService } from "@/content/services/drawing/drawing.service";
import { ImageFinishedService } from "@/content/services/image-finished/image-finished.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { MemberService } from "@/content/services/member/member.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import { copyBlobToClipboard } from "@/util/clipboard";
import { downloadBlob, downloadText } from "@/util/download";
import type {
  IGifRendererParent,
  IGifRendererWorker,
} from "@/worker/gif-renderer/gif-renderer.worker";
import { TypedWorkerExecutor } from "@/worker/typed-worker";
import { gifRendererWorkerBase64 } from "@/worker/workers";
import { inject } from "inversify";
import { catchError, combineLatest, map, of, Subscription, switchMap, take, withLatestFrom } from "rxjs";
import { fromPromise } from "rxjs/internal/observable/innerFrom";
import { TypoFeature } from "../../core/feature/feature";
import ToolbarSave from "./toolbar-save.svelte";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";

export class ToolbarSaveFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(DrawingService) private readonly _drawingService!: DrawingService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(CloudService) private readonly _cloudService!: CloudService;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ImageFinishedService) private readonly _imageFinishedService!: ImageFinishedService;

  public readonly name = "Save Image";
  public readonly description =
    "Adds an icon to the typo toolbar to save the current image locally, to cloud, as gif or as draw command file";
  public readonly tags = [
    FeatureTag.DRAWING
  ];
  public readonly featureId = 12;

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;
  private _customName?: string;

  public set customName(value: string | undefined){
    const val = value?.replace(/[^a-z0-9]/gi, "_") ?? undefined;
    this._customName = val && val.length > 0 ? val : undefined;
  }

  public get customName(){
    return this._customName;
  }

  private readonly _saveCommand = this.useCommand(
    new ExtensionCommand("save", this, "Save Image", "Downloads the current image"),
  ).withParameters(params => params
    .addParam(new StringOptionalCommandParameter("File name", "The filename of the downloaded image", name => ({ name })))
    .run(async (args, command) => {
      this._customName = args.name;
      await this.saveAsPng();
      return new InterpretableSilentSuccess(command);
    })
  );

  private readonly _copyHotkey = this.useHotkey(
    new HotkeyAction(
      "save",
      "Copy to Clipboard",
      "Copy the current image to the clipboard",
      this,
      () => this.saveToClipboard(),
      true,
      ["ControlLeft", "KeyC"]
    ));

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();

    /* create icon and attach to toolbar */
    this._iconComponent = new IconButton({
      target: elements.toolbar,
      props: {
        icon: "file-img-floppy-drive-gif",
        name: "Save Image",
        order: 2,
        tooltipAction: this.createTooltip,
        lockTooltip: "Y"
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => {

      /* if already opened, return */
      if (this._flyoutComponent) {
        return;
      }

      /* create fly out content */
      const flyoutContent: componentData<ToolbarSave> = {
        componentType: ToolbarSave,
        props: {
          feature: this,
        },
      };

      /* open flyout and destroy when clicked out */
      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          maxWidth: "300px",
          title: "Save Image",
          iconName: "file-img-floppy-drive-gif",
        },
      });
      this._flyoutSubscription = this._flyoutComponent.closed$.subscribe(() => {
        this._logger.info("Destroyed flyout");
        this._flyoutComponent?.$destroy();
        this._flyoutSubscription?.unsubscribe();
        this._flyoutComponent = undefined;
      });
    });
  }

  async saveInCloud() {
    const toast = await this._toastService.showLoadingToast("Uploading image");
    this._imageFinishedService
      .mapToImageState()
      .pipe(
        withLatestFrom(this._memberService.member$),
        catchError((err) => {
          this._logger.error("Failed to save image", err);
          toast.reject("Unknown error :(");
          throw err;
        }),
      )
      .subscribe(async ([image, member]) => {
        if (!image) {
          this._logger.error("Failed to get image data, no drawing active?");
          toast.reject("Failed to get image");
          throw new Error("No drawing active");
        }
        if (!member) {
          this._logger.error("Failed to get member, not logged in?");
          toast.reject("You need to log in to use the cloud");
          return of(false);
        }

        /* use custom name */
        if (this._customName) {
          image.name = this._customName;
        }

        await this._cloudService.uploadToCloud(image, member);
        toast.resolve();
      });
  }

  async saveAsPng() {
    const toast = await this._toastService.showLoadingToast("Downloading image");
    combineLatest({
      blob: fromPromise(this._drawingService.getCurrentImageData()).pipe(map(data => data.blob)),
      meta: this._drawingService.imageState$.pipe(take(1)),
      lobby: this._lobbyService.lobby$.pipe(take(1)),
    }).pipe(
      catchError(err => {
        this._logger.error("Failed to download image", err);
        toast.reject();
        throw err;
      })
    ).subscribe(({ blob, meta, lobby }) => {
      if(!meta) {
        this._logger.error("Failed to get image meta data, no drawing active?");
        toast.reject("Failed to get image");
        throw new Error("No drawing active");
      }

      if(!lobby) {
        this._logger.error("Failed to get lobby, not joined?");
        toast.reject("failed to get lobby details");
        throw new Error("Not joined in lobby");
      }

      const drawer = lobby.players.find(player => player.id === meta.drawerId)?.name ?? "unknown";
      downloadBlob(blob, (this._customName ?? `skribbl-${meta.word.hints}-by-${drawer}`) + ".png");
      toast.resolve();
    });
  }

  async saveToClipboard(){
    this._logger.debug("Saving to clipboard");

    const toast = await this._toastService.showLoadingToast("Saving image to clipboard");
    combineLatest({
      blob: fromPromise(this._drawingService.getCurrentImageData()).pipe(map(data => data.blob))
    }).pipe(
      catchError(err => {
        this._logger.error("Failed to copy image", err);
        toast.reject();
        throw err;
      })
    ).subscribe(async ({ blob }) => {
      try {
        await copyBlobToClipboard(blob);
        toast.resolve();
      }
      catch(err){
        this._logger.error("Failed to copy image", err);
        toast.reject("Failed to copy image");
      }
    });
  }

  async saveAsGif() {
    this._logger.debug("Saving as gif");
    const toast = await this._toastService.showStickyToast("Generating GIF");

    combineLatest({
      commands: this._drawingService.commands$,
      lobby: this._lobbyService.lobby$.pipe(take(1)),
      state: this._drawingService.imageState$,
      duration: fromPromise(this._toastService.showPromptToast("Generate GIF", "Enter the preferred duration in seconds")).pipe(
        switchMap(v => v.result)
      )
    }).pipe(
      take(1)
    ).subscribe(async ({commands, lobby, state, duration}) => {

      const durationMs = parseFloat(duration ?? "") * 1000;
      if(Number.isNaN(durationMs)){
        toast.resolve("Invalid duration entered");
        return;
      }

      if(state === null) {
        this._logger.warn("Attempted to save commands, but state null. In a lobby?");
        toast.resolve("No drawing active");
        throw new Error("state is null");
      }

      if(!lobby) {
        this._logger.error("Failed to get lobby, not joined?");
        toast.resolve("Failed to get lobby details");
        throw new Error("Not joined in lobby");
      }

      const progressBar = (progress: number) => {
        const doneChar = "█";
        const leftChar = "░";
        const length = 10;
        const done = Math.floor(progress * length);
        const left = length - done;
        return `${doneChar.repeat(done)}${leftChar.repeat(left)}`;
      };

      const drawer = lobby.players.find(player => player.id === state.drawerId)?.name ?? "unknown";
      const name = this._customName ?? `skribbl-${state.word.hints}-by-${drawer}`;

      const workerBlob = new Blob([atob(gifRendererWorkerBase64)], { type: "application/javascript" });
      const worker = new TypedWorkerExecutor<IGifRendererWorker, IGifRendererParent>(
        URL.createObjectURL(workerBlob),
        {
          frameRendered: (index, total) => {
            toast.update(`Rendering GIF..   ${progressBar(index / total)} (${Math.floor(index*100/total).toString().padStart(2, " ")}%)`);
          }
        }
      );
      const gif = await worker.run("renderGif", commands, durationMs);
      /*const gif = gifRendererWorker.renderGif(commands, 5000);*/

      toast.resolve(`${name} rendered`, 3000);
      downloadBlob(gif, `${name}.gif`);
    });
  }

  async saveAsDrawCommands() {
    this._logger.debug("Saving as draw commands");
    const toast = await this._toastService.showLoadingToast("Downloading commands");

    combineLatest({
      meta: this._drawingService.imageState$.pipe(take(1)),
      lobby: this._lobbyService.lobby$.pipe(take(1)),
      commands: this._drawingService.commands$.pipe(take(1)),
    }).pipe(
      catchError(err => {
        this._logger.error("Failed to download commands", err);
        toast.reject();
        throw err;
      })
    ).subscribe(({meta, lobby, commands}) => {
      if(!meta) {
        this._logger.error("Failed to get image meta data, no drawing active?");
        toast.reject("Failed to get image");
        throw new Error("No drawing active");
      }

      if(!lobby) {
        this._logger.error("Failed to get lobby, not joined?");
        toast.reject("failed to get lobby details");
        throw new Error("Not joined in lobby");
      }

      const json = JSON.stringify(commands);
      const drawer = lobby.players.find(player => player.id === meta.drawerId)?.name ?? "unknown";
      downloadText(json, (this._customName ?? `skribbl-${meta.word.hints}-by-${drawer}`) + ".skd");
      toast.resolve();
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._iconClickSubscription?.unsubscribe();
    this._iconComponent?.$destroy();
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
  }
}