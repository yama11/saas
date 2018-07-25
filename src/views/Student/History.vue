<template>
  <AppList
    :list.sync="list"
    :api="'/student/' + studentId + '/schedule/' + curriculumId"
    title="上课历史"
  >

    <template slot-scope="props">
      <span style="margin-left:10px;">总星星: {{ list.star_total }}</span>
      <el-table :data="list.schedules.data">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :formatter="column.formatter"
          :width="column.width ? column.width : undefined"
        />
        <el-table-column
          label="操作"
          width="180px"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="getPerformance(scope.row.id)"
            >学习报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<script>
/**
 * @desc 上课历史
 *
 * @author suyanping
*/
export default {
  name: 'StudentHistory',

  data() {
    return {
      studentId: this.$route.params.id.split('_')[0],
      curriculumId: this.$route.params.id.split('_')[1],
      columns: [
        { prop: 'classes_name', label: '班级名称', search: true },
        { prop: 'name', label: '课件名称', search: true },
        { prop: 'range', label: '上课时间' },
        { prop: 'teacher_name', label: '教师' },
        { prop: 'manager_teacher_name', label: '学管师' },
        { label: '评价', width: 100, formatter: row => `老师：${row.teacher_evaluate_name} 学生：${row.student_evaluate_name}` },
        { prop: 'star_number', label: '获得星星' },
      ],
      list: {
        schedules: { data: [] },
        star_total: 0,
      },
    };
  },

  methods: {
    getPerformance(id) {
      this.$router.push(`/course-performance/${this.studentId}_${id}`);
    },
  },
};
</script>

<style lang="postcss">

</style>

