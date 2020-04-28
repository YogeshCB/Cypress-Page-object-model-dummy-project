const months = [{
  name: "January",
  lastDay: "31"
}, {
  name: "February",
  lastDay: "28,29"
}, {
  name: "March",
  lastDay: "31"
}, {
  name: "April",
  lastDay: "30"
}, {
  name: "May",
  lastDay: "31"
}, {
  name: "June",
  lastDay: "30"
}, {
  name: "July",
  lastDay: "31"
}, {
  name: "August",
  lastDay: "31"
}, {
  name: "September",
  lastDay: "30"
}, {
  name: "October",
  lastDay: "31"
}, {
  name: "November",
  lastDay: "30"
}, {
  name: "December",
  lastDay: "31"
}];

const days = [{
  name: "Sunday"
}, {
  name: "Monday"
}, {
  name: "Tuesday"
}, {
  name: "Wednesday"
}, {
  name: "Thursday"
}, {
  name: "Friday"
}, {
  name: "Saturday"
}];

const isCurrentYear = (date1, date2 = new Date()) => date1.getFullYear() === date2.getFullYear();

const isPreviousYear = (date1, date2 = new Date()) => date1.getFullYear() === (date2.getFullYear() - 1);

const isCurrentMonth = (date1, date2 = new Date()) => date1.getMonth() === date2.getMonth();

const isPreviousMonth = (date1, date2 = new Date()) => date1.getMonth() === (date2.getMonth() - 1);

const isCurrentDate = (date1, date2 = new Date()) => date1.getDate() === date2.getDate();

const isPreviousDate = (date1, date2 = new Date()) => date1.getDate() === (date2.getDate() - 1);

const getFormattedDateValue = date => {
  const [digit1, digit2] = `${date < 10 ? '0' : ''}${date}`.split("");
  let suffix = 'th';
  if (digit1 !== '1') {
    if (+digit2 === 1) {
      suffix = 'st';
    } else if (+digit2 === 2) {
      suffix = 'nd';
    } else if (+digit2 === 3) {
      suffix = 'rd';
    }
  }
  return `${date}${suffix}`;
};

const getFormattedDate = (date, withYear = false) => `${days[date.getDay()].name}, ${months[date.getMonth()].name} ${getFormattedDateValue(date.getDate())}${withYear ? ` ${date.getFullYear()}` : ''}`;

export const dateFormatter = date => {
  const currentDate = new Date();
  const currentYear = isCurrentYear(date);
  if (currentYear) {
    if (isCurrentMonth(date)) {
      if (isCurrentDate(date)) {
        return "Today";
      } else if (isPreviousDate(date)) {
        return "Yesterday"
      }
    } else if (isPreviousMonth(date)) {
      const prevMonth = currentDate.getMonth() - 1;
      if (months[prevMonth].lastDay.indexOf(date.getDate()) > -1) {
        return "Yesterday"
      }
    }
  } else if (isPreviousYear(date) && date.getMonth() === 0 && currentDate.getMonth() === 11 && date.getDate() === 1 && currentDate.getDate() === 31) {
    return "Yesterday";
  }
  return getFormattedDate(date, !currentYear);
};

export const timeFormatter = date => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
};

export const getFullDate = date => `${dateFormatter(date)} ${timeFormatter(date)}`;

export const convertUTCDateToLocalDate = (date) => {
  var newDate = new Date(date.getTime() - date.getTimezoneOffset()*60*1000);
  return newDate;   
}
