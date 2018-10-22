<script>
/**
 * @overview  约课学生 - 约课详情
 *
 * @author  yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{
  name: 'IntentionForm',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,

      scheme: {
        start_date: null,
        end_date: null,
      },

      // 定义星期
      toDay: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];

      const {
        student_name: studentName,
        curriculum_name: curriculumName,
        course_number: courseNumber,
        categories_name: categoriesName,
        department_name: departmentName,
        class_name: className,
      } = this.data;

      return [
        {
          label: '约课学生',
          content: studentName,
        },
        {
          label: '课程名称',
          content: curriculumName,
        },
        {
          label: '课时数',
          content: courseNumber ? courseNumber.toString() : '',
        },
        {
          label: '品类',
          content: categoriesName,
        },
        {
          label: '机构名称',
          content: departmentName,
        },
        {
          label: '班级名称',
          content: className,
        },
      ];
    },

  },

  created() {
    this.getOrderInfo();
  },

  methods: {

    getOrderInfo() {
      const url = `/intention/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
          this.scheme = body.scheme;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    disreguardRefund() {
      if (this.from.matched.length) {
        return this.$router.back();
      }

      const prefix = this.$route.path.match(/^\/\w+-/)[0];

      const location = (prefix && prefix.concat('list')) || '/';

      return this.$router.push(location);
    },

    orderNumber(id) {
      this.$router.push(`/order-info/${id}`);
    },
  },
};
</script>


<template>
  <div class="intention-info">
    <header class="intention-info__header">
      <h2 class="intention-info__title">约课详情</h2>
    </header>
    <div
      v-if="data"
      class="intention-info__body"
    >
      <section class="intention-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          v-bind="note"
        />
      </section>
      <div
        class="intention-info-order"
      >
        <div
          class="intention-info__classtime"
        >
          <span>关联订单编号</span>
          :
          <span
            class="intention-info__classtime-number"
            @click="orderNumber(data.order_id)"
          >{{ data.order_number }}</span>
        </div>
        <div
          class="intention-info__classtime"
        >
          <span>上课时间段</span>
          :
          <span
            v-if="scheme"
          >{{ scheme.start_date.split(' ')[0] }} 至 {{ scheme.end_date.split(' ')[0] }}</span>
      </div></div>
      <div
        class="intention-info__classtime order-info-note"
      >
        <span>上课时间</span>
        :
        <span
          v-if="scheme"
          class="intention-info__classtime__span"
        >
          <span
            v-for="(calendar,index) in scheme.calendar"
            :key="index"
            class="intention-info__classtime__week"
          >
            {{ toDay[calendar.day-1] }}&nbsp;{{ calendar.start_time }}~{{ calendar.end_time }}
          </span>
        </span>

      </div>

      <div class="intention-info__but">
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
.intention-info__but{
  display: flex;
  justify-content: center;
}
.intention-info__body{
  padding-left: 10px;
}
.intention-info-order{
  display: flex;
}
.intention-info__classtime-number{
  text-decoration: underline;
  color: blue;
}
.intention-info__classtime{
  width: 40%;
  padding-left: 8px;
  padding-bottom:30px;
}
.intention-info__classtime__span{
  display: block;
  height: 270px;
  overflow-y: scroll;
  margin-left: 60px;
  margin-right: 10px;
}
.intention-info__classtime__week{
  display: inline-block;
  margin:10px 30px;
}
.intention-info__buyer{
    display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  margin-bottom: 22px;
}
.intention-info__buyer .order-info-note{
    margin: .5em 0;
    width: 40%;
    padding-top: 15px;
}
</style>

