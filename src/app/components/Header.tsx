import * as React from 'react'
import { MenuItem, Nav, Navbar, NavDropdown } from 'react-bootstrap'

const arabicWebsites = [
  {
    active: false,
    href: 'https://ahimta.github.io/fuel-consumption-calculator/',
    title: 'أسعار البنزين و المياه و الكهرباء'
  },
  {
    active: false,
    href: 'http://ahimta.github.io/saudi-radios',
    title: 'الإذاعات السعودية'
  },
  {
    active: false,
    href: 'https://donation-web-pla-1479993243743.firebaseapp.com/',
    title: 'منصة التبرعات'
  },
  {
    active: true,
    href: 'https://ahimta.github.io/bagi/',
    title: 'باقي'
  },
]

const englishWebsites = [
  {
    href: 'http://ctw.getforge.io/',
    title: 'Clinton, Trump, what\'s up'
  },
  {
    href: 'https://blood-donation-system0.herokuapp.com/',
    title: 'Blood Donation System'
  },
]

const contactUs = {
  link: 'https://twitter.com/intent/tweet?via=ahymta&url=https%3A//ahimta.github.io/bagi/',
  title: 'راسلنا',
}

function ArabicWebsite({active, href, title}: { active: boolean, href: string, title: string }) {
  return <MenuItem active={active} className='text-right' href={href} key={href} target='_blank'>{title}</MenuItem>
}

function EnglishWebsite({href, title}: { href: string, title: string }) {
  return <MenuItem className='text-left' href={href} key={href} target='_blank'>{title}</MenuItem>
}

interface IProps { }
interface IState { }

export default class Header extends React.Component<IProps, IState> {
  render() {
    return (<header>
      <div style={{ marginBottom: '5em' }}>
        <Navbar collapseOnSelect fixedTop inverse>
          <Navbar.Header>
            <Navbar.Brand>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav pullRight className='text-right'>
              <MenuItem className='text-right' href={contactUs.link} target='_blank'>{contactUs.title}</MenuItem>
              <NavDropdown title='مواقع أخرى' dir='rtl' id='other-websites'>
                {arabicWebsites.map(ArabicWebsite)}
                <MenuItem divider />
                {englishWebsites.map(EnglishWebsite)}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </header>)
  }
}
