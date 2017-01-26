import * as React from 'react'
import { ButtonGroup, DropdownButton, MenuItem, Panel } from 'react-bootstrap'

import * as utils from '../utils'

function RemainingText({dir, remaining}: { dir: string, remaining: any }) {
  const pairs: ReadonlyArray<[string, number]> = [
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

  return <span dir={dir}>{remainingText}</span>;
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

function t(s: string) {
  const dict = {
    'all-days': 'جميع الأيام',
    custom: 'مخصص',
    date: 'التاريخ',
    day: 'أيام',
    hour: 'ساعات',
    month: 'شهور',
    now: 'اﻵن',
    remaining: 'باقي',
    value: 'القيمة',
    week: 'أسابيع',
    weekdays: 'أيام الأسبوع',
    weekends: 'نهاية الأسبوع'
  }

  return dict[s]
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

    const remaining = utils.getRemaining(currentDate, date, timeUnit)

    const Footer = (<ButtonGroup>
      <DropdownButton dir='rtl' id='display-dropdown' title={t(display)} pullRight>
        <MenuItem active={display === 'remaining'} className='text-right' eventKey='remaining'
          onSelect={this.handleChangeFactory('display')}>
          {t('remaining')}
        </MenuItem>
        <MenuItem active={display === 'date'} className='text-right' eventKey='date'
          onSelect={this.handleChangeFactory('display')} disabled>
          {t('date')}
        </MenuItem>
        <MenuItem active={display === 'value'} className='text-right' eventKey='value'
          onSelect={this.handleChangeFactory('display')} disabled>
          {t('value')}
        </MenuItem>
      </DropdownButton>
      <DropdownButton dir='rtl' id='daysSelection-dropdown' title={t(daysSelection)} pullRight>
        <MenuItem active={daysSelection === 'all-days'} className='text-right' eventKey='all-days'
          onSelect={this.handleChangeFactory('daysSelection')}>
          {t('all-days')}
        </MenuItem>
        <MenuItem active={daysSelection === 'weekdays'} className='text-right' eventKey='weekdays'
          onSelect={this.handleChangeFactory('daysSelection')} disabled>
          {t('weekdays')}
        </MenuItem>
        <MenuItem active={daysSelection === 'weekends'} className='text-right' eventKey='weekends'
          onSelect={this.handleChangeFactory('daysSelection')} disabled>
          {t('weekends')}
        </MenuItem>
      </DropdownButton>
      <DropdownButton dir='rtl' id='timeUnit-dropdown' title={t(timeUnit)} pullRight>
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

    return (<article>
      <Panel bsStyle={positive ? 'primary' : 'danger'} className='text-center' footer={Footer} header={title}>
        <RemainingText dir='rtl' remaining={remaining} />
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
