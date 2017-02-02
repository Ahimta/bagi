import * as React from 'react'
import { Button, ButtonGroup, DropdownButton, MenuItem, Panel } from 'react-bootstrap'

import RemindMeModal from './RemindMeModal'
import t from '../translate'
import * as utils from '../utils'

import DaysFilter from '../types/DaysFilter'
import EventDisplay from '../types/EventDisplay'
import EventType from '../types/EventType'
import TimeUnit from '../types/TimeUnit'

const notificationSupported = ('serviceWorker' in navigator && 'PushManager' in window)

function getStyle(type: EventType) {
  switch (type) {
    case 'custom': return 'primary'
    case 'negative': return 'danger'
    case 'positive': return 'success'
  }
}

interface IEventTextProps {
  display: EventDisplay,
  formattedDate: string,
  formattedRemaining: string,
  formattedValue: string
}

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
  readonly title: string;
  readonly type: EventType;

  readonly removeEvent: (title: string) => void;
}

interface IState {
  readonly daysSelection: DaysFilter;
  readonly display: EventDisplay;
  readonly showModal: boolean;
  readonly timeUnit: TimeUnit;
}

export default class Event extends React.Component<IProps, IState>
{
  constructor(props: IProps, context: any) {
    super(props, context)
    this.state = {
      daysSelection: 'all-days',
      display: 'remaining',
      showModal: false,
      timeUnit: utils.getLargestTimeUnit(props.currentDate, props.date)
    }
  }

  render() {
    const {currentDate, date, title, type, removeEvent} = this.props
    const {display, daysSelection, showModal, timeUnit} = this.state

    const formattedDate = utils.formatDate(date, t)
    const formattedRemaining = utils.formatRemaining(currentDate, date, timeUnit, daysSelection, t('and'))
    const formattedValue = utils.formatValue(currentDate, date, daysSelection, t('currency'))

    const isZeroWeekends = utils.isZeroWeekends(currentDate, date)
    const isZeroWeekdays = utils.isZeroWeekdays(currentDate, date)

    const Footer = (<ButtonGroup>
      <DropdownButton dir='rtl' id='display-dropdown' title={t(display)} onSelect={this.handleChangeFactory('display')}
        pullRight>
        <MenuItem active={display === 'remaining'} className='text-right' eventKey='remaining'>
          {t('remaining')}
        </MenuItem>
        <MenuItem active={display === 'time'} className='text-right' eventKey='time'>{t('time')}</MenuItem>
        <MenuItem active={display === 'value'} className='text-right' eventKey='value'>{t('value')}</MenuItem>
      </DropdownButton>

      <Button active={showModal} className='hidden' disabled={!notificationSupported}
        onClick={() => this.setState({ showModal: true } as IState)}>
        ذكرني
      </Button>

      <DropdownButton disabled={display === 'time'} dir='rtl' id='daysSelection-dropdown' title={t(daysSelection)}
        onSelect={this.handleChangeFactory('daysSelection')} pullRight>
        <MenuItem active={daysSelection === 'all-days'} className='text-right' eventKey='all-days'>
          {t('all-days')}
        </MenuItem>
        <MenuItem active={daysSelection === 'weekdays'} className='text-right' disabled={isZeroWeekdays}
          eventKey='weekdays'>
          {t('weekdays')}
        </MenuItem>
        <MenuItem active={daysSelection === 'weekends'} className='text-right' disabled={isZeroWeekends}
          eventKey='weekends'>
          {t('weekends')}
        </MenuItem>
      </DropdownButton>

      <DropdownButton disabled={display !== 'remaining'} dir='rtl' id='timeUnit-dropdown' title={t(timeUnit)}
        onSelect={this.handleTimeUnitChange as any} pullRight>
        <MenuItem active={timeUnit === 'year'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'year')} eventKey='year'>
          {t('year')}
        </MenuItem>
        <MenuItem active={timeUnit === 'month'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'month')} eventKey='month'>
          {t('month')}
        </MenuItem>
        <MenuItem active={timeUnit === 'week'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'week')} eventKey='week'>
          {t('week')}
        </MenuItem>
        <MenuItem active={timeUnit === 'day'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'day')} eventKey='day'>
          {t('day')}
        </MenuItem>
        <MenuItem active={timeUnit === 'hour'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'hour')}
          eventKey='hour'>
          {t('hour')}
        </MenuItem>
      </DropdownButton>
    </ButtonGroup>)

    const CloseButton = (<span className='pull-left' style={{ cursor: 'pointer' }} onClick={() => removeEvent(title)}>
      &times;
    </span>)

    const Header = (type === 'custom') ? (<h2 dir='rtl'>{CloseButton}{title}</h2>) : (<h2 dir='rtl'>{title}</h2>)

    return (<article data-datetime={date.getTime()}>
      <Panel bsStyle={getStyle(type)} className='text-center' footer={Footer} header={Header}>
        <EventText display={display} formattedDate={formattedDate} formattedRemaining={formattedRemaining}
          formattedValue={formattedValue} />
      </Panel>

      <RemindMeModal currentDate={currentDate} event={{ date, title, type }} showModal={showModal}
        hideModal={() => this.setState({ showModal: false } as IState)} />
    </article>)
  }

  private handleChangeFactory = (fieldName) => (value) => this.setState({ [fieldName]: value } as IState)

  private handleTimeUnitChange = (timeUnit: TimeUnit) => {
    const {currentDate, date} = this.props

    if (utils.isValidTimeUnit(currentDate, date, timeUnit)) {
      this.setState({ timeUnit } as IState)
    }
  }
}
