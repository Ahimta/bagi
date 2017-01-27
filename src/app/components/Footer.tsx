import * as React from 'react'

interface IProps { }
interface IState { }

export default class Footer extends React.Component<IProps, IState> {
  render() {
    return (<footer className='lead text-center'>
      <p>
        <a dir='rtl' href='https://linkedin.com/in/ahimta' target='_blank'>
          &copy; 2017&nbsp;
          عبدالله الأنصاري
        </a>
      </p>
    </footer>)
  }
}
