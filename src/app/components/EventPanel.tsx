import * as React from 'react'
import {
  Button, ButtonGroup, ControlLabel, DropdownButton, FormControl, FormGroup, MenuItem, Modal,
  Panel
} from 'react-bootstrap'

import * as notifications from '../notifications'
import t from '../translate'
import * as utils from '../utils'

const notificationSupported = ('serviceWorker' in navigator && 'PushManager' in window)

function getStyle(type: string) {
  switch (type) {
    case 'custom': return 'primary'
    case 'negative': return 'danger'
    case 'positive': return 'success'
  }
}

interface IEventTextProps { display: string, formattedDate: string, formattedRemaining: string, formattedValue: string }
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
  readonly type: string;

  readonly removeEvent: (title: string) => void;
}

interface IState {
  readonly before: string;
  readonly daysSelection: string;
  readonly display: string;
  readonly from: string;
  readonly showModal: boolean;
  readonly timeUnit: string;
}

export default class Event extends React.Component<IProps, IState>
{
  constructor(props: IProps) {
    super(props)
    this.state = {
      before: 'second',
      daysSelection: 'all-days',
      display: 'remaining',
      from: 'now',
      showModal: false,
      timeUnit: utils.getLargestTimeUnit(props.currentDate, props.date)
    }
  }

  render() {
    const {currentDate, date, title, type, removeEvent} = this.props
    const {before, display, daysSelection, showModal, timeUnit} = this.state

    const formattedDate = utils.formatDate(date, t)
    const formattedRemaining = utils.formatRemaining(currentDate, date, timeUnit, daysSelection, t('and'))
    const formattedValue = utils.formatValue(currentDate, date, daysSelection, t('currency'))

    const isZeroWeekends = utils.isZeroWeekends(currentDate, date)
    const isZeroWeekdays = utils.isZeroWeekdays(currentDate, date)

    const Footer = (<ButtonGroup>
      <DropdownButton dir='rtl' id='display-dropdown' title={t(display)} pullRight>
        <MenuItem active={display === 'remaining'} className='text-right' eventKey='remaining'
          onSelect={this.handleChangeFactory('display') as any}>
          {t('remaining')}
        </MenuItem>
        <MenuItem active={display === 'time'} className='text-right' eventKey='time'
          onSelect={this.handleChangeFactory('display') as any}>
          {t('time')}
        </MenuItem>
        <MenuItem active={display === 'value'} className='text-right' eventKey='value'
          onSelect={this.handleChangeFactory('display') as any}>
          {t('value')}
        </MenuItem>
      </DropdownButton>
      <Button active={showModal} className='hidden' disabled={!notificationSupported}
        onClick={() => this.setState({ showModal: true } as IState)}>
        ذكرني
      </Button>
      <DropdownButton disabled={display === 'time'} dir='rtl' id='daysSelection-dropdown' title={t(daysSelection)}
        pullRight>
        <MenuItem active={daysSelection === 'all-days'} className='text-right' eventKey='all-days'
          onSelect={this.handleChangeFactory('daysSelection') as any}>
          {t('all-days')}
        </MenuItem>
        <MenuItem active={daysSelection === 'weekdays'} className='text-right' disabled={isZeroWeekdays}
          eventKey='weekdays' onSelect={this.handleChangeFactory('daysSelection') as any}>
          {t('weekdays')}
        </MenuItem>
        <MenuItem active={daysSelection === 'weekends'} className='text-right' disabled={isZeroWeekends}
          eventKey='weekends' onSelect={this.handleChangeFactory('daysSelection') as any}>
          {t('weekends')}
        </MenuItem>
      </DropdownButton>
      <DropdownButton disabled={display !== 'remaining'} dir='rtl' id='timeUnit-dropdown' title={t(timeUnit)} pullRight>
        <MenuItem active={timeUnit === 'year'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'year')} eventKey='year'
          onSelect={this.handleTimeUnitChange as any}>
          {t('year')}
        </MenuItem>
        <MenuItem active={timeUnit === 'month'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'month')} eventKey='month'
          onSelect={this.handleTimeUnitChange as any}>
          {t('month')}
        </MenuItem>
        <MenuItem active={timeUnit === 'week'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'week')} eventKey='week'
          onSelect={this.handleTimeUnitChange as any}>
          {t('week')}
        </MenuItem>
        <MenuItem active={timeUnit === 'day'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'day')} eventKey='day'
          onSelect={this.handleTimeUnitChange as any}>
          {t('day')}
        </MenuItem>
        <MenuItem active={timeUnit === 'hour'} className='text-right'
          disabled={!utils.isValidTimeUnit(currentDate, date, 'hour')}
          eventKey='hour' onSelect={this.handleTimeUnitChange as any}>
          {t('hour')}
        </MenuItem>
      </DropdownButton>
    </ButtonGroup>)

    const CloseButton = (<span className='pull-left' style={{ cursor: 'pointer' }} onClick={() => removeEvent(title)}>
      &times;
    </span>)

    const Header = (type === 'custom') ?
      (<h2 dir='rtl'>{CloseButton}{title}</h2>) :
      (<h2 dir='rtl'>{title}</h2>)

    return (<article data-datetime={date.getTime()}>
      <Panel bsStyle={getStyle(type)} className='text-center' footer={Footer} header={Header}>
        <EventText display={display} formattedDate={formattedDate} formattedRemaining={formattedRemaining}
          formattedValue={formattedValue} />
      </Panel>

      <Modal show={showModal} onHide={() => this.setState({ showModal: false } as IState)}>
        <Modal.Header className='text-center' closeButton>
          <Modal.Title>إضافة تذكير</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <FormGroup controlId={`before-${date.getTime()}`} dir='rtl'>
            <ControlLabel>ذكرني قبل بـ:</ControlLabel>
            <FormControl componentClass='select' value={before}
              onChange={(e) => this.setState({ before: (e.target as any).value } as IState)}>
              <option value='second'>ثانية</option>
              <option value='minute'>دقيقة</option>
              <option value='hour'>ساعة</option>
              <option value='day'>يوم</option>
              <option value='week'>أسبوع</option>
              <option value='month'>شهر</option>
            </FormControl>
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button bsStyle='success' onClick={this.remindMe} block>ذكرني</Button>
        </Modal.Footer>
      </Modal>
    </article>)
  }

  private handleChangeFactory = (fieldName) => (value, event) => this.setState({ [fieldName]: value } as IState)

  private handleTimeUnitChange = (timeUnit, event) => {
    const {currentDate, date} = this.props

    if (utils.isValidTimeUnit(currentDate, date, timeUnit)) {
      this.setState({ timeUnit } as IState)
    }
  }

  private remindMe = () => {
    const {date, title, type} = this.props
    const {before} = this.state

    notifications.scheduleNotification({ date, title, type }, before).then(() => {
      this.setState({ showModal: false } as IState)
    }).catch(err => {
      console.log('Notification failed with: ', err)
    })
  }
}
