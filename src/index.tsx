import * as Raven from 'raven-js'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as injectTapEventPlugin from 'react-tap-event-plugin'

import App from './app/containers/App'

Raven
  .config('https://7b2db5e403a44579bca792256504713b@sentry.io/1205564')
  .install()

Raven.context(() => {
  // needed for onTouchTap
  // http://stackoverflow.com/a/34015469/988941
  injectTapEventPlugin()

  ReactDOM.render(<MuiThemeProvider><App /></MuiThemeProvider>, document.getElementById('root'))
})
