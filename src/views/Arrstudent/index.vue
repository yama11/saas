<script>
/**
 * @overview  约课学生 - 约课学生列表
 *
 * @author  yehaifeng
 */
import list from '@/mixins/list';

export default {

  name: 'IntentionList',

  mixins: [list],

  data() {
    return {

      list: {},

      editionInfo: {
        schemes: [],
      },

      id: null,

      visible: false,

      formData: {
        id: null,
        scheme_id: null,
        class_id: null,
        start_date: null,
        end_date: null,
        quota: null,
        intention_ids: [],
        department_id: null,
      },

      toDay: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

      calendar: [],

      classes: [],

      capacity: null,

      student_number: null,

      radioArr: [],

      categories: [],

      rules: {
        scheme_id: [
          this.$rules.required('时间', 'number'),
        ],
        class_id: [
          this.$rules.required('班级', 'number'),
        ],
      },

    };
  },

  computed: {

    type() {
      return this.$route.params.type;
    },

    columns() {
      return [
        { prop: 'student_name', label: '学生姓名' },
        { prop: 'phone', label: '家长电话' },
        { prop: 'curriculum_name', label: '约课课程' },
        { prop: 'course_number', label: '课时数' },
        { prop: 'categories_name', label: '品类' },
        { prop: 'department_name', label: '约课机构' },
        { prop: 'start_date', label: '上课时间' },
        { prop: 'class_name', label: '约课班级' },
      ];
    },

    searchArr() {
      const column = [
        { prop: 'curriculum_name', label: '课程名称' },
        { prop: 'department_name', label: '培训机构' },
        { prop: 'class_name', label: '约课班级' },
      ];
      const department = this.$store.state.user.department_tree;

      const searchList = [
        { selectValue: department, componentType: 'AppSearchAddress', searchType: 'scope', placeholder: '选择机构' },
        { selectValue: this.categories,
          componentType: 'AppSearchCascader',
          searchType: ['category_name', 'product_name'] },
        { componentType: 'AppSearchColumn', searchType: column },
      ];
      return searchList;
    },
  },

  created() {
    this.toFormBefore();
  },

  methods: {

    checkPermission(key, text) {
      return this.$permissions(`schedule_center.intention.${key}`, text);
    },

    toFormBefore() {
      this.$http.get('/intention/index_before')
        .then((res) => {
          this.categories = res.categories
            .map((item) => {
              const children = item.product
                .map(proItem => ({
                  value: proItem.product_name,
                  label: proItem.product_name,
                }));

              return {
                value: item.category_name,
                label: item.category_name,
                children,
              };
            });
        });
    },

    toDeleteUser(id) {
      this.$router.push(`/intention-edit/${id}`);
    },

    changeRodio(value) {
      this.radioArr = value;
    },

    updateProcess(id, curriculumID) {
      this.formData = {};
      this.calendar = [];
      this.classes = [];
      this.student_number = null;
      this.capacity = null;

      this.formData.intention_ids = [];

      if (id) {
        this.visible = true;
        this.formData.intention_ids.push(id);

        this.getFormData(curriculumID);

        return;
      }
      const curriculumId = this.radioArr
        .map(item => item.curriculum_id);

      const curriculumArr = [...new Set(curriculumId)];

      if (curriculumArr.length !== 1) {
        this.$message.error('请选择相同课程的学生');
        return;
      }
      this.visible = true;
      this.formData.intention_ids = this.radioArr.map(item => item.id);

      this.getFormData(curriculumId[0]);
    },

    getFormData(cId) {
      this.$http.get(`/intention/dispatch/${cId}`)
        .then((res) => {
          const schemeList = res.schemes
            .filter(item => item.start_date);

          this.editionInfo.schemes = schemeList
            .map(item => ({
              ...item,
              date: `${item.start_date.split(' ')[0]}~${item.end_date.split(' ')[0]}`,
            }));
        });
    },

    submitEdition(submit) {
      submit().then(() => this.$refs.list.getList());
    },

    changTime(id) {
      const timeId = this.editionInfo.schemes
        .find(item => item.id === id);


      if (timeId) {
        this.calendar = timeId.calendar;
        this.classes = timeId.classes;
      }
    },

    changClass(id) {
      const classId = this.classes
        .find(item => item.id === id);

      if (classId) {
        this.capacity = classId.capacity;
        this.student_number = classId.student_number;
        this.formData.department_id = classId.department_id;
        this.formData.quota = this.capacity - this.student_number;
      }
    },

  },
};
</script>

<template>
  <AppList
    ref="list"
    :list.sync="list"
    create-label="调度"
    title="约课学生"
    api="/intention"
    @create="updateProcess"
  >
    <AppSearch
      v-if="checkPermission('index')"
      slot="search"
      :search-arr="searchArr"
    />
    <template
      v-if="checkPermission('index')"
      slot-scope="props">
      <el-table
        :data="props.listData"
        @selection-change="changeRodio"
      >
        <el-table-column
          type="selection"/>
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :formatter="column.formatter"
          :label="column.label"
        />
        <el-table-column
          label="操作"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="checkPermission('show')"
              type="small"
              size="small"
              @click="toDeleteUser(scope.row.id)"
            >查看</el-button>
            <el-button
              v-if="checkPermission('dispatcher')"
              size="small"
              @click="updateProcess(scope.row.id,scope.row.curriculum_id)"
            >调度</el-button>

            <AppFormDialog
              v-if="checkPermission('dispatching')"
              :visible.sync="visible"
              :model="formData"
              :rules="rules"
              label-width="8em"
              url="/intention"
              object="调度学生"
              class="process-edition"
              @on-submit="submitEdition"
            >
              <el-form-item
                label="时间"
                prop="scheme_id"
              >
                <el-select
                  v-model="formData.scheme_id"
                  placeholder="请选择时间"
                  @change="changTime(formData.scheme_id)"
                >
                  <el-option
                    v-for="role in editionInfo.schemes"
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
                label="班级"
                prop="class_id"
              >
                <el-select
                  v-model="formData.class_id"
                  placeholder="请选择班级"
                  @change="changClass(formData.class_id)"
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
                v-model="formData.quota"
                label="班级约课/容量"
              >
                <div
                  v-if="capacity"
                >
                  {{ student_number }}/{{ capacity }}
                </div>

              </el-form-item>
            </AppFormDialog>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </AppList>
</template>

<style>

</style>

