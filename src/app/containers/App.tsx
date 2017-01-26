import * as React from 'react'
import { Button, Grid } from 'react-bootstrap'
import { connect } from 'react-redux'
import { IDispatch } from '~react-redux~redux'
import { bindActionCreators } from 'redux'

import { addTodo, deleteTodo, editTodo, completeTodo, completeAll, clearCompleted } from '../actions/index'
import Event from '../components/Event'
import Footer from '../components/Footer'
import Header from '../components/Header'

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

    return (<section>
      <Header />

      <main>
        <Grid>
          <Event currentDate={currentDate} date={new Date(2017, 1, 7)} positive={true} title='title0' />
          <Event currentDate={currentDate} date={new Date(2017, 3, 7)} positive={false} title='title1' />
          <Event currentDate={currentDate} date={new Date(2017, 3, 7)} positive={true} title='title2' />
          <Button bsStyle='success' block disabled>إضافة وقت</Button>
        </Grid>
      </main>

      <hr />

      <Footer />
    </section>)
  }
}
