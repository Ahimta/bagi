import * as localforage from 'localforage'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import * as React from 'react'
import { Button, FormControl, FormGroup, Grid, InputGroup, Modal } from 'react-bootstrap'
import { connect } from 'react-redux'
import { IDispatch } from '~react-redux~redux'
import { bindActionCreators } from 'redux'

import { addTodo, deleteTodo, editTodo, completeTodo, completeAll, clearCompleted } from '../actions/index'
import EventPanel from '../components/EventPanel'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SharingButtons from '../components/SharingButtons'

function date(year: number, month: number, day: number, hour: number, minute: number = 0) {
  return new Date(year, month, day, hour, minute)
}

function massageEvents(currentDate: Date, events: ReadonlyArray<any>): ReadonlyArray<any> {
  return events.slice()
    .sort(({date: d1}, {date: d2}) => d1.getTime() - d2.getTime())
    .filter(({date}) => date.getTime() > currentDate.getTime())
}

const EVENTS = [
  { title: 'بداية إجازة منتصف الفصل الأول', date: date(2016, 10, 11, 0), type: 'positive' },
  { title: 'بداية الدراسة بعد إجازة منتصف الفصل الأول', date: date(2016, 10, 20, 0), type: 'negative' },
  { title: 'بداية اختبارات الفصل الدراسي الأول', date: date(2017, 0, 15, 0), type: 'negative' },
  { title: 'بداية إجازة منتصف العام', date: date(2017, 0, 27, 0), type: 'positive' },
  { title: 'بداية الدراسة للفصل الدراسي الثاني', date: date(2017, 1, 5, 0), type: 'negative' },
  { title: 'بداية إجازة منتصف الفصل الدراسي الثاني', date: date(2017, 2, 31, 0), type: 'positive' },
  { title: 'بداية الدراسة بعد إجازة منتصف الفصل الدراسي الثاني', date: date(2017, 3, 9, 0), type: 'negative' },
  { title: 'بداية اختبارات الفصل الدراسي الثاني', date: date(2017, 5, 4, 0), type: 'negative' },
  { title: 'بداية إجازة نهاية العام', date: date(2017, 5, 16, 0), type: 'positive' },

  { title: 'راتب شهر 5 (جمادة الأولى)', date: date(2017, 1, 24, 0), type: 'positive' },
  { title: 'راتب شهر 6 (جمادة الآخرة)', date: date(2017, 2, 25, 0), type: 'positive' },
  { title: 'راتب شهر 7 (رجب)', date: date(2017, 3, 25, 0), type: 'positive' },
  { title: 'راتب شهر 8 (شعبان)', date: date(2017, 4, 26, 0), type: 'positive' },
  { title: 'راتب شهر 9 (رمضان)', date: date(2017, 5, 26, 0), type: 'positive' },
  { title: 'راتب شهر 10 (شوال)', date: date(2017, 6, 27, 0), type: 'positive' },
  { title: 'راتب شهر 11 (ذو القعدة)', date: date(2017, 7, 27, 0), type: 'positive' },
  { title: 'راتب شهر 12 (ذو الحجة)', date: date(2017, 8, 27, 0), type: 'positive' },

  { title: 'فرض ضريبة المنتجات الضارة (المشروبات الغازية...)', date: date(2017, 3, 1, 0), type: 'positive' },
  { title: 'زيادة أسعار منتجات الطاقة', date: date(2017, 6, 1, 0), type: 'negative' },
  { title: 'فرض ضريبة القيمة المضافة', date: date(2018, 0, 1, 0), type: 'negative' },
  { title: 'اعتماد تعرفة السلع الفاخرة', date: date(2018, 0, 1, 0), type: 'negative' },
  { title: 'ربط جميع منتجات الطاقة بالأسعار المرجعية', date: date(2020, 0, 1, 0), type: 'negative' },
]

function mapStateToProps(state: any) {
  return {
    todos: state.todos
  }
}

function mapDispatchToProps(dispatch: IDispatch) {
  return {
    actions: bindActionCreators({
      addTodo,
      deleteTodo,
      editTodo,
      completeTodo,
      completeAll,
      clearCompleted
    }, dispatch)
  }
}

interface IProps { }

interface IState {
  readonly currentDate: Date;
  readonly events: Readonly<any>;
  readonly showModal: boolean;

  readonly newDate: Date;
  readonly newTime: Date;
  readonly newTitle: string;
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component<IProps, IState>
{
  private intervalId: number;

  constructor(props: IProps) {
    super(props)
    this.state = {
      currentDate: new Date(),
      events: [],
      showModal: false,

      newDate: new Date(),
      newTime: new Date(),
      newTitle: ''
    }
  }

  componentWillMount() {
    const {currentDate} = this.state

    this.intervalId = setInterval(() => this.setState({ currentDate: new Date() } as IState), 1000)

    localforage.getItem('myEvents').then((storedEvents) => {
      const customEvents = (storedEvents || [])
      const events = massageEvents(currentDate, EVENTS.concat(customEvents))

      this.setState({ events } as IState)
    })
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {currentDate, events, showModal} = this.state
    const {newDate, newTime, newTitle} = this.state

    const EventsPanels = events.map(this.mapDateFactory(currentDate, this.removeEvent))

    return (<section>
      <Header />

      <main>
        <Grid>
          {EventsPanels}
          <Button active={showModal} bsSize='lg' bsStyle='success' block
            onClick={() => this.setState({ showModal: true } as IState)}>
            إضافة وقت
          </Button>
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

      const newEvent: { date: Date, title: string, type: string } = {
        date: newEventDate,
        title: newTitle,
        type: 'custom'
      }

      localforage.getItem('myEvents').then((storedCustomEvents: ReadonlyArray<any>) => {
        const oldCustomEvents = (storedCustomEvents || [])
        const newCustomEvents = oldCustomEvents.concat(newEvent)
        const newEvents = massageEvents(currentDate, EVENTS.concat(newCustomEvents))

        this.setState({ events: newEvents, showModal: false } as IState)
        localforage.setItem('myEvents', newCustomEvents)
      })
    }
  }

  private removeEvent = (title: string) => {
    const {currentDate} = this.state

    localforage.getItem('myEvents').then((storedCustomEvents: ReadonlyArray<any>) => {
      const oldCustomEvents = (storedCustomEvents || [])
      const newCustomEvents = oldCustomEvents.filter(({title: existingTitle}) => existingTitle !== title)
      const newEvents = massageEvents(currentDate, EVENTS.concat(newCustomEvents))

      this.setState({ events: newEvents } as IState)
      localforage.setItem('myEvents', newCustomEvents)
    })
  }

  private mapDateFactory = (currentDate, removeEvent) => ({date, title, type}) => {
    return <EventPanel currentDate={currentDate} date={date} key={title} title={title} type={type}
      removeEvent={removeEvent} />
  }
}
