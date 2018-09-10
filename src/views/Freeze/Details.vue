<script>
/**
 * @overview 挂起管理  - 挂起详情
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{
  name: 'FreezeDetails',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,

      scheme: [],

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
        curriculum_name: curriculumName,
        hour_remain: hourRemain,
        department_name: departmentName,
        class_name: className,
        proposer_name: proposerName,
        proposer_date: proposerDate,
        auditor_name: auditorName,
        audit_date: auditDate,
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
          label: '课程名称',
          details: curriculumName,
        },
        {
          label: '挂起课时',
          details: hourRemain ? hourRemain.toString() : '',
        },
        {
          label: '机构',
          details: departmentName,
        },
        {
          label: '挂起班级',
          details: className,
        },
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
          label: '挂起时间',
          details: auditDate,
        },
      ];
    },
  },

  created() {
    this.getFreezeInfo();
  },

  methods: {

    getFreezeInfo() {
      const url = `/freeze/${this.$route.params.id}`;
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
      return this.$router.push('/freeze-list');
    },
  },
};
</script>

<template>
  <div class="freeze-info">
    <header class="freeze-info__header">
      <h2 class="freeze-info__title">挂起详情</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="freeze-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :label="note.label"
          :content="note.details"
          :formatter="note.formatter"
        />
      </section>
      <div
        class="freeze-info__classtime"
      >
        <span>上课时间</span>
        :
        <span>{{ scheme.start_date.split(' ')[0] }}
          ~{{ scheme.end_date.split(' ')[0] }}</span><br>
        <span
          class="freeze-info__classtime__span"
        >
          <span
            v-for="(calendar,index) in scheme.calendar"
            :key="index"
            class="freeze-info__classtime__week"
          >
            {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
          </span>
        </span>
      </div>
      <div class="freeze-info__but">
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
.freeze-info__title{
  padding-left: 1em;

}
.freeze-info__classtime{
   width: 50%;
  padding-left: 4em;
  padding-bottom:30px;
}
.freeze-info__classtime__span{
  display: block;
  width: 60%;
  height: 270px;
  overflow-y: scroll;
  margin-left: 60px;
  margin-right: 10px;
}
.freeze-info__classtime__week{
  display: inline-block;
  margin:10px 10px;
}
.freeze-info__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.freeze-info__buyer .order-info-note{
    width: 50%;
    margin-bottom: 30px;
  }
.freeze-info__but{
  display: flex;
  justify-content: center;
}
.freeze-info-note{
  margin-bottom: 30px;
}
</style>

