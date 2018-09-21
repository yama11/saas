<script>
/**
 * @overview 转班管理  - 转班处理
 *
 * @author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{

  name: 'ChangeDispose',

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

      currentScheme: {},
    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];
      const {
        student_name: studentName,
        phone: Phone,
        department_name: departmentName,
        proposer_date: proposerDate,
        proposer_name: proposerName,
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
    this.getOrderInfo();
  },

  methods: {

    getOrderInfo() {
      const url = `/change/deal/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
          this.scheme = body.primordial.scheme;
          this.currentScheme = body.current.scheme;
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

    confirmTurn() {
      this.$http.post(`/change/audit/${this.$route.params.id}`)
        .then(this.cancelForm)
        .cantch((err) => {
          this.$message.error(err.message);
        });
    },
    cancelTurn() {
      this.$http.post(`/change/cancel/${this.$route.params.id}`)
        .then(this.cancelForm)
        .cantch((err) => {
          this.$message.error(err.message);
        });
    },
  },
};
</script>

<template>
  <div class="change-info">
    <header class="change-info__header">
      <h2 class="change-info__title">转班处理</h2>
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
          class="change-info__outtime"
        >
          <span>转出上课时间</span> :
          <span>{{ scheme.start_date.split(' ')[0] }}
            ~{{ scheme.end_date.split(' ')[0] }}</span><br>
          <span
            class="change-info__classtime__span"
          >
            <span
              v-for="(calendar,index) in scheme.calendar"
              :key="index"
              class="change-info__outtime__week"
            >
              {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
            </span>
          </span>
        </div>
        <div
          class="change-info__enter"
        >
          <span>转入上课时间</span> :
          <span>{{ currentScheme.start_date.split(' ')[0] }}
            ~{{ currentScheme.end_date.split(' ')[0] }}</span><br>
          <span
            class="change-info__classtime__span"
          >
            <span
              v-for="(calendar,index) in currentScheme.calendar"
              :key="index"
              class="change-info__outtime__week"
            >
              {{ toDay[calendar.day-1] }}{{ calendar.start_time }}~{{ calendar.end_time }}
            </span>
          </span>
        </div>
      </div>
      <div class="change-info__but">
        <el-button
          type="primary"
          @click="confirmTurn"
        >
          确定转班
        </el-button>
        <el-button
          type="primary"
          @click="cancelTurn"
        >
          取消转班
        </el-button>
      </div>

    </div>
  </div>
</template>

<style lang="postcss">
.change-info__title{
  padding-left: 1em;

}
.change-info__buyer{
  margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.change-info .change-info-time{
  box-sizing: border-box;
  display: flex;
 justify-content: space-between;
 margin-bottom: 30px;
}
.change-info__classtime__span{
  display: block;
  height: 270px;
  overflow-y: scroll;
  margin-left: 60px;
  margin-right: 10px;
}
.change-info__enter,.change-info__outtime{
  width: 50%;
 margin-left: 60px;
}
.change-info__outtime__week{
  display: inline-block;
  margin:10px 10px;
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

