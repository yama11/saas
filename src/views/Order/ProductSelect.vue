<script>
/**
 * @overview 商品中心 - 订单管理 - 订单创建 - 选择商品
 *
 * @author suyanping
 */

import { form } from '@/mixins';

export default {
  name: 'ProductSelect',

  mixins: [form],

  props: {
    productSelectList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {

      list: {},

      productCol: [
        { prop: 'name', label: '商品标题' },
        { prop: 'total_course_number', label: '总课时数' },
        { prop: 'unit_price', label: '售价' },
      ],

      searchObj: {
        page: 1,
        per_page: 10,
      },

      currSelectList: [],

      inputValue: '',

      selectValue: '',

      loading: false,
    };
  },

  computed: {
    selectWidth() {
      const maxLength = Math.max(
        ...this.searchList.map(({ label }) => label.length),
      );

      return `${maxLength + 4}em`;
    },

    searchList() {
      const column = [
        { prop: 'name', label: '商品标题' },
      ];

      return column;
    },
  },

  watch: {
    list() {
      this.currSelectList = [];
    },
  },

  created() {
    this.getProductList();
  },

  methods: {
    getProductList() {
      this.loading = true;

      if (this.selectValue) {
        this.searchObj = {
          page: 1,
          per_page: this.searchObj.per_page,
          'equal[status]': 2,
        };

        this.searchObj[`like[${this.selectValue}]`] = this.inputValue;
      }

      if (!this.selectValue) {
        this.searchObj = {
          page: this.searchObj.page,
          per_page: this.searchObj.per_page,
          'equal[status]': 2,
        };
      }

      const query = Object.keys(this.searchObj)
        .map(key => `${key}=${this.searchObj[key]}`)
        .join('&');

      this.$http.get(`/merchandise?${query}`)
        .then((data) => {
          this.list = data;
        })
        .catch(() => {
          this.$message.error('数据请求发生错误');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    onSizeChange(per_page) {
      this.searchObj = {
        ...this.searchObj,
        page: 1,
        per_page,
      };

      this.getProductList();
    },

    onCurrentChange(page) {
      this.searchObj = {
        ...this.searchObj,
        page,
      };

      this.getProductList();
    },

    getProductSelect(val) {
      if (val.length === 1) {
        this.currSelectList = val;

        this.sendProductList(val);

        return;
      }

      if (val.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(val[0], false);

        return;
      }

      if (this.currSelectList.length > 0) {
        this.sendProductList(val);
      }

      this.currSelectList = val;
    },

    sendProductList(val) {
      this.$emit('productList', val);
    },
  },
};
</script>

<template>
  <div
    v-loading="loading"
    class="product-select">

    <div class="product-select__search">
      <el-input
        v-model="inputValue"
        class="product-select__input"
        placeholder="请输入关键字进行搜索"
        size="small"
        @keyup.enter.native="getProductList"
      >
        <el-select
          slot="prepend"
          v-model="selectValue"
          :style="{ width: selectWidth }"
          placeholder="请选择"
        >
          <el-option
            v-for="column in searchList"
            :key="column.prop"
            :label="column.label"
            :value="column.prop"
          />
        </el-select>
      </el-input>

      <el-button
        slot="append"
        icon="el-icon-search"
        size="small"
        class="product-select__button"
        @click="getProductList"
      />
    </div>

    <div style="clear:both;"/>

    <div
      class="product-select__selected">
      <el-tag
        v-for="tag in productSelectList"
        :key="tag.id">
        {{ tag.name }}
      </el-tag>
    </div>

    <el-table
      ref="multipleTable"
      :data="list.data"
      class="product-select__table"
      @selection-change="getProductSelect"
    >

      <el-table-column
        type="selection"
        width="55"/>

      <el-table-column
        v-for="col in productCol"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
      />

    </el-table>

    <footer
      class="product-select__footer"
    >
      <el-pagination
        v-if="list.total > 10"
        :current-page="list.current_page"
        :page-sizes="[10, 20, 50, 100, 500]"
        :page-size="10"
        :total="list.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="onSizeChange"
        @current-change="onCurrentChange"
      />
    </footer>
  </div>
</template>

<style lang="postcss">
.product-select__search{
  width: 350px;
  float: right;
}

.product-select__input{
  width: 300px;
}

.product-select__table .has-gutter .el-table-column--selection label{
    display: none;
}

.product-select__selected{
  margin: 20px 0;
}

.product-select__footer{
  padding: 2em 0 1em;
  margin-top: auto;
}
</style>
