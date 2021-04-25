import { allowedKorean, birthValid } from '../students/utils';

test.each`
  source | expected
  ${'only used korean'} | ${false}
  ${'한글만 abcc 됩니다'} | ${false}
  ${'띄어쓰기 불가능'} | ${false}
  ${'특수 기호 * $ .'} | ${false}
  ${'1'} | ${false}
  ${'열글자이하까지만가능합니다'} | ${false}
  ${'한글은가능'} | ${true}
  ${'김강'} | ${true}
  ${'열글자까지가능합니다'} | ${true}
`('only used korean - returns $expected when $source', ({ source, expected }) => {
  const res = allowedKorean(source)

  expect(res).toEqual(expected)
})

test.each`
  source | expected
  ${'2012--12-31'} | ${false}
  ${'2012-01-01-02'} | ${false}
  ${'1970/02/28'} | ${false}
  ${'1990-5-2'} | ${false}
  ${'1987-04-13'} | ${true}
`('birth format check - returns $expected when $soruce', ({ source, expected }) => {
  const res = birthValid(source)

  expect(res).toEqual(expected)
})