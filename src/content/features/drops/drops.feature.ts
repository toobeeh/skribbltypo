import { LobbyStatusService } from "@/content/features/lobby-status/lobby-status.service";
import { ApiDataSetup } from "@/content/setups/api-data/api-data.setup";
import { fromObservable } from "@/util/store/fromObservable";
import { inject } from "inversify";
import { delay, filter, map, mergeWith, of, switchMap, tap } from "rxjs";
import { TypoFeature } from "../../core/feature/feature";
import { ElementsSetup } from "../../setups/elements/elements.setup";
import DropsComponent from "./drops.svelte";

export class DropsFeature extends TypoFeature {
  @inject(ElementsSetup) private readonly _elementsSetup!: ElementsSetup;
  @inject(ApiDataSetup) private readonly _apiDataSetup!: ApiDataSetup;
  @inject(LobbyStatusService) private readonly _lobbyStatusService!: LobbyStatusService;

  public readonly name = "Drops";
  public readonly description = "Show drops to collect extra bubbles when you're playing";
  public readonly featureId = 40;

  private _component?: DropsComponent;

  protected override async onActivate() {
    const elements = await this._elementsSetup.complete();
    const apiData = await this._apiDataSetup.complete();

    this._component = new DropsComponent({
      target: elements.canvasWrapper,
      props: {
        feature: this,
        drops: apiData.drops
      },
    });
  }

  protected override onDestroy(): Promise<void> | void {
    this._component?.$destroy();
  }
  
  public async claimDrop(id: number){
    const result = await this._lobbyStatusService.connection.hub.claimDrop({ dropId: id });
    console.log(result);
  }

  public currentDropStore(){
    return fromObservable(
      this._lobbyStatusService.dropAnnounced$.pipe(
        switchMap(drop => of(drop).pipe(
          mergeWith(

            /* set to undefined after timeout of 2s */
            of(undefined).pipe(
              delay(2000)
            ),

            /* set to undefined when someone else clears */
            this._lobbyStatusService.dropClaimed$.pipe(
              filter(claim => claim.clearedDrop),
              map(() => undefined)
            )
          )
        )),
        tap(drop => this._logger.info("Setting drop", drop))
      ),
      undefined
    );
  }
}