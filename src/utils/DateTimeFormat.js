import moment from 'moment';
import 'moment-timezone';

export function DateTimeFormat(date) {

  const TimeZone = "Asia/Kolkata"

  if( date !== null){
    const convertedDate = moment.tz(date, TimeZone).format('YYYY-MM-DD  HH:mm:ss')
    return convertedDate;
  }

  return(" ")
}

export function DateFormat(date) {
  const TimeZone = "Asia/Kolkata"
  if( date !== null){
    const convertedDate = moment.tz(date, TimeZone).format('YYYY-MM-DD')
    return convertedDate;
  }
  return(" ")
}