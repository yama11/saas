/**
 * 错误信息处理
 * @author chenliangshan
 * @version 2018/03/01
 * @param options {String} 自定义错误信息
 * @param options {Object} => { errors, status, message }
 * @param errors {Object}  异常错误信息
 * @param status {Object}  服务器错误信息
 * @param message {String} 自定义错误信息
 * @returns {Array}
 */
const errorHandler = (options) => {
  if (typeof options === 'string') {
    return [options];
  }
  const { errors, message } = options;
  if (errors) {
    return Object.values(errors)
      .reduce((result, item) => result.concat(item), []);
  } else if (message) {
    return [message];
  }
  return ['服务端错误，请联系网站管理员或稍后重试'];
};

export default errorHandler;
