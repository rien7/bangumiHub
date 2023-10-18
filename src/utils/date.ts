function readableDate(_date: number) {
  const date = new Date(_date * 1000)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const diffDays = Math.floor(diff / (1000 * 3600 * 24))
  const diffHours = Math.floor(diff / (1000 * 3600))
  const diffMinutes = Math.floor(diff / (1000 * 60))

  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  if (diffDays > 5)
    return `${year}-${month}-${day}`
  else if (diffDays > 0)
    return `${diffDays} days ago`
  else if (diffHours > 0)
    return `${diffHours} hours ago`
  else if (diffMinutes > 0)
    return `${diffMinutes} mins ago`
  else
    return 'just now'
}

function readableSeconds(seconds: number) {
  const hour = Math.floor(seconds / 3600)
  const _hour = hour.toString().padStart(2, '0')
  const min = Math.floor((seconds - hour * 3600) / 60)
  const _min = min.toString().padStart(2, '0')
  const sec = Math.floor(seconds - hour * 3600 - min * 60)
  const _sec = sec.toString().padStart(2, '0')
  return hour > 0 ? `${_hour}:${_min}:${_sec}` : `${_min}:${_sec}`
}

export { readableDate, readableSeconds }
