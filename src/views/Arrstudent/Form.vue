<script>

import { form } from '@/mixins';
import InfoNote from '../components/InfoNote';

export default{
  name: 'RoleInfo',

  components: {
    InfoNote,
  },

  mixins: [form],

  data() {
    return {

      data: null,

      from: null,
    };
  },

  computed: {

    buyer() {
      if (!this.data) return [];

      const {
        id: Id,
        phone: Phone,
        role_type: roleType,
        user_state: userState,
        user_state_name: userStateName,
        gender_name: genderName,
        name: Name,
        email: Email,
        created_at: createdAt,
        updated_at: updatedAt,
      } = this.data;

      return [
        {
          label: '约课时间',
          content: Id.toString(),
        },
        {
          label: '家长电话',
          content: Phone,
        },
        {
          label: '课程名称',
          content: roleType.toString(),
        },
        {
          label: '课时数',
          content: userState.toString(),
        },
        {
          label: '品类',
          content: userStateName,
        },
        {
          label: '机构名称',
          content: genderName,
        },
        {
          label: '班级名称',
          content: Name,
        },
        {
          label: '关联订单编号',
          content: Email,
        },
        {
          label: '上课时间段',
          content: createdAt,
        },
        {
          label: '上课时间',
          content: updatedAt,
        },
      ];
    },

  },

  created() {
    this.getOrderInfo();
  },

  methods: {

    getOrderInfo() {
      const url = `/user/${this.$route.params.id}`;
      this.$http.get(url)
        .then((body) => {
          this.data = body;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },

    disreguardRefund() {
      return this.$router.push('/user-list');
    },
  },
};
</script>


<template>
  <div class="package-info">
    <header class="package-info__header">
      <h2 class="package-info__title">约课详情</h2>
    </header>
    <div
      v-if="data"
      class="order-info__body"

    >
      <section class="package-info__buyer">
        <InfoNote
          v-for="note in buyer"
          :key="note.label"
          v-bind="note"
        />
      </section>

      <div class="package-info__but">
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
.role-info-foot{
  height: 120px;
  margin-left: 10px;
  margin-top: 20px;
}
.role-info-foot__student{
  float: left;
  margin-right: 25px;
}
.role-info-head{
  font-size: 20px;
  font-weight: 800;
  background-color:#ccc;
  margin-top: 10px;
}
.package-info__but{
  display: flex;
  justify-content: center;
}
.order-info__body{
  padding-left: 10px;
}
.package-info__buyer{
    display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  margin-bottom: 30px;
}
.package-info__buyer .order-info-note{
    margin: .5em 0;
    width: 40%;
    padding-top: 15px;
}
</style>

