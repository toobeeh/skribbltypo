import { ExtensionCommand } from "@/app/core/commands/command";
import { InterpretableSilentSuccess } from "@/app/core/commands/results/interpretable-silent-success";
import { FeatureTag } from "@/app/core/feature/feature-tags";
import { BooleanExtensionSetting } from "@/app/core/settings/setting";
import { LobbyLeftEventListener } from "@/app/events/lobby-left.event";
import { LobbyStateChangedEventListener } from "@/app/events/lobby-state-changed.event";
import { RoundStartedEventListener } from "@/app/events/round-started.event";
import type { datasetSummaryEntry } from "@/util/chart/dataset.interface";
import { MetricView } from "@/util/chart/metricView";
import { createMetricViews } from "@/app/features/lobby-statistics/viewsFactory";
import type {
  lobbyStatEvent,
} from "@/app/services/lobby-stats/lobby-stats-events.interface";
import { LobbyStatsService } from "@/app/services/lobby-stats/lobby-stats.service";
import { LobbyService } from "@/app/services/lobby/lobby.service";
import { type componentData, ModalService } from "@/app/services/modal/modal.service";
import { ElementsSetup } from "@/app/setups/elements/elements.setup";
import IconButton from "@/lib/icon-button/icon-button.svelte";
import { Chart } from "@/util/chart/chart";
import { downloadBlob, downloadText } from "@/util/download";
import { ImageData } from "@/util/imageData";
import type { skribblPlayer } from "@/util/skribbl/lobby";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import {
  BehaviorSubject, distinctUntilChanged,
  filter, map,
  mergeWith,
  type Observable,
  type Subscription,
  withLatestFrom,
} from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ExtensionSetting } from "../../core/settings/setting";
import { ChatService } from "../../services/chat/chat.service";
import ChartsComponent from "./charts.svelte";
import LobbyStatsManage from "./lobby-stats-manage.svelte";
import ChatSummaryStats from "./chat-summary-stats.svelte";

interface archiveEntry {
  key: string;
  lobbyId: string;
  date: string;
  name: string;
  players: skribblPlayer[];
}

export class LobbyStatisticsFeature extends TypoFeature {

  @inject(LobbyStatsService) private readonly _lobbyStatsService!: LobbyStatsService;
  @inject(LobbyService) private readonly _lobbyService!: LobbyService;
  @inject(LobbyLeftEventListener) private readonly _lobbyLeftEventListener!: LobbyLeftEventListener;
  @inject(RoundStartedEventListener) private readonly _roundStartedEventListener!: RoundStartedEventListener;
  @inject(LobbyStateChangedEventListener) private readonly _lobbyStateChangedEventListener!: LobbyStateChangedEventListener;
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ModalService) private readonly _modalService!: ModalService;
  @inject(ChatService) private readonly _chatService!: ChatService;

  public readonly name = "Game Stats";
  public readonly description = "Collects and visualizes competitive game statistics of lobbies.";
  public readonly tags = [
    FeatureTag.GAMEPLAY,
    FeatureTag.SOCIAL
  ];
  public readonly featureId = 55;

  public override get featureManagementComponent(): componentData<LobbyStatsManage> {
    return { componentType: LobbyStatsManage, props: { feature: this } };
  }

  private readonly _metricViews = createMetricViews();
  private _statArchive$ = new BehaviorSubject<Map<string, archiveEntry>>(new Map());
  private _seenLobbyPlayers$ = new BehaviorSubject<Map<string, Map<number, skribblPlayer>>>(new Map());
  private _statsSubscriptions: Subscription[] = [];

  private _iconComponent?: IconButton;
  private _iconClickSubscription?: Subscription;
  private _quickAccessSettingSubscription?: Subscription;

  private readonly _statViewCommand = this.useCommand(
    new ExtensionCommand("stat", this, "View stats in popup", "Opens a popup with detailed lobby statistics"),
  ).run(async command => {
    const popupComponent: componentData<ChartsComponent> = {
      componentType: ChartsComponent,
      props: {
        feature: this
      }
    };

    this._modalService.showModal(popupComponent.componentType, popupComponent.props, "Lobby Statistics", "card");
    return new InterpretableSilentSuccess(command);
  });

  private readonly _showQuickAccessSetting = this.useSetting(
    new BooleanExtensionSetting("quick_access", true, this)
      .withName("Stats View Access")
      .withDescription("Show an icon in the controls tray to quickly access the stats view.")
  );

  private readonly _chatStatSummarySetting = this.useSetting(
    new BooleanExtensionSetting("chat_summary", true, this)
      .withName("Chat Summary")
      .withDescription("Show a brief summary of stats in the chat after a round has ended.")
  );

  private readonly _chatSummarizeMetricCategories = new ExtensionSetting<string[]>(
    "summary_categories", ["averageCompletionSpeed", "averageDrawLikes", "averageGuessedPlayers", "fastestGuess"], this
  );

  private readonly _chatSummarizeTopMetrics = new ExtensionSetting<number>(
    "summary_top", 8, this
  );

  protected override async onActivate() {

    /* subscribe metrics and pipe them to views */
    this.subscribeMetric(this._lobbyStatsService.guessTimeStats$, this._metricViews.averageGuessTime);
    this.subscribeMetric(this._lobbyStatsService.turnStandingScoreStats$, this._metricViews.totalScore);
    this.subscribeMetric(this._lobbyStatsService.turnStandingScoreStats$, this._metricViews.finalStandings);
    this.subscribeMetric(this._lobbyStatsService.guessCountStats$, this._metricViews.averageNeededGuesses);
    this.subscribeMetric(this._lobbyStatsService.guessMessageGapStats$, this._metricViews.averageGuessSpeed);
    this.subscribeMetric(this._lobbyStatsService.guessTimeStats$, this._metricViews.fastestGuess);
    this.subscribeMetric(this._lobbyStatsService.guessScoreStats$, this._metricViews.averageGuessScore);
    this.subscribeMetric(this._lobbyStatsService.guessAccuracyStats$, this._metricViews.averageGuessAccuracy);
    this.subscribeMetric(this._lobbyStatsService.guessStreakStats$, this._metricViews.longestGuessStreak);
    this.subscribeMetric(this._lobbyStatsService.guessRankStats$, this._metricViews.averageGuessRank);
    this.subscribeMetric(this._lobbyStatsService.drawTimeStats$, this._metricViews.averageDrawTime);
    this.subscribeMetric(this._lobbyStatsService.drawTimeStats$, this._metricViews.fastestDrawTime);
    this.subscribeMetric(this._lobbyStatsService.drawScoreStats$, this._metricViews.averageDrawScore);
    this.subscribeMetric(this._lobbyStatsService.drawGuessedPlayersStats$, this._metricViews.averageGuessedPlayers);
    this.subscribeMetric(this._lobbyStatsService.drawLikesStats$, this._metricViews.averageDrawLikes);
    this.subscribeMetric(this._lobbyStatsService.drawDislikesStats$, this._metricViews.mostDrawDislikes);
    this.subscribeMetric(this._lobbyStatsService.completionTimeStats$, this._metricViews.averageCompletionTime);
    this.subscribeMetric(this._lobbyStatsService.completionTimeStats$, this._metricViews.completionTime);

    /* clear recorded metrics on lobby leave and round start */
    const metricResetSub = this._lobbyLeftEventListener.events$.pipe(
      mergeWith(this._roundStartedEventListener.events$.pipe(
        filter(event => event.data === 1)
      ))
    ).subscribe(() => this.resetMetrics());

    /* archive lobby metrics when round ended */
    const metricArchiveSub = this._lobbyStateChangedEventListener.events$.pipe(
      filter(event => event.data.gameEnded !== undefined),
      withLatestFrom(this._lobbyService.lobby$, this._statArchive$, this._seenLobbyPlayers$, this._chatStatSummarySetting.changes$),
    ).subscribe(([,lobby, archive, seenPlayers, summaryEnabled]) => {
      if(lobby === null || lobby.id === null) return;

      const date = new Date().toLocaleTimeString();
      const key = `${lobby.id}-${Date.now()}`;
      Object.values(this._metricViews).forEach((metricView) => metricView.archiveEvents(key));

      const winner = lobby.players.sort((a,b) => b.score - a.score)[0];
      const entry: archiveEntry = {
        key,
        lobbyId: lobby.id,
        date,
        name: `${lobby.id}, ${date} - ${winner.name} ${winner.score}pts`,
        players: Array.from(seenPlayers.get(lobby.id)?.entries().map(([,value]) => value) ?? [] as skribblPlayer[])
      };
      archive.set(key, entry);
      this._statArchive$.next(archive);
      if(summaryEnabled) this.summarizeGameInChat(entry);
    });

    const playersSub = this._lobbyService.lobby$.pipe(
      filter(lobby => lobby !== null),
      map(event => ({ players: event?.players ?? [], lobbyId: event.id ?? ""})),
      distinctUntilChanged((curr, prev) =>
        curr.players.map(p => p.id).join(",") === prev.players.map(p => p.id).join(",")
      ),
      withLatestFrom(this._seenLobbyPlayers$)
    ).subscribe(([{ players, lobbyId }, seenPlayers]) => {
      const lobbySeen = seenPlayers.get(lobbyId) ?? new Map();
      let changed = false;

      players.forEach(player => {
        if(!lobbySeen.has(player.id)){
          lobbySeen.set(player.id, player);
          changed = true;
        }
      });

      if(changed){
        seenPlayers.set(lobbyId, lobbySeen);
        this._seenLobbyPlayers$.next(seenPlayers);
      }
    });

    this._statsSubscriptions.push(metricResetSub, metricArchiveSub, playersSub);

    this._quickAccessSettingSubscription = this._showQuickAccessSetting.changes$.subscribe(value => {
      if(value) this.addQuickAccessIcon();
      else this.removeQuickAccessIcon();
    });
  }

  protected override async onDestroy() {
    this._statsSubscriptions.forEach((subscriber) => subscriber.unsubscribe());
    this._statsSubscriptions = [];

    this.resetMetrics(true);

    this._quickAccessSettingSubscription?.unsubscribe();
    this._quickAccessSettingSubscription = undefined;
    this.removeQuickAccessIcon();
  }

  public openStatsPopup(defaultArchiveKey?: string | undefined) {
    const popupComponent: componentData<ChartsComponent> = {
      componentType: ChartsComponent,
      props: {
        feature: this,
        defaultArchiveKey
      }
    };

    this._modalService.showModal(popupComponent.componentType, popupComponent.props, "Lobby Statistics", "card");
  }

  private async summarizeGameInChat(archiveEntry: archiveEntry) {
    this._logger.debug("summarizeGameInChat", archiveEntry);

    const categories = await this._chatSummarizeMetricCategories.getValue();
    const topRanks = await this._chatSummarizeTopMetrics.getValue();

    const selectedViews = Object.entries(this._metricViews)
      .filter(([key]) => categories.includes(key))
      .map(([, view]) => {
        let summary: datasetSummaryEntry[] = [];
        try {
          summary = view.generateSummary(archiveEntry.players, archiveEntry.key).slice(0, topRanks);
        }
        catch {}

        return {
          name: view.name,
          summary,
        };
      });

    if(selectedViews.length === 0 || selectedViews.every(view => view.summary.length === 0)) return;

    const messageComponent = await this._chatService.addChatMessage("", "", );
    const messageElements = await messageComponent.message;

    const isScrolledDown = await this._chatService.isScrolledDown();
    new ChatSummaryStats({
      target: messageElements.wrapperElement,
      props: {
        feature: this,
        summaries: selectedViews,
        summaryArchiveKey: archiveEntry.key
      }
    });
    if(isScrolledDown) await this._chatService.scrollToBottom();
  }

  private async addQuickAccessIcon() {
    if(this._iconComponent !== undefined) return;

    const elements = await this._elementsSetup.complete();

    /* create icon and attach to controls */
    this._iconComponent = new IconButton({
      target: elements.controls,
      props: {
        hoverMove: false,
        size: "48px",
        icon: "file-img-chart-gif",
        name: "Lobby Statistics",
        order: 6,
        tooltipAction: this.createTooltip
      },
    });

    /* listen for click on icon */
    this._iconClickSubscription = this._iconComponent.click$.subscribe(() => this.openStatsPopup());
  }

  private removeQuickAccessIcon() {
    this._iconClickSubscription?.unsubscribe();
    this._iconClickSubscription = undefined;
    this._iconComponent?.$destroy();
    this._iconComponent = undefined;
  }

  private subscribeMetric<TEvent extends lobbyStatEvent>(source: Observable<TEvent>, metricView: MetricView<TEvent>){
    const sub = source.subscribe(entry => metricView.addEvent(entry));
    this._statsSubscriptions.push(sub);
  }

  private resetMetrics(clearArchive = false) {
    Object.values(this._metricViews).forEach((metricView) => metricView.clearEvents(clearArchive));
  }

  public createChart(canvas: HTMLCanvasElement){
    const chart = new Chart({
      width: 2000,
      height: 1000,
      chartArea: {
        x: 200,
        y: 200,
        width: 1600,
        height: 700
      },
      barPadding: 30,
      barMaxWidth: 100,
      yGridGap: 50
    }, canvas);
    return chart;
  }

  public downloadCsv(data: string[][], viewName: string, roundName: string){
    const csv = data.map(row => row.join(",")).join("\n");
    const filename = `typo-stats-${viewName}-${roundName}.csv`.replaceAll(" ", "_");
    downloadText(csv, filename);
  }

  public async downloadChart(canvas: HTMLCanvasElement, viewName: string, roundName: string){
    const filename = `typo-stats-${viewName}-${roundName}.png`.replaceAll(" ", "_");
    const imageData = await ImageData.fromImageUrl(canvas.toDataURL("image/png"));
    downloadBlob(imageData.blob, filename);
  }

  public getViews() {
    return Object.values(this._metricViews);
  }

  public getViewsWithKeys() {
    return Object.entries(this._metricViews).map(([key, view]) => ({ key, view }));
  }

  public get lobbyStore() {
    return fromObservable(this._lobbyService.lobby$, null);
  }

  public get archiveStore() {
    return fromObservable(this._statArchive$.asObservable(), this._statArchive$.value);
  }

  public get seenPlayersStore() {
    return fromObservable(this._seenLobbyPlayers$.asObservable(), this._seenLobbyPlayers$.value);
  }

  public get chatSummarizeCategoriesStore() {
    return fromObservable(this._chatSummarizeMetricCategories.changes$, [], val => this._chatSummarizeMetricCategories.setValue(val));
  }

  public get chatSummarizeTopStore() {
    return fromObservable(this._chatSummarizeTopMetrics.changes$, 3, val => this._chatSummarizeTopMetrics.setValue(val));
  }
}