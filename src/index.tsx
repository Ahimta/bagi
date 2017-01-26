import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { IStore } from '~react-redux~redux'
import { Provider } from 'react-redux'
import * as injectTapEventPlugin from 'react-tap-event-plugin'

import App from './app/containers/App'
import configureStore from './app/store/configureStore'
import { Router, Route, hashHistory } from 'react-router'

const store: IStore<any> = configureStore({})

// needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router history={hashHistory}>
        <Route path='/' component={App} />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
)
