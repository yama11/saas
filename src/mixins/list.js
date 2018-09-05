/**
 * 列表页公共逻辑
 *
 * @author  huojinzhao
 */

export default {
  data: () => ({
    // 页面loading状态
    loading: false,
  }),

  methods: {
    /**
     * 确认删除Table中的某一项
     *
     * @param id          {number}    目标id
     * @param list        {Array}     目标所在数组列表
     * @param appellation {string}    目标称呼
     * @param uri         {string}    删除接口前缀
     * @param tableHref   {object}    数据渲染表格的ref
     */
    $_listMixin_alertDeleteItem(id, list, appellation, uri, tableHref) {
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
          this.$_listMixin_deleteItem(id, list, uri, tableHref);
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
    $_listMixin_confirmDeleteItem(id, list, message, uri, tableHref) {
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

          this.$_listMixin_deleteItem(id, list, uri, tableHref, header);
        })
        .catch(() => {});
    },

    $_listMixin_deleteItem(id, list, uri, tableHref, header) {
      return this.$http.delete(`${uri}/${id}`, header)
        .then(() => {
          const index = list.findIndex(item => item.id === id);

          if (index === -1) return;

          if (!tableHref) {
            list.splice(index, 1);
          }

          this.$alert(
            '删除成功',
            '删除确认',
            {
              confirmButtonText: '我知道了',
              type: 'success',
              confirmButtonClass: 'success',
            })
            .then(() => {
              if (tableHref) {
                tableHref.getList();
              }
            });
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

    $_listMixin_getList(uri, query = this.$route.query) {
      this.loading = true;

      const search = Object.keys(query)
        .reduce((acc, key, index) => {
          const prefix = index ? '&' : '?';

          return `${acc}${prefix}${key}=${query[key]}`;
        }, '');

      return this.$http.get(`${uri}${search}`)
        .then((data) => {
          this.loading = false;

          return data;
        })
        .catch((error) => {
          this.loading = false;

          this.$message.error('数据请求发生错误');

          throw error;
        });
    },

    /**
     * 改变每页条数
     * @param {number} per_page 每页条数
     */
    $_listMixin_changeSize(per_page) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page: 1,
          per_page,
        },
      });
    },

    /**
     * 翻页
     * @param {number} page 当前页数
     */
    $_listMixin_changeIndex(page) {
      this.$router.push({
        query: {
          ...this.$route.query,
          page,
        },
      });
    },
  },
};
