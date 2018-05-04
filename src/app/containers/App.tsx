import * as React from 'react'
import { Alert, Button, FormControl, FormGroup, Grid, InputGroup, Modal, ProgressBar } from 'react-bootstrap'

import ContentAdd from 'material-ui/svg-icons/content/add';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'

import EventPanel from '../components/EventPanel'
import Footer from '../components/Footer'
import Header from '../components/Header'
import IBagiEvent from '../types/IBagiEvent'
import SharingButtons from '../components/SharingButtons'
import * as storage from '../storage'

const serviceWorkerSupported = ('serviceWorker' in navigator)

function date(year: number, month: number, day: number, hour: number, minute: number = 0) {
  return new Date(year, month, day, hour, minute)
}

function findPos(obj: any) {
  var curtop = 0;

  if (obj.offsetParent) {
    do {
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return curtop;
  }
}

function scrollIntoView(element: any) {
  const FIXED_HEADER_MARGIN = 70
  const topOffset = findPos(element)

  window.scrollTo(0, topOffset - FIXED_HEADER_MARGIN)
}

function massageEvents(currentDate: Date, events: ReadonlyArray<IBagiEvent>): ReadonlyArray<IBagiEvent> {
  return events
    .filter(({date}) => date.getTime() > currentDate.getTime())
    .slice()
    .sort(({date: d1}, {date: d2}) => d1.getTime() - d2.getTime())
}

const EVENTS: ReadonlyArray<IBagiEvent> = [
  { title: 'بداية شهر رمضان المبارك', date: date(2018, 4, 15, 0), type: 'positive' },
  { title: 'بداية العشر الأواخر', date: date(2018, 5, 2, 0), type: 'positive' },
  { title: 'عيد الفطر المبارك', date: date(2018, 5, 14, 0), type: 'positive' },
  { title: 'يوم عرفة', date: date(2018, 7, 20, 0), type: 'positive' },
  { title: 'عيد ذو الحجة المبارك', date: date(2018, 7, 21, 0), type: 'positive' },

  { title: 'بداية اختبار الفصل الدراسي الثاني', date: date(2018, 4, 6, 0), type: 'negative' },
  { title: 'بداية اجازة نهاية العام', date: date(2018, 4, 15, 0), type: 'positive' },
  { title: 'بداية الدراسة للطلاب للفصل الدراسي الأول', date: date(2018, 8, 2, 0), type: 'negative' },
  { title: 'إجازة اليوم الوطني', date: date(2018, 8, 23, 0), type: 'positive' },
  { title: 'بداية اختبار الفصل الدراسي الأول', date: date(2018, 11, 16, 0), type: 'negative' },
  { title: 'بداية إجازة منتصف العام', date: date(2018, 11, 27, 0), type: 'positive' },
  { title: 'بداية الدراسة للفصل الدراسي الثاني', date: date(2019, 0, 6, 0), type: 'negative' },
  { title: 'بداية اختبار الفصل الدراسي الثاني', date: date(2019, 3, 21, 0), type: 'negative' },
  { title: 'بداية اجازة نهاية العام', date: date(2019, 4, 2, 0), type: 'positive' },

  { title: 'ربط جميع منتجات الطاقة بالأسعار المرجعية', date: date(2020, 0, 1, 0), type: 'negative' }
]

function OfflineAlert() {
  if (serviceWorkerSupported) {
    return (<Alert bsStyle='success' dir='rtl'>الموقع يعمل بدون انترنت!</Alert>)
  } else {
    return (<Alert bsStyle='warning' dir='rtl'>الموقع لا يعمل بدون انترنت!</Alert>)
  }
}

interface IProps { }

interface IState {
  readonly currentDate: Date;
  readonly loading: boolean;
  readonly events: ReadonlyArray<IBagiEvent>;
  readonly showModal: boolean;

  readonly newDate: Date;
  readonly newTime: Date;
  readonly newTitle: string;
}

export default class App extends React.Component<IProps, IState>
{
  private intervalId: number;

  constructor(props: IProps) {
    super(props)
    this.state = {
      currentDate: new Date(),
      events: [],
      loading: true,
      showModal: false,

      newDate: new Date(),
      newTime: new Date(),
      newTitle: ''
    }
  }

  componentWillMount() {
    const {currentDate} = this.state

    this.intervalId = setInterval(() => this.setState({ currentDate: new Date() } as IState), 1000)

    storage.getEvents().then(customEvents => {
      const events = massageEvents(currentDate, EVENTS.concat(customEvents as any))
      this.setState({ events, loading: false } as IState)
    })
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {currentDate, events, loading, showModal} = this.state
    const {newDate, newTime, newTitle} = this.state

    const EventsPanels = loading ?
      <ProgressBar now={100} striped /> :
      events.map(this.mapDateFactory(currentDate, this.removeEvent))

    return (<section>
      <Header />

      <Grid><OfflineAlert /></Grid>

      <main>
        <Grid>
          {EventsPanels}
          <FloatingActionButton backgroundColor='#337ab7' style={{bottom: '1em', left: '1em', position: 'fixed'}}
             onClick={this.openModal}>
            <ContentAdd />
          </FloatingActionButton>
        </Grid>

        <Modal show={showModal} onHide={() => this.setState({ showModal: false } as IState)}>
          <Modal.Header className='text-center' closeButton>
            <Modal.Title>إضافة وقت</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <FormGroup validationState={(newTitle === '') ? 'error' : 'success'}>
              <InputGroup>
                <FormControl dir='rtl' placeholder='مثلاً: "بداية الدراسة"' type='text' value={newTitle}
                  onChange={(e) => this.setState({ newTitle: (e.target as any).value } as IState)} required />
                <InputGroup.Addon>العنوان</InputGroup.Addon>
              </InputGroup>
            </FormGroup>

            <DatePicker cancelLabel='إلغاء' firstDayOfWeek={0} hintText='التاريخ' minDate={new Date()}
              okLabel='تأكيد' textFieldStyle={{ width: '100%' }} value={newDate}
              onChange={(_, newDate) => this.setState({ newDate } as IState)} autoOk />

            <TimePicker cancelLabel='إلغاء' hintText='الساعة و الدقيقة'
              textFieldStyle={{ width: '100%' }} okLabel='تأكيد' value={newTime}
              onChange={(_, newTime) => this.setState({ newTime } as IState)} autoOk />
          </Modal.Body>

          <Modal.Footer>
            <Button bsStyle='success' onClick={this.addEvent} block>إضافة الوقت</Button>
          </Modal.Footer>

        </Modal>
      </main>

      <hr />

      <SharingButtons />

      <hr />

      <Footer />
    </section>)
  }

  private addEvent = () => {
    const {currentDate, newDate, newTime, newTitle} = this.state

    if (newTitle) {
      const newEventDate = date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newTime.getHours(),
        newTime.getMinutes())

      const newEvent: IBagiEvent = {
        date: newEventDate,
        title: newTitle,
        type: 'custom'
      }

      storage.addEvent(newEvent).then(newCustomEvents => {
        const newEvents = massageEvents(currentDate, EVENTS.concat(newCustomEvents))

        this.setState({ events: newEvents, showModal: false } as IState, () => {
          const newEventElement = document.querySelector(`[data-datetime="${newEventDate.getTime()}"]`)

          if (newEventElement) {
            // hack
            setTimeout(() => scrollIntoView(newEventElement), 500)
          } else {
            console.log('newEventElement not found!');
          }
        })
      })
    }
  }

  private openModal = () => {
    this.setState({ newDate: new Date(), newTime: new Date(), newTitle: '', showModal: true } as IState)
  }

  private removeEvent = (title: string) => {
    const {currentDate} = this.state

    storage.removeEvent(title).then(newCustomEvents => {
      const newEvents = massageEvents(currentDate, EVENTS.concat(newCustomEvents))
      this.setState({ events: newEvents } as IState)
    })
  }

  private mapDateFactory = (currentDate, removeEvent) => ({date, title, type}: IBagiEvent) => {
    return <EventPanel currentDate={currentDate} date={date} key={`${title}-${date.getTime()}`} title={title}
      type={type} removeEvent={removeEvent} />
  }
}
