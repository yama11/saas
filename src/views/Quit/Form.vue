<script>
/**
 * @overview 退班管理  - 退班列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';
import QuitEdition from './Edition';


export default {

  name: 'QuitForm',

  components: {
    QuitEdition,
  },

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'student_name', label: '学习姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '课程名称' },
        { label: '上课时间',
          formatter: row =>
            `
            ${row.start_date.split(' ')[0]}
            ~${row.end_date.split(' ')[0]}
          `,
        },
        { prop: 'department_name', label: '机构名称' },
        { prop: 'class_name', label: '班级名称' },
        { prop: 'class_code', label: '班级编码' },
        { prop: 'remain_hour', label: '剩余课时' },
      ],

      list: {},

      visible: false,

      formData: {
        hour_id: null,
        student_id: null,
        parent_id: null,
        curriculum_id: null,
        department_id: null,
        scheme_id: null,
        class_id: null,
        hour_total: null,
        hour_remain: null,
        hour_finish: null,
        refund_money: null,
        discount: null,
        paid_money: null,
      },

      editionInfo: {
        id: null,
        visible: false,
        formData: {},
      },
    };
  },

  computed: {
    searchArr() {
      const column = [
        { prop: 'student_name', label: '学习姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'department_name', label: '机构名称' },
        { prop: 'class_name', label: '班级名称' },
        { prop: 'class_code', label: '班级编码' },
      ];

      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`dispatch_center.quit.${key}`, text);
    },

    formQuitClass(id) {
      this.editionInfo.visible = true;
      this.editionInfo.id = id;
      this.$http.post('/quit/create', { id })
        .then((res) => {
          this.editionInfo.formData = { ...res };
        })
        .catch(({ message }) => {
          this.$message.error(message);
        });
    },

    submitEdition(submit) {
      submit().then(() => this.$refs.list.getList());
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    api="/quit/student"
    title="退班"
  >
    <AppSearch
      v-if="checkPermission('student')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('student')"
      slot-scope="props">
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
              v-if="checkPermission('deal')"
              size="small"
              @click="formQuitClass(scope.row.id)"
            >退班</el-button>

            <QuitEdition
              :visible.sync="editionInfo.visible"
              :id="editionInfo.id"
              :form-data="editionInfo.formData"
              width="458px"
              @on-submit="submitEdition"
            />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>
