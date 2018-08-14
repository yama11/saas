<script>
/**
 * @overview 商品中心 - 订单管理
 *
 * @author suyanping
 */
import list from '@/mixins/list';

export default {
  name: 'OrderList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'client_phone', label: '购买手机号' },
        { prop: 'student_name', label: '小孩' },
        { prop: 'merchandise_name', label: '商品名称' },
        { prop: 'order_time', label: '下单时间' },
        { prop: 'paid_money', label: '实付金额' },
        { prop: 'status_name', label: '订单状态' },
      ],

      order_status: [],
    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'client_phone', label: '手机号' },
        { prop: 'student_name', label: '小孩姓名' },
        { prop: 'merchandise_name', label: '商品名称' },
      ];

      const searchList = [
        { selectValue: this.order_status, componentType: 'AppSearchStatus', searchType: 'order_status' },
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
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

    lookOrderInfo(id) {
      this.$router.push(`/order-info/${id}`);
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    class="order-list"
    api="/order"
    title="订单管理"
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
