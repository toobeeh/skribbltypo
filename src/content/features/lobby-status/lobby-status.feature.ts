import { type MemberDto } from "@/api";
import type { featureBinding } from "@/content/core/feature/featureBinding";
import { ExtensionSetting } from "@/content/core/settings/setting";
import { LobbyConnectionService } from "@/content/features/lobby-status/lobby-connection.service";
import { GlobalSettingsService } from "@/content/services/global-settings/global-settings.service";
import { LobbyService } from "@/content/services/lobby/lobby.service";
import { MemberService } from "@/content/services/member/member.service";
import type { componentData } from "@/content/services/modal/modal.service";
import { ToastService } from "@/content/services/toast/toast.service";
import { ElementsSetup } from "@/content/setups/elements/elements.setup";
import type {
  SkribblLobbyStateDto,

} from "@/signalr/tobeh.Avallone.Server.Classes.Dto";
import { repeatAfterDelay } from "@/util/rxjs/repeatAfterDelay";
import type { skribblLobby } from "@/util/skribbl/lobby";
import { fromObservable } from "@/util/store/fromObservable";
import {
  BehaviorSubject,
  combineLatestWith,
  debounce,
  distinctUntilChanged, interval,
  map,
  of,
  type Subscription, withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { inject } from "inversify";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import AreaFlyout from "@/lib/area-flyout/area-flyout.svelte";
import LobbyStatus from "./lobby-status.svelte";


export class LobbyStatusFeature extends TypoFeature {
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(MemberService) private readonly _memberService!: MemberService;
  @inject(ToastService) private readonly _toastService!: ToastService;
  @inject(GlobalSettingsService) private readonly _settingsService!: GlobalSettingsService;
  @inject(LobbyConnectionService) private readonly _lobbyConnectionService!: LobbyConnectionService;

  protected override get boundServices(): featureBinding[] {
    return [this._lobbyConnectionService];
  }

  private _privateLobbyWhitelistEnabledSetting = new ExtensionSetting<boolean>(
    "private_whitelist_enabled",
    false,
    this,
  );
  private _publicLobbyWhitelistEnabledSetting = new ExtensionSetting<boolean>(
    "public_whitelist_enabled",
    false,
    this,
  );
  private _privateLobbyWhitelistedServersSetting = new ExtensionSetting<string[]>(
    "private_whitelisted_servers",
    [],
    this,
  );
  private _publicLobbyWhitelistedServersSetting = new ExtensionSetting<string[]>(
    "public_whitelisted_servers",
    [],
    this,
  );

  private _lobbySubscription?: Subscription;
  private _currentBackendProcessing?: Promise<void>; /** a promise that resolves when the current backend lobby update finished */
  private _triggerManualRefresh$ = new BehaviorSubject(undefined);

  private _controlIcon?: IconButton;
  private _controlIconSubscription?: Subscription;
  private _flyoutComponent?: AreaFlyout;
  private _flyoutSubscription?: Subscription;
  private _lobbyTypeSubscription?: Subscription;

  /**
   * A store containing the current connection state
   */
  public get connectionStore() {
    return fromObservable(this._lobbyConnectionService.connection$, undefined);
  }

  /**
   * Store containing devmode state
   */
  public get isDevmodeStore() {
    return this._settingsService.settings.devMode.store;
  }

  public readonly name = "Lobby Status";
  public readonly description =
    "Share your current lobby with typo to use avatar decorations, give awards and catch drops.";
  public readonly featureId = 19;

  protected override async onActivate() {
    this._lobbyTypeSubscription = this._lobbyService.lobby$
      .pipe(
        map((lobby) =>
          lobby === null
            ? null
            : lobby.id === null
              ? "practice"
              : lobby.private
                ? "custom"
                : "public",
        ),
        distinctUntilChanged(),
        combineLatestWith(this._lobbyConnectionService.connection$)
      )
      .subscribe(async ([type, connection]) => {
        if ((type === "public" || type === "custom") && connection !== "unauthorized") {
          if(!this._controlIcon) await this.setupSettings();

          const open = connection?.typoLobbyState.lobbySettings.whitelistAllowedServers === false;
          const icon = connection === undefined ? "file-img-connection-loading-gif" : open ? "file-img-connection-open-gif" : "file-img-connection-gif";
          const greyscale = connection !== undefined;
          this._controlIcon?.$set({
            icon,
            greyscaleInactive: greyscale,
          });

        } else {
          this.destroySettings();
          this._flyoutComponent?.close();
        }
      });

    this._lobbySubscription = repeatAfterDelay(
      this._lobbyService.lobby$.pipe(
        combineLatestWith(this._triggerManualRefresh$),
        map(([lobby]) => lobby),
      ),
      30 * 1000,
    )
      .pipe(
        debounce(() => this._lobbyConnectionService.isConnected ? of(null) : interval(2000)), // start connection only after player has been in the lobby for 2s to avoid spamming
        combineLatestWith(this._memberService.member$),
        debounce(() => this._currentBackendProcessing ?? of(0)), // allow only one backend processing at a time
      )
      .subscribe(
        ([lobby, member]) =>
          (this._currentBackendProcessing = this.processLobbyUpdate(lobby, member)),
      );
  }

  protected override async onDestroy() {
    this._lobbySubscription?.unsubscribe();
    this._lobbyTypeSubscription?.unsubscribe();
    this.destroySettings();
  }

  /**
   * Sets up the lobby settings/status UI
   * @private
   */
  private async setupSettings() {
    const elements = await this._elementsSetup.complete();

    this._controlIcon = new IconButton({
      target: elements.chatControls,
      props: {
        icon: "file-img-connection-gif",
        name: "Lobby Status",
        order: 2,
        size: "2rem",
        hoverMove: false,
        greyscaleInactive: true,
        tooltipAction: this.createTooltip,
      },
    });

    /* open settings when icon clicked */
    this._controlIconSubscription = this._controlIcon.click$.subscribe(() => {
      /* if already opened, return */
      if (this._flyoutComponent) {
        return;
      }

      /* create fly out content */
      const flyoutContent: componentData<LobbyStatus> = {
        componentType: LobbyStatus,
        props: {
          feature: this,
        },
      };

      /* open flyout and destroy when closed */
      this._flyoutComponent = new AreaFlyout({
        target: elements.gameWrapper,
        props: {
          componentData: flyoutContent,
          areaName: "chat",
          maxHeight: "600px",
          maxWidth: "300px",
          title: "Lobby Status",
          closeStrategy: "explicit",
          iconName: "file-img-connection-gif",
          alignment: "top",
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

  /**
   * Destroys the lobby settings/status UI
   * @private
   */
  private destroySettings() {
    this._controlIcon?.$destroy();
    this._controlIconSubscription?.unsubscribe();
    this._controlIcon = undefined;
    this._flyoutComponent?.$destroy();
    this._flyoutSubscription?.unsubscribe();
    this._flyoutComponent = undefined;
  }

  /**
   * Processes a new lobby update
   * Connects to the server if in lobby and not yet connected, or disconnects if lobby left, or updates state if already connected
   * @param lobby the current lobby data
   * @param member the authenticated member data
   * @private
   */
  private async processLobbyUpdate(
    lobby: skribblLobby | null,
    member: MemberDto | undefined | null,
  ): Promise<void> {
    this._logger.info("processing lobby status update", lobby, member?.userName);

    /* if member is null and connection exists, disconnect */
    if (member === null || member === undefined) {
      await this._lobbyConnectionService.destroyConnection(true);
      return;
    }

    /* if lobby is null or practice and connection exists, disconnect */
    if (lobby === null || lobby.id === null) {
      await this._lobbyConnectionService.destroyConnection();
      return;
    }

    /* if lobby exists, but connection null, connect */
    if (lobby && !this._lobbyConnectionService.isConnected) {
      const lobbyDto = this.mapLobbyToDto(lobby);
      const result = await this._lobbyConnectionService.setupConnection(
        lobby.id,
        lobbyDto,
        lobby.meId,
        member,
      );

      if(result === "failed") {
        this._logger.error("Failed to setup connection, retrying in next update cycle");
        return;
      }

      const { typoLobbyState, hub } = this._lobbyConnectionService.connection;

      // set default settings if owner and not a reconnect (existing claim undefined)
      if (typoLobbyState.playerIsOwner && result === "connected") {
        const defaults = lobby.private
          ? {
              whitelistEnabled: await this._privateLobbyWhitelistEnabledSetting.getValue(),
              whitelist: await this._privateLobbyWhitelistedServersSetting.getValue(),
            }
          : {
              whitelistEnabled: await this._publicLobbyWhitelistEnabledSetting.getValue(),
              whitelist: await this._publicLobbyWhitelistedServersSetting.getValue(),
            };
        try {
          await hub.updateTypoLobbySettings({
            description: "",
            whitelistAllowedServers: defaults.whitelistEnabled,
            allowedServers: defaults.whitelist,
          });
        } catch (e) {
          this._logger.error("Failed to set defaults", e);
        }
      }
    }

    /* if lobby exists, and connected, send update */
    if (lobby && this._lobbyConnectionService.isConnected) {

      /* if current lobby is different from current connection, disconnect and reconnect, then run again */
      if (lobby.id !== this._lobbyConnectionService.connection.typoLobbyState.lobbyId) {
        this._logger.info("Lobby changed, reconnecting");
        await this._lobbyConnectionService.destroyConnection();
        return this.processLobbyUpdate(lobby, member);
      } else
        await this._lobbyConnectionService.connection.hub.updateSkribblLobbyState(
          this.mapLobbyToDto(lobby),
        );
    }

    this._logger.info("Lobby status processed");
  }

  /**
   * Maps the current lobby state to a DTO
   * @param lobby
   * @private
   */
  private mapLobbyToDto(lobby: skribblLobby): SkribblLobbyStateDto {
    if (lobby.id === null) throw new Error("cannot map practice lobby to state dto");

    return {
      link: lobby.id,
      ownerId: lobby.ownerId ?? undefined,
      round: lobby.round,
      players: lobby.players.map((player) => ({
        name: player.name,
        isDrawing: player.id === lobby.drawerId,
        score: player.score,
        playerId: player.id,
        hasGuessed: player.guessed,
      })),
      settings: {
        language: lobby.settings.language,
        players: lobby.settings.players,
        rounds: lobby.settings.rounds,
        drawTime: lobby.settings.drawTime,
      },
    };
  }

  /**
   * Updates the settings of the current typo lobby
   * Requires the player to be the typo lobby owner
   * @param description The new description of the lobby to be shown in the palantir bot
   * @param whitelistAllowedServers Whether the lobby invite will be shown only in servers in the allowedServers list
   * @param allowedServers A list of server IDs which are allowed to show the lobby invite
   */
  public async updateLobbySettings(
    description: string,
    whitelistAllowedServers: boolean,
    allowedServers: Record<string, boolean>,
  ) {
    const toast = await this._toastService.showLoadingToast("Updating lobby settings");

    /* write settings to defaults */
    this._lobbyService.lobby$.subscribe((lobby) => {
      if (!lobby) return;
      if (lobby.private) {
        this._privateLobbyWhitelistEnabledSetting.setValue(whitelistAllowedServers);
        this._privateLobbyWhitelistedServersSetting.setValue(
          Object.keys(allowedServers).filter((key) => allowedServers[key]),
        );
      } else {
        this._publicLobbyWhitelistEnabledSetting.setValue(whitelistAllowedServers);
        this._publicLobbyWhitelistedServersSetting.setValue(
          Object.keys(allowedServers).filter((key) => allowedServers[key]),
        );
      }
    });

    try {
      await this._lobbyConnectionService.connection.hub.updateTypoLobbySettings({
        description,
        whitelistAllowedServers,
        allowedServers: Object.entries(allowedServers)
          .filter(([, value]) => value)
          .map(([key]) => key),
      });
      toast.resolve();
    } catch (e) {
      this._logger.error("Failed to update lobby settings", e);
      toast.reject();
    }
  }

  /**
   * Disconnect the current lobby connection
   * The next lobby change event will reconnect as if lobby was first discovered
   */
  public async resetConnection() {
    await this._lobbyConnectionService.destroyConnection();
    await this._toastService.showToast(
      undefined,
      "Connection reset; reconnecting in next update cycle",
    );
  }

  /**
   * Triggers a lobby update event with the last seen lobby data
   */
  public async triggerManualRefresh() {
    this._triggerManualRefresh$.next(undefined);
    await this._toastService.showToast(undefined, "Manual refresh triggered");
  }
}