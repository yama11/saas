<script>
/**
 * @overview 家长管理 - 家长详情
 *
 * @author yehaifeng
*/
import { form } from '@/mixins';

export default {

  name: 'ParentForm',

  mixins: [form],

  data() {
    return {

      form: {},

      from: null,

    };
  },

  created() {
    this.getParentBefore();
  },

  methods: {

    getParentBefore() {
      this.$http.get(`/member_center/client/${this.$route.params.id}`)
        .then((res) => {
          this.form = res;
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
  <div class="parent-info">
    <header class="parent-info__header">
      <h2 class="parent-info__title">家长详情</h2>
    </header>
    <el-form
      class="parent-form"
      label-width="80px"
      label-position="left"
    >
      <el-form-item
        label="姓名">
        <span>{{ form.name }}</span>
      </el-form-item>
      <el-form-item
        prop="phone"
        label="手机号">
        <span>{{ form.phone }}</span>

      </el-form-item>
      <el-form-item
        prop="balance"
        label="账户余额">
        <span>{{ form.balance }}</span>

      </el-form-item>

      <el-form-item
        prop="role_type_name"
        label="角色">
        <span>{{ form.role_type_name }}</span>

      </el-form-item>

      <el-form-item
        prop="wechat_name"
        label="微信昵称">
        <span>{{ form.wechat_name }}</span>

      </el-form-item>

      <el-form-item
        prop="iconurl"
        label="微信头像">
        <img
          :src="form.iconurl"
          class="parent-form-headimgurl"
          alt="">
      </el-form-item>

      <el-form-item
        prop="created_at"
        label="注册时间">
        <span>
          {{ form.register_at }}
        </span>

      </el-form-item>

      <el-form-item
        prop=""
        label="他的小孩">
        <div class="parent-form-childs">
          <div
            v-for="item in form.student"
            :key="item.id"
            class="parent-form-childs-item">
            <img
              :src="item.head_url"
              class="parent-form-childs-item__headimg">
            <div class="parent-form-childs-item__name">
              <span>{{ item.name }}</span>
              <span>{{ item.birth_at }}</span>
              <span style="margin-left: 10px;">{{ item.gender_name }}</span>
            </div>
            <div class="parent-form-childs-item__school">
              <span>{{ item.school_name }}</span>
              <span>{{ item.grade_name }}</span>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div class="parent-info__but">
      <el-button
        type="primary"
        @click="disreguardRefund"
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<style lang="postcss">
.parent-form-headimgurl {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.parent-form-childs {
  display: flex;
  flex-wrap: wrap;
}
.parent-form-childs-item {
  background-color: #efeff4;
  border: 1px solid #ccc;
  text-align: center;
  min-width: 190px;
  line-height: 30px;
  margin-bottom: 15px;
  margin-right: 15px;
  overflow: hidden;
  word-break: break-all;
  padding: 0 5px 10px;
}
.parent-form-childs-item__headimg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-top: 15px;
}
.parent-info .el-form-item__label{
  text-align: right;
  margin-right: 15px;
}
.parent-form-childs-item__school{
  margin-bottom: 50px;
}
.parent-info__but{
  display: flex;
  justify-content: center;
}
</style>
