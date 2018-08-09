<script>
/**
 * @overview 商品中心 - 商品管理
 *
 * @author suyanping
 */
import list from '@/mixins/list';

export default {
  name: 'ProductList',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'name', label: '商品标题' },
        { prop: 'brief', label: '商品简介' },
        { prop: 'total_course_number', label: '总课时数' },
        { prop: 'unit_price', label: '售价' },
        { prop: 'created_at', label: '创建时间' },
        { prop: 'shelve_time', label: '上架时间' },
        { prop: 'status_name', label: '状态' },
      ],

      merchandise_status: [],

    };
  },

  computed: {
    searchArr() {
      const column = [{ prop: 'curriculum_name', label: '商品标题' }];

      const searchList = [
        { selectValue: this.merchandise_status, componentType: 'AppSearchStatus', searchType: 'merchandise_status' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },
  },

  created() {
    this.getIndexBefore();
  },

  methods: {
    getIndexBefore() {
      this.$http.get('/merchandise/index_before')
        .then((res) => {
          this.merchandise_status = res.merchandise_status;
        });
    },

    createProduct() {
      this.$router.push('/product-create');
    },

    lookProductInfo(id) {
      this.$router.push(`/product-look/${id}_${id}`);
    },

    editProductInfo(id) {
      this.$router.push(`/product-edit/${id}`);
    },

    shelveProductInfo(id) {
      this.$http.post(`/merchandise/${id}/shelve`)
        .then(() => this.$refs.list.getList());
    },

    offProductInfo(id) {
      this.$http.post(`/merchandise/${id}/off_shelve`)
        .then(() => this.$refs.list.getList());
    },

    delProductInfo(id) {
      this.$_listMixin_alertDeleteItem(id, this.list.data, '优惠券', '/merchandise');
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    create-label="添加商品"
    class="product-list"
    api="/merchandise"
    title="商品管理"
    @create="createProduct()"
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

        <el-table-column
          label="操作"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== 2"
              size="small"
              @click="shelveProductInfo(scope.row.id)"
            >
              上架
            </el-button>
            <el-button
              v-else
              size="small"
              @click="offProductInfo(scope.row.id)"
            >
              下架
            </el-button>
            <el-button
              size="small"
              @click="lookProductInfo(scope.row.id)"
            >
              查看
            </el-button>
            <el-button
              size="small"
              @click="editProductInfo(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              @click="delProductInfo(scope.row.id)"
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
