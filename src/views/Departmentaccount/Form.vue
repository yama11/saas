<script>
/**
 * @overview  机构结算  - 学生明细
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'DepartmentForm',

  mixins: [list],

  data() {
    return {

      list: {},

      id: this.$route.params.id.split('_')[0],

      year: this.$route.params.id.split('_')[1],

      month: this.$route.params.id.split('_')[2],

      columns: [
        { prop: 'student_name', label: '学生' },
        { prop: 'curriculum_name', label: '课程' },
        { prop: 'decrease_count', label: '课耗数' },
        { prop: 'decrease_money', label: '结算金额' },
      ],
    };
  },
};
</script>
<template>
  <AppList
    ref="list"
    :list.sync="list"
    :api="`/finance/department/student/${id}/${year}/${month}`"
    title="机构明细"
  >
    <template
      slot-scope="props">
      <span style="margin-left:10px;">机构 : {{ list.departmentName }}</span>
      <span style="margin-left:80px;">结算月份 : {{ list.date }}</span>
      <span style="margin-left:80px;">课耗数 : {{ list.decreaseCount }}</span>
      <span style="margin-left:80px;">结算金额 : {{ list.decreaseMoney }}</span>
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
