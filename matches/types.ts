export interface Opponent {
  player: string,
  result: boolean
}

export interface Results {
  player: string,
  win: number,
  lose: number,
  opponents: Opponent[]
}

export interface Match {
  match: {
    title: string,
    interval: number,
  },
  mode: string,
  results: Results[],
  isFinished: boolean,
}