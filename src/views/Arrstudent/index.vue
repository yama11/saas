<script>
/**
 * @overview  约课学生 - 约课学生列表
 *
 * @author  yehaifeng
 */
import { list } from '@/mixins';

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

      arr: [],
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
  },

  methods: {

    toDeleteUser(id) {
      this.$router.push(`/intention-edit/${id}`);
    },

    changeRodio(value) {
      this.arr = value;
    },

    updateProcess(id) {
      const curriculumName = this.arr
        .map(item => item.curriculum_name);

      const curriculumArr = [...new Set(curriculumName)];

      if (curriculumArr.length !== 1 && !id) {
        this.$message.error('请选择相同课程的学生');
        return;
      }
      const curriculumId = this.arr.map(item => item.id);

      this.formData.intention_ids = [];
      this.id = id;
      this.visible = true;
      this.$http.get('/intention/dispatch/3')
        .then((res) => {
          this.editionInfo = { ...res };

          this.editionInfo.schemes = res.schemes
            .map(item => ({
              ...item,
              date: item.start_date ? `${item.start_date.split(' ')[0]}~${item.end_date.split(' ')[0]}` : 'null~null',
            }));
        });
      if (id) {
        this.formData.intention_ids.push(id);
      } else {
        this.formData.intention_ids = curriculumId;
      }
    },

    submitEdition(submit) {
      submit().then(() => this.$refs.list.getList());
    },

    updateList(listRef) {
      listRef.getList();
    },

    changTime(id) {
      this.calendar = [];
      this.classes = [];

      const timeId = this.editionInfo.schemes
        .find(item => item.id === id);


      if (timeId) {
        this.calendar = timeId.calendar;
        this.classes = timeId.classes;
      }
    },

    changClass(id) {
      this.capacity = null;
      this.student_number = null;

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
    :key="$route.path"
    :list.sync="list"
    create-label="调度"
    title="约课学生"
    api="/intention"
    @create="updateProcess"
  >
    <template slot-scope="props">
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
              type="small"
              size="small"
              @click="toDeleteUser(scope.row.id)"
            >查看</el-button>
            <el-button
              size="small"
              @click="updateProcess(scope.row.id)"

            >调度</el-button>

            <AppFormDialog
              :visible.sync="visible"
              :model="formData"
              label-width="5em"
              url="/intention"
              object="学生"
              class="process-edition"
              width="500px"
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

