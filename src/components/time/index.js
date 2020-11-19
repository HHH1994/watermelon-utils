export  const parseTime = (date, type) => {
  if (!date) {
    throw 'date为必传参数';
  }

  const d = new Date(date);

  let year = d.getFullYear(),
  month = d.getMonth() + 1,
  day = d.getDate();

  if (type === 'day') {
    return [year, formatNumberToStr(month), formatNumberToStr(day)].join('-');
  } else if (!type || type === 'time'){
    let hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds();
    return `${[year, formatNumberToStr(month), formatNumberToStr(day)].join('-')} ${[formatNumberToStr(hour), formatNumberToStr(minute), formatNumberToStr(second)].join(':')}`;
  }
};

const formatNumberToStr = (str) => {
  return str < 10 ?  `0${str}` : str;
}

// 获取指定月份的最后一天
export function getLastDate(date) {
  if (!date instanceof Date) {
    throw new Error('请传入Date类型')
  }
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return d.getDate();
}

export default {
  parseTime,
  getLastDate
}