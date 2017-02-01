import DaysFilter from './types/DaysFilter'
import IRemaining from './types/IRemaining'
import TimeUnit from './types/TimeUnit'

const MILLIS_IN = {
  year: 12 * 30 * 24 * 60 * 60 * 1000,
  month: 30 * 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

export function formatDate(date: Date, t: (s: string) => string) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1)
  const monthDay = date.getDate()
  const day = getDay(date.getDay())
  const hour = date.getHours()
  const minute = date.getMinutes()

  const _12Hour = get12Hour(hour)
  const hourCode = getHourCode(hour)

  const dateText = `${t(day)} ${zeroFill(monthDay)}-${zeroFill(month)}-${year} م`
  const timeText = `${zeroFill(_12Hour)}:${zeroFill(minute)} ${t(hourCode)}`
  const text = `${dateText}، ${timeText}`

  return text
}

export function formatRemaining(currentDate: Date, date: Date, timeUnit: TimeUnit, daysSelection: DaysFilter,
  separator: string) {

  const remaining = getRemaining(currentDate, date, timeUnit, daysSelection)
  const pairs: ReadonlyArray<[string, number]> = [
    ['year', remaining.year],
    ['month', remaining.month],
    ['week', remaining.week],
    ['day', remaining.day],
    ['hour', remaining.hour],
    ['minute', remaining.minute],
    ['second', remaining.second],
  ]

  const remainingText = pairs
    .filter(([, value]) => value !== 0)
    .map(([unit, value]) => getPlural(unit, value))
    .join(` ${separator} `)

  return remainingText
}

export function formatValue(currentDate: Date, date: Date, daysSelection: DaysFilter, currency: string) {
  const millis = getMillisDifference(currentDate, date, daysSelection)
  const value = (millis / 1000 * 0.01).toFixed(2)
  const text = `${value} ${currency}`

  return text
}

export function getLargestTimeUnit(currentDate: Date, date: Date): TimeUnit {
  const difference = date.getTime() - currentDate.getTime()

  if (difference >= MILLIS_IN.year) { return 'year' }
  else if (difference >= MILLIS_IN.month) { return 'month' }
  else if (difference >= MILLIS_IN.week) { return 'week' }
  else if (difference >= MILLIS_IN.day) { return 'day' }
  else { return 'hour' }
}

export function isValidTimeUnit(currentDate: Date, date: Date, timeUnit: TimeUnit) {
  const millisDifference = date.getTime() - currentDate.getTime()
  return (millisDifference >= MILLIS_IN[timeUnit])
}

export function isZeroWeekends(currentDate: Date, date: Date) {
  const weekendsMillis = getWeekendsMillis(currentDate, date)
  return (weekendsMillis === 0)
}

export function isZeroWeekdays(currentDate: Date, date: Date) {
  const weekdaysMillis = getWeekdaysMillis(currentDate, date)
  return (weekdaysMillis === 0)
}

function get12Hour(_24Hour: number) {
  if (_24Hour === 0) {
    return 12
  } else if (_24Hour > 12) {
    return _24Hour - 12
  } else {
    return _24Hour
  }
}

function getDay(day: number) {
  const dict = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return dict[day]
}

function getFirstWeekday(date: Date) {
  if (isWeekday(date.getDay())) { return date }
  else {
    const daysDifference = (date.getDay() === 5) ? 2 : 1
    const firstWeekday = new Date(date.getTime())

    firstWeekday.setDate(date.getDate() + daysDifference)
    firstWeekday.setHours(0, 0, 0, 0)

    return firstWeekday
  }
}

function getFirstWeekend(date: Date) {
  if (isWeekend(date.getDay())) { return date }
  else {
    const daysDifference = (5 - date.getDay())
    const firstWeekend = new Date(date.getTime())

    firstWeekend.setDate(date.getDate() + daysDifference)
    firstWeekend.setHours(0, 0, 0, 0)

    return firstWeekend
  }
}

function getHourCode(hour: number) {
  return (hour < 12) ? 'am' : 'pm'
}

function getLastTwoDigits(number: number) {
  if (number < 100) { return number }
  else {
    const lastDigit = number % 10
    const secondLastDigit = Math.floor(number / 10) % 10

    return lastDigit + (secondLastDigit * 10)
  }
}

function getMillisDifference(currentDate: Date, date: Date, daysSelection: DaysFilter) {
  switch (daysSelection) {
    case 'all-days': return (date.getTime() - currentDate.getTime())
    case 'weekdays': return getWeekdaysMillis(currentDate, date)
    case 'weekends': return getWeekendsMillis(currentDate, date)
  }
}

function getPlural(timeUnit: string, number: number): string {
  const phrases = {
    year: { one: 'سنة', two: 'سنتين', plural: 'سنوات' },
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

function getPlurality(number: number) {
  const digits = getLastTwoDigits(number)

  if (digits === 1) { return 'one' }
  else if (digits === 2) { return 'two' }
  else if (digits <= 10) { return 'plural' }
  else { return 'one' }
}

function getRank(timeUnit: string): number {
  const ranks = { second: 0, minute: 1, hour: 2, day: 3, week: 4, month: 5, year: 6 }
  return ranks[timeUnit]
}

function getRemaining(currentDate: Date, date: Date, timeUnit: TimeUnit, daysSelection: DaysFilter): IRemaining {
  const millisDifference = getMillisDifference(currentDate, date, daysSelection)
  const none = { year: 0, month: 0, week: 0, day: 0, hour: 0, minute: 0, second: 0 }

  if (millisDifference > 0) {
    const units = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second']
    const remaining = {}
    let sum = 0
    units.forEach(element => {
      const millisInUnit = MILLIS_IN[element]
      const remainingOfUnit = getTimeForUnits(element as TimeUnit, timeUnit,
        parseInt(((millisDifference - sum) / millisInUnit) + ''))
      remaining[element] = remainingOfUnit
      sum += millisInUnit * remainingOfUnit
    })

    return (remaining as IRemaining)
  } else {
    return none
  }
}

function getTimeForUnits(currentTimeUnit: TimeUnit, chosenTimeUnit: TimeUnit, time: number) {
  return getRank(currentTimeUnit) > getRank(chosenTimeUnit) ? 0 : time
}

function getWeekdaysMillis(currentDate: Date, date: Date) {
  const millisDifference = date.getTime() - currentDate.getTime()

  if (millisDifference <= 0) { return 0 }
  else {
    const weeks = Math.floor(millisDifference / MILLIS_IN.week)
    const weekdaysMillis = weeks * (MILLIS_IN.day * 5)
    const remainingDaysMillis = millisDifference - (weeks * MILLIS_IN.week)
    const remainingDaysStart = new Date(currentDate.getTime() + (weeks * MILLIS_IN.week))

    if (isWeekday(remainingDaysStart.getDay()) && isWeekday(currentDate.getDay()) &&
      date.getDay() >= currentDate.getDay()) {
      return (weekdaysMillis + remainingDaysMillis)
    } else {
      const firstWeekend = getFirstWeekend(remainingDaysStart)
      const weekdayAfterWeekend = new Date(Math.min(getFirstWeekday(firstWeekend).getTime(), date.getTime()))
      const remainingWeekendsMillis = (weekdayAfterWeekend.getTime() - firstWeekend.getTime())

      return (weekdaysMillis + remainingDaysMillis - remainingWeekendsMillis)
    }
  }
}

function getWeekendsMillis(currentDate: Date, date: Date) {
  const millisDifference = date.getTime() - currentDate.getTime()
  const weekdaysMillis = getWeekdaysMillis(currentDate, date)

  return millisDifference - weekdaysMillis
}

function isWeekday(day: number) {
  return day < 5
}

function isWeekend(day: number) {
  return !isWeekday(day)
}

function zeroFill(twoDigitsNumber: number) {
  if (twoDigitsNumber < 10) {
    return `0${twoDigitsNumber}`
  } else {
    return `${twoDigitsNumber}`
  }
}
