<script>
/**
 * @overview  经销商结算  - 经销商列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'DealerList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'dealer_name', label: '经销商' },
        { label: '结算月份',
          formatter: row => `
        ${row.year}-${row.month}
        `,
        },
        { prop: 'decrease_count', label: '课耗数' },
        { prop: 'decrease_money', label: '结算金额' },
        { prop: 'status_name', label: '状态' },
      ],

    };
  },
  computed: {
    searchArr() {
      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '请选择机构' },
      ];

      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`finance.dealer.${key}`, text);
    },

    dealerInfo(id) {
      this.$router.push(`/account-info/${id}`);
    },

    dealerDeal(id) {
      this.$router.push(`/account-deal/${id}`);
    },

    dealerDetail(id, year, month) {
      this.$router.push(`/account-detail/${id}_${year}_${month}`);
    },
  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    title="经销商结算"
    api="/finance/dealer/index"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
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
          width="200px"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="dealerDetail(scope.row.dealer_id,scope.row.year,scope.row.month)"
            >
              明细
            </el-button>
            <el-button
              v-if="scope.row.status === 0 && checkPermission('accounted')"
              size="small"
              @click="dealerDeal(scope.row.id)"
            >
              确认结算
            </el-button>
            <el-button
              v-else-if="checkPermission('detail')"
              size="small"
              @click="dealerInfo(scope.row.id)"
            >
              结算详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>


<style lang="postcss">

</style>
