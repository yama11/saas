/**
 * 处理用户登录信息逻辑封装
 *
 * @author huojinzhao
 *
 * @desc 所有接口都是immutable
 * @type history = { rememberMe: boolean, records: record[] }
 * @type record = { username: string, password?: string }
 */

import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

const privateKey = 'aikaola180305';

/**
 * 还原加密历史信息字符串为解密字符串
 *
 * @param  {string} history
 *
 * @return {string} 解密字符串
 */
const decrypt = (history) => {
  const decrypted = AES.decrypt(history, privateKey);

  return decrypted.toString(encUtf8);
};

/**
 * 恢复用户历史信息
 *
 * @return {Object}
 */
const recover = () => {
  const history = localStorage.getItem('userHistory');

  return history ? JSON.parse(decrypt(history)) : null;
};

/**
 * 加密历史信息字符串
 *
 * @param  {string} history
 *
 * @return {string} 加密字符串
 */
const encrypt = (history) => {
  const encrypted = AES.encrypt(history, privateKey);

  return encrypted.toString();
};

/**
 * 保存用户历史信息
 *
 * @param {Object}  records     登录记录
 * @param {boolean} rememberMe  是否记住/还原密码
 *
 * @return void
 */
const preserve = ({ records, rememberMe }) => {
  const history = JSON.stringify({ records, rememberMe });

  localStorage.setItem('userHistory', encrypt(history));
};

/**
 * 删除与新记录相关的登录记录
 *
 * @param {Object}  record      新用户纪录
 * @param {Array}   records     登录记录列表
 *
 * @return {Array}    更新后的历史记录
 */
const deleteRecord = (record, records) => records
  .filter(item => item.username !== record.username);

/**
 * 加入新的登录记录
 *
 * @param {Object}  record      新用户纪录
 * @param {Array}   records     登录记录列表
 *
 * @return {Array}    更新后的历史记录
 */
const createRecord = (record, records) => {
  const list = [...records];

  list.unshift(record);

  return list;
};

/**
 * 更新用户登录记录
 *
 * @param {Object}  record      新用户纪录
 * @param {Array}   records     登录记录列表
 *
 * @return Array    更新后的历史记录
 */
const updateRecord = (record, records) => {
  const list = deleteRecord(record, records);

  return createRecord(record, list);
};

/**
 * 更新用户登录记录及相关配置
 *
 * @param   {Object}    record      新用户纪录
 * @param   {boolean}   rememberMe
 * @param   {Object}    records     登录记录列表
 *
 * @return  {Array}     更新后的用户历史信息
 */
const update = (record, rememberMe, history) => {
  const { password } = record;
  // 如果没有password，说明该记录无效，删除该登录记录
  const records = password
    ? updateRecord(record, history.records)
    : deleteRecord(record, history.records);

  return { rememberMe, records };
};

export default {
  recover,
  preserve,
  update,
};
