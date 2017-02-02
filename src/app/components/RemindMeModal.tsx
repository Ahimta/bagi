import * as React from 'react'
import { Button, DropdownButton, FormControl, FormGroup, InputGroup, MenuItem, Modal } from 'react-bootstrap'

import * as notifications from '../notifications'
import IBagiEvent from '../types/IBagiEvent'
import TimeUnit from '../types/TimeUnit'
import t from '../translate'

const initialState: IState = {
  timeUnit: 'minute',
  timeValue: 5
}

interface IProps {
  readonly currentDate: Date;
  readonly event: IBagiEvent;
  readonly showModal: boolean;

  readonly hideModal: () => void;
}

interface IState {
  readonly timeUnit: TimeUnit;
  readonly timeValue: number;
}

export default class RemindMeModal extends React.Component<IProps, IState>
{
  constructor(props: IProps, context: any) {
    super(props, context)
    this.state = initialState
  }

  render() {
    const {event, hideModal, showModal} = this.props
    const {timeUnit, timeValue} = this.state

    return (<Modal show={showModal} onEnter={() => this.setState(initialState)} onHide={hideModal}>
      <Modal.Header className='text-center' closeButton>
        <Modal.Title>إضافة تذكير</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <FormGroup>
          <InputGroup>
            <DropdownButton componentClass={InputGroup.Button} id={`reminder-${event.date.getTime()}`}
              title={t(timeUnit)} value={timeUnit} onSelect={this.handleChangeFactory('timeUnit')} pullRight>
              <MenuItem active={timeUnit === 'second'} className='text-right' eventKey='second'>{t('second')}</MenuItem>
              <MenuItem active={timeUnit === 'minute'} className='text-right' eventKey='minute'>{t('minute')}</MenuItem>
              <MenuItem active={timeUnit === 'hour'} className='text-right' eventKey='hour'>{t('hour')}</MenuItem>
              <MenuItem active={timeUnit === 'day'} className='text-right' eventKey='day'>{t('day')}</MenuItem>
              <MenuItem active={timeUnit === 'week'} className='text-right' eventKey='week'>{t('week')}</MenuItem>
              <MenuItem active={timeUnit === 'month'} className='text-right' eventKey='month'>{t('month')}</MenuItem>
            </DropdownButton>
            <FormControl type='text' dir='rtl' value={timeValue}
              onChange={(e) => this.setState({ timeValue: (e.target as any).value } as IState)} />
            <InputGroup.Addon>ذكرني</InputGroup.Addon>
          </InputGroup>
        </FormGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button bsStyle='success' onClick={this.remindMe} block>ذكرني</Button>
      </Modal.Footer>
    </Modal>)
  }

  private handleChangeFactory = (fieldName) => (value) => this.setState({ [fieldName]: value } as IState)

  private remindMe = () => {
    const {event, hideModal} = this.props
    const {timeUnit, timeValue} = this.state

    notifications.scheduleNotification(event, timeUnit, timeValue).then(() => {
      hideModal()
    }).catch(err => {
      console.log('Notification failed with: ', err)
    })
  }
}
