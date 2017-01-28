import * as React from 'react'
import { ButtonGroup, DropdownButton, MenuItem, Panel } from 'react-bootstrap'

import * as utils from '../utils'

function t(s: string) {
  const dict = {
    'all-days': 'جميع الأيام',
    weekdays: 'أيام الأسبوع',
    weekends: 'نهاية الأسبوع',

    custom: 'مخصص',
    now: 'اﻵن',

    date: 'التاريخ',
    remaining: 'باقي',
    value: 'القيمة',

    year: 'سنوات',
    month: 'شهور',
    week: 'أسابيع',
    day: 'أيام',
    hour: 'ساعات',

    sat: 'السبت',
    sun: 'الأحد',
    mon: 'الاثنين',
    tue: 'الثلاثاء',
    wed: 'الأربعاء',
    thu: 'الخميس',
    fri: 'الجمعة',
  }

  return dict[s]
}

function getDay(day: number) {
  const dict = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return dict[day]
}

function RemainingText({remaining}: { remaining: any }) {
  const pairs: ReadonlyArray<[string, number]> = [
    ['year', remaining.years],
    ['month', remaining.months],
    ['week', remaining.weeks],
    ['day', remaining.days],
    ['hour', remaining.hours],
    ['minute', remaining.minutes],
    ['second', remaining.seconds],
  ]

  const remainingText = pairs
    .filter(([, value]) => value !== 0)
    .map(([unit, value]) => utils.getPlural(unit, value))
    .join(' و ')

  return <span dir='rtl'>{remainingText}</span>;
}

function EventDate({date}: { date: Date }) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1)
  const monthDay = date.getDate()
  const day = getDay(date.getDay())

  const text = `${t(day)} ${monthDay}/${month}/${year}`
  return <span dir='rtl'>{text}</span>
}

interface IEventTextProps {currentDate: Date, date: Date, daysSelection: string, display: string, remaining: any}
function EventText({currentDate, date, daysSelection, display, remaining}: IEventTextProps) {
  switch (display) {
    case 'date': return <EventDate date={date} />
    case 'remaining': return <RemainingText remaining={remaining} />
    case 'value': return <EventValue currentDate={currentDate} date={date} daysSelection={daysSelection} />

    default: return <RemainingText remaining={remaining} />
  }
}

function EventValue({currentDate, date, daysSelection}: {currentDate: Date, date: Date, daysSelection: string}) {
  const millis = utils.getMillisDifference(currentDate, date, daysSelection)
  const value = (millis / 1000 * 0.01).toFixed(2)
  const text = `${value} ريال`

  return <span dir='rtl'>{text}</span>
}

interface IProps {
  readonly currentDate: Date;
  readonly date: Date;
  readonly positive: boolean;
  readonly title: string;
}

interface IState {
  readonly daysSelection: string;
  readonly display: string;
  readonly from: string;
  readonly timeUnit: string;
}

export default class Event extends React.Component<IProps, IState>
{
  constructor(props: IProps) {
    super(props)
    this.state = {
      daysSelection: 'all-days',
      display: 'remaining',
      from: 'now',
      timeUnit: utils.getLargestTimeUnit(props.currentDate, props.date)
    }
  }

  render() {
    const {currentDate, date, positive, title} = this.props
    const {display, daysSelection, timeUnit} = this.state

    const remaining = utils.getRemaining(currentDate, date, timeUnit, daysSelection)

    const Footer = (<ButtonGroup>
      <DropdownButton dir='rtl' id='display-dropdown' title={t(display)} pullRight>
        <MenuItem active={display === 'remaining'} className='text-right' eventKey='remaining'
          onSelect={this.handleChangeFactory('display')}>
          {t('remaining')}
        </MenuItem>
        <MenuItem active={display === 'date'} className='text-right' eventKey='date'
          onSelect={this.handleChangeFactory('display')}>
          {t('date')}
        </MenuItem>
        <MenuItem active={display === 'value'} className='text-right' eventKey='value'
          onSelect={this.handleChangeFactory('display')}>
          {t('value')}
        </MenuItem>
      </DropdownButton>
      <DropdownButton disabled={display === 'date'} dir='rtl' id='daysSelection-dropdown' title={t(daysSelection)}
        pullRight>
        <MenuItem active={daysSelection === 'all-days'} className='text-right' eventKey='all-days'
          onSelect={this.handleChangeFactory('daysSelection')}>
          {t('all-days')}
        </MenuItem>
        <MenuItem active={daysSelection === 'weekdays'} className='text-right' eventKey='weekdays'
          onSelect={this.handleChangeFactory('daysSelection')}>
          {t('weekdays')}
        </MenuItem>
        <MenuItem active={daysSelection === 'weekends'} className='text-right' eventKey='weekends'
          onSelect={this.handleChangeFactory('daysSelection')}>
          {t('weekends')}
        </MenuItem>
      </DropdownButton>
      <DropdownButton disabled={display !== 'remaining'} dir='rtl' id='timeUnit-dropdown' title={t(timeUnit)} pullRight>
        <MenuItem active={timeUnit === 'year'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'year')} eventKey='year'
          onSelect={this.handleTimeUnitChange}>
          {t('year')}
        </MenuItem>
        <MenuItem active={timeUnit === 'month'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'month')} eventKey='month'
          onSelect={this.handleTimeUnitChange}>
          {t('month')}
        </MenuItem>
        <MenuItem active={timeUnit === 'week'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'week')} eventKey='week'
          onSelect={this.handleTimeUnitChange}>
          {t('week')}
        </MenuItem>
        <MenuItem active={timeUnit === 'day'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'day')} eventKey='day'
          onSelect={this.handleTimeUnitChange}>
          {t('day')}
        </MenuItem>
        <MenuItem active={timeUnit === 'hour'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'hour')}
          eventKey='hour' onSelect={this.handleTimeUnitChange}>
          {t('hour')}
        </MenuItem>
      </DropdownButton>
    </ButtonGroup>)

    const Header = (<h2>{title}</h2>)

    return (<article>
      <Panel bsStyle={positive ? 'primary' : 'danger'} className='text-center' footer={Footer} header={Header}>
        <EventText currentDate={currentDate} date={date} daysSelection={daysSelection} display={display}
          remaining={remaining} />
      </Panel>
    </article>)
  }

  private handleChangeFactory = (fieldName) => (eventKey, event) => this.setState({ [fieldName]: eventKey } as IState)

  private handleTimeUnitChange = (eventKey, event) => {
    const {currentDate, date} = this.props

    if (utils.isValidTimeUnit(currentDate, date, eventKey)) {
      this.setState({ timeUnit: eventKey } as IState)
    }
  }
}
