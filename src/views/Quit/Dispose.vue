<script>
/**
 * @overview 退班管理  - 退班处理
 *
 * @author yehaifeng
 */
import errorHandler from '@/components/AppFormAlert/errorHandler';
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'QuitDispose',

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
          details: proposerName,
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

    cancelForm() {
      if (this.from.matched.length) {
        return this.$router.back();
      }
      const prefix = this.$route.path.match(/^\/\w+-/)[0];
      const location = (prefix && prefix.concat('list')) || '/';
      return this.$router.push(location);
    },

    returnAudit() {
      this.$http.post(`/quit/audit/${this.$route.params.id}`)
        .then(this.cancelForm)
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },

    returnCancel() {
      this.$http.post(`/quit/cancel/${this.$route.params.id}`)
        .then(this.cancelForm)
        .catch((error) => {
          const errorMessage = errorHandler(error);

          this.$message.error(errorMessage[0]);
        });
    },
  },
};
</script>

<template>
  <div class="quit-info">
    <header class="quit-info__header">
      <h2 class="quit-info__title">退班处理</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="quit-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :content="note.details"
          :label ="note.label"
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
          class="quit-info__classtime__span"
        >
          <span
            v-for="(calendar,index) in scheme.calendar"
            :key="index"
            class="quit-info__classtime__week"
          >
            {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
          </span>
        </span>
      </div>
      <div class="quit-info__but">
        <el-button
          type="primary"
          @click="returnAudit"
        >
          确定退班
        </el-button>
        <el-button
          type="primary"
          @click="returnCancel"
        >
          取消退班
        </el-button>
      </div>

    </div>
  </div>
</template>

<style lang="postcss">
.quit-info__title{
  padding-left: 1em;

}
.quit-info__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.quit-info__classtime{
  padding-left: 4em;
  padding-bottom:30px;
}
.quit-info__classtime__span{
  display: block;
  width: 40%;
  height: 225px;
  overflow-y: scroll;
  margin-left: 60px;
  margin-right: 10px;
}
.quit-info__classtime__week{
  display: inline-block;
  margin:10px 10px;
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

