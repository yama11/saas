<script>
/**
 * @desc 课程列表
 *
 * @author suyanping
*/
export default {
  name: 'StudentInfo',

  data() {
    return {
      columns: [
        { prop: 'curriculum_name', label: '课程名称' },
        { label: '课程类型', formatter: row => (row.category_type === 1 ? '正常类型' : '试听类型') },
        { prop: 'course_number', label: '课时数' },
        { prop: 'course_remain', label: '已耗课时' },
        { prop: 'course_remain', label: '冻结课时' },
        { prop: 'course_remain', label: '退班课时' },
        { prop: 'course_remain', label: '转班课时' },
        { prop: 'date', label: '约课时间' },
        { prop: 'date', label: '培训机构' },
        { prop: 'date', label: '上课时间段' },
        { prop: 'classes_name', label: '班级名称' },
        { prop: 'contract_status_name', label: '状态' },
      ],
      list: {},
      apiUrl: '',
    };
  },
  methods: {
    getClassHistory(id) {
      this.$router.push(`/course-history/${this.$route.params.id}_${id}`);
    },
  },
};
</script>

<template>
  <AppList
    :list.sync="list"
    :api="'/student/' + $route.params.id + '/contract'"
    title="课程列表"
  >

    <template slot-scope="props">
      <el-table :data="list.contracts">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :formatter="column.formatter"
        />
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="getClassHistory(scope.row.curriculum_id)"
            >查看上课历史</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<style lang="postcss">

</style>
