<script>
/**
 * @overview 商品中心 - 优惠券管理
 *
 * @author suyanping
 */
import list from '@/mixins/list';
import { times } from '@/utils';

export default {
  name: 'DiscountList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'name', label: '优惠券名称' },
        { prop: 'type_name', label: '优惠类别' },
        { prop: 'condition_name', label: '领取条件' },

        { label: '领取有效期',
          formatter: (row) => {
            if (row.condition !== 3) {
              return `${times.dateChange(row.distribute_effect_time)}至${times.dateChange(row.distribute_expire_time)}`;
            }
            return '';
          } },

        { label: '领取/总发放数量', formatter: row => `${row.distributed_quantity}/${row.total_quantity}` },

        { prop: 'minimum_price', label: '消费最低金额' },

        { label: '使用有效期',
          formatter: (row) => {
            if (row.expire_type === 1) {
              return `${times.dateChange(row.expire_effect_time)}至${times.dateChange(row.expire_expire_time)}`;
            }
            return `领取后${row.expire_day}天有效`;
          } },

        { prop: 'created_at', label: '创建时间' },
      ],

    };
  },

  computed: {
    searchArr() {
      const column = [{ prop: 'name', label: '优惠券名称' }];

      const searchList = [
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  methods: {
    createDiscount() {
      this.$router.push('/discount-create');
    },

    editDiscount(id) {
      this.$router.push(`/discount-edit/${id}`);
    },

    discountShelve(id) {
      this.$http.post(`/coupon/${id}/shelve`)
        .then(() => this.$refs.list.getList());
    },

    discountOffShelve(id) {
      this.$http.post(`/coupon/${id}/off_shelve`)
        .then(() => this.$refs.list.getList());
    },

    discountSituation(id) {
      this.$router.push(`/discount-get/${id}`);
    },

    deleteDiscount(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '优惠券', '/coupon');
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    create-label="添加优惠券"
    class="discount"
    api="/coupon"
    title="优惠券管理"
    @create="createDiscount()"
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
          :formatter="col.formatter"
        />

        <el-table-column
          label="操作"
          width="350px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status === 3"
              size="small"
              @click="discountShelve(scope.row.id)"
            >
              上架
            </el-button>

            <el-button
              v-if="scope.row.status === 2"
              size="small"
              @click="discountOffShelve(scope.row.id)"
            >
              下架
            </el-button>

            <el-button
              size="small"
              @click="discountSituation(scope.row.id)"
            >
              领取情况
            </el-button>

            <el-button
              v-if="scope.row.can_edit"
              size="small"
              @click="editDiscount(scope.row.id)"
            >
              编辑
            </el-button>

            <el-button
              v-if="scope.row.can_delete"
              size="small"
              type="danger"
              @click="deleteDiscount(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>

    </template>
  </AppList>
</template>

<style lang="postcss">

</style>
