export const allowedKorean = (str: string): boolean => {
  const hangulFilter = /(?:[^\s\uAC00-\uD7A3\u3131-\u314E\u314F-\u3163\u318D\u119E\u11A2\u2022\u2025\u00B7\uFE55]|_)+/g

  return !hangulFilter.test(str) && str.length > 1 && str.length < 11
}

export const birthValid = (str: string): boolean => {
  const [year, month, day] = str.split('-')

  const yearValid = Number(year) > 1900 && Number(year) < 2050
  const monthValid = Number(month) > 0 && Number(month) < 13
  const dayValid = Number(day) > 0 && Number(day) < 32

  return yearValid && monthValid && dayValid
}