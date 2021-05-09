import { Match } from './types';

const modes = ['league', 'tonurment', 'doubleelimination']

export const hasMatchTitle = (data: Match) => (
  data.match.hasOwnProperty('title')
  && data.match.title.length > 0
)

export const shouldMode = (mode: string) => modes.indexOf(mode?.toLowerCase()) >= 0;

const totalMatchCount = (count: number) => count * (count - 1);

export const isArray = (target: any) => Array.isArray(target) && target.length > 2;

export const isFinished = (results) => {
  const sumOfIndividualMatches = results.reduce((a, b) => a + b.opponents.length, 0);

  return totalMatchCount(results.length) === sumOfIndividualMatches;
}