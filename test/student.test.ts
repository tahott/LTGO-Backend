import { allowedKorean, birthValid } from '../student/utils';

describe('Student 관련 API', () => {
  it('한글만 입력 받기 - false', () => {
    const res1 = allowedKorean('한han')
    const res2 = allowedKorean('한 abcc ddie')

    expect(res1).toEqual(false)
    expect(res2).toEqual(false)
  })

  it('한글만 입력 받기 - true', () => {
    const res1 = allowedKorean('김강')
    const res2 = allowedKorean('김 산')

    expect(res1).toEqual(true)
    expect(res2).toEqual(true)
  })

  it('생년월일 - false', () => {
    const res1 = birthValid('2020-12')
    const res2 = birthValid('1000-12-31')

    expect(res1).toEqual(false)
    expect(res2).toEqual(false)
  })

  it('생년월일 - true', () => {
    const res1 = birthValid('2018-07-07')

    expect(res1).toEqual(true)
  })
})