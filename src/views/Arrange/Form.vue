<script>
/**
 * @overview  上课安排 - 班级详情
 *
 * @author  yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'ArrangeForm',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,

      // 定义星期
      toDay: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

      calendar: {},

      student: [],

      quit: [],

      change: [],

      freeze: [],

      tableClass: [
        { label: '学生姓名', prop: 'student_name' },
        { label: '约课时间',
          formatter: row =>
            `${row.create_date.split(' ')[0]}`,
        },
        { label: '约课课时', prop: 'hour_total' },
        { label: '课耗数', prop: 'hour_finish' },
      ],

      tableQuit: [
        { label: '学生姓名', prop: 'student_name' },
        { label: '退班时间',
          formatter: row =>
            `${row.done_date.split(' ')[0]}`,
        },
        { label: '课耗数', prop: 'hour_finish' },
        { label: '退班课时', prop: 'hour_remain' },
      ],

      tableChange: [
        { label: '学生姓名', prop: 'student_name' },
        { label: '转班时间',
          formatter: row =>
            `${row.done_date.split(' ')[0]}`,
        },
        { label: '课耗数', prop: 'hour_finish' },
        { label: '剩余课时', prop: 'hour_remain' },
      ],

      tableFreeze: [
        { label: '学生姓名', prop: 'student_name' },
        { label: '冻结时间',
          formatter: row =>
            `${row.audit_date.split(' ')[0]}`,
        },
        { label: '课耗数', prop: 'hour_finish' },
        { label: '冻结数', prop: 'hour_remain' },
      ],
    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];

      const {
        curriculum_name: curriculumName,
        categories_name: categoriesName,
      } = this.data;

      const {
        schedule_total: scheduleTotal,
        schedule_finish: scheduleFinish,
        start_date: startDate,
        end_date: endDate,
      } = this.data.scheme;

      return [
        {
          label: '课程名称',
          content: curriculumName,
        },
        {
          label: '课时数',
          content: scheduleTotal.toString(),
        },
        {
          label: '品类',
          content: categoriesName,
        },
        {
          label: '已上课时数',
          content: scheduleFinish.toString(),
        },
        {
          label: '上课时间段',
          content:
            `
              ${startDate.split(' ')[0]}
             至${endDate.split(' ')[0]}
            `,
        },
      ];
    },

    curriculum() {
      if (!this.data) return [];

      const {
        name: Name,
        department_name: departmentName,
        code: Code,
        capacity: Capacity,
        student_number: studentNumber,
        class_status_name: classStatusName,
      } = this.data;

      return [
        {
          label: '班级名称',
          content: Name,
        },
        {
          label: '机构名称',
          content: departmentName,
        },
        {
          label: '班级编码',
          content: Code,
        },
        {
          label: '约课/满课人数',
          content: `${studentNumber}/${Capacity}`,
        },
        {
          label: '班级状态',
          content: classStatusName,
        },
      ];
    },
  },

  created() {
    this.getOrderInfo();
  },

  methods: {

    getOrderInfo() {
      const url = `/class/show/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
          this.calendar = body.scheme.calendar;
          this.student = body.student;
          this.quit = body.quit;
          this.change = body.change;
          this.freeze = body.freeze;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    disreguardRefund() {
      return this.$router.push('/arrange-list');
    },
  },
};
</script>


<template>
  <div class="arrange-info">
    <header class="arrange-info__header">
      <h2 class="arrange-info__title">班级详情</h2>
    </header>
    <div
      v-if="data"
      class="arrange-info__body"

    >
      <div class="arrange-info-head">
        课程信息
      </div>
      <section class="arrange-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :formatter ="note.formatter"
          v-bind="note"
        />
      </section>
      <div class="arrange-info-head_classtime">
        <span
        >上课时间</span>
        ：
        <span
          v-for="(calendar,index) in calendar"
          :key="index"
          class="arrange-info-head_classtime_span"
        >{{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}</span>
      </div>
      <div class="arrange-info-head">
        班级信息
      </div>
      <section class="arrange-info__buyer">
        <InfoNote
          v-for="note in curriculum"
          :key="note.label"
          v-bind="note"
        />
      </section>
      <div class="arrange-info-foot">
        <span class="arrange-info-foot__student">班级学生</span>
        <el-table
          :data="student"
          style="width: 522px"
          height="145"
          border
        >
          <el-table-column
            v-for="info in tableClass"
            :key="info.prop"
            :prop="info.prop"
            :label="info.label"
            :formatter="info.formatter"
          />
        </el-table>
      </div>

      <div class="arrange-info-foot">
        <span class="arrange-info-foot__student">退班记录</span>
        <el-table
          :data="quit"
          style="width:522px"
          height="145"
          border
        >
          <el-table-column
            v-for="info in tableQuit"
            :key="info.prop"
            :prop="info.prop"
            :label="info.label"
            :formatter="info.formatter"
          />
        </el-table>
      </div>

      <div class="arrange-info-foot">
        <span class="arrange-info-foot__student">转出记录</span>
        <el-table
          :data="change"
          style="width: 522px"
          height="145"
          border
        >
          <el-table-column
            v-for="info in tableChange"
            :key="info.prop"
            :prop="info.prop"
            :label="info.label"
            :formatter="info.formatter"
          />
        </el-table>
      </div>
      <div class="arrange-info-foot">
        <span class="arrange-info-foot__student">冻结记录</span>
        <el-table
          :data="freeze"
          style="width: 522px"
          height="145"
          border
        >
          <el-table-column
            v-for="info in tableFreeze"
            :key="info.prop"
            :prop="info.prop"
            :label="info.label"
            :formatter="info.formatter"
          />
        </el-table>
      </div>
      <div class="arrange-info__but">
        <el-button
          type="primary"
          @click="disreguardRefund"
        >
          确定
        </el-button>
      </div>

    </div>
  </div>
</template>


<style lang="postcss">
.arrange-info-foot{
  height: 120px;
  margin: 20px 0 50px 10px;
}
.arrange-info-foot__student{
  float: left;
  margin-right: 25px;
}
.arrange-info-head{
  font-size: 20px;
  font-weight: 800;
  background-color:#ffeeee;
  margin-top: 10px;
}
.arrange-info__but{
  display: flex;
  justify-content: center;
}
.arrange-info-head_classtime{
    padding-left: 8px;
    margin: 20px 0 20px;
}
.arrange-info__body{
  padding-left: 10px;
}
.arrange-info__buyer{
    display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
}
.arrange-info__buyer .order-info-note{
    margin: .5em 0;
    width: 40%;
    padding-top: 15px;
}
.arrange-info-head_classtime_span{
    margin-left: 90px;
    display: block;
    padding-bottom: 30px;
    margin-top: -16px;
}
</style>

