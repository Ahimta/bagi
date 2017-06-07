import * as classNames from 'classnames'
import * as React from 'react'
import { MenuItem, Nav, Navbar, NavDropdown } from 'react-bootstrap'

const arabicWebsites = [
  {
    active: false,
    disabled: false,
    href: 'https://ahimta.github.io/fuel-consumption-calculator/',
    title: 'أسعار البنزين و المياه و الكهرباء'
  },
  {
    active: false,
    disabled: true,
    href: 'http://ahimta.github.io/saudi-radios',
    title: 'الإذاعات السعودية'
  },
  {
    active: false,
    disabled: false,
    href: 'https://donation-web-pla-1479993243743.firebaseapp.com/',
    title: 'منصة التبرعات'
  },
  {
    active: true,
    disabled: false,
    href: 'https://ahimta.github.io/bagi/',
    title: 'باقي'
  },
]

const englishWebsites = [
  {
    disabled: false,
    href: 'http://ctw.getforge.io/',
    title: 'Clinton, Trump, what\'s up'
  },
  {
    disabled: true,
    href: 'https://blood-donation-system0.herokuapp.com/',
    title: 'Blood Donation System'
  },
]

const contactUs = {
  link: 'https://twitter.com/intent/tweet?via=ahymta&url=https%3A//ahimta.github.io/bagi/',
  title: 'راسلنا',
}

interface IArabicWebsiteProps { active: boolean, disabled: boolean, href: string, title: string }
function ArabicWebsite({active, disabled, href, title}: IArabicWebsiteProps) {
  const className = classNames('text-right', { active })
  return <MenuItem className={className} disabled={disabled} href={href} key={href} target='_blank'>{title}</MenuItem>
}

function EnglishWebsite({disabled, href, title}: { disabled: boolean, href: string, title: string }) {
  return <MenuItem className='text-left' disabled={disabled} href={href} key={href} target='_blank'>{title}</MenuItem>
}

export default function Header() {
  return (<header>
    <div style={{ marginBottom: '5em' }}>
      <Navbar collapseOnSelect fixedTop inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <img src='app/images/icon-256x256.png' />
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
