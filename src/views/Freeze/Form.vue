<script>
/**
 * @overview 冻结管理  - 冻结列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'FreezeForm',

  mixins: [list],

  data() {
    return {
      columns: [
        { prop: 'student_name', label: '学习姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '课程名称' },
        { label: '上课时间',
          formatter: row =>
            `${row.start_date.split(' ')[0]}
          ~${row.end_date.split(' ')[0]}
          `,
        },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'class_name', label: '班级名称' },
        { prop: 'class_code', label: '班级编码' },
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
        hour_total: null,
        hour_remain: null,
        hour_finish: null,
        refund_money: null,
      },

    };
  },

  computed: {
    searchArr() {
      const column = [{ prop: 'name', label: '学习姓名' }];

      const searchList = [
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  created() {
    this.indexBefore();
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`dispatch_center.freeze.${key}`, text);
    },

    indexBefore() {
      this.$http.get('/freeze/index_before')
        .then(() => {

        });
    },

    freezeClass(id) {
      this.visible = true;

      this.$http.post('/freeze/create', { id })
        .then((res) => {
          this.formData = { ...res };
        });
    },

    submitEdition(submit) {
      submit()
        .then(() => this.$refs.list.getList());
    },

  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    :columns="columns"
    api="/freeze/student"
    title="冻结"
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
              v-if="checkPermission('audit')"
              size="small"
              @click="freezeClass(scope.row.id)"
            >冻结</el-button>
            <AppFormDialog
              :visible.sync="visible"
              :model="formData"
              url="/freeze"
              label-width="5em"
              object="冻结"
              width="500px"
              class="freeze-popup"
              @on-submit="submitEdition"
            >
              <span
                class="freeze-popup__span"
              >确定冻结该学生该课程?</span>
            </AppFormDialog>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<style>
.freeze-popup .el-form-item__content{
text-align: center;
}
.freeze-popup__span{
    height: 147px;
    display: block;
    font-size: 18px;
    text-align: center;
    padding-top: 20px;
}
</style>
