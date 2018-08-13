<script>
/**
 * @overview 冻结管理  - 冻结处理
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'FreezeManage',

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
          label: '冻结课时',
          details: hourRemain ? hourRemain.toString() : '',
        },
        {
          label: '机构',
          details: departmentName,
        },
        {
          label: '冻结班级',
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

    cancelForm() {
      if (this.from.matched.length) {
        return this.$router.back();
      }
      const prefix = this.$route.path.match(/^\/\w+-/)[0];
      const location = (prefix && prefix.concat('list')) || '/';
      return this.$router.push(location);
    },

    freezeAudit() {
      this.$http.post(`/freeze/audit/${this.$route.params.id}`)
        .then(this.cancelForm());
    },
    freezeCancel() {
      this.$http.post(`/freeze/cancel/${this.$route.params.id}`)
        .then(this.cancelForm());
    },

  },
};
</script>

<template>
  <div class="freeze-deal">
    <header class="freeze-deal__header">
      <h2 class="freeze-deal__title">转班处理</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="freeze-deal__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :label="note.label"
          :content="note.details"
        />
      </section>
      <div
        class="freeze-deal__classtime"
      >
        <span>上课时间</span>
        :
        <span>{{ scheme.start_date.split(' ')[0] }}
          ~{{ scheme.end_date.split(' ')[0] }}</span><br>
        <span
          v-for="(calendar,index) in scheme.calendar"
          :key="index"
          class="freeze-deal__classtime__week"
        >
          {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
        </span>

      </div>
      <div class="freeze-deal__but">
        <el-button
          type="primary"
          @click="freezeAudit"
        >
          确定转班
        </el-button>
        <el-button
          type="primary"
          @click="freezeCancel"
        >
          取消转班
        </el-button>
      </div>

    </div>
  </div>
</template>

<style lang="postcss">
.freeze-deal__title{
  padding-left: 1em;

}
.freeze-deal__classtime{
   width: 50%;
  padding-left: 4em;
  padding-bottom:30px;
}
.freeze-deal__classtime__week{
  padding-left: 80px;
  margin-top: 10px;
  display: block;
}
.freeze-deal__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.freeze-deal__buyer .order-info-note{
    width: 50%;
    margin-bottom: 30px;
  }
.freeze-deal__but{
  display: flex;
  justify-content: center;
}
.freeze-deal-note{
  margin-bottom: 30px;
}
</style>

