<script>
/**
 * @overview 版本管理 - 版本详情
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from './components/InfoNote';

export default{
  name: 'PackageInfo',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,

      version: '',

      fullSize: null,

      incrementSize: null,

    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];

      const {
        production_name: productionName,
        full: Full,
        increment: Increment,
        update_type_name: updateTypeName,
        content: Content,
        update_count: updateCount,
        package_status_name: packageStatusName,
        created_at: createdAt,
        updated_at: updatedAt,
      } = this.data;

      return [
        {
          label: '产品',
          details: productionName,
        },
        {
          label: '全量安装包',
          details: Full,
        },
        {
          label: '增量安装包',
          details: Increment,
        },
        {
          label: '更新方式',
          details: updateTypeName,
        },
        {
          label: '更新内容',
          details: Content,
        },
        {
          label: '更新人数',
          details: updateCount,
        },
        {
          label: '状态',
          details: packageStatusName,
        },
        {
          label: '创建时间',
          details: createdAt,
        },
        {
          label: '更新时间',
          details: updatedAt,
        },
      ];
    },
  },

  created() {
    this.getOrderInfo();
  },

  methods: {

    getOrderInfo() {
      const url = `/package/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
          this.data.update_count = this.data.update_count.toString();
          this.version = this.data.version;
          this.fullSize = this.data.full_size;
          this.incrementSize = this.data.increment_size;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    disreguardRefund() {
      if (this.from.matched.length) {
        return this.$router.back();
      }

      const prefix = this.$route.path.match(/^\/\w+-/)[0];

      const location = (prefix && prefix.concat('list')) || '/';

      return this.$router.push(location);
    },
  },
};
</script>
<template>
  <div class="package-info">
    <header class="package-info__header">
      <h2 class="package-info__title">版本详情</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="package-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :version="version"
          :full-size="fullSize"
          :increment-size="incrementSize"
          v-bind="note"
        />
      </section>

      <div class="package-info__but">
        <el-button
          type="primary"
          @click="disreguardRefund"
        >
          确定
        </el-button>
      </div>

    </div>
  </div>
</template>

<style lang="postcss">
.package-info__title{
  padding-left: 1em;
}
.package-info__buyer{
  margin-top: 40px;
  padding-left: 4em;
}
.package-info__but{
  display: flex;
  justify-content: center;
}
.package-info-note{
  margin-bottom: 30px;
}
</style>

