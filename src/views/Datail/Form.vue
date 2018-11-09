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
      if (value.account_type === 5) {
        this.$router.push(`/quit-info/${value.instance_id}`);
      }
      if (value.account_type === 1 || value.account_type === 2) {
        this.$router.push(`/draw-info/${value.instance_id}`);
      }
      if (value.account_type === 3 || value.account_type === 4) {
        this.$router.push(`/order-info/${value.instance_id}`);
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
