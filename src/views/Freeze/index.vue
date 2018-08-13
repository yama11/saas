<script>
/**
 * @overview 冻结管理  - 冻结管理列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'FreezeList',

  mixins: [list],

  data() {
    return {

      columns: [
        { prop: 'student_name', label: '学习姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'hour_remain', label: '冻结课时' },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'class_name', label: '班级' },
        { prop: 'audit_date', label: '冻结时间' },
      ],

      list: {},

      freeze_status: [],

      statusType: 1,

    };
  },

  computed: {

    searchArr() {
      const searchList = [
        { componentType: 'AppSearchDate', searchType: 'data_level' },
        { selectValue: this.freeze_status, componentType: 'AppSearchStatus', searchType: 'freeze_status' },
      ];
      return searchList;
    },
  },

  created() {
    this.indexBefore();

    this.changeRoute();

    this.$watch('$route.query', () => {
      this.changeRoute();
    });
  },

  methods: {

    changeRoute() {
      const { page, per_page, ...search } = this.$route.query;

      const status = 'equal[freeze_status]';

      if (status in search) {
        const freezeType = search['equal[freeze_status]'];

        this.statusType = freezeType;
        return;
      }

      const query = {
        page: 1,
        per_page: 10,
        'equal[freeze_status]': 1,
      };

      this.$router.push({ query });

      this.$router.go(0);
    },

    freezeInfo(id) {
      this.$router.push(`/freeze-info/${id}`);
    },

    freezeDeal(id) {
      this.$router.push(`/freeze-deal/${id}`);
    },

    indexBefore() {
      this.$http.get('/freeze/index_before')
        .then((res) => {
          this.freeze_status = res.freeze_status;
        });
    },

    toCreateFreeze() {
      this.$router.push('/freeze-create');
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :columns="columns"
    create-label="冻结"
    api="/freeze"
    title="冻结管理"
    @create="toCreateFreeze"

  >
    <AppSearch
      slot="search"
      :search-arr="searchArr"
    />
    <template slot-scope="props">
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
              v-if="statusType !== '1'"
              size="small"
              @click="freezeInfo(scope.row.id)"
            >查看</el-button>
            <el-button
              v-else
              size="small"
              @click="freezeDeal(scope.row.id)"
            >冻结处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<style>

</style>
