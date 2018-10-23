<script>
/**
 * @overview  区域运营商结算  - 区域运营商明细
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {
  name: 'DealerForm',

  mixins: [list],

  data() {
    return {
      list: {},

      id: this.$route.params.id.split('_')[0],

      year: this.$route.params.id.split('_')[1],

      month: this.$route.params.id.split('_')[2],

      columns: [
        { prop: 'department_name', label: '机构' },
        { prop: 'decrease_count', label: '课耗数' },
        { prop: 'decrease_money', label: '结算金额' },
      ],

    };
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`finance.dealer.${key}`, text);
    },

    checkInfo(id, year, month) {
      this.$router.push(`/account-student/${id}_${year}_${month}`);
    },

  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    :api="`/finance/dealer/dealer_department/${id}/${year}/${month}`"
    title="机构结算"
  >
    <template
      v-if="checkPermission('department_index')"
      slot-scope="props">
      <span style="margin-left:10px;">区域运营商 : {{ list.dealerName }}</span>
      <span style="margin-left:80px;">结算月份 : {{ list.date }}</span>
      <span style="margin-left:80px;">课耗数 : {{ list.decreaseCount }}</span>
      <span style="margin-left:80px;">结算金额 : {{ list.decreaseMoney }}</span>
      <el-table :data="props.listData">
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />
        <el-table-column
          width="200px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('detail')"
              size="small"
              @click="checkInfo(scope.row.department_id,scope.row.year,scope.row.month)"
            >
              查看机构明细
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>


<style lang="postcss">

</style>
