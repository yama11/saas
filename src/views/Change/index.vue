<script>
/**
 * @overview 转班管理  - 转班管理列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'ChangeList',

  mixins: [list],

  data() {
    return {

      columns: [
        { prop: 'student_name', label: '学习姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'primordial.curriculum_name', label: '课程名称' },
        { prop: 'primordial.class_name', label: '转出班级' },
        { prop: 'primordial.hour_remain', label: '转出班级剩余课时' },
        { prop: 'current.class_name', label: '转入班级' },
        { prop: 'current.hour_remain', label: '转入班级所需课时' },
        { prop: 'done_date', label: '转班时间' },
      ],

      list: {},

      change_status: [],

    };
  },

  computed: {

    searchArr() {
      const column = [
        { prop: 'student_name', label: '学习姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'primordial.curriculum_name', label: '课程名称' },
      ];
      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '选择机构' },
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { componentType: 'AppSearchColumn', searchType: column },
        { selectValue: this.change_status, componentType: 'AppSearchStatus', searchType: 'change_status' },
      ];
      return searchList;
    },

  },

  created() {
    this.indexBefore();
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`dispatch_center.change.${key}`, text);
    },

    editPackage(id) {
      this.$router.push(`/change-info/${id}`);
    },

    disposePackage(id) {
      this.$router.push(`/change-deal/${id}`);
    },

    indexBefore() {
      this.$http.get('/change/index_before')
        .then((res) => {
          this.change_status = res.change_status;
        });
    },

    toCreateUser() {
      this.$router.push('/change-create');
    },

  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    create-label="转班"
    api="/change"
    title="转班管理"
    @create="toCreateUser"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('index')"
      slot-scope="props">
      <el-table :data="props.listData">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
        />
        <el-table-column
          label="操作"
          width="230px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.change_status !== 1 && checkPermission('show')"
              size="small"
              @click="editPackage(scope.row.id)"
            >查看</el-button>
            <el-button
              v-else-if="checkPermission('deal')"
              size="small"
              @click="disposePackage(scope.row.id)"
            >转班处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

