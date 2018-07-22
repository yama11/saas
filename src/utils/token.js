/**
 * @overview token业务处理
 */

const get = () => localStorage.getItem('token');

const remove = () => {
  localStorage.removeItem('token');
};

const set = (token) => {
  localStorage.setItem('token', token);
};

export default {
  remove,
  set,
  get,
};
