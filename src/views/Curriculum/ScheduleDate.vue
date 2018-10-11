<script>
/**
 * @overview 课程管理 - 排班 - 选择时间
 *
 * @author suyanping
 */
import list from '@/mixins/list';
import { times } from '@/utils';

export default {
  name: 'ScheduleDate',

  filters: {
    getTime(value) {
      if (!value) {
        return '';
      }

      const date = new Date(`2018-08-06 ${value}`);

      const hours = `${date.getHours() < 10
        ? `0${date.getHours()}`
        : date.getHours()}`;

      const minutes = `${date.getMinutes() < 10
        ? `0${date.getMinutes()}`
        : date.getMinutes()}`;

      return `${hours}:${minutes}`;
    },
  },

  mixins: [list],

  props: {
    id: {
      type: Number,
      default: null,
    },

    schemeId: {
      type: Number,
      default: null,
    },

    schemeObj: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      list: {},

      pickerTime: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },

      weeks: [
        { day: 1, name: '周一' },
        { day: 2, name: '周二' },
        { day: 3, name: '周三' },
        { day: 4, name: '周四' },
        { day: 5, name: '周五' },
        { day: 6, name: '周六' },
        { day: 7, name: '周日' },
      ],

      columns: [
        { prop: 'name', label: '名称', width: 200 },
        { label: '时间',
          formatter: (row) => {
            let classTime = '';
            if (row.subsidiary.length > 0) {
              classTime = this.getContent(row.subsidiary);
            }
            return classTime;
          } },
      ],

      timeDialog: false,

      timeId: null,

      timeForm: {
        scheme_id: null,
        start_date: '',
        calendar: [],
      },

      timeRules: {
        start_date: [
          this.$rules.required('开始时间', 'date'),
        ],

        calendar: [
          this.$rules.required('时间', 'array'),
        ],
      },
    };
  },

  methods: {
    checkPermission(key, text) {
      return this.$permissions(`curriculum_center.curriculum.${key}`, text);
    },

    addTime() {
      if (!this.schemeId) {
        this.$message.error('请选择一个时间段');

        return;
      }

      this.timeDialog = true;

      this.timeId = null;

      this.timeForm = {
        scheme_id: this.schemeId,
        start_date: '',
        calendar: [],
      };

      if (!this.list.data) return;

      if (this.list.data.length > 0) {
        this.$refs.multipleTable.clearSelection();
      }
    },

    getTimeArr(val) {
      if (val.length === 1) {
        const subsidiary = val[0].subsidiary;

        this.timeForm.calendar = subsidiary.map(item => ({
          ...item,
          curriculum_id: this.id,
        }));

        return;
      }

      if (val.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(val[0], false);

        const subsidiary = val[val.length - 1].subsidiary;

        this.timeForm.calendar = subsidiary.map(item => ({
          ...item,
          curriculum_id: this.id,
        }));

        return;
      }

      this.timeForm.calendar = [];
    },

    submitTime(submit) {
      if (this.timeForm.start_date) {
        this.timeForm.start_date = times.dateChange(new Date(this.timeForm.start_date));
      }

      submit()
        .then(() => {
          this.$emit('getDateData');
        });
    },

    getContent(subsidiary) {
      const arrWeek = [];

      const arrTime = subsidiary
        .reduce((acc, item) => {
          const num = arrWeek.indexOf(item.day);

          if (num !== -1) {
            acc[num].timeStr += ` ${this.timeChange(item.start_time)}-${this.timeChange(item.end_time)}`;

            return acc;
          }

          arrWeek.push(item.day);

          const week = this.weeks[item.day - 1].name;

          acc.push({
            week_date: `${week}: `,
            day: item.day,
            timeStr: `${this.timeChange(item.start_time)}-${this.timeChange(item.end_time)}`,
          });

          return acc;
        }, []);

      arrTime.sort((a, b) => a.day - b.day);

      const strTime = arrTime
        .reduce((acc, { week_date, timeStr }) => `${acc}${week_date}${timeStr} `, '');

      return strTime;
    },

    timeChange(time) {
      let str = '';

      if (time !== '') {
        const timeArr = time.split(':');

        str = `${timeArr[0]}:${timeArr[1]}`;
      }

      return str;
    },
  },
};
</script>

<template>
  <div class="schedule-date">
    <el-button
      v-if="checkPermission('schedule_calendar_store')"
      size="small"
      @click="addTime">+选择时间</el-button>
    <div class="schedule-date-body__info">
      <div
        v-for="item in weeks"
        :key="item.name"
        :class="item.name === '周日'
          ? 'schedule-date-body__border'
        : ''">
        <p>{{ item.name }}</p>
        <span
          v-for="(timeItem,index) in schemeObj.calendar"
          v-if="timeItem.day === item.day"
          :key="index">
          {{ timeItem.start_time | getTime }}~{{ timeItem.end_time | getTime }}
          <br>
        </span>
      </div>
    </div>
    <span>
      开始上课日期
      <span v-if="schemeObj.start_date">
        {{ schemeObj.start_date.split(' ')[0] }}
      </span>
    </span>
    <span>
      结束上课日期
      <span v-if="schemeObj.end_date">
        {{ schemeObj.end_date.split(' ')[0] }}
      </span>
    </span>


    <AppFormDialog
      :visible.sync="timeDialog"
      :rules="timeRules"
      :model="timeForm"
      url="/curriculum/schedule/calendar"
      object="选择时间"
      width="1000px"
      label-width="8em"
      @on-submit="submitTime"
    >
      <el-form-item
        prop="start_date"
        label="开始上课日期"
      >
        <el-date-picker
          v-model="timeForm.start_date"
          :picker-options="pickerTime"
          type="date"
          format="yyyy-MM-dd"
          placeholder="开始日期"/>
      </el-form-item>

      <el-form-item
        prop="calendar"
        label=""
        class="scheme-timeTable-list__error"
      >

        <AppList
          ref="list"
          :list.sync="list"
          :exit-url="false"
          class="scheme-timeTable-list"
          api="/timetable"
          title=""
        >

          <template slot-scope="{ listData }">
            <el-table
              ref="multipleTable"
              :data="listData"
              max-height="387"
              border
              class="time-dialog__table"
              @selection-change="getTimeArr"
            >
              <el-table-column
                type="selection"
                width="55"/>

              <el-table-column
                v-for="col in columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width="col.width"
                :formatter="col.formatter"
              />

            </el-table>

          </template>
        </AppList>
      </el-form-item>
    </AppFormDialog>
  </div>
</template>

<style lang="postcss">
.schedule-date{
  background: #F0F0F0;
  margin-bottom: 15px;
  & button{
    margin: 5px 10px;
  }
  &>span{
    display: inline-block;
    margin: 15px 20px;
  }
}

.schedule-date-body__info{
  border-top: 1px solid gainsboro;
  border-bottom: 1px solid gainsboro;
  display: flex;
  & div{
    display: inline-block;
    text-align:center;
    width: 14.2%;
    border-right: 1px solid gainsboro;
  }
}

.schedule-date-body__border{
  border: none !important;
}

.time-dialog__table{
  text-align: center;
  position: relative;
  left: -130px;
  top: -40px;
  & th{
    text-align: center;
  }
  & .has-gutter .el-table-column--selection label{
    display: none;
  }
}

.scheme-timeTable-list .list-footer{
  position: relative;
  left: -130px;
  top: -20px;
}

.scheme-timeTable-list__error .el-form-item__error{
  position: relative;
  left: -100px;
  top: -110px;
}
</style>
