<script>
/**
 * @overview 转班管理  - 转班学生列表
 *
 * @author yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'ChangeForm',

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

      package_productions: [],

      formData: {
        id: null,
        student_id: null,
        parent_id: null,
        hour_id: null,
        original: {
          curriculum_id: null,
          class_id: null,
          department_id: null,
          scheme_id: null,
          hour_total: null,
          hour_remain: null,
          hour_finish: null,
        },
        current: {
          curriculum_id: null,
          class_id: null,
          department_id: null,
          scheme_id: null,
          hour_total: null,
          hour_remain: null,
        },
      },

      originalArr: {
        classes: {
          name: '',
        },
      },

      id: null,

      visible: false,

      scheme: {
        start_date: '',
        end_date: '',
      },

      schemeArr: [],

      schedule_remain: null,

      calendar: [],

      classes: [],

      // 定义星期
      toDay: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

    };
  },

  computed: {
    searchArr() {
      const column = [{ prop: 'student_name', label: '学习姓名' }];

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
      return this.$permissions(`dispatch_center.change.${key}`, text);
    },


    editPackage(id) {
      this.visible = true;

      this.$http.post('/change/create', { id })
        .then((res) => {
          this.formData.original = res.original;
          this.formData.original.class_id = res.original.classes.id;
          this.formData.original.curriculum_id = res.original.curriculum_id;
          this.formData.original.scheme_id = res.original.classes.scheme.id;

          this.formData.current = { ...res.current };
          this.formData.student_id = res.student_id;
          this.formData.parent_id = res.parent_id;
          this.formData.hour_id = res.hour_id;

          this.originalArr = res.original;
          this.scheme = res.original.classes.scheme;

          const currCourse = res.current
            .find(item => item.id === this.formData.original.curriculum_id);
          if (currCourse) {
            this.formData.current.curriculum_id = currCourse.id;

            const arrs = currCourse.scheme
              .filter(item => item.start_date);

            this.schemeArr = arrs
              .map(item => ({
                ...item,
                date: `${item.start_date.split(' ')[0]}~${item.end_date.split(' ')[0]}`,
              }));
          }
        });
    },

    changTime(id) {
      this.calendar = [];
      this.classes = [];

      const timeId = this.schemeArr
        .find(item => item.id === id);
      if (timeId) {
        this.calendar = timeId.calendar;
        this.formData.current.hour_remain = timeId.schedule_remain;
        this.formData.current.hour_total = timeId.schedule_total;
        this.schedule_remain = timeId.schedule_remain;
        this.classes = timeId.classes;
      }
    },

    changClass(id) {
      const classArr = this.classes
        .find(item => item.id === id);
      if (classArr) {
        this.formData.current.department_id = classArr.department_id;
      }
    },

    indexBefore() {
      this.$http.get('/change/index_before')
        .then((res) => {
          this.package_productions = res.package_productions;
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
    :columns="columns"
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
              @click="editPackage(scope.row.id)"
            >转班</el-button>

            <AppFormDialog
              :visible.sync="visible"
              :model="formData"
              url="/change"
              object="转班"
              label-width="7em"
              class="change-edition"
              width="550px"
              @on-submit="submitEdition"
            >
              <el-form-item
                label="转出课程"
                prop="curriculum_name"
              >
                <span>{{ formData.original.curriculum_name }}</span>
              </el-form-item>
              <el-form-item
                v-model="formData.original.class_id"
                label="转出班级"
                prop="name"

              >
                <span>{{ originalArr.classes.name }}</span>
              </el-form-item>
              <el-form-item
                label="转出上课时间"
              >
                <span>{{ scheme.start_date.split(' ')[0] }}
                  ~{{ scheme.end_date.split(' ')[0] }}</span><br>
                <span
                  v-for="(calendar,index) in scheme.calendar"
                  :key="index"
                  class="change-info__classtime__week"
                >
                  {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
                </span>
              </el-form-item>
              <el-form-item
                label="转出剩余课时"
              >
                <span>{{ formData.original.hour_remain }}</span>
              </el-form-item>
              <el-form-item
                label="转入上课时间"
                prop="class_id"
              >
                <el-select
                  v-model="formData.current.scheme_id"

                  width="150px"
                  placeholder="请选择上课时期"
                  @change="changTime(formData.current.scheme_id)"

                >
                  <el-option
                    v-for="role in schemeArr"
                    :key="role.id"
                    :label="role.date"
                    :value="role.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item
                label="上课时间"
              >
                <div
                  v-for="(calendar,index) in calendar"
                  :key="index"
                >
                  {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
                </div>

              </el-form-item>

              <el-form-item
                label="转入班级"
                prop="class_id"
              >
                <el-select
                  v-model="formData.current.class_id"
                  placeholder="请选择班级"
                  @change="changClass(formData.current.class_id)"
                >
                  <el-option
                    v-for="role in classes"
                    :key="role.id"
                    :label="role.name"
                    :value="role.id"
                  />
                </el-select>
              </el-form-item>


              <el-form-item
                v-model="formData.current.hour_remain"
                label="转入所需课时"
              >
                <span>{{ schedule_remain }}</span>
              </el-form-item>
            </AppFormDialog>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<style>
.change-info__classtime__week{
  margin-top: 10px;
  display: block;
}
.change-edition .el-select>.el-input{
  width: 217px;
}
</style>

