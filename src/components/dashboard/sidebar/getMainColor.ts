import ColorThief from '#root/node_modules/colorthief/dist/color-thief.mjs'

const colorThief = new ColorThief()

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((x) => {
  const hex = x.toString(16)
  return hex.length === 1 ? `0${hex}` : hex
}).join('')}`
}

function getMainColor(imageDom: HTMLImageElement) {
  const color = colorThief.getColor(imageDom)
  return rgbToHex(color[0], color[1], color[2])
}

function isDark(color: string) {
  const R = Number.parseInt(color.substring(1, 3), 16)
  const G = Number.parseInt(color.substring(3, 5), 16)
  const B = Number.parseInt(color.substring(5, 7), 16)
  // const luma = 0.2126 * R + 0.7152 * G + 0.0722 * B
  const luma = 0.4 * R + 0.4 * G + 0.2 * B
  return luma
}

function getShadeColor(color: string, percent: number) {
  let R = Number.parseInt(color.substring(1, 3), 16)
  let G = Number.parseInt(color.substring(3, 5), 16)
  let B = Number.parseInt(color.substring(5, 7), 16)

  R = R * (100 + percent) / 100
  G = G * (100 + percent) / 100
  B = B * (100 + percent) / 100

  R = (R < 255) ? R : 255
  G = (G < 255) ? G : 255
  B = (B < 255) ? B : 255

  R = Math.round(R)
  G = Math.round(G)
  B = Math.round(B)

  const RR = ((R.toString(16).length === 1) ? `0${R.toString(16)}` : R.toString(16))
  const GG = ((G.toString(16).length === 1) ? `0${G.toString(16)}` : G.toString(16))
  const BB = ((B.toString(16).length === 1) ? `0${B.toString(16)}` : B.toString(16))

  return `#${RR}${GG}${BB}`
}

export default getMainColor
export { getShadeColor, isDark }
