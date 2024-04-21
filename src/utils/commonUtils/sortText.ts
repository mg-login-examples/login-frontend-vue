export function sortText(textA: string, textB: string) {
  const textALowercase = textA.toLowerCase()
  const textBLowercase = textB.toLowerCase()
  if (textALowercase < textBLowercase) {
    return -1
  }
  if (textALowercase > textBLowercase) {
    return 1
  }
  return 0
}
