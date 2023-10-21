function strToBase64(str: string) {
  const bytes = new TextEncoder().encode(str)
  const binString = String.fromCodePoint(...bytes)
  return btoa(binString)
}

export { strToBase64 }
