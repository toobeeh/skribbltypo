export class LobbyTurnScale {
   id = "lobbyTurnScale";

  private _allTurns: string[] = []; /* ordered R_T_ */
  private _mappedTurns = new Map<number, Set<number>>();

   determineDataLimits() {

    /* collect all recorded turns */
    const allTurns = new Set<string>(); /* R_T_ */
    this.chart.data.datasets.forEach(d => {
      d.data.forEach(data => {
        if(typeof data !== "string") return;
        allTurns.add(data);
      });
    });

    /* parse lobby turns */
    const lobbyTurns = new Map<number, Set<number>>();
    allTurns.forEach(turnStr => {
      const parsed = this.parseX(turnStr);
      if(!parsed) return;
      if(!lobbyTurns.has(parsed.round)){
        lobbyTurns.set(parsed.round, new Set<number>());
      }
      lobbyTurns.get(parsed.round)?.add(parsed.turn);
    });
    this._mappedTurns = lobbyTurns;

    /* order all turns */
    const orderedTurns = Array.from(allTurns.values())
      .map(turn => this.parseX(turn))
      .filter((turn): turn is {round: number, turn: number} => turn !== null)
      .sort((a, b) => {
        if(a.round === b.round){
          return a.turn - b.turn;
        }
        return a.round - b.round;
      });
    this._allTurns = orderedTurns.map(t => `R${t.round}T${t.turn}`);

    /* set min/max */
    this.min = 0;
    this.max = this._allTurns.length - 1;
  }

   buildTicks(): Tick[] {
    const ticks: Tick[] = [];
    let index = 0;
    this._allTurns.forEach(turn => {
      ticks.push({value: index, label: turn});
      index++;
    });
    return ticks;
  }

   getLabelForValue(value: number): string {
    return `value ${value}`;
  }

   getPixelForTick(index: number): number {
    return index;
  }

   getPixelForValue(value: number, index?: number): number {
    return index ?? 0;
  }

   getValueForPixel(pixel: number): number | undefined {
    return pixel;
  }

  /**
   * Expects the value in the format "R{round}T{turn}"
   * @param value
   */
  parseX(value: unknown){
    if(typeof value !== "string") return null;
    const match = value.match(/^R(\d+)T(\d+)$/);
    if(!match) return null;
    const round = parseInt(match[1]);
    const turn = parseInt(match[2]);
    return {round, turn};
  }
}