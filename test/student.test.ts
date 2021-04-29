import { idPatternCheck } from '../student/utils';

test.each`
  source | expected
  ${'c7269149-8a3e-4a8e-9df2298a2d8ba61f'} | ${false}
  ${'c7269149-8a3e-4a8e-9df2--298a2d8ba61f'} | ${false}
  ${'c7269149-8a3e-4a8e-9df2-298a2d8ba61f-'} | ${false}
  ${'c7269149-8a3e-4a8e-9df2-298a2*d8ba61f'} | ${false}
  ${'c7269149-8a3e-4a8e-9df2-298a2d8ba61f '} | ${false}
  ${'c7269149-8a3e-4a8e-9df2-298a2d8ba61f'} | ${true}
  ${'1-2-3-4-5'} | ${true}
`('id pattern check - returns $expected when $source', ({ source, expected }) => {
  const res = idPatternCheck(source)

  expect(res).toEqual(expected)
})