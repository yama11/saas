/**
 * 自定义表单组件公共配置
 *
 * @author  huojinzhao
 */
import AppForm from './Main';

export default {

  components: {
    VForm: AppForm,
  },

  inheritAttrs: false,

  props: {
    // 表单页标题主体
    object: {
      type: String,
      required: true,
    },

    // 表单提交地址
    url: {
      type: String,
      default: '',
    },

    // 后端最后提交的数据（对应model的处理）
    // 不绑定的话使用model
    value: {
      type: Object,
      default: null,
    },

    fixedTitle: {
      type: Boolean,
      default: false,
    },
  },


  computed: {
    // 当前编辑主体的ID
    targetID() {
      return this.id || this.$route.params.id || null;
    },

    // 表单页标题 创建&编辑 两种情况
    title() {
      const temp = this.targetID
        ? `编辑${this.object}`
        : `添加${this.object}`;

      return this.fixedTitle ? this.object : temp;
    },

    // 表单提交方法 创建&编辑 两种情况
    methodType() {
      return this.targetID ? 'put' : 'post';
    },

    // 表单提交成功的提示信息 创建&编辑 两种情况
    succeedMessage() {
      return `${this.title}成功`;
    },

    // 提交地址
    requestURL() {
      return this.targetID
        ? `${this.url}/${this.targetID}`
        : this.url;
    },

    // 提交数据，是否有处理数据？处理数据：model数据
    data() {
      return this.value || this.$attrs.model;
    },
  },

  methods: {
    /**
     * 触发表单提交 - 详细信息参见Main
     *
     * @param   {Function}  validate  - 总表单验证函数
     * @param   {Function}  callback  - 结果处理
     *
     * @return  {Promise}   submit    - 异步提交表单函数
     */
    submitForm(validate, callback) {
      const valid = validate();

      const submitSucceed = () => {
        callback();
        this.$message.success(this.succeedMessage);
        this.cancelForm();
      };

      const onlineSubmit = () => (
        valid
          ? this.$http[this.methodType](
            this.requestURL,
            this.data,
          )
            .then(submitSucceed)
            .catch(callback)
          : Promise.reject()
      );

      const offlineSubmit = () => new Promise((
        resolve,
        reject,
      ) => {
        if (valid) {
          submitSucceed();
          resolve();
        }

        reject();
      });

      return this.url
        ? this.$emit('on-submit', onlineSubmit)
        : this.$emit('on-submit', offlineSubmit);
    },

    /**
     * 提供el-form的api
     */
    validate(callback) {
      this.$refs.form.validate(callback);
    },

    validateField(...args) {
      this.$refs.form.validateField(...args);
    },

    clearValidate() {
      this.$refs.form.clearValidate();
    },
  },
};
