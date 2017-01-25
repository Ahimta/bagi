import * as React from 'react'
import { connect } from 'react-redux'
import { IDispatch } from '~react-redux~redux'
import { bindActionCreators } from 'redux'

import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'

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
    this.interval = setInterval(() => this.setState({currentDate: new Date()}), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const {currentDate} = this.state

    return (<Paper>
      <Header />

      <main>
        <Event currentDate={currentDate} date={new Date(2017, 1, 7)} title='title0' />
        <Event currentDate={currentDate} date={new Date(2017, 3, 7)} title='title1' />
        <Event currentDate={currentDate} date={new Date(2017, 3, 7)} title='title2' />
      </main>

      <Divider />

      <Footer />
    </Paper>)
  }
}
