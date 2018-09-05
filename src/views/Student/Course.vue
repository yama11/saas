<script>
/**
 * @overview 学员管理 - 课程列表
 *
 * @author yehaifeng
*/
import list from '@/mixins/list';

export default {

  name: 'StudentInfo',

  mixins: [list],


  data() {
    return {

      id: this.$route.params.id.split('_')[0],

      name: this.$route.params.id.split('_')[1],

      columns: [
        { prop: 'curriculum_name', label: '课程名称' },
        { label: '品类', formatter: row => (row.category_type === 1 ? '正常类型' : '试听类型') },
        { prop: 'hour_total', label: '课时数' },
        { prop: 'hour_finish', label: '已耗课时' },
        { prop: 'hour_freeze', label: '挂起课时' },
        { prop: 'hour_quit', label: '退班课时' },
        { prop: 'hour_change', label: '转班课时' },
        { prop: 'create_date', label: '约课时间' },
        { prop: 'department_name', label: '培训机构' },
        { label: '上课时间段',
          formatter: row =>
            `${row.start_date.split(' ')[0]}
        ~${row.end_date.split(' ')[0]}
        `,
        },
        { prop: 'class_name', label: '班级名称' },
        { prop: 'class_status_name', label: '状态' },
      ],
      list: {
        statics: {},
      },

      apiUrl: '',
    };
  },

  methods: {
    getClassHistory(id, schemeId) {
      this.$router.push(`/course-history/${id}_${schemeId}`);
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :api="'/member_center/student/curriculum/'+id"
    title="课程列表"
  >
    <template>
      <div
        class="course—class"
      >
        <span>学生</span>
        :
        <span>{{ name }}</span>&nbsp;&nbsp;&nbsp;
        <span>剩余可用课时</span>
        :
        <span>{{ list.statics.hour_remain }}</span>&nbsp;&nbsp;&nbsp;
        <span>挂起课时</span>
        :
        <span>{{ list.statics.hour_freeze }}</span>&nbsp;&nbsp;&nbsp;
        <span>已耗课时</span>
        :
        <span>{{ list.statics.hour_finish }}</span>&nbsp;&nbsp;&nbsp;
        <span>退班课时</span>
        :
        <span>{{ list.statics.hour_quit }}</span>
      </div>
      <el-table :data="list.hour">
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
              @click="getClassHistory(id,scope.row.scheme_id)"
            >查看上课历史</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<style lang="postcss">
.course—class{

}
</style>
