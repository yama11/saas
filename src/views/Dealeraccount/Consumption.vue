<script>
/**
 * @overview  区域运营商结算  - 课耗明细
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';
import { token } from '@/utils';

export default {

  name: 'DealerConsumption',

  mixins: [list],

  data() {
    return {
      list: {},

      columns: [
        { prop: 'department_name', label: '机构名称' },
        { prop: 'student_name', label: '学生姓名' },
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'decrease', label: '课耗数' },
        { prop: 'created_at', label: '课耗日期' },
      ],

    };
  },
  computed: {
    searchArr() {
      const column = [
        { prop: 'department_name', label: '机构名称' },
        { prop: 'student_name', label: '学生姓名' },
        { prop: 'curriculum_name', label: '课程名称' },
      ];
      const searchList = [
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`finance.dealer.${key}`, text);
    },

    Permission(key, text) {
      return this.$permissions(`finance.class_hour_record.${key}`, text);
    },

    onCreate() {
      this.$router.push('/account-list');
    },

    onSkip() {
      this.$router.push('/account-consumption');
    },

    onExcel() {
      const tokens = token.get();

      const query = Object.keys(this.$route.query)
        .map(key => `${key}=${this.$route.query[key]}`)
        .join('&');

      const url = `${this.$http.baseURI}/finance/class_hour_record/export?`;

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
    :excel-label ="Permission('export')?'导出excel':null"
    api="/finance/class_hour_record"
    title="区域运营商课耗明细"
    @create="onCreate"
    @skipPage="onSkip"
    @excelPage="onExcel"


  >
    <AppSearch
      v-if="Permission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="Permission('index')"
      slot-scope="props">
      <el-table :data="props.listData">
        <el-table-column
          v-for="col in columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :formatter="col.formatter"
        />
      </el-table>
    </template>
  </AppList>
</template>


<style lang="postcss">

</style>
