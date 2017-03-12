import moment from 'moment';

const reducer = (acc, cur) => acc.add(cur.duration);

export function totalDuration(counts) {
  const initial = moment.duration(0);
  const total = counts.reduce(reducer, initial);
  const hours = total.asHours() === 0 ? '00' : Math.floor(total.asHours());
  return hours + ':' + moment.utc(total.asMilliseconds()).format('mm:ss');
}

export function totalCount(counts, timeFrame) {
  return flatten(counts)
    .filter(count => {
      const {date, cDate} = getDates(count.time, timeFrame);
      return date === cDate;
    });
}

function flatten(arr) {
  return arr.reduce((flat, toFlatten) => (
    flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  ), []);
}

function getDates(cTime, timeFrame='day') {
  if (timeFrame === 'day') {
    return {
      date: moment(Date.now()).format('MMMM Do YYYY'),
      cDate: cTime.format('MMMM Do YYYY')
    };
  } else if (timeFrame === 'week') {
    return {
      date: moment(Date.now()).format('ww YYYY'),
      cDate: cTime.format('ww YYYY')
    };
  } else if (timeFrame === 'month') {
    return {
      date: moment(Date.now()).format('MMMM YYYY'),
      cDate: cTime.format('MMMM YYYY')
    };
  }
}
