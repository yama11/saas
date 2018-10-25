<script>
/* eslint-disable camelcase */
import errorHandler from '../AppFormAlert/errorHandler';

export default {
  name: 'AppList',

  components: {
    errorHandler,
  },

  props: {
    // 后端返回的列表数据
    list: {
      type: Object,
      default: () => ({}),
    },

    // 请求的接口
    api: {
      type: String,
      default: '',
    },

    // 是否将请求条件放在url上
    exitUrl: {
      type: Boolean,
      default: true,
    },

    // 固定的请求条件
    fixedQuery: {
      type: String,
      default: '',
    },

    // 该列表页title
    title: {
      type: String,
      required: true,
    },

    // 添加按钮的文案
    createLabel: {
      type: [String, Boolean],
      default: false,
    },

    // 跳转页面按钮的文案
    skipLabel: {
      type: [String, Boolean],
      default: false,
    },
  },

  data() {
    return {
      // 控制页面加载状态
      loading: false,

      searchObj: {
        page: 1,
        per_page: 10,
      },
    };
  },

  created() {
    if (!this.api) return;

    if (!this.exitUrl) {
      this.getData();

      return;
    }

    this.getList();

    this.$watch('$route.query', () => {
      this.getList();
    });
  },

  methods: {
    /**
     * 从url中获取参数，并依据参数获取列表数据
     */
    getList() {
      this.loading = true;

      let query = Object.keys(this.$route.query)
        .map(key => `${key}=${this.$route.query[key]}`)
        .join('&');

      if (this.fixedQuery) {
        query += `&${this.fixedQuery}`;
      }

      return this.$http.get(`${this.api}?${query}`)
        .then((data) => {
          this.$emit('update:list', data);
        })
        .catch((error) => {
          this.$message.error(errorHandler(error)[0]);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getData() {
      this.loading = true;

      const query = Object.keys(this.searchObj)
        .map(key => `${key}=${this.searchObj[key]}`)
        .join('&');

      this.$http.get(`${this.api}?${query}`)
        .then((data) => {
          this.$emit('update:list', data);
        })
        .catch(() => {
          this.$message.error('数据请求发生错误');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 改变每页条数
     * @param {number} per_page 每页条数
     */
    onSizeChange(per_page) {
      if (!this.exitUrl) {
        this.searchObj = {
          page: 1,
          per_page,
        };

        this.getData();

        return;
      }

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
    onCurrentChange(page) {
      if (!this.exitUrl) {
        this.searchObj = {
          ...this.searchObj,
          page,
        };

        this.getData();

        return;
      }

      this.$router.push({
        query: {
          ...this.$route.query,
          page,
        },
      });
    },
  },
};
</script>

<template>
  <div
    v-loading="loading"
    class="list"
  >
    <header class="list-header">
      <h2 class="list-header__title">{{ title }}</h2>
      <div class="list-header__filter">

        <!-- 自定义搜索 -->
        <slot
          name="search"/>

        <el-button
          v-if="createLabel"
          size="small"
          type="primary"
          @click="$emit('create')"
        >
          {{ createLabel }}
        </el-button>

        <el-button
          v-if="skipLabel"
          size="small"
          type="primary"
          @click="$emit('skipPage')"
        >
          {{ skipLabel }}
        </el-button>
      </div>
    </header>

    <div class="list-body">
      <slot :list-data="list.data"/>
    </div>

    <footer
      class="list-footer"
    >
      <el-pagination
        v-if="list.total > 10"
        :current-page="list.current_page"
        :page-sizes="[10, 20, 50, 100, 500]"
        :page-size="10"
        :total="list.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </footer>
  </div>
</template>

<style>
.list {
  display: flex;
  flex-direction: column;
  padding: 0 2em;
}

.list-header {
  display: flex;
  align-items: center;
  padding: 1em 0;
}

.list-header__title {
  font-size: 1rem;
}
.list-header__filter {
  margin-left: auto;
}

.list-header__input {
  width: 280px;
  margin-left: 1em;
}

.list-header__button {
  margin-left: 1em;
  margin-right: 2em;
}

.list-footer {
  padding: 2em 0 1em;
  margin-top: auto;
}
</style>
