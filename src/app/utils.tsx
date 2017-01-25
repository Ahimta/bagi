const MILLIS_IN = {
  month: 30 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

export function getLargestTimeUnit(currentDate: Date, date: Date) {
  const difference = date.getTime() - currentDate.getTime()

  if (difference >= MILLIS_IN.month) { return 'month' }
  else if (difference >= MILLIS_IN.week) { return 'week' }
  else if (difference >= MILLIS_IN.day) { return 'day' }
  else { return 'hour' }
}

export function getPlural(timeUnit: string, number: number): string {
  const phrases = {
    month: { one: 'شهر', two: 'شهرين', plural: 'شهور' },
    week: { one: 'أسبوع', two: 'أسبوعين', plural: 'أسابيع' },
    day: { one: 'يوم', two: 'يومين', plural: 'أيام' },
    hour: { one: 'ساعة', two: 'ساعتين', plural: 'ساعات' },
    minute: { one: 'دقيقة', two: 'دقيقتين', plural: 'دقائق' },
    second: { one: 'ثانية', two: 'ثانيتين', plural: 'ثواني' },
  };

  const plurality = getPlurality(number);

  if (number === 1) { return phrases[timeUnit].one }
  else if (plurality === 'two') {
    if (number === 2) { return phrases[timeUnit].two }
    else { return (number + ' ' + phrases[timeUnit].one) }
  }
  else { return (number + ' ' + phrases[timeUnit][plurality]) }
}

export function getRemaining(currentDate: Date, date: Date, timeUnit: string): any {
  const time = date.getTime() - currentDate.getTime()
  const none = { months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }

  if (time > 0) {
    const units = ['month', 'week', 'day', 'hour', 'minute', 'second']
    const remaining = {}
    let sum = 0
    units.forEach(element => {
      const millisInUnit = MILLIS_IN[element]
      const remainingOfUnit = getTimeForUnits(element, timeUnit, parseInt(((time - sum) / millisInUnit) + ''))
      remaining[element + 's'] = remainingOfUnit
      sum += millisInUnit * remainingOfUnit
    })

    return remaining
  }
  else { return none }
}

export function isValidTimeUnit(currentDate: Date, date: Date, timeUnit: string) {
  const millisDifference = date.getTime() - currentDate.getTime()
  return millisDifference >= MILLIS_IN[timeUnit] || timeUnit === 'auto'
}

function getLastTwoDigits(number: number) {
  if (number < 100) { return number }
  else {
    const lastDigit = number % 10
    const secondLastDigit = Math.floor(number / 10) % 10

    return lastDigit + (secondLastDigit * 10)
  }
}

function getPlurality(number: number) {
  const digits = getLastTwoDigits(number)

  if (digits === 1) { return 'one' }
  else if (digits === 2) { return 'two' }
  else if (digits <= 10) { return 'plural' }
  else { return 'one' }
}

function getRank(timeUnit: string): number {
  const ranks = { second: 0, minute: 1, hour: 2, day: 3, week: 4, month: 5, auto: 6 }
  return ranks[timeUnit]
}

function getTimeForUnits(currentTimeUnit: string, chosenTimeUnit: string, time: number) {
  return getRank(currentTimeUnit) > getRank(chosenTimeUnit) ? 0 : time
}
