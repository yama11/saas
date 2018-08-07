<script>
/**
 * @overview  约课班级 - 约课列表
 *
 * @author  yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'ClassList',

  mixins: [list],

  data() {
    return {

      list: {},

      columns: [
        { prop: 'code', label: '班级编码' },
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'schedule_total', label: '课时数' },
        { prop: 'categories_name', label: '品类' },
        { prop: 'department_name', label: '机构名称' },
        { prop: 'classroom_name', label: '班级名称' },
        { label: '上课时间',
          formatter: row =>
            `
            ${row.start_date}
            至${row.end_date}
            `,
        },
        { label: '约课/满课人数',
          formatter: row =>
            `
          ${row.student_number}
          /${row.capacity}
          `,
        },
        { prop: 'class_status_name', label: '班级状态' },
      ],

      status: [],

    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'department_name', label: '校区' },
        { prop: 'classroom_name', label: '班级' },
      ];

      const searchList = [
        { selectValue: this.status, componentType: 'AppSearchStatus', searchType: 'status' },
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },
  created() {
    this.indexBefore();
  },

  methods: {
    indexBefore() {
      this.$http.get('/class/index_before')
        .then((res) => {
          this.status = res.status;
        });
    },

    editClass(id) {
      this.$router.push(`/class-info/${id}`);
    },

    deleteClass(id) {
      const url = `/class/ready/${id}`;
      this.$http.post(url)
        .then(() => {
          this.$refs.list.getList();
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

  },

};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :columns="columns"
    api="/class"
    title="约课班级"
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
          :formatter="column.formatter"
        />
        <el-table-column
          label="操作"
          width="230px"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="editClass(scope.row.id)"
            >查看</el-button>
            <el-button
              v-if="scope.row.class_status_name ==='未开班'"
              type="danger"
              size="small"
              @click="deleteClass(scope.row.id)"
            >
              开班
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>
