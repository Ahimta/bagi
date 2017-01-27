import * as React from 'react'

interface IProps { }
interface IState { }

export default class Footer extends React.Component<IProps, IState> {
  render() {
    return (<footer>
      <p className='text-center' dir='rtl'>
        بعض الأيقونات المستخدمة من تصميم&nbsp;
          <a href='http://www.flaticon.com/authors/roundicons' target='_blank' rel='noopener'>Roundicons</a>&nbsp;
          تحت رخصة&nbsp;
          <a href='CC 3.0 BY' target='_blank' rel='noopener'>CC 3.0 BY</a>
      </p>
      <p className='text-center' dir='rtl'>
        <a href='https://sa.linkedin.com/in/ahimta' target='_blank'>
          &copy;
          2017
          عبدالله الأنصاري
        </a>
      </p>
    </footer>)
  }
}
