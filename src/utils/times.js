/**
 * 时间转换的公共逻辑
 *
 * @author  suyanping
 *
 */

const dateChange = (date) => {
  if (date !== undefined) {
    const year = `${date.getFullYear()}-`;
    const month = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`;
    const day = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());
    return year + month + day;
  }
  return '';
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
