import * as React from 'react'
import * as utils from '../utils'

import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const HidableElement = ({children, isHidden}: { children?: any, isHidden: boolean }) => {
  return <span>{isHidden ? '' : children}</span>
}

interface ISeparatorProps { children?: any, pairs: ReadonlyArray<[string, number]>, separator: string }
const Separator = ({children, pairs, separator}: ISeparatorProps) => {
  const length = children.length
  const mapFactory = (separator) => (child, index, xs) => (<span key={pairs[index][0]}>
    {child}
    <HidableElement isHidden={index === length - 1}>
      {separator}
    </HidableElement>
  </span>)

  return (<span>{children.map(mapFactory(separator))}</span>)
}

function RemainingText({remaining}: {remaining: any}) {
  const pairs: ReadonlyArray<[string, number]> = [
    ['month', remaining.months],
    ['week', remaining.weeks],
    ['day', remaining.days],
    ['hour', remaining.hours],
    ['minute', remaining.minutes],
    ['second', remaining.seconds],
  ]

  const filteredPairs = pairs.filter(pair => pair[1] !== 0)
  const Children = filteredPairs.map((pair) => (<span key={pair[0]}>{utils.getPlural(pair[0], pair[1])}</span>))
  return (<Separator pairs={filteredPairs} separator=' و '>{Children}</Separator>)
}

const styles = {
  negative: {
    headerStyle: { backgroundColor: '#f2dede' },
    titleColor: '#a94442'
  },
  positive: {
    headerStyle: { backgroundColor: '#337ab7' },
    titleColor: '#fff'
  }
}

interface IProps {
  readonly currentDate: Date;
  readonly date: Date;
  readonly title: string;
}

interface IState {
  readonly daysSelection: string;
  readonly display: string;
  readonly from: string;
  readonly timeUnit: string;
}

export default class Event extends React.Component<IProps, IState>
{
  constructor(props: IProps) {
    super(props)
    this.state = {
      daysSelection: 'all',
      display: 'remaining',
      from: 'now',
      timeUnit: utils.getLargestTimeUnit(props.currentDate, props.date)
    }
  }

  render() {
    const {currentDate, date, title} = this.props
    const {display, daysSelection, from, timeUnit} = this.state

    const remaining = utils.getRemaining(currentDate, date, timeUnit)

    return (
      <Card style={{ textAlign: 'center' }}>
        <CardHeader
          title={title}
          titleColor={styles.positive.titleColor}
          style={styles.positive.headerStyle}
        />
        <CardText dir='rtl'>
          <RemainingText remaining={remaining} />
        </CardText>
        <CardActions>
          <DropDownMenu value={timeUnit} onChange={this.handleTimeUnitChange}>
            <MenuItem value='month' primaryText='Months'
              disabled={!utils.isValidTimeUnit(currentDate, date, 'month')} />
            <MenuItem value='week' primaryText='Weeks' disabled={!utils.isValidTimeUnit(currentDate, date, 'week')} />
            <MenuItem value='day' primaryText='Days' disabled={!utils.isValidTimeUnit(currentDate, date, 'day')} />
            <MenuItem value='hour' primaryText='Hours' disabled={!utils.isValidTimeUnit(currentDate, date, 'hour')} />
          </DropDownMenu>
          <DropDownMenu value={daysSelection} onChange={this.handleChangeFactory('daysSelection')}>
            <MenuItem value='all' primaryText='All Days' />
            <MenuItem value='weekdays' primaryText='Weekdays' disabled />
            <MenuItem value='weekends' primaryText='Weekends' disabled />
          </DropDownMenu>
          <DropDownMenu value={display} onChange={this.handleChangeFactory('display')}>
            <MenuItem value='remaining' primaryText='Remaining' />
            <MenuItem value='date' primaryText='Date' disabled />
            <MenuItem value='value' primaryText='Value' disabled />
          </DropDownMenu>
          <DropDownMenu value={from} onChange={this.handleChangeFactory('from')}>
            <MenuItem value='now' primaryText='Now' />
            <MenuItem value='custom' primaryText='Custom' disabled />
          </DropDownMenu>
        </CardActions>
      </Card>)
  }

  private handleChangeFactory = (fieldName) => (event, index, value) => this.setState({ [fieldName]: value } as IState)

  private handleTimeUnitChange = (event, index, value) => {
    const {currentDate, date} = this.props

    if (utils.isValidTimeUnit(currentDate, date, value)) {
      this.setState({ timeUnit: value } as IState)
    }
  }
}
