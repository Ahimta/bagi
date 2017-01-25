import * as React from 'react'
import { connect } from 'react-redux'
import { IDispatch } from '~react-redux~redux'
import { bindActionCreators } from 'redux'

import Divider from 'material-ui/Divider'
import Paper from 'material-ui/Paper'

import { addTodo, deleteTodo, editTodo, completeTodo, completeAll, clearCompleted } from '../actions/index'
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
interface IState { }

@connect(mapStateToProps, mapDispatchToProps)
export default class App extends React.Component<IProps, IState> {
  render() {
    return (<Paper>
      <Header />

      <Divider />

      <Footer />
    </Paper>)
  }
}
