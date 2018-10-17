<script>
/**
 * @overview 学生管理 - 查看课程 - 上课历史
 *
 * @author yehaifneg
*/
export default {
  name: 'StudentHistory',

  data() {
    return {
      studentId: this.$route.params.id.split('_')[0],

      curriculumId: this.$route.params.id.split('_')[1],

      columns: [
        { prop: 'name', label: '课程名称' },
        { label: '上课时间',
          formatter: row => `
            ${row.date} ${row.start_time}-${row.end_time}
          `,
        },
        { prop: 'teacher_name', label: '教师' },
        { prop: 'star_number', label: '获得星星' },
      ],

      list: {
        class: {},
        schedule: { data: [] },
        star_total: 0,
      },
    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'name', label: '课程名称' },
      ];

      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];

      return searchList;
    },

  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`member_center.student.${key}`, text);
    },
    getPerformance(id) {
      this.$router.push(`/student-performance/${this.studentId}_${id}`);
    },
  },
};
</script>
<template>
  <AppList
    :list.sync="list"
    :api="'/member_center/student/schedule/'+studentId+'/'+curriculumId"
    title="上课历史"
  >
    <AppSearch
      v-if="checkPermission('schedule')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('schedule')"
      slot-scope="props">
      <span style="margin-left:10px;">总星星: {{ list.star_number }}</span>
      <span style="margin-left:10px;">班级名称: {{ list.class.name }}</span>
      <span style="margin-left:10px;">辅师: {{ list.class.audience_name }}</span>
      <el-table :data="list.schedule.data">
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
              v-if="checkPermission('report')"
              size="small"
              @click="getPerformance(scope.row.id)"
            >学习报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>


<style lang="postcss">

</style>

