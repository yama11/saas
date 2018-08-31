<script>
/**
 * @overview 商品中心 - 订单管理 - 订单创建 - 约课
 *
 * @author suyanping
 */

import { form } from '@/mixins';
// import { times } from '@/utils';

export default {
  name: 'ArrangeClass',

  mixins: [form],

  props: {
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

      curriculumId: null,

      curriculumIndex: null,

      schemeList: [],

      departmentList: [],

      classList: [],

      formData: {
        schemeId: null,
        departmentId: null,
        classId: null,
      },

      timeStr: '',

      visible: false,
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

  methods: {

    getSchemeList(id) {
      return this.$http.get(`/order/batch/scheme?equal[curriculum_id]=${id}`)
        .then((res) => {
          const list = res.filter(item => (item.start_date && item.end_date));

          this.schemeList = list
            .map(item => ({
              ...item,
              date: `${item.start_date.split(' ')[0]}~${item.end_date.split(' ')[0]}`,
            }));
        });
    },

    getDepartmentList(id) {
      this.$http.get(`/order/batch/department?equal[curriculum_id]=${id}`)
        .then((res) => {
          this.departmentList = res;
        });
    },

    getClassList(id) {
      this.formData.classId = null;

      const data = `equal[curriculum_id]=${this.curriculumId}&equal[department_id]=${id}`;

      this.$http.get(`/order/batch/class?${data}`)
        .then((res) => {
          this.classList = res;
        });
    },

    arrangeClass(index, data, id) {
      this.visible = true;

      this.curriculumId = id;

      this.curriculumIndex = index;

      const schemeId = data.scheme.id;
      const departmentId = data.department.id;
      const classId = data.class.id;

      this.formData = {
        schemeId: schemeId || null,
        departmentId: departmentId || null,
        classId: classId || null,
      };


      this.getSchemeList(id)
        .then(() => {
          if (schemeId) {
            this.getClassTime(schemeId);
          }
        });

      this.getDepartmentList(id);
    },

    getClassTime(id) {
      this.timeStr = '';

      const calendarData = this.schemeList
        .find(item => item.id === id);

      if (!calendarData) return;

      this.timeStr = this.getContent(calendarData.calendar);
    },

    classSubmit(submit) {
      const scheme = this.schemeList
        .find(item => item.id === this.formData.schemeId);

      const department = this.departmentList
        .find(item => item.id === this.formData.departmentId);

      const classes = this.classList
        .find(item => item.id === this.formData.classId);

      const data = {
        index: this.curriculumIndex,
        id: this.curriculumId,
        scheme: scheme || {},
        department: department || {},
        class: classes || {},
      };

      submit()
        .then(() => {
          this.$emit('changeProduct', data);
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
  <div class="arrange-class">

    <div class="arrange-class__info">
      <span>购买商品：{{ productInfo.name }}</span>
      <span>课时：{{ productInfo.number }}</span>
      <span>售价： {{ productInfo.price }}</span>
    </div>

    <el-table
      :data="classTableList"
    >

      <el-table-column
        v-for="col in classCol"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        :formatter="col.formatter"
      />

      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            @click="arrangeClass(scope.$index,scope.row,scope.row.curriculum.id)"
          >
            约课
          </el-button>
        </template>

      </el-table-column>

    </el-table>

    <AppFormDialog
      :visible.sync="visible"
      :model="formData"
      object="约课选择"
      width="500px"
      label-width="7em"
      @on-submit="classSubmit"
    >
      <el-form-item
        prop="schemeId"
        label="上课时间段"
      >
        <el-select
          v-model="formData.schemeId"
          placeholder="请选择上课时间段"
          @change="getClassTime(formData.schemeId)">

          <el-option
            v-for="item in schemeList"
            :key="item.id"
            :label="item.date"
            :value="item.id"/>

        </el-select>
      </el-form-item>

      <el-form-item
        prop="time"
        label="上课时间"
      >
        {{ timeStr }}
      </el-form-item>

      <el-form-item
        prop="departmentId"
        label="上课机构"
      >
        <el-select
          v-model="formData.departmentId"
          placeholder="请选择上课机构"
          @change="getClassList(formData.departmentId)">

          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>

      </el-select></el-form-item>

      <el-form-item
        prop="classId"
        label="上课班级"
      >

        <el-select
          v-model="formData.classId"
          placeholder="请选择上课班级">

          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>

        </el-select>

      </el-form-item>

    </AppFormDialog>

  </div>
</template>

<style lang="postcss">
.arrange-class__info{
  margin: 20px 0;
}

.arrange-class__info span{
  margin-right: 80px;
}
</style>
