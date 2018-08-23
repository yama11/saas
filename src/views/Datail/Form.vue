<script>
/**
 * @overview  用户账户管理  - 用户账户列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'DatailList',

  mixins: [list],

  data() {
    return {

      id: this.$route.params.id,

      list: {},

      columns: [
        { label: '来源', prop: 'account_type_name' },
        { label: '金额',
          formatter: row => `
          ${row.add_subtract_name}${row.money}
          `,
        },
        { label: '剩余金额', prop: 'remain' },
        { label: '交易时间', prop: 'created_at' },
      ],

      formData: {},

    };
  },
  computed: {
    searchArr() {
      const column = [
        { prop: 'phone', label: '手机号' },
      ];

      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`finance.account_detail.${key}`, text);
    },

    checkInfo(value) {
      if (value.account_type_name === '退班') {
        this.$router.push(`/quit-info/${value.id}`);
      } else {
        this.$router.push(`/draw-info/${value.id}`);
      }
    },

  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    :api="`/finance/account_detail/${id}`"
    title="用户账户"
  >
    <template
      v-if="checkPermission('index')"
      slot-scope="props">
      <el-table :data="props.listData">
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />
        <el-table-column
          width="150px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('show')"
              size="small"
              @click="checkInfo(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>


<style lang="postcss">

</style>
