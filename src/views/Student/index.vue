<script>
/**
 * @desc 学生列表
 *
 * @author yehaifeng
*/
import list from '@/mixins/list';

export default {

  name: 'StudentList',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'name', label: '学生姓名' },
        { prop: 'total_score', label: '总积分' },
        { prop: 'client_phone', label: '家长手机号码' },
        { prop: 'client_name', label: '家长姓名' },
        { prop: 'gender_name', label: '学生性别' },
        { prop: 'birth_at', label: '出生年月日' },
        { prop: 'school_name', label: '生源学校' },
        { prop: 'grade_name', label: '年级' },
      ],

      list: {},
    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'name', label: '学生姓名' },
        { prop: 'client_phone', label: '家长手机号码' },
        { prop: 'client_name', label: '家长姓名' },
        { prop: 'school_name', label: '生源学校' },
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
      return this.$permissions(`member_center.student.${key}`, text);
    },
    onCreate() {
      this.$router.push('/student-create');
    },
    infoStudent(id) {
      this.$router.push(`/student-info/${id}`);
    },
    editStudent(id) {
      this.$router.push(`/student-edit/${id}`);
    },

    lookCourse(id, name) {
      this.$router.push(`/course-info/${id}_${name}`);
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    api="/member_center/student"
    title="学生管理"
    @create="onCreate"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('index')"
      slot-scope="props"
    >
      <el-table
        :data="props.listData"
      >
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
              v-if="checkPermission('show')"
              size="small"
              @click="infoStudent(scope.row.id)"
            >查看</el-button>
            <el-button
              v-if="checkPermission('update')"

              size="small"
              @click="editStudent(scope.row.id)"
            >编辑</el-button>
            <el-button
              v-if="checkPermission('curriculum')"
              size="small"
              @click="lookCourse(scope.row.id,scope.row.name)"
            >查看课程</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>

</template>


<style lang="postcss">
.student-list__img{
  width: 60px;
  height: 60px;
}
</style>
