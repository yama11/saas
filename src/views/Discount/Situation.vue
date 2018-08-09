<script>
/**
 * @overview 商品中心 - 优惠券管理 - 优惠券领取情况
 *
 * @author suyanping
 */
import list from '@/mixins/list';

export default {
  name: 'DiscountSituation',

  mixins: [list],

  data() {
    return {
      list: {},

      id: this.$route.params.id,

      columns: [
        { prop: 'client_name', label: '微信昵称' },
        { prop: 'client_phone', label: '手机号码' },
        { prop: 'status_name', label: '状态' },
        { prop: 'created_at', label: '领取日期' },
        { prop: 'use_time', label: '使用时间' },
      ],

      status: [],

    };
  },

  computed: {
    situationApi() {
      return `/coupon/${this.id}/client_coupon`;
    },

    searchArr() {
      const searchList = [
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { selectValue: this.status, componentType: 'AppSearchStatus', searchType: 'client_coupon_status' },
      ];

      return searchList;
    },
  },

  created() {
    this.getIndexBefore();
  },

  methods: {
    getIndexBefore() {
      this.$http.get(`/coupon/${this.id}/client_coupon/index_before`)
        .then((res) => {
          this.status = res.client_coupon_status;
        });
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :api="situationApi"
    class="discount-situation"
    title="查看优惠券"
  >

    <AppSearch
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

      </el-table>

    </template>
  </AppList>
</template>

<style lang="postcss">

</style>
