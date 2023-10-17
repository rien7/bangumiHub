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

export { readableDate }
