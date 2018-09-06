<script>

import { form } from '@/mixins';

export default{

  name: 'ChangeEdition',

  mixins: [form],

  props: {
    id: {
      type: Number,
      default: null,
    },

    visible: {
      type: Boolean,
      default: false,
    },

    // 编辑数据
    formData: {
      type: Object,
      default: null,
    },

  },

  data() {
    return {
      // 定义星期
      toDay: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

      calendar: [],

      classes: [],

      schedule_remain: null,

      rules: {
        scheme_id: [
          this.$rules.required('转入上课时间', 'number'),
        ],
        class_id: [
          this.$rules.required('转入班级', 'number'),
        ],
      },

    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.calendar = [];

        this.classes = [];

        this.schedule_remain = null;
      }
    },
  },

  methods: {
    changTime(id) {
      this.calendar = [];
      this.classes = [];

      const timeId = this.formData.schemeArr
        .find(item => item.id === id);
      this.formData.current.scheme_id = timeId.id;
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
      this.formData.current.class_id = classArr.id;
      if (classArr) {
        this.formData.current.department_id = classArr.department_id;
      }
    },

    submitEdition(submit) {
      submit().then(() => this.$emit('getData'));
    },
  },

};
</script>

<template>
  <AppFormDialog
    :visible="visible"
    :model="formData"
    :rules="rules"
    url="/change"
    object="转班"
    label-width="8em"
    class="change-edition"
    width="550px"
    @on-submit="submitEdition"
    @update:visible="value => $emit('update:visible', value)"
  >
    <el-form-item
      label="转出课程"
      prop="curriculum_name"
    >
      <span
        v-if="formData.original.curriculum_name"
      >{{ formData.original.curriculum_name }}</span>
    </el-form-item>
    <el-form-item
      v-model="formData.original.class_id"
      label="转出班级"
      prop="name"
    >
      <span>{{ formData.original.classes.name }}</span>
    </el-form-item>
    <el-form-item
      label="转出上课时间"
    >
      <span>{{ formData.original.classes.scheme.start_date.split(' ')[0] }}
        ~{{ formData.original.classes.scheme.end_date.split(' ')[0] }}</span>
      <br>
      <span
        class="change-edition__classtime"
      >
        <span
          v-for="(calendar,index) in formData.original.classes.scheme.calendar"
          :key="index"
          class="change-edition__classtime-span"
        >
          {{ toDay[calendar.day-1] }}&nbsp;{{ calendar.start_time }}~{{ calendar.end_time }}
        </span>
      </span>
    </el-form-item>
    <el-form-item
      label="转出剩余课时"
    >
      <span>{{ formData.original.hour_remain }}</span>
    </el-form-item>
    <el-form-item
      label="转入上课时间"
      prop="scheme_id"
    >
      <el-select
        v-model="formData.scheme_id"
        width="150px"
        placeholder="请选择上课时期"
        @change="changTime(formData.scheme_id)"
      >
        <el-option
          v-for="role in formData.schemeArr"
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
        class="change-edition__classtime"
      >
        <div
          v-for="(calendar,index) in calendar"
          v-if="calendar"
          :key="index"
          class="change-edition__classtime-span"
        >
          {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
        </div>
      </div>
    </el-form-item>
    <el-form-item
      label="转入班级"
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
      v-model="formData.current.hour_remain"
      label="转入所需课时"
      class="change-edition__time"
    >
      <span>{{ schedule_remain }}</span>
    </el-form-item>
  </AppFormDialog>
</template>

<style>
.change-edition .change-edition__classtime{
  display: block;
  height: 200px;
  overflow-y: scroll;
  margin-top: 10px;
}
.change-edition .change-edition__classtime-span{
  display: inline-block;
  margin-right: 10px;
}
.change-edition__time{
  margin-top: 10px;
}
.change-edition .el-select>.el-input{
  width: 217px;
}
.change-edition .el-form-item{
  margin-bottom:0;
}
</style>
