import * as React from 'react'

import AppBar from 'material-ui/AppBar'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'

import EmailIcon from 'material-ui/svg-icons/communication/email'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

const arabicStyle = { textAlign: 'right' }

const contactIcon = (<IconButton
  href={'https://twitter.com/intent/tweet?via=ahymta&url=https%3A//ahimta.github.io/bagi/'} target='_blank'>
  <EmailIcon />
</IconButton>)

const otherWebsitesMenu = (<IconMenu
  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
  targetOrigin={{ horizontal: 'right', vertical: 'top' }}
  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}>
  <MenuItem href='http://ctw.getforge.io/' primaryText="Clinton, Trump, what's up" target='_blank' />

  <MenuItem href='https://blood-donation-system0.herokuapp.com/' primaryText='Blood Donation System' target='_blank' />

  <Divider />

  <MenuItem href='https://ahimta.github.io/fuel-consumption-calculator/'
    primaryText='أسعار البنزين و المياه و الكهرباء' style={arabicStyle} target='_blank' />

  <MenuItem href='http://ahimta.github.io/saudi-radios' primaryText='الإذاعات السعودية' style={arabicStyle}
    target='_blank' />

  <MenuItem href='https://donation-web-pla-1479993243743.firebaseapp.com/' primaryText='منصة التبرعات'
    style={arabicStyle} target='_blank' />

  <MenuItem href='https://ahimta.github.io/bagi/' primaryText='باقي' style={arabicStyle} target='_blank' disabled />
</IconMenu>)

interface IProps { }
interface IState { }

export default class Header extends React.Component<IProps, IState> {
  render() {
    return (<header>
      <AppBar
        title='Bagi'
        iconElementLeft={contactIcon}
        iconElementRight={otherWebsitesMenu} />
    </header>)
  }
}
