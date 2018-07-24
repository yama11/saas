<template>
  <AppList
    :list.sync="list"
    :create-label="$permissions('user.student.store') ? '创建学生' : null"
    api="/student"
    title="学生管理"
    @create="onCreate"
  >
    <AppSearchIndex
      slot="search"
      :search-arr="[
        {componentType: 'DateSelect',searchType:'created_at'},
        {selectValue:columns,componentType: 'ColumnSearch',},
    ]"/>

    <template slot-scope="props">
      <el-table
        :data="props.listData"
        border>
        <!-- <el-table-column
          label="学生头像">
          <template slot-scope="scope">
            <img
              :src="scope.row.head_url"
              class="student-list__img">
          </template>
        </el-table-column> -->
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :formatter="column.formatter"
        />
        <el-table-column
          label="操作"
          width="260px"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="infoStudent(scope.row.id)"
            >查看</el-button>
            <el-button
              size="small"
              @click="editStudent(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="small"
              @click="lookCourse(scope.row.id)"
            >查看课程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>

</template>

<script>
/**
 * @desc 学生列表
 *
 * @author suyanping
*/
export default {
  name: 'StudentList',

  data() {
    return {
      columns: [
        { prop: 'name', label: '学生姓名', search: true },
        { prop: 'integrals', label: '总积分' },
        { prop: 'phone', label: '家长手机号码', search: true },
        { prop: 'school_name', label: '家长姓名' },
        { prop: 'school_name', label: '学生性别' },
        { prop: 'school_name', label: '出生年月日' },
        { prop: 'school_name', label: '生源学校' },
        { prop: 'grade_name', label: '年级' },
      ],
      list: {},
      datePicker: true,
    };
  },

  methods: {
    onCreate() {
      this.$router.push('/student-create');
    },
    infoStudent(id) {
      this.$router.push(`/student-look/${id}`);
    },
    editStudent(id) {
      this.$router.push(`/student-edit/${id}`);
    },

    lookCourse(id) {
      this.$router.push(`/course-look/${id}`);
    },
  },
};
</script>

<style lang="postcss">
.student-list__img{
  width: 60px;
  height: 60px;
}
</style>
