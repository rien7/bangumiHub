function n10to64(number: number) {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~'.split('')
  const radix = chars.length
  let qutient = +number
  const arr: string[] = []
  let mod = 0
  do {
    mod = qutient % radix
    qutient = (qutient - mod) / radix
    arr.unshift(chars[mod])
  } while (qutient)
  return arr.join('')
}

function n64to10(number: string) {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ-~'
  const radix = chars.length
  const arr = number.split('')
  let qutient = 0
  let count = 0
  do {
    const index = chars.indexOf(arr.pop() || '')
    qutient += index * radix ** count
    count++
  } while (arr.length)
  return qutient
}

export { n10to64, n64to10 }
