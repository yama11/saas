<script>
/**
 * @overview  机构结算  - 机构列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';
import { token } from '@/utils';

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
        { prop: 'payment_method_name', label: '付款方式' },
      ],

      payment_method: [],

      status: [],

    };
  },
  computed: {
    searchArr() {
      const column = [
        { prop: 'dealer_name', label: '区域运营商' },
        { prop: 'year', label: '结算年份' },
        { prop: 'month', label: '结算月份' },
      ];

      const searchList = [
        { selectValue: this.payment_method, componentType: 'AppSearchStatus', searchType: 'payment_method', placeholder: '选择付款方式' },
        { selectValue: this.status, componentType: 'AppSearchStatus', searchType: 'status', placeholder: '请选择状态' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  created() {
    this.indexBefore();
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`finance.department.${key}`, text);
    },

    Permission(key, text) {
      return this.$permissions(`finance.class_hour_record.${key}`, text);
    },

    indexBefore() {
      this.$http.get('/finance/dealer/index_before')
        .then((res) => {
          this.payment_method = res.payment_method;
          this.status = res.status;
        })
        .catch((error) => {
          this.$message.error(error.message);
        });
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

    onCreate() {
      this.$router.push('/department-list');
    },

    onSkip() {
      this.$router.push('/department-consumption');
    },

    onExcel() {
      const tokens = token.get();

      const query = Object.keys(this.$route.query)
        .map(key => `${key}=${this.$route.query[key]}`)
        .join('&');

      const url = `${this.$http.baseURI}/finance/department/export?`;

      window.location.href = `${url}${query}&token=${tokens}`;
    },
  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label ="checkPermission('index')?'结算单':null"
    :skip-label ="Permission('index')?'课耗明细':null"
    :excel-label ="checkPermission('export')?'导出excel':null"
    title="机构结算"
    api="/finance/department/index"
    @create="onCreate"
    @skipPage="onSkip"
    @excelPage="onExcel"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('index')"
      slot-scope="props">
      <div
        class="dealer-class"
      >
        <span>总课耗数</span>
        :
        <span>{{ list.decreaseCount }}</span>&nbsp;&nbsp;&nbsp;
        <span>总金额</span>
        :
        <span>{{ list.decreaseMoney }}</span>&nbsp;&nbsp;&nbsp;
        <span>已结算金额</span>
        :
        <span>{{ list.decreaseMoneyAccounted }}</span>&nbsp;&nbsp;&nbsp;
        <span>待结算金额</span>
        :
        <span>{{ list.decreaseMoneyWaitAccounted }}</span>&nbsp;&nbsp;&nbsp;
      </div>
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
              v-if="checkPermission('student_index')"
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
