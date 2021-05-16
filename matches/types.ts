export interface Match {
  match: {
    title: string,
    interval: number,
  },
  mode: string,
  results: {
    player: string,
    win: number,
    lose: number,
    opponents: {
      player: string,
      result: boolean,
    }[]
  }[],
  isFinished: boolean,
}