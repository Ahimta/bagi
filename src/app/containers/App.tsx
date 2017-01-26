import * as React from 'react'
import { Button, Grid } from 'react-bootstrap'
import { connect } from 'react-redux'
import { IDispatch } from '~react-redux~redux'
import { bindActionCreators } from 'redux'

import { addTodo, deleteTodo, editTodo, completeTodo, completeAll, clearCompleted } from '../actions/index'
import EventPanel from '../components/EventPanel'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SharingButtons from '../components/SharingButtons'

function date(year: number, month: number, day: number, hour: number) {
  return new Date(year, month, day, hour)
}

const EVENTS = [
  { title: 'بداية إجازة منتصف الفصل الأول', date: date(2016, 10, 11, 0), positive: true },
  { title: 'بداية الدراسة بعد إجازة منتصف الفصل الأول', date: date(2016, 10, 20, 0), positive: false },
  { title: 'بداية اختبارات الفصل الدراسي الأول', date: date(2017, 0, 15, 0), positive: false },
  { title: 'بداية إجازة منتصف العام', date: date(2017, 0, 27, 0), positive: true },
  { title: 'بداية الدراسة للفصل الدراسي الثاني', date: date(2017, 1, 5, 0), positive: false },
  { title: 'بداية إجازة منتصف الفصل الدراسي الثاني', date: date(2017, 2, 31, 0), positive: true },
  { title: 'بداية الدراسة بعد إجازة منتصف الفصل الدراسي الثاني', date: date(2017, 3, 9, 0), positive: false },
  { title: 'بداية اختبارات الفصل الدراسي الثاني', date: date(2017, 5, 4, 0), positive: false },
  { title: 'بداية إجازة نهاية العام', date: date(2017, 5, 16, 0), positive: true },
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
  readonly events: any[];
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component<IProps, IState>
{
  private intervalId: number;

  constructor(props: IProps) {
    super(props)
    this.state = {
      currentDate: new Date(),
      events: EVENTS
    }
  }

  componentWillMount() {
    this.intervalId = setInterval(() => this.setState({ currentDate: new Date() } as IState), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const {currentDate, events} = this.state

    const futureEvents = events
      .sort(({date: d1}, {date: d2}) => d1.getTime() - d2.getTime())
      .filter(({date}) => date.getTime() > currentDate.getTime())

    const EventsPanels = futureEvents.map(this.mapDateFactory(currentDate))

    return (<section>
      <Header />

      <main>
        <Grid>
          {EventsPanels}
          <Button bsStyle='success' block disabled>إضافة وقت</Button>
        </Grid>
      </main>

      <hr />

      <SharingButtons />

      <hr />

      <Footer />
    </section>)
  }

  private mapDateFactory = (currentDate) => ({date, positive, title}) => {
    return <EventPanel currentDate={currentDate} date={date} positive={positive} title={title} />
  }
}
