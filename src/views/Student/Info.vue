<script>
/**
 *
 *@overview 学生管理 - 查看学生
 *
 *@author yehaifeng
 */
import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{
  name: 'StudentInfo',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      form: null,

    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];

      const {
        second_contact_phone: secondPhone,
        client_phone: clientPhone,
        second_contact_name: secondName,
        client_name: clientName,
        name: Name,
        total_score: totalScore,
        gender_name: genderName,
        birth_at: birthAt,
        school_name: schoolName,
        grade_name: gradeName,
        province_name: provinceName,
        city_name: cityName,
        district_name: districtName,
      } = this.data;

      return [
        {
          label: '第一联系人',
          details: clientPhone,
        },
        {
          label: '第一联系家长',
          details: clientName,
        },
        {
          label: '第二联系人',
          details: secondPhone,
        },
        {
          label: '第二联系家长',
          details: secondName,
        },
        {
          label: '学生姓名',
          details: Name,
        },
        {
          label: '总积分',
          details: totalScore.toString(),
        },
        {
          label: '性别',
          details: genderName,
        },
        {
          label: '出生年月',
          details: birthAt,
        },
        {
          label: '生源地区',
          details: provinceName + cityName + districtName,
        },
        {
          label: '生源学校',
          details: schoolName,
        },
        {
          label: '就读年级',
          details: gradeName,
        },
      ];
    },
  },

  created() {
    this.getFormBefore();
  },

  methods: {

    getFormBefore() {
      this.$http.get(`/member_center/student/${this.$route.params.id}`)
        .then((res) => {
          this.data = res;
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
  },
};
</script>

<template>
  <div class="student-info">
    <header class="student-info__header">
      <h2 class="student-info__title">查看学生</h2>
    </header>
    <div
      v-if="data"
    >
      <section class="student-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          :content="note.details"
          :label ="note.label"
        />
      </section>
      <div
        class="student-info-photo"
      >
        <span
          class="student-info-photo__span"
        >
          学生头像
        </span>
        :
        <img
          :src="data.head_url"
          class="student-info-photo__image"
          alt="">
      </div>

      <div class="student-info__but">
        <el-button
          type="primary"
          @click="disreguardRefund"
        >
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>;


<style lang="postcss">
.student-info__title{
  padding-left: 1em;
}
.student-info-photo{
 padding-left: 62px;
    height: 50px;
    position: relative;
    margin-bottom: 30px;
}
.student-info-photo__span{
    height: 55px;
    line-height: 55px;
    text-align: center;
    display: inline-block;
}
.student-info-photo .el-form-item__label{
  font-size: 16px;
}
.student-info-photo__image{
      width: 50px;
    height: 50px;
    border-radius: 50%;
    position: absolute;
    left: 145px;
}
.student-info__buyer{
 margin-top: 30px;
  padding-left: 4em;
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
}
.student-info__buyer .order-info-note{
    width: 100%;
    margin-bottom: 30px;
  }
.student-info__but{
  display: flex;
  justify-content: center;
}
.student-info-note{
  margin-bottom: 30px;
}
</style>

