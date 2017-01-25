import * as React from 'react'

interface IProps { }
interface IState { }

export default class Footer extends React.Component<IProps, IState> {
  render() {
    return (<footer style={{ paddingBottom: '1px', textAlign: 'center' }}>
      <p><a href='https://linkedin.com/in/ahimta' target='_blank'>&copy; 2017 Abdullah Alansari</a></p>
    </footer>)
  }
}
