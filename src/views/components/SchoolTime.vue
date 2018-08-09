
<script>
import form from '@/mixins/form';
import { times } from '@/utils';

export default {
  /**
 * @author  suyanping
 * @desc    上课时间的多选
 */

  name: 'SchoolTime',

  mixins: [form],

  props: {
    id: {
      type: Number,
      default: null,
    },

    weekMsg: {
      type: Array,
      default: () => [],
    },

    otherForm: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      initDate: times.dateChange(new Date()),

      weekList: this.getWeekList(this.weekMsg),
    };
  },

  computed: {
    defaultValue() {
      const dateTime = [new Date(`${this.initDate} 00:00:00`), new Date(`${this.initDate} 23:59:00`)];

      return dateTime;
    },
  },

  watch: {
    weekMsg(val) {
      this.weekList = this.getWeekList(val);
    },
  },

  methods: {
    addInput(countIndex) {
      const index_time = this.weekList
        .findIndex(item => countIndex === item.day);

      const oneVal = this.weekList[index_time].timeVal;

      if (oneVal[oneVal.length - 1].start_end !== '') {
        oneVal.push({ start_end: '' });
      }
    },

    changeCycle(listData, index, count) {
      const currDay = index + 1;

      const cycleArr = [];

      const cycleList = JSON.parse(JSON.stringify(listData));

      const data_val = this.weekList
        .find(item => item.day === currDay);

      const data_index = this.weekList[index].timeVal
        .findIndex(item => (item.start_end === null));

      if ((data_val.timeVal.length > 1) && (data_val.timeVal[count] !== undefined)) {
        if (data_val.timeVal[count].start_end === null) {
          this.weekList[index].timeVal.splice(data_index, 1);
        }
      }

      cycleList.forEach((item) => {
        const timeVal = item.timeVal;

        timeVal.forEach((oneTime, indexs) => {
          if (item.day !== currDay) {
            if (oneTime.start_end !== '') {
              this.getCyclesArr(cycleArr, item, oneTime);
            }

            return;
          }

          if (timeVal.length < 2) {
            this.getCyclesArr(cycleArr, item, oneTime);

            return;
          }

          const timeOne = oneTime.start_end;

          const timeTwo = timeVal[timeVal.length - 1].start_end;

          if (timeOne && !timeTwo) {
            this.getCyclesArr(cycleArr, item, oneTime);

            return;
          }

          if (!timeOne) {
            return;
          }

          const startTime = new Date(timeOne[0]).getTime() * 1;
          const endTime = new Date(timeOne[1]).getTime() * 1;

          const midTime_start = new Date(timeTwo[0]).getTime() * 1;
          const midTime_end = new Date(timeTwo[1]).getTime() * 1;

          if ((midTime_start > endTime) || (midTime_end < startTime)) {
            this.getCyclesArr(cycleArr, item, oneTime);

            return;
          }

          if (indexs !== (timeVal.length - 1)) {
            this.weekList[index].timeVal[count].start_end = '';

            return;
          }

          this.getCyclesArr(cycleArr, item, oneTime);
        });
      });

      this.$emit('getCycle', cycleArr);
    },

    getWeekList(cycleArr) {
      const weeekList = [
        { weekTitle: '星期一', day: 1, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期二', day: 2, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期三', day: 3, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期四', day: 4, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期五', day: 5, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期六', day: 6, timeVal: [{ start_end: '' }] },
        { weekTitle: '星期日', day: 7, timeVal: [{ start_end: '' }] },
      ];

      if (!this.id) {
        return weeekList;
      }

      cycleArr.forEach((itemCycle) => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth()}` : date.getMonth();
        const day = (date.getDate() < 10 ? `0${date.getDate()}` : date.getDate());

        const startArr = this.getTimeArr(itemCycle.start_time);

        const endArr = this.getTimeArr(itemCycle.end_time);

        const index_time = weeekList
          .findIndex(itemWeek => itemCycle.day === itemWeek.day);

        const oneWeek = weeekList[index_time].timeVal;

        if (oneWeek[0].start_end === '') {
          oneWeek.splice(oneWeek, 1, {
            start_end: [
              new Date(year, month, day, startArr[0], startArr[1], '00'),
              new Date(year, month, day, endArr[0], endArr[1], '59'),
            ],
          });

          return;
        }

        oneWeek.push({
          start_end: [
            new Date(year, month, day, startArr[0], startArr[1], '00'),
            new Date(year, month, day, endArr[0], endArr[1], '59'),
          ],
        });
      });

      return weeekList;
    },

    getTimeArr(timeStr) {
      const arrs = timeStr ? timeStr.split(':') : '';
      return arrs;
    },

    getCyclesArr(cycleArr, item, oneTime) {
      const isArray = oneTime.start_end instanceof Array;

      if (!isArray) {
        return cycleArr;
      }

      cycleArr.push({
        day: item.day,
        start_time: times.getTime(oneTime.start_end[0]),
        end_time: times.getTime(oneTime.start_end[1], 'other') });

      return cycleArr;
    },

  },
};
</script>

<template>
  <div class="school-time">
    <div>
      <el-row>
        <el-col
          v-for="(item,index) in weekList"
          :key="item.weekTitle"
          :span="3"
        >
          <p
            style="margin:0px;text-align:center">{{ item.weekTitle }}
          </p>
          <el-time-picker
            v-for="(countList,count) in item.timeVal"
            :key="count"
            :editable="false"
            v-model="countList.start_end"
            :disabled="$_formMixin_authority('cycle',otherForm.operation)"
            :default-value="defaultValue"
            arrow-control
            clearable
            is-range
            format="HH:mm"
            range-separator="-"
            style="width:160px"
            @input="changeCycle(weekList,index,count)"/>
          <el-button
            v-if="(!$_formMixin_authority('cycle',otherForm.operation))"
            size="small"
            style="width:160px"
            @click="addInput(index + 1)">+</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="postcss">
.school-time .el-range-input{
  width: 40px;
}
</style>

