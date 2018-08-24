<script>
/**
 * @overview  用户提现  - 提现管理
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {
  name: 'DrawlList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'client_phone', label: '提现用户' },
        { prop: 'money', label: '提现金额' },
        { prop: 'draw_time', label: '提现时间' },
        { prop: 'draw_status_name', label: '状态' },
      ],

    };
  },
  computed: {
    searchArr() {
      const column = [
        { prop: 'client_phone', label: '提现用户' },
      ];

      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`finance.draw_money.${key}`, text);
    },

    drawInfo(id) {
      this.$router.push(`/draw-info/${id}`);
    },

    drawDeal(id) {
      this.$router.push(`/draw-deal/${id}`);
    },
  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    title="提现管理"
    api="/finance/draw_money"
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
              v-if="checkPermission('show')"
              size="small"
              @click="drawInfo(scope.row.id)"
            >
              查看
            </el-button>
            <el-button
              v-if="scope.row.draw_status === 1"
              size="small"
              @click="drawDeal(scope.row.id)"
            >
              打款处理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>


<style lang="postcss">

</style>
