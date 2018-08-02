/**
 * 公共验证规则
 * @author chenliangshan
 * @version 2018-03-02
 */

const verifyPassword = (
  source,
  key,
  identical,
  message,
) => (
  rule,
  val,
  callback,
) => {
  // eslint-disable-next-line
  (val === source[key]) === identical
    ? callback() : callback(message);
};

const Rules = {
  /**
   * 必填验证
   * @param {String} fieldName - 必填项的label名称，如“姓名”
   * @param {String} type - 数据类型，默认为string
   * @param {String} trigger - 触发方式，默认为‘blur,change’
   * @param {String} message - 提示信息，默认为‘{fieldName}不能为空’
   */
  required: (
    fieldName,
    type = 'string',
    trigger = 'blur,change',
    message = `${fieldName}不能为空`,
  ) => ({
    type,
    trigger,
    message,
    required: true,
  }),

  // 姓名验证（中文包含少数民族如：买买提·陈奕迅·阿凡提，英文名支持由空格和·分隔开）
  name: {
    // eslint-disable-next-line
    // pattern: /^([\u4e00-\u9fa5]+|[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*|([a-zA-Z]+\s?)+|[a-zA-Z]+(·[a-zA-Z]+)*)$/,
    pattern: /^([\u4e00-\u9fa5]+|[\u4e00-\u9fa5]+([\u4e00-\u9fa5]+)*)$/,
    message: '姓名格式不正确',
    trigger: 'blur',
  },

  // 输入正整数
  numbers: {
    pattern: /^[1-9]\d*$/,
    message: '请输入正整数',
    trigger: 'blur',
  },

  // 账号验证（支持数字、字母）
  userName: {
    pattern: /^(([a-zA-Z0-9]+\s?)+|[a-zA-Z0-9]*)$/,
    message: '账号格式不正确',
    trigger: 'blur',
  },

  // 真实姓名验证（支持数字、字母、汉字）
  realName: {
    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
    message: '姓名格式不正确',
    trigger: 'blur',
  },

  // 单个学校名称的验证
  schoolName: {
    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/,
    message: '名称格式不正确',
    trigger: 'blur,change',
  },

  // 多个学校名称的验证
  moreSchoolName: {
    pattern: /^\S[a-zA-Z\s\d\u4e00-\u9fa5]+\S$/,
    message: '名称格式不正确',
    trigger: 'blur',
  },

  // 商品标题的验证
  productTitle: {
    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{10,20}$/,
    message: '请输入10-20个数字、字母或汉字',
    trigger: 'blur',
  },

  // 商品简介的验证
  introduce: {
    pattern: /^.{10,35}$/,
    message: '请输入10-35个字符',
    trigger: 'blur',
  },

  // 商品售价的验证
  prices: {
    pattern: /(^[1-9]{1}[0-9]*$)|(^[0-9]*\.[0-9]{2}$)/,
    message: '请输入正整数或者保留两位小数',
    trigger: 'blur',
  },

  // 折扣的验证
  discount: {
    pattern: /^(0\.([0-9]){1,2}|1)$/,
    message: '请输入正确的折扣',
    trigger: 'blur',
  },

  // 评比项的验证
  evaluateRule: {
    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{0,30}$/,
    message: '最多输入30个数字、字母或汉字',
    trigger: 'blur',
  },

  // 手机号码验证
  mobile: {
    pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])\d{8}$/,
    message: '手机号码格式不正确',
    trigger: 'blur',
  },

  // 账号密码的验证规则
  userPassword: {
    pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
    message: '密码长度为6位-20位，必须包含数字和字母',
    trigger: 'blur',
  },

  // 密码格式校验
  password: (required = true) => [
    { required, message: '密码不能为空', triger: 'blur' },
    { min: 6, message: '密码长度不应小于6位', trigger: 'blur' },
  ],

  // 确认密码校验规则
  repassword: (
    source,
    key = 'password',
    identical = true,
    required = true,
    message = identical
      ? '两次输入的密码不一致'
      : '新密码应与旧密码不同',
  ) => [
    {
      required,
      message: '密码不能为空',
      triger: 'blur',
    },
    {
      min: 6,
      message: '密码长度不应小于6位',
      trigger: 'blur',
    },
    {
      validator: verifyPassword(source, key, identical, message),
      trigger: 'blur',
    },
  ],

  // 邮箱验证
  email: {
    type: 'email',
    message: '邮箱地址格式不正确',
    trigger: 'blur',
  },

  // 角色验证
  rolename: {
    pattern: /^[A-Za-z0-9\u4e00-\u9fa5]{0,30}$/,
    message: '仅支持数字、字母、汉字',
    trigger: 'blur',
  },

  // 角色描述验证
  roledescribe: {
    pattern: /^[A-Za-z0-9\u4e00-\u9fa5,./?:;""''|[\]{}~!@#$%^&*()]{0,100}$/,
    message: '角色描述格式有误',
    trigger: 'blur',
  },
};

export default Rules;
