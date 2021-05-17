import {
  hasLeagueResultsKeys,
  hasMatchTitle,
  isMatchFinished,
  shouldMode,
} from '../matches/utils';

test.each`
  source | expected
  ${{ match: { title: "주간 리그", interval: 0 } }} | ${true}
  ${{ match: {} }} | ${false}
  ${{ match: { title: "" } }} | ${false}
  ${{ match: { tltle: "일간 리그" }}} | ${false}
`('has match title check - returns $expected when $source', ({ source, expected }) => {
  const res = hasMatchTitle(source);

  expect(res).toEqual(expected);
})

test.each`
  source | expected
  ${'league'} | ${true}
  ${'Tonurment'} | ${true}
  ${'DOUBLEELIMINATION'} | ${true}
  ${'lea gue'} | ${false}
  ${'elimination'} | ${false}
  ${undefined} | ${false}
`('mode value check - returns $expected when $source', ({ source, expected }) => {
  const res = shouldMode(source);

  expect(res).toEqual(expected);
})

const resultsCases = [
  {
    player: 'a00',
    win: 2,
    lose: 0,
    opponents: [
      {
        player: 'b00',
        result: true,
      },
      {
        player: 'c00',
        result: true,
      },
    ]
  },
  {
    player: 'b00',
    win: 1,
    lose: 1,
    opponents: [
      {
        player: 'a00',
        result: false,
      },
      {
        player: 'c00',
        result: true,
      },
    ]
  },
  {
    player: 'c00',
    win: 0,
    lose: 2,
    opponents: [
      {
        player: 'a00',
        result: false,
      },
      {
        player: 'b00',
        result: false,
      },
    ]
  }
]

test.each`
  source | expected
  ${resultsCases} | ${true}
`('match finished check - returns $expected when $source', ({ source, expected }) => {
  const res = isMatchFinished(source);

  expect(res).toEqual(expected);
})

test.each`
  source | expected
  ${{ player: '', win: 0, lose: 0, opponents: [] }} | ${true}
  ${{ player: '', win: 0, lose: 0 }} | ${false}
  ${{ Player: '', WIN: '', lose: 0, opponents: [] }} | ${false}
`('results required key check - returns $expected when $source', ({ source, expected }) => {
  const res = hasLeagueResultsKeys(source)

  expect(res).toEqual(expected);
})