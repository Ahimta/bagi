import * as React from 'react'
import {
  Alert, Button, DropdownButton, FormControl, FormGroup, InputGroup, MenuItem, Modal, ProgressBar
} from 'react-bootstrap'

import IBagiEvent from '../types/IBagiEvent'
import TimeUnit from '../types/TimeUnit'
import t from '../translate'

const initialState: IState = {
  loading: false,
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
  readonly loading: boolean;
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
    const {loading, timeUnit, timeValue} = this.state

    const ModalBody = loading ? <ProgressBar now={100} striped /> : (<form>
      <Alert bsSize='xs' bsStyle='warning' dir='rtl'>ﻷسباب تقنية، ميزة التذكير تحتاج اتصال إنترنت!</Alert>

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
          <FormControl dir='rtl' min={0} max={1000000} type='number' value={timeValue}
            onChange={(e) => this.setState({ timeValue: (e.target as any).value } as IState)} required />
          <InputGroup.Addon>قبل</InputGroup.Addon>
        </InputGroup>
      </FormGroup>
    </form>)

    return (<Modal show={showModal} onEnter={() => this.setState(initialState)} onHide={hideModal}>
      <Modal.Header className='text-center' closeButton>
        <Modal.Title>إضافة تذكير</Modal.Title>
      </Modal.Header>

      <Modal.Body>{ModalBody}</Modal.Body>

      <Modal.Footer>
        <Button bsStyle='success' disabled={loading} block>ذكرني</Button>
      </Modal.Footer>
    </Modal>)
  }

  private handleChangeFactory = (fieldName) => (value) => this.setState({ [fieldName]: value } as IState)
}
