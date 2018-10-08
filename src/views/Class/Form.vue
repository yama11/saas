<script>
/**
 * @overview  约课班级 - 约课班级详情
 *
 * @author  yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'ClassForm',

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

      join: [],

      student: [],

      leave: [],

      tableClass: [
        { prop: 'student_name', label: '学生姓名' },
        { label: '约课时间',
          formatter: row =>
            `${row.create_date.split(' ')[0]}`,
        },
      ],

      tableCome: [
        { prop: 'student_name', label: '学生姓名' },
        { label: '调入记录',
          formatter: row =>
            `${row.create_date.split(' ')[0]}`,
        },
      ],

      tableOut: [
        { prop: 'student_name', label: '学生姓名' },
        { label: '调出记录',
          formatter: row =>
            `${row.create_date.split(' ')[0]}`,
        },
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
             至 ${endDate.split(' ')[0]}
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
          this.join = body.join;
          this.student = body.student;
          this.leave = body.leave;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    disreguardRefund() {
      return this.$router.push('/class-list');
    },
  },
};
</script>


<template>
  <div class="class-info">
    <header class="class-info__header">
      <h2 class="class-info__title">班级详情</h2>
    </header>
    <div
      v-if="data"
      class="class-info__body"

    >
      <div class="class-info-head">
        课程信息
      </div>
      <section class="class-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :formatter ="note.formatter"
          v-bind="note"
        />
      </section>
      <div class="class-info-head_classtime">
        <span
        >上课时间</span>
        ：
        <span
          class="class-info-head_classtime_span">
          <span
            v-for="(calendar,index) in calendar"
            :key="index"
            class="class-info-head_classtime_week">
            {{ toDay[calendar.day-1] }}&nbsp;{{ calendar.start_time }}~{{ calendar.end_time }}
          </span>
        </span>
      </div>
      <div class="class-info-head">
        班级信息
      </div>
      <section class="class-info__buyer">
        <InfoNote
          v-for="note in curriculum"
          :key="note.label"
          v-bind="note"
        />
      </section>
      <div class="class-info-foot">
        <span class="class-info-foot__student">班级学生</span>
        <el-table
          :data="student"
          style="width: 262px"
          height="140"
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

      <div class="class-info-foot">
        <span class="class-info-foot__student">调入记录</span>
        <el-table
          :data="join"
          style="width:262px"
          height="140"
          border
        >
          <el-table-column
            v-for="info in tableCome"
            :key="info.prop"
            :prop="info.prop"
            :label="info.label"
            :formatter="info.formatter"
          />
        </el-table>
      </div>

      <div class="class-info-foot">
        <span class="class-info-foot__student">调出记录</span>
        <el-table
          :data="leave"
          style="width: 262px"
          height="140"
          border
        >
          <el-table-column
            v-for="info in tableOut"
            :key="info.prop"
            :prop="info.prop"
            :label="info.label"
            :formatter="info.formatter"
          />
        </el-table>
      </div>

      <div class="class-info__but">
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
.class-info-foot{
  height: 120px;
  margin: 20px 0 50px 10px;
}
.class-info-foot__student{
  float: left;
  margin-right: 25px;
}
.class-info-head{
  font-size: 20px;
  font-weight: 800;
  background-color:#ffeeee;
  margin-top: 10px;
}
.class-info__but{
  display: flex;
  justify-content: center;
}
.class-info-head_classtime{
    padding-left: 8px;
    margin: 20px 0 20px;
}
.class-info__body{
  padding-left: 10px;
}
.class-info__buyer{
    display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
}
.class-info__buyer .order-info-note{
    margin: .5em 0;
    width: 40%;
    padding-top: 15px;
}
.class-info-head_classtime_span{
    display: block;
    height: 200px;
    overflow-y: scroll;
    margin-left: 60px;
    margin-right: 10px;
    width: 450px;
}
.class-info-head_classtime_week{
  display: inline-block;
  margin:10px 10px;
}
</style>

