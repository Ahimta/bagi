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

const sortedEvents = [
  {title: 'بداية إجازة منتصف الفصل الأول', date: new Date(2016, 10, 11, 0), positive: true},
  {title: 'بداية الدراسة بعد إجازة منتصف الفصل الأول', date: new Date(2016, 10, 20, 0), positive: false},
  {title: 'بداية اختبارات الفصل الدراسي الأول', date: new Date(2017, 0, 15, 0), positive: false},
  {title: 'بداية إجازة منتصف العام', date: new Date(2017, 0, 27, 0), positive: true},
  {title: 'بداية الدراسة للفصل الدراسي الثاني', date: new Date(2017, 1, 5, 0), positive: false},
  {title: 'بداية إجازة منتصف الفصل الدراسي الثاني', date: new Date(2017, 2, 31, 0), positive: true},
  {title: 'بداية الدراسة بعد إجازة منتصف الفصل الدراسي الثاني', date: new Date(2017, 3, 9, 0), positive: false},
  {title: 'بداية اختبارات الفصل الدراسي الثاني', date: new Date(2017, 5, 4, 0), positive: false},
  {title: 'بداية إجازة نهاية العام', date: new Date(2017, 5, 16, 0), positive: true},
].sort(({date: d1}, {date: d2}) => d1.getTime() - d2.getTime())

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
}

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component<IProps, IState>
{
  private interval: number;

  constructor(props: IProps) {
    super(props)
    this.state = {
      currentDate: new Date()
    }
  }

  componentWillMount() {
    this.interval = setInterval(() => this.setState({ currentDate: new Date() }), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const {currentDate} = this.state
    const futureEvents = sortedEvents.filter(({date}) => date.getTime() > currentDate.getTime())
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
    return (<article key={date.getTime()}>
      <EventPanel currentDate={currentDate} date={date} positive={positive} title={title} />
    </article>)
  }
}
