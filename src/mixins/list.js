/**
 * 列表页公共逻辑
 *
 * @author  huojinzhao
 */

export default {
  methods: {
    /**
     * 确认删除Table中的某一项
     *
     * @param id          {number}    目标id
     * @param list        {Array}     目标所在数组列表
     * @param appellation {string}    目标称呼
     * @param uri         {string}    删除接口前缀
     */
    $_listMixin_alertDeleteItem(id, list, appellation, uri) {
      this.$confirm(
        `确定删除该${appellation}？`,
        '删除确认',
        {
          showCancelButton: true,
          type: 'warning',
          confirmButtonText: '删除',
          confirmButtonClass: 'el-button--danger',
          // beforeClose,
        })
        .then(() => {
          this.$_listMixin_deleteItem(id, list, uri);
        })
        .catch(() => {});
    },

    /**
     * 密码式确认删除Table中的某一项
     *
     * @param id          {number}    目标id
     * @param list        {Array}     目标所在数组列表
     * @param message     {string}    删除提醒文案
     * @param uri         {string}    删除接口前缀
     */
    $_listMixin_confirmDeleteItem(id, list, message, uri) {
      this.$prompt(
        message,
        '确认删除',
        {
          inputType: 'password',
          inputPlaceholder: '请输入密码',
          inputPattern: /^\S{6}\S*$/,
          inputErrorMessage: '请填写正确的密码',
          confirmButtonText: '删除',
          confirmButtonClass: 'el-button--danger',
        },
      )
        .then(({ value }) => {
          const header = { CheckoutPassword: value };

          this.$_listMixin_deleteItem(id, list, uri, header);
        })
        .catch(() => {});
    },

    $_listMixin_deleteItem(id, list, uri, header) {
      return this.$http.delete(`${uri}/${id}`, header)
        .then(() => {
          const index = list.findIndex(item => item.id === id);

          if (index > -1) {
            list.splice(index, 1);

            this.$alert(
              '删除成功',
              '删除确认',
              {
                confirmButtonText: '我知道了',
                type: 'success',
                confirmButtonClass: 'success',
              });
          }
        })
        .catch(({ message }) => {
          this.$alert(
            message,
            '删除确认',
            {
              confirmButtonText: '我知道了',
              type: 'warning',
              confirmButtonClass: 'el-button--danger',
            });
        });
    },
  },
};
