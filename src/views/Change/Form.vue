<script>
/**
 * @overview 转班管理  - 转班学生列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';
import ChangeEdition from './Edition';

export default {

  name: 'ChangeForm',

  components: {
    ChangeEdition,
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
            `${row.start_date.split(' ')[0]}
            ~${row.end_date.split(' ')[0]}
           `,
        },
        { prop: 'department_name', label: '机构名称' },
        { prop: 'class_name', label: '班级名称' },
        { prop: 'class_code', label: '班级编码' },
        { prop: 'remain_hour', label: '剩余课时' },
      ],

      list: {},

      id: null,

      visible: false,

      formData: {
        id: null,
        class_id: null,
        scheme_id: null,
        primordial: {
          classes: {
            scheme: {
              start_date: '',
              end_date: '',
            },
          },
        },
        current: {
          scheme: {},
        },
        schemeArr: [],
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
      return this.$permissions(`dispatch_center.change.${key}`, text);
    },


    changeClass(value, id) {
      this.visible = true;
      this.formData = {
        class_id: null,
        scheme_id: null,
        primordial: { classes: { scheme: { start_date: '', end_date: '' } } },
        current: { scheme: {} },
        schemeArr: [],
      };

      this.$http.post('/change/create', { id })
        .then((res) => {
          this.formData.primordial = res.primordial;
          this.formData.primordial.class_id = res.primordial.classes.id;
          this.formData.primordial.curriculum_id = res.primordial.curriculum_id;
          this.formData.primordial.scheme_id = res.primordial.classes.scheme.id;

          this.formData.current = { ...res.current };
          this.formData.student_id = res.student_id;
          this.formData.parent_id = res.parent_id;
          this.formData.hour_id = res.hour_id;

          this.formData.primordial.classes.scheme = res.primordial.classes.scheme;

          const currCourse = res.current
            .find(item => item.id === this.formData.primordial.curriculum_id);
          if (currCourse) {
            this.formData.current.curriculum_id = currCourse.id;

            const arrs = currCourse.scheme
              .filter(item => item.start_date);

            this.formData.schemeArr = arrs
              .map(item => ({
                ...item,
                date: `${item.start_date.split(' ')[0]}~${item.end_date.split(' ')[0]}`,
              }));
          }
        });
      this.id = value.id;
    },

    submitEdition() {
      this.$refs.list.getList();
    },
  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    api="/change/student"
    title="转班"
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
              @click="changeClass(scope.row,scope.row.id)"
            >转班</el-button>

          </template>
        </el-table-column>
      </el-table>
      <ChangeEdition
        :visible.sync="visible"
        :id="formData.id"
        :form-data="formData"
        width="458px"
        @getData="submitEdition"
      />
    </template>
  </AppList>
</template>

