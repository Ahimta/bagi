function monthsToMillis (months) { return months * 30 * 24 * 60 * 60 * 1000; }
function weeksToMillis (weeks) { return weeks * 7 * 24 * 60 * 60 * 1000; }
function daysToMillis (days) { return days * 24 * 60 * 60 * 1000; }
function hoursToMillis (hours) { return hours * 60 * 60 * 1000; }
function minutesToMillis (minutes) { return minutes * 60 * 1000; }
function secondsToMillis (seconds) { return seconds * 1000; }

function getPlurality (number)
{
  if      (number === 1)  { return 'one'    }
  else if (number === 2)  { return 'two'    }
  else if (number <=  10) { return 'plural' }
  else                    { return 'one'    }
}

function getPlural (timeUnit, number)
{
  timeUnit = timeUnit || 'second'

  var x = {
    month:  {one: 'شهر', two: 'شهرين', plural: 'شهور'},
    week:   {one: 'أسبوع', two: 'أسبوعين', plural: 'أسابيع'},
    day:    {one: 'يوم', two: 'يومين', plural: 'أيام'},
    hour:   {one: 'ساعة', two: 'ساعتين', plural: 'ساعات'},
    minute: {one: 'دقيقة', two: 'دقيقتين', plural: 'دقائق'},
    second: {one: 'ثانية', two: 'ثانيتين', plural: 'ثواني'},
  };

  var plurality = getPlurality(number);

  if      (number === 1)        { return x[timeUnit].one                               }
  else if (plurality === 'two') { return x[timeUnit].two;                              }
  else                          { return ('' + number + ' ' + x[timeUnit][plurality]); }
}

function f (currentTimeUnit, chosenTimeUnit, time)
{
  var ranks = {second: 0, minute: 1, hour: 2, day: 3, week: 4, month: 5, auto: 6}
  return ranks[currentTimeUnit] > ranks[chosenTimeUnit] ? 0 : time
}

function period (dateMilliseconds, timeUnit)
{
  var time = dateMilliseconds - Date.now()
  var none = {months: 0, weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0}

  if      (time < 0) { return none }
  else if (time > 0)
  {
    var remainingMonths = f('month', timeUnit, parseInt(time / 1000 / 60 / 60 / 24 / 30))
    var remainingWeeks = f('week', timeUnit, parseInt((time - monthsToMillis(remainingMonths)) / 1000 / 60 / 60 / 24 / 7))
    var remainingDays = f('day', timeUnit, parseInt((time - monthsToMillis(remainingMonths) - weeksToMillis(remainingWeeks)) / 1000 / 60 / 60 / 24))
    var remainingHours = f('hour', timeUnit, parseInt((time - monthsToMillis(remainingMonths) - weeksToMillis(remainingWeeks) - daysToMillis(remainingDays)) / 1000 / 60 / 60))
    var remainingMinutes = f('minute', timeUnit, parseInt((time - monthsToMillis(remainingMonths) - weeksToMillis(remainingWeeks) - daysToMillis(remainingDays) - hoursToMillis(remainingHours)) / 1000 / 60))
    var remainingSeconds = f('second', timeUnit, parseInt((time - monthsToMillis(remainingMonths) - weeksToMillis(remainingWeeks) - daysToMillis(remainingDays) - hoursToMillis(remainingHours) - minutesToMillis(remainingMinutes)) / 1000))

    return {months: remainingMonths, weeks: remainingWeeks, days: remainingDays, hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds};
  }
  else { return none }
}

var HidableElement = React.createClass({

  render: function ()
  {
    return <span>{this.props.isHidden ? '' : this.props.children}</span>
  }
})

var SplitChildren = React.createClass({

  generateMap: function (separator)
  {
    return function (child, index, xs)
    {
      return (<span>
        {child}
        <HidableElement isHidden={index === xs.length - 1}>
          {separator}
        </HidableElement>
      </span>);
    }
  },
  render: function ()
  {
    return (<span>{this.props.children.map(this.generateMap(this.props.separator))}</span>)
  }
})

var RemainderPanel = React.createClass({

  getInitialState: function ()
  {
    var selectedTimeUnit = 'auto'
    return {remaining: period(this.props.date, selectedTimeUnit), selectedTimeUnit: selectedTimeUnit};
  },
  componentDidMount: function ()
  {
    this.interval = setInterval(this.tick.bind(this), 1000)
  },
  componentWillUnmount: function ()
  {
    clearInterval(this.interval)
  },
  tick: function ()
  {
    this.setState({remaining: period(this.props.date, this.state.selectedTimeUnit)})
  },
  map: function (pair, index, xs)
  {
    return (<span>{getPlural(pair[0], pair[1])}</span>);
  },
  render: function ()
  {
    this.state.xs = [
      ['month', this.state.remaining.months],
      ['week', this.state.remaining.weeks],
      ['day', this.state.remaining.days],
      ['hour', this.state.remaining.hours],
      ['minute', this.state.remaining.minutes],
      ['second', this.state.remaining.seconds],
    ]

    this.state.xs = this.state.xs.filter(function (pair) { return pair[1] !== 0; });

    return (
     <HidableElement isHidden={this.props.date < Date.now()}>
      <article className={this.getPanelClass()}>
        <header className="panel-heading">
          <h2 className="panel-title">{this.props.title}</h2>
        </header>
        <div className="panel-body" dir="rtl">
          <SplitChildren separator=" و ">{this.state.xs.map(this.map)}</SplitChildren>
        </div>
        <footer className="panel-footer">
          <div className="btn-group" role="group" aria-label="...">
            <button type="button" className={this.getButtonClass('hour')} onClick={this.selectTimeUnitCallback('hour')}>ساعات</button>
            <button type="button" className={this.getButtonClass('day')} onClick={this.selectTimeUnitCallback('day')}>أيام</button>
            <button type="button" className={this.getButtonClass('week')} onClick={this.selectTimeUnitCallback('week')}>أسابيع</button>
            <button type="button" className={this.getButtonClass('month')} onClick={this.selectTimeUnitCallback('month')}>شهور</button>
            <button type="button" className={this.getButtonClass('auto')} onClick={this.selectTimeUnitCallback('auto')}>تلقائي</button>
          </div>
        </footer>
      </article>
    </HidableElement>)
  },
  getPanelClass: function ()
  {
    return this.props.style === 'success' ? 'panel panel-primary' : 'panel panel-danger'
  },
  getButtonClass: function (timeUnit)
  {
    if      (!this.isValidTimeUnit(timeUnit))            { return 'btn btn-default disabled' }
    else if (this.state.selectedTimeUnit === timeUnit)   { return 'btn btn-default active'   }
    else                                                 { return 'btn btn-default'          }
  },
  selectTimeUnitCallback: function (timeUnit)
  {
    return (() =>
    {
      if (this.isValidTimeUnit(timeUnit)) { this.setState({remaining: this.state.remaining, selectedTimeUnit: timeUnit}) }
    })
  },
  isValidTimeUnit: function (timeUnit)
  {
    var remaining = period(this.props.date, 'auto')
    return remaining[timeUnit + 's'] !== 0
  }
});

var Remainders = React.createClass({

  map: function (remainder)
  {
    return <RemainderPanel title={remainder.title} date={remainder.date} style={remainder.style} />
  },
  render: function ()
  {
    return <section>{this.props.remainders.map(this.map)}</section>
  }
})

// ReactDOM.render(<RemainderPanel title='رمضان' date={new Date(2016, 5, 6, 0).getTime()} />, document.getElementById('example0'));
var remainders = [
  {title: 'رمضان', date: new Date(2016, 5, 6, 0).getTime(), style: 'success'},
  {title: 'العشر الأواخر', date: new Date(2016, 5, 25, 0).getTime(), style: 'success'},
  {title: 'عيد الفطر', date: new Date(2016, 6, 6, 0).getTime(), style: 'success'},
  {title: 'عيد الأضحية', date: new Date(2016, 8, 11, 0).getTime(), style: 'success'},
  {title: 'بداية الدراسة', date: new Date(2016, 8, 18, 0).getTime(), style: 'danger'},
]

ReactDOM.render(<Remainders remainders={remainders} />, document.getElementById('example0'))