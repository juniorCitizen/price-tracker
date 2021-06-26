export function stringifyDate(date: Date): string {
  const dayValue = date.getDate()
  const dayString = `${dayValue < 10 ? '0' : ''}${dayValue}`
  const monthValue = date.getMonth() + 1
  const monthString = `${monthValue < 10 ? '0' : ''}${monthValue}`
  const dateString = `${date.getFullYear()}-${monthString}-${dayString}`
  return dateString
}

export default stringifyDate
