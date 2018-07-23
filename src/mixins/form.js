/**
 * 表单页公共逻辑
 *
 * @author  huojinzhao
 */
export default {
  data: () => ({
    from: null,
    isAuth: false,
  }),

  methods: {

    // 初始化
    $_formMixin_init(params) {
      // 请求表单before数据
      if (this.getFormBefore) {
        this.getFormBefore();
      }

      // 编辑时请求原数据
      if (params.id && this.getFormStore) {
        this.getFormStore(params.id);
      }
    },

    $_formMixin_authority(dataStr, dataObj) {
      let isAuth = false;
      if (!dataObj) {
        return isAuth;
      }
      const isDisable = dataObj.authority;

      if (!(isDisable instanceof Array)) {
        // eslint-disable-next-line
        isAuth = !isDisable;
      } else {
        // eslint-disable-next-line
        isAuth = (isDisable.indexOf(dataStr) === -1);
      }
      return isAuth;
    },

  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$_formMixin_init(to.params);
      // 记录如何进入表单页，用于离开表单页的逻辑
      // eslint-disable-next-line
      vm.from = from || null;
    });
  },
};
