<script>
/**
 * @overview 退班管理  - 退班详情
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'QuitDetails',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,

      scheme: {},

      // 定义星期
      toDay: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],

    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];

      const {
        student_name: studentName,
        phone: Phone,
        department_name: departmentName,
        curriculum_name: curriculumName,
        class_name: className,
        proposer_date: proposerDate,
        audit_date: auditDate,
        proposer_name: proposerName,
        auditor_name: auditorName,
        refund_rate: refundRate,
        hour_total: hourTotal,
        paid_money: paidMoney,
        hour_finish: hourFinish,
        discount: Discount,
        hour_remain: hourRemain,
        refund_money: refundMoney,
        price: Price,
      } = this.data;

      return [
        {
          label: '学生姓名',
          details: studentName,
        },
        {
          label: '家长电话',
          details: Phone,
        },
        {
          label: '机构',
          details: departmentName,
        },
        {
          label: '退课课程',
          details: curriculumName,
        },
        {
          label: '退班班级',
          details: className,
        },
        {
          label: '申请时间',
          details: proposerDate,
        },
        {
          label: '审核时间',
          details: auditDate,
        },
        {
          label: '申请人',
          details: proposerName,
        },
        {
          label: '课时单价',
          details: Price,
        },
        {
          label: '审核顾问',
          details: auditorName,
        },
        {
          label: '扣课折扣',
          details: refundRate,
        },
        {
          label: '总课时',
          details: hourTotal ? hourTotal.toString() : '',
        },
        {
          label: '实付金额',
          details: paidMoney,
        },
        {
          label: '已耗课时',
          details: hourFinish ? hourFinish.toString() : '',
        },
        {
          label: '原订单优惠金额',
          details: Discount,
        },
        {
          label: '退班课时',
          details: hourRemain ? hourRemain.toString() : '',
        },
        {
          label: '退费金额',
          details: refundMoney,
        },
      ];
    },
  },

  created() {
    this.getOrderInfo();
  },

  methods: {

    getOrderInfo() {
      const url = `/quit/${this.$route.params.id}`;
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
      return this.$router.push('/quit-list');
    },
  },
};
</script>

<template>
  <div class="quit-info">
    <header class="quit-info__header">
      <h2 class="quit-info__title">退班详情</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="quit-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :content="note.details"
          v-bind="note"
        />
      </section>
      <div
        class="quit-info__classtime"
      >
        <span>退班上课时间</span>
        :
        <span>{{ scheme.start_date.split(' ')[0] }}
          ~{{ scheme.end_date.split(' ')[0] }}</span><br>
        <span
          v-for="(calendar,index) in scheme.calendar"
          :key="index"
          class="quit-info__classtime__week"
        >
          {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
        </span>

      </div>
      <div class="quit-info__but">
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
.quit-info__title{
  padding-left: 1em;

}
.quit-info__classtime{
  padding-left: 4em;
  padding-bottom:30px;
}
.quit-info__classtime__week{
  padding-left: 110px;
  margin-top: 10px;
  display: block;
}
.quit-info__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.quit-info__buyer .order-info-note{
    width: 50%;
    margin-bottom: 30px;
  }
.quit-info__but{
  display: flex;
  justify-content: center;
}
.quit-info-note{
  margin-bottom: 30px;
}
</style>

