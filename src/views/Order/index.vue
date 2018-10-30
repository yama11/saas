<script>
/**
 * @overview 商品中心 - 订单管理
 *
 * @author suyanping
 */
import list from '@/mixins/list';
import { token } from '@/utils';

export default {
  name: 'OrderList',

  mixins: [list],

  data() {
    return {
      list: {},


      order_status: [],
    };
  },

  computed: {
    searchArr() {
      const column = this.$store.state.roleType === 31
        ? [
          { prop: 'order_sn', label: '订单编号' },
          { prop: 'merchandise_name', label: '商品名称' },
        ]
        : [
          { prop: 'client_phone', label: '手机号' },
          { prop: 'student_name', label: '小孩姓名' },
          { prop: 'merchandise_name', label: '商品名称' },
        ];

      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '选择机构' },
        { selectValue: this.order_status, componentType: 'AppSearchStatus', searchType: 'order_status' },
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },

    columns() {
      const initList = [
        { prop: 'department_name', label: '机构' },
        { prop: 'merchandise_name', label: '商品名称' },
        { prop: 'order_time', label: '下单时间' },
        { prop: 'paid_money', label: '实付金额' },
        { prop: 'status_name', label: '订单状态' },
        { prop: 'order_source_name', label: '来源' },
      ];

      const columnsList = this.$store.state.roleType === 31
        ? [
          { prop: 'order_sn', label: '订单编号' },
          ...initList,
        ]
        : [
          { prop: 'client_phone', label: '手机号' },
          { prop: 'student_name', label: '小孩姓名' },
          ...initList,
        ];

      return columnsList;
    },
  },

  created() {
    this.getIndexBefore();
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`shop.order.${key}`, text);
    },

    getIndexBefore() {
      this.$http.get('/order/index_before')
        .then((res) => {
          this.order_status = res.order_status;
        });
    },

    createOrder() {
      this.$router.push('/order-create');
    },

    lookOrderInfo(id) {
      this.$router.push(`/order-info/${id}`);
    },

    exportExcel() {
      const tokens = token.get();

      const query = Object.keys(this.$route.query)
        .map(key => `${key}=${this.$route.query[key]}`)
        .join('&');

      const url = `${this.$http.baseURI}/order/export?`;

      window.location.href = `${url}${query}&token=${tokens}`;
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :create-label="checkPermission('batch_store') ? '批量创建订单' : null"
    :skip-label="checkPermission('export') ? '导出excel' : null"
    class="order-list"
    api="/order"
    title="订单管理"
    @create="createOrder"
    @skipPage="exportExcel"
  >

    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"/>

    <template slot-scope="{ listData }">

      <el-table
        :data="listData"
      >
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
        />

        <el-table-column
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('show')"
              size="small"
              @click="lookOrderInfo(scope.row.id)"
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
