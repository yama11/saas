<script>
/**
 * @overview  机构结算  - 机构列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'DepartmentList',

  mixins: [list],

  data() {
    return {

      list: {},

      columns: [
        { prop: 'department_name', label: '培训机构' },
        { prop: 'dealer_name', label: '所属区域运营商' },
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
      return this.$permissions(`finance.department.${key}`, text);
    },

    departmentInfo(id) {
      this.$router.push(`/department-info/${id}`);
    },

    departmentDeal(id) {
      this.$router.push(`/department-deal/${id}`);
    },

    departmentDetail(id, year, month) {
      this.$router.push(`/department-detail/${id}_${year}_${month}`);
    },
  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    title="机构结算"
    api="/finance/department/index"
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
              @click="departmentDetail(scope.row.department_id,scope.row.year,scope.row.month)"
            >
              明细
            </el-button>
            <el-button
              v-if="scope.row.status === 0&&checkPermission('accounted')"
              size="small"
              @click="departmentDeal(scope.row.id)"
            >
              确认结算
            </el-button>
            <el-button
              v-else-if="checkPermission('detail')"
              size="small"
              @click="departmentInfo(scope.row.id)"
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
