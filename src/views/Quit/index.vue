<script>
/**
 * @overview 退班管理  - 退班管理列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'QuitList',

  mixins: [list],

  data() {
    return {

      columns: [
        { prop: 'student_name', label: '学生姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'hour_remain', label: '剩余课时' },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'class_name', label: '班级' },
        { prop: 'refund_money', label: '应退金额' },
        { prop: 'done_date', label: '退班时间' },
      ],

      list: {},

      quit_status: [],

      statusType: 1,

    };
  },

  computed: {

    searchArr() {
      const column = [
        { prop: 'student_name', label: '学生姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'curriculum_name', label: '课程名称' },
      ];
      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '选择机构' },
        { componentType: 'AppSearchDate', searchType: 'created_at' },
        { componentType: 'AppSearchColumn', searchType: column },
        { selectValue: this.quit_status, componentType: 'AppSearchStatus', searchType: 'quit_status' },
      ];
      return searchList;
    },
  },

  created() {
    this.indexBefore();
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`dispatch_center.quit.${key}`, text);
    },

    quitInfo(id) {
      this.$router.push(`/quit-info/${id}`);
    },

    quitDeal(id) {
      this.$router.push(`/quit-deal/${id}`);
    },

    indexBefore() {
      this.$http.get('/quit/index_before')
        .then((res) => {
          this.quit_status = res.quit_status;
        });
    },

    toQuitClass() {
      this.$router.push('/quit-create');
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    create-label="退班"
    api="/quit"
    title="退班管理"
    @create="toQuitClass"
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
              v-if="scope.row.quit_status !== 1 && checkPermission('show')"
              size="small"
              @click="quitInfo(scope.row.id)"
            >查看</el-button>
            <el-button
              v-else-if="checkPermission('audit')"
              size="small"
              @click="quitDeal(scope.row.id)"
            >退班处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>
