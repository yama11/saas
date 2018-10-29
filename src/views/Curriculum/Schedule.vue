<script>
/**
 * @overview 商品中心 - 课程管理 - 排课
 *
 * @author suyanping
 */

import list from '@/mixins/list';
import ScheduleDepartment from './ScheduleDepartment';
import ScheduleDate from './ScheduleDate';
import ScheduleClass from './ScheduleClass';

export default {
  name: 'CurriculumSchedule',

  components: {
    ScheduleDepartment,
    ScheduleDate,
    ScheduleClass,
  },

  filters: {
    getDate(value) {
      const date = new Date(value);

      const month = `${date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1}`;

      const day = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());

      return `${month}.${day}`;
    },
  },

  mixins: [list],

  data() {
    return {
      list: {},

      id: Number(this.$route.params.id),

      schemeId: null,

      formData: {
        name: '',
        categories_name: '',
        course_number: null,
        scheme: [],
      },

      formBefore: {
        dealers: [],
        departmentData: [],
      },

      departments: [],

      classes: [],

      scheme: {
        calendar: [],
        start_date: null,
        end_date: null,
        scheme_status: 1,
        scheme_status_name: '未开放预约',
      },

    };
  },

  created() {
    this.getCurriculum();
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`curriculum_center.curriculum.${key}`, text);
    },

    getCurriculum(val) {
      this.$http.get(`/curriculum/schedule/${this.id}`)
        .then((res) => {
          this.formData = res;

          if (val === 'department') {
            this.getDepartments(this.schemeId);

            return;
          }

          if (val === 'scheme') {
            this.getScheme(this.schemeId);

            return;
          }

          if (val === 'classes') {
            this.getClasses(this.schemeId);

            return;
          }

          if (this.schemeId) return;

          if (this.formData.scheme.length > 0) {
            this.schemeId = this.formData.scheme[0].id;

            this.getDepartments(this.schemeId);

            this.getScheme(this.schemeId);

            this.getClasses(this.schemeId);

            return;
          }

          this.addSchedule();
        });
    },

    addSchedule() {
      this.$http.post('/curriculum/schedule', { curriculum_id: this.id })
        .then(() => {
          this.getCurriculum();
        });
    },

    beginOpen() {
      if (!this.schemeId) {
        this.$message.error('请选择一个时间段');

        return;
      }

      this.$http.post(`/curriculum/schedule/begin/${this.schemeId}`)
        .then(() => {
          this.getCurriculum('scheme');
        });
    },

    pauseOpen() {
      if (!this.schemeId) {
        this.$message.error('请选择一个时间段');

        return;
      }

      this.$http.post(`/curriculum/schedule/pause/${this.schemeId}`)
        .then(() => {
          this.getCurriculum('scheme');
        });
    },

    changeSchemeId(id) {
      this.schemeId = id;

      this.getDepartments(this.schemeId);

      this.getScheme(this.schemeId);

      this.getClasses(this.schemeId);
    },

    getDepartments(id) {
      this.departments = [];

      const departmentList = this.formData.scheme
        .find(item => item.id === id);

      if (departmentList) {
        this.departments = departmentList.department;
      }
    },

    getDeleteList() {
      this.getCurriculum('department');
    },

    getScheme(id) {
      this.scheme = {
        calendar: [],
        start_date: null,
        end_date: null,
        scheme_status: 1,
        scheme_status_name: '未开放预约',
      };

      const schemeObj = this.formData.scheme
        .find(item => item.id === id);

      if (schemeObj) {
        this.scheme = schemeObj;
      }
    },

    getClasses(id) {
      this.classes = [];

      const classesList = this.formData.scheme
        .find(item => item.id === id);

      if (classesList) {
        this.classes = classesList.classes;
      }
    },
  },
};
</script>

<template>
  <div class="curriculum-schedule">
    <header>
      <h2 class="curriculum-schedule-header__title">排班</h2>
      <hr>

      <div class="curriculum-schedule-header__block">
        <p>课程名称： {{ formData.name }}</p>
        <p>所属品类： {{ formData.categories_name }}</p>
        <p>课时数： &nbsp;&nbsp;&nbsp;{{ formData.course_number }}</p>
      </div>
    </header>

    <div class="curriculum-schedule-body">
      <p>排课</p>

      <div class="curriculum-schedule-add">
        <span
          v-for="item in formData.scheme"
          :key="item.id"
          :class="schemeId === item.id
            ? 'curriculum-schedule-add__back'
          : ''"
          @click="changeSchemeId(item.id)">
          <span v-if="!item.start_date">待定时间</span>
          <span v-else>
            {{ item.start_date | getDate }}~{{ item.end_date | getDate }}
          </span>
        </span>
        <div @click="addSchedule">+</div>
      </div>

      <div class="curriculum-schedule-body__status">
        <el-button
          v-if="scheme.scheme_status === 2 && checkPermission('schedule_pause')"
          size="small"
          @click="pauseOpen()">
          暂停预约
        </el-button>
        <el-button
          v-if="scheme.scheme_status !== 2 && checkPermission('schedule_begin')"
          size="small"
          @click="beginOpen()">
          开始预约
        </el-button>
        <span>状态：{{ scheme.scheme_status_name }}</span>
      </div>

      <ScheduleDepartment
        :id="id"
        :scheme-id="schemeId"
        :departments="departments"
        @getDepartmentData="getCurriculum('department')"
        @getDeleteData="getDeleteList"/>

      <ScheduleDate
        :id="id"
        :scheme-id="schemeId"
        :scheme-obj="scheme"
        @getDateData="getCurriculum('scheme')"/>

      <ScheduleClass
        :id="id"
        :scheme-id="schemeId"
        :classes="classes"
        :departments="departments"
        @getClassesData="getCurriculum('classes')"/>

    </div>

  </div>
</template>

<style lang="postcss">
.curriculum-schedule-header__title{
  font-size: 1rem;
  margin-bottom: 20px;
}

.curriculum-schedule-body{
  margin-top: 30px;
}

.curriculum-schedule-add{
  margin-bottom: 10px;
  &>span{
    cursor: pointer;
    display: inline-block;
    background: #D2D2D2;
    padding: 5px 10px;
    margin-right: 5px;
    margin-top: 5px;
  }
  & div{
    cursor: pointer;
    display: inline-block;
    background: #D2D2D2;
    padding: 5px 10px;
  }
}

.curriculum-schedule-add__back{
  background: #F0F0F0 !important;
}

.curriculum-schedule-body__status{
  background: #F0F0F0;
  padding: 5px 10px;
  height: 45px;
  & >span{
    line-height: 35px;
    float: right;
    color: #2400FA;
  }
}
</style>
