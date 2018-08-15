/**
 * 时间转换的公共逻辑
 *
 * @author  suyanping
 *
 */

const dateChange = (data, condition) => {
  if (data === undefined) {
    return '';
  }

  const date = new Date(data);
  const year = `${date.getFullYear()}-`;
  const month = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
  const day = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
  const hours = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`;
  const minutes = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:`;

  if (condition === 'zero') {
    return `${year + month + day} 00:00:00`;
  }

  if (condition === 'full') {
    return `${year + month + day} 23:59:59`;
  }

  if (condition === 'total') {
    return `${year + month + day} ${hours}${minutes}59`;
  }

  return year + month + day;
};

const getTime = (time, other) => {
  const date = new Date(time);
  const hours = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:`;
  const minutes = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:`;
  if (other) {
    return `${hours + minutes}59`;
  }
  return `${hours + minutes}00`;
};

export default {
  dateChange,
  getTime,
};
