import * as React from 'react'
import { Button, ButtonGroup, DropdownButton, MenuItem, Panel } from 'react-bootstrap'

import * as utils from '../utils'

function t(s: string) {
  const dict = {
    and: 'و',
    currency: 'ريال',

    'all-days': 'جميع الأيام',
    weekdays: 'أيام الأسبوع',
    weekends: 'نهاية الأسبوع',

    custom: 'مخصص',
    now: 'اﻵن',

    remaining: 'باقي',
    time: 'الوقت',
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

    am: 'ص',
    pm: 'م',
  }

  return dict[s]
}

interface IEventTextProps {display: string, formattedDate: string, formattedRemaining: string, formattedValue: string}
function EventText({display, formattedDate, formattedRemaining, formattedValue}: IEventTextProps) {
  switch (display) {
    case 'remaining': return <span dir='rtl'>{formattedRemaining}</span>
    case 'time': return <span dir='rtl'>{formattedDate}</span>
    case 'value': return <span dir='rtl'>{formattedValue}</span>

    default: return <span dir='rtl'>{formattedRemaining}</span>
  }
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

    const formattedDate = utils.formatDate(date, t)
    const formattedRemaining = utils.formatRemaining(currentDate, date, timeUnit, daysSelection, t('and'))
    const formattedValue = utils.formatValue(currentDate, date, daysSelection, t('currency'))

    const Footer = (<ButtonGroup>
      <Button disabled>
        ذكرني
      </Button>
      <DropdownButton dir='rtl' id='display-dropdown' title={t(display)} pullRight>
        <MenuItem active={display === 'remaining'} className='text-right' eventKey='remaining'
          onSelect={this.handleChangeFactory('display')}>
          {t('remaining')}
        </MenuItem>
        <MenuItem active={display === 'time'} className='text-right' eventKey='time'
          onSelect={this.handleChangeFactory('display')}>
          {t('time')}
        </MenuItem>
        <MenuItem active={display === 'value'} className='text-right' eventKey='value'
          onSelect={this.handleChangeFactory('display')}>
          {t('value')}
        </MenuItem>
      </DropdownButton>
      <DropdownButton disabled={display === 'time'} dir='rtl' id='daysSelection-dropdown' title={t(daysSelection)}
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

    const Header = (<h2 dir='rtl'>{title}</h2>)

    return (<article>
      <Panel bsStyle={positive ? 'success' : 'danger'} className='text-center' footer={Footer} header={Header}>
        <EventText display={display} formattedDate={formattedDate} formattedRemaining={formattedRemaining}
          formattedValue={formattedValue} />
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
