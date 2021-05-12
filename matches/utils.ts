import { Match } from './types';

const modes = ['league', 'tonurment', 'doubleelimination']
const intervals = [0, 1, 2, 3]
const leagueResultKeys = ['player', 'win', 'lose', 'opponents']

export const hasMatchTitle = (data: Match) => (
  data.match.hasOwnProperty('title')
  && data.match.title.length > 0
  && data.match.hasOwnProperty('interval')
  && intervals.indexOf(data.match.interval) >= 0
)

export const shouldMode = (mode: string) => modes.indexOf(mode?.toLowerCase()) >= 0;

const totalMatchCount = (count: number) => count * (count - 1);

export const isArray = (target: any) => Array.isArray(target)
export const hasLength = (target: any, len: number) => target.length > len

export const isMatchFinished = (results) => {
  const sumOfIndividualMatches = results
    .reduce((a, b) => b.opponents.length > 0 ? a + b.opponents.length : 0, 0);

  if (totalMatchCount(results.length) < sumOfIndividualMatches) {
    throw new Error('Invalid Matches')
  }

  return totalMatchCount(results.length) > sumOfIndividualMatches
    ? false
    : totalMatchCount(results.length) === sumOfIndividualMatches
}

export const hasLeagueResultsKeys = (result) => {
  const keys = Object.keys(result)
  const res = leagueResultKeys.every((e) => keys.includes(e))

  return res
    && typeof result.player === 'string'
    && typeof result.win === 'number'
    && typeof result.lose === 'number'
    && Array.isArray(result.opponents)
}