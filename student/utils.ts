export const idPatternCheck = (id: string) => {
  const reg = /^[A-Za-z0-9\-]+$/;

  return reg.test(id) && id.split('-').length === 5
}