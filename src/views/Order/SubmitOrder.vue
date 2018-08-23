<script>
/**
 * @overview 商品中心 - 订单管理 - 订单创建 - 确认订单
 *
 * @author suyanping
 */

import { form } from '@/mixins';

export default {
  name: 'SubmitOrder',

  mixins: [form],

  props: {
    studentSelected: {
      type: Array,
      default: () => [],
    },

    productSelectList: {
      type: Array,
      default: () => [],
    },

    classTableList: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {

      weeks: [
        { day: 1, name: '周一' },
        { day: 2, name: '周二' },
        { day: 3, name: '周三' },
        { day: 4, name: '周四' },
        { day: 5, name: '周五' },
        { day: 6, name: '周六' },
        { day: 7, name: '周日' },
      ],

      studentCol: [
        { prop: 'name', label: '学生姓名' },
        { prop: 'client_phone', label: '家长手机号码' },
        { prop: 'client_name', label: '家长姓名' },
        { prop: 'gender_name', label: '学生性别' },
        { prop: 'birth_at', label: '出生年月日' },
        { prop: 'school_name', label: '生源学校' },
        { prop: 'grade_name', label: '年级' },
      ],

      classCol: [
        { prop: 'curriculum.name', label: '课程名称' },
        { prop: 'curriculum.category_name', label: '品类' },
        { prop: 'curriculum.course_number', label: '课时数' },
        { prop: 'curriculum.price', label: '课时单价' },
        { prop: 'curriculum.refund_rate', label: '扣课折扣' },
        { prop: 'price', label: '课程金额' },
        { label: '上课时间',
          formatter: (row) => {
            let classTime = '';

            if (!row.scheme.calendar) {
              return classTime;
            }

            if (row.scheme.calendar.length > 0) {
              classTime = row.scheme.date + this.getContent(row.scheme.calendar);
            }
            return classTime;
          },
        },
        { prop: 'department.name', label: '机构' },
        { prop: 'class.name', label: '班级' },
      ],

      classList: [],
    };
  },

  computed: {
    productInfo() {
      const obj = {
        name: this.productSelectList[0].name,
        number: this.productSelectList[0].total_course_number,
        price: this.productSelectList[0].unit_price,
      };

      return obj;
    },
  },

  created() {

  },

  methods: {
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
  <div class="submit-order">

    <el-table
      :data="studentSelected"
      max-height="300"
    >

      <el-table-column
        v-for="col in studentCol"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
      />

    </el-table>


    <div class="submit-order__product">
      <span>购买商品：{{ productInfo.name }}</span>
      <span>课时：{{ productInfo.number }}</span>
      <span>售价： {{ productInfo.price }}</span>
    </div>

    <el-table
      :data="classTableList"
      max-height="300"
    >

      <el-table-column
        v-for="col in classCol"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :formatter="col.formatter"
      />

    </el-table>

  </div>
</template>

<style lang="postcss">
.submit-order__product{
  margin: 50px 0 20px;
}

.submit-order__product span{
  margin-right: 80px;
}
</style>
