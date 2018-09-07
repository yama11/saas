<script>
/**
 * @overview 转班管理  - 转班详情
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'ChangeDetails',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,

      scheme: {
        start_date: '',
        end_date: '',
      },

      schemeArr: {
        start_date: '',
        end_date: '',
      },

      errand: null,

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
      } = this.data;

      const {
        curriculum_name: curriculumName,
        class_name: className,
        hour_remain: hourRemain,
      } = this.data.primordial;

      const {
        curriculum_name: CurriculumName,
        class_name: ClassName,
        hour_remain: HourRemain,
      } = this.data.current;

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
          label: '转出课程',
          details: curriculumName,
        },
        {
          label: '转入课程',
          details: CurriculumName,
        },
        {
          label: '转出班级',
          details: className,
        },
        {
          label: '转入班级',
          details: ClassName,
        },
        {
          label: '转出课时',
          details: hourRemain ? hourRemain.toString() : '',
        },
        {
          label: '转入所需课时',
          details: HourRemain ? HourRemain.toString() : '',
        },
      ];
    },

    proposer() {
      if (!this.data) return [];

      const {
        proposer_name: proposerName,
        proposer_date: proposerDate,
        auditor_name: auditorName,
        audit_date: auditDate,
        done_date: doneDate,
      } = this.data;

      return [
        {
          label: '申请人',
          details: proposerName,
        },
        {
          label: '申请时间',
          details: proposerDate,
        },
        {
          label: '审核人',
          details: auditorName,
        },
        {
          label: '审核时间',
          details: auditDate,
        },
        {
          label: '转班时间',
          details: doneDate,
        },
      ];
    },
  },

  created() {
    this.getOrderInfo();
  },

  methods: {

    getOrderInfo() {
      const url = `/change/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
          this.errand = this.data.primordial.hour_remain - this.data.current.hour_remain;
          this.scheme = body.current.scheme;
          this.schemeArr = body.primordial.scheme;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    disreguardRefund() {
      this.$router.push('/change-list');
    },

  },
};
</script>

<template>
  <div class="change-info">
    <header class="change-info__header">
      <h2 class="change-info__title">转班详情</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="change-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :content="note.details"
          v-bind="note"
        />
      </section>
      <div
        class="change-info-time"
      >
        <div
          class="change-info__classtime"
        >
          <span>转出上课时间</span>
          :
          <span>{{ schemeArr.start_date.split(' ')[0] }}
            ~{{ schemeArr.end_date.split(' ')[0] }}</span><br>
          <span
            class="change-info__classtime__span"
          >
            <span
              v-for="(calendar,index) in scheme.calendar"
              :key="index"
              class="change-info__classtime__week"
            >
              {{ toDay[calendar.day-1] }}&nbsp;{{ calendar.start_time }}~{{ calendar.end_time }}
            </span>
          </span>
        </div>
        <div
          class="change-info__comeTime"
        >
          <span>转入上课时间</span>
          :
          <span>{{ scheme.start_date.split(' ')[0] }}
            ~{{ scheme.end_date.split(' ')[0] }}</span><br>
          <span
            class="change-info__classtime__span"
          >
            <span
              v-for="(calendar,index) in scheme.calendar"
              :key="index"
              class="change-info__classtime__week"
            >
              {{ toDay[calendar.day-1] }}&nbsp;{{ calendar.start_time }}~{{ calendar.end_time }}
            </span>
          </span>
        </div>
      </div>
      <section class="change-info__buyer">
        <InfoNote
          v-for="note in proposer"
          :key="note.label"
          :content="note.details"
          v-bind="note"
        />
      </section>
      <div
        class="change-info__order"
      >
        <div
          v-if="errand<0"
        >
          <span>支付订单编号</span>
          :
          <span>{{ data.order_sn }}</span>
        </div>

        <div
          v-else
        >
          <span>挂起课时</span>
          :
          <span>{{ errand }}</span>
        </div>

      </div>
      <div class="change-info__but">
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
.change-info__title{
  padding-left: 1em;

}
.change-info .change-info-time{
 box-sizing: border-box;
  display: flex;
 justify-content: space-between;
}
.change-info__classtime{
  width: 50%;
  margin-left: 60px;
}
.change-info__order{
  width: 50%;
  padding-left: 62px;
}
.change-info__comeTime{
  width: 50%;
}
.change-info__classtime__span{
  display: block;
  height: 270px;
  overflow-y: scroll;
  margin-left: 60px;
  margin-right: 10px;
}
.change-info__classtime__week{
  display: inline-block;
  margin:10px 10px;
}
.change-info__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.change-info__buyer .order-info-note{
    width: 50%;
    margin-bottom: 30px;
  }
.change-info__but{
  display: flex;
  justify-content: center;
}
.change-info-note{
  margin-bottom: 30px;
}
</style>

